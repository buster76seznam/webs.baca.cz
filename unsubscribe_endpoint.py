# Add this to admin_panel.py on the VPS server
# Place the imports at the top of the file with other imports
import csv
import os
from datetime import datetime

# Add BLACKLIST_FILE path near other file paths (e.g., after DATA_DIR definition)
BLACKLIST_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "email_blacklist.csv")

# Add this helper function (place it with other helper functions)
def ensure_blacklist_file():
    """Ensure the blacklist CSV file exists with proper headers."""
    if not os.path.exists(BLACKLIST_FILE):
        with open(BLACKLIST_FILE, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['email', 'unsubscribed_at'])

def add_to_blacklist(email: str) -> bool:
    """Add an email to the unsubscribe blacklist."""
    ensure_blacklist_file()
    
    # Normalize email
    email = email.strip().lower()
    
    # Check if already in blacklist
    existing = set()
    if os.path.exists(BLACKLIST_FILE):
        with open(BLACKLIST_FILE, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader, None)  # Skip header
            for row in reader:
                if row:
                    existing.add(row[0].strip().lower())
    
    if email in existing:
        return True  # Already unsubscribed
    
    # Add to blacklist
    with open(BLACKLIST_FILE, 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([email, datetime.utcnow().isoformat()])
    
    return True

# Add this endpoint to your Flask app (place it with other @app.route definitions)
# IMPORTANT: Place this BEFORE the auth decorator check so it's public
# If you have auth protection on all routes, add this exemption:
#
# From your app.route decorators, if you have something like:
#   @app.before_request
#   def check_auth():
#       ...auth logic...
#
# Add this before that check:
#   EXEMPT_ROUTES = {'/unsubscribe', '/health', ...}
#   if request.path in EXEMPT_ROUTES:
#       return None

@app.route('/unsubscribe', methods=['POST'])
def unsubscribe():
    """Public endpoint to unsubscribe an email address."""
    try:
        data = request.get_json()
        if not data or 'email' not in data:
            return jsonify({'error': 'Email is required'}), 400
        
        email = data.get('email', '').strip()
        if not email or '@' not in email:
            return jsonify({'error': 'Invalid email format'}), 400
        
        add_to_blacklist(email)
        
        return jsonify({
            'success': True,
            'message': 'Successfully unsubscribed'
        }), 200
        
    except Exception as e:
        print(f"Unsubscribe error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


# OPTIONAL: Add route to check if email is blacklisted (for mail sending logic)
@app.route('/check-unsubscribe/<email>', methods=['GET'])
def check_unsubscribe(email):
    """Check if an email is in the blacklist."""
    email = email.strip().lower()
    
    if not os.path.exists(BLACKLIST_FILE):
        return jsonify({'blacklisted': False})
    
    with open(BLACKLIST_FILE, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        next(reader, None)  # Skip header
        for row in reader:
            if row and row[0].strip().lower() == email:
                return jsonify({'blacklisted': True})
    
    return jsonify({'blacklisted': False})
