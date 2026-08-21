-- Migration: Add generation_limits table for anti-spam
CREATE TABLE IF NOT EXISTS public.generation_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address TEXT,
    fingerprint_hash TEXT,
    token TEXT,
    last_generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for faster lookup
CREATE INDEX IF NOT EXISTS idx_gen_limits_ip ON public.generation_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_gen_limits_fingerprint ON public.generation_limits(fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_gen_limits_token ON public.generation_limits(token);

-- Enable RLS (Row Level Security) - but keep it simple for now, 
-- mostly accessed from server-side service role anyway
ALTER TABLE public.generation_limits ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access" ON public.generation_limits
    USING (auth.role() = 'service_role');

-- Function to check and update generation limit atomically
CREATE OR REPLACE FUNCTION check_and_update_generation_limit(
    p_ip TEXT,
    p_fingerprint TEXT,
    p_token TEXT,
    p_window_hours INT
)
RETURNS TABLE (
    allowed BOOLEAN,
    remaining_time_seconds INT
) AS $$
DECLARE
    v_last_gen TIMESTAMP WITH TIME ZONE;
    v_wait_seconds INT;
BEGIN
    -- Check for existing recent record
    SELECT last_generated_at INTO v_last_gen
    FROM generation_limits
    WHERE (ip_address = p_ip OR fingerprint_hash = p_fingerprint OR token = p_token)
      AND last_generated_at > NOW() - (p_window_hours || ' hours')::INTERVAL
    ORDER BY last_generated_at DESC
    LIMIT 1;

    IF v_last_gen IS NOT NULL THEN
        v_wait_seconds := EXTRACT(EPOCH FROM (v_last_gen + (p_window_hours || ' hours')::INTERVAL - NOW()))::INT;
        RETURN QUERY SELECT FALSE, v_wait_seconds;
    ELSE
        -- No recent record, so we allow it and record the current generation
        INSERT INTO generation_limits (ip_address, fingerprint_hash, token, last_generated_at)
        VALUES (p_ip, p_fingerprint, p_token, NOW());
        
        RETURN QUERY SELECT TRUE, 0;
    END IF;
END;
$$ LANGUAGE plpgsql;
