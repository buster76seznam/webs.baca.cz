export default function PrivacyPage() {
  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '860px', margin: '0 auto', fontFamily: 'inherit', color: '#fff', lineHeight: 1.7 }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '0.25rem' }}>PRIVACY POLICY</h1>
      <p style={{ color: '#aaa', marginBottom: '2rem' }}>Last Updated: August 5, 2026</p>

      <p style={{ marginBottom: '2rem' }}>
        This Privacy Policy describes how Ing. Petr Bača, operating under the trade name Webs Bača ("we", "us", or "our"), collects, uses, and protects your personal information when you use our website and services.
      </p>

      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '1rem' }}>1. Information We Collect</h2>
      <p style={{ marginBottom: '0.75rem' }}>We collect information that you directly provide to us when placing an order or communicating with us:</p>
      <ul style={{ marginBottom: '2rem', paddingLeft: '1.5rem' }}>
        <li style={{ marginBottom: '0.5rem' }}><strong>Account & Contact Data:</strong> Name, business name, email address, phone number, and physical billing address.</li>
        <li style={{ marginBottom: '0.5rem' }}><strong>Payment Information:</strong> Payment card details and transaction history. Please note: All payment card transactions are processed directly and securely by Stripe. We do not store full credit card numbers on our servers.</li>
        <li><strong>Technical & Usage Data:</strong> IP address, browser type, device information, and interactions with our website.</li>
      </ul>

      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '1rem' }}>2. How We Use Your Information</h2>
      <p style={{ marginBottom: '0.75rem' }}>We use the collected information strictly for the following operational purposes:</p>
      <ul style={{ marginBottom: '2rem', paddingLeft: '1.5rem' }}>
        <li style={{ marginBottom: '0.5rem' }}>To process orders, set up web hosting infrastructure, and manage subscription billing.</li>
        <li style={{ marginBottom: '0.5rem' }}>To communicate with you regarding service updates, technical notifications, and invoice receipts.</li>
        <li style={{ marginBottom: '0.5rem' }}>To provide ongoing technical support and process requested website revisions.</li>
        <li>To comply with statutory legal, accounting, and tax obligations.</li>
      </ul>

      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '1rem' }}>3. Third-Party Service Providers</h2>
      <p style={{ marginBottom: '0.75rem' }}>To deliver our automated services, we share necessary data with trusted third-party infrastructure providers:</p>
      <ul style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem' }}>
        <li style={{ marginBottom: '0.5rem' }}><strong>Stripe Inc.:</strong> Payment processing, transaction verification, and billing management.</li>
        <li style={{ marginBottom: '0.5rem' }}><strong>Supabase Inc.:</strong> Database infrastructure for order status and website content configuration.</li>
        <li style={{ marginBottom: '0.5rem' }}><strong>Resend Inc.:</strong> Transactional email notifications and service communications.</li>
        <li><strong>Vercel Inc.:</strong> Hosting infrastructure, deployment, and domain connection.</li>
      </ul>
      <p style={{ marginBottom: '2rem' }}>Each third-party provider processes data in compliance with international security standards and data protection regulations.</p>

      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '1rem' }}>4. Data Retention</h2>
      <p style={{ marginBottom: '2rem' }}>
        We retain your personal information for as long as your service subscription remains active, or as necessary to fulfill contractual obligations, resolve disputes, and comply with applicable tax and legal regulations.
      </p>

      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '1rem' }}>5. Your Data Protection Rights</h2>
      <p style={{ marginBottom: '0.75rem' }}>Depending on your geographic location (including GDPR for EU residents and applicable US state privacy laws), you have the following rights regarding your personal data:</p>
      <ul style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem' }}>
        <li style={{ marginBottom: '0.5rem' }}><strong>Access:</strong> The right to request copies of the personal data we hold about you.</li>
        <li style={{ marginBottom: '0.5rem' }}><strong>Correction:</strong> The right to request correction of inaccurate or incomplete information.</li>
        <li><strong>Deletion:</strong> The right to request the erasure of your personal data, subject to legal and accounting retention mandates.</li>
      </ul>
      <p style={{ marginBottom: '2rem' }}>
        To exercise any of these rights, please contact us at <a href="mailto:webs.baca.support@gmail.com" style={{ color: '#0066cc' }}>webs.baca.support@gmail.com</a>.
      </p>

      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '1rem' }}>6. Contact Information</h2>
      <p style={{ marginBottom: '0.25rem' }}>If you have any questions or concerns regarding this Privacy Policy, please contact us at:</p>
      <address style={{ fontStyle: 'normal', marginTop: '0.75rem' }}>
        <strong>Webs Bača</strong><br />
        Operator: Ing. Petr Bača<br />
        Address: Dvořákova 1879/10, 741 01 Nový Jičín, Czech Republic<br />
        Official Support Email: <a href="mailto:webs.baca.support@gmail.com" style={{ color: '#0066cc' }}>webs.baca.support@gmail.com</a>
      </address>
    </div>
  );
}
