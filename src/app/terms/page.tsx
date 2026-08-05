export default function TermsPage() {
  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '860px', margin: '0 auto', fontFamily: 'inherit', color: '#111', lineHeight: 1.7 }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '0.25rem' }}>WEBSITE SERVICES AGREEMENT & TERMS OF SERVICE</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Last Updated: August 5, 2026</p>

      <p style={{ marginBottom: '1.5rem' }}>
        This Website Services Agreement ("Agreement") is entered into by and between Ing. Petr Bača, residing/headquartered at Dvořákova 1879/10, 741 01 Nový Jičín, Czech Republic, operating and presenting services under the trade name Webs Bača ("Provider"), and the entity or individual subscribing to the services ("Client").
      </p>
      <p style={{ marginBottom: '2rem' }}>
        By placing an order, checking the acceptance box, or paying for the services, the Client agrees to be legally bound by the terms of this Agreement.
      </p>

      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '1rem' }}>1. Scope of Services</h2>
      <p style={{ marginBottom: '0.75rem' }}>1.1 The Provider agrees to supply, host, and maintain a functional website presentation for the Client ("Website").</p>
      <p style={{ marginBottom: '0.75rem' }}>1.2 The Provider shall ensure technical functionality, security maintenance, and standard infrastructure operational stability.</p>
      <p style={{ marginBottom: '2rem' }}>1.3 <strong>Disclaimer of Commercial Results:</strong> The Provider does NOT guarantee any specific financial return, sales increases, web traffic metrics, or customer acquisition outcomes. The service is provided strictly as a technical and design framework.</p>

      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '1rem' }}>2. Intellectual Property, Domain Name & Buyout</h2>
      <p style={{ marginBottom: '0.75rem' }}>2.1 <strong>Ownership:</strong> The Website, source code, underlying software architecture, databases, and structural designs remain the exclusive intellectual property of the Provider.</p>
      <p style={{ marginBottom: '0.75rem' }}>2.2 <strong>Usage License:</strong> The Client receives a non-exclusive, non-transferable license to utilize the Website strictly for the active duration of this Agreement.</p>
      <p style={{ marginBottom: '0.75rem' }}>2.3 <strong>Infrastructure:</strong> The domain name and hosting resources are registered and managed directly by the Provider.</p>
      <p style={{ marginBottom: '2rem' }}>2.4 <strong>Buyout Option:</strong> Upon mutual agreement, the Client may purchase full ownership of the Website's assets and code for a one-time buyout fee of $1,000 USD. Upon receipt of full payment of the buyout fee, the Provider shall transfer the domain name and code repository to the Client's control.</p>

      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '1rem' }}>3. Contract Duration, Initial Term & Termination</h2>
      <p style={{ marginBottom: '0.75rem' }}>3.1 <strong>Mandatory Initial Term:</strong> This Agreement is executed for an initial mandatory term of ten (10) consecutive months ("Initial Term"). The Client cannot prematurely terminate or withdraw from the Agreement during the Initial Term.</p>
      <p style={{ marginBottom: '0.75rem' }}>3.2 <strong>Conversion to Indefinite Period:</strong> Upon the completion of the 10th month, this Agreement automatically converts into a contract of indefinite duration ("Indefinite Term").</p>
      <p style={{ marginBottom: '0.75rem' }}>3.3 <strong>Termination Conditions:</strong></p>
      <ul style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem' }}>
        <li style={{ marginBottom: '0.5rem' }}><strong>During Initial Term:</strong> Early termination by the Client is not permitted.</li>
        <li><strong>During Indefinite Term (Month 11 onwards):</strong> Either party may terminate the Agreement by providing a 30-day written notice.</li>
      </ul>
      <p style={{ marginBottom: '2rem' }}>3.4 <strong>Notice Format:</strong> All notices of termination or formal contract communication must be submitted electronically to the Provider's official email address: <a href="mailto:webs.baca.support@gmail.com" style={{ color: '#0066cc' }}>webs.baca.support@gmail.com</a>.</p>

      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '1rem' }}>4. Billing, Due Dates & Default Procedures</h2>
      <p style={{ marginBottom: '0.75rem' }}>4.1 <strong>Billing Schedule:</strong> Automated invoices/charges are issued via Stripe on the 1st calendar day of each month. The Client is granted a grace period of four (4) business days from the invoice date to complete the payment.</p>
      <p style={{ marginBottom: '0.75rem' }}>4.2 <strong>Overdue Default Protocol (Initial Term - Months 1 to 10):</strong></p>
      <ul style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem' }}>
        <li style={{ marginBottom: '0.5rem' }}><strong>Notification:</strong> The Provider will issue official electronic payment reminders upon payment failure.</li>
        <li style={{ marginBottom: '0.5rem' }}><strong>Suspension (14 Days Overdue):</strong> If payment is not cleared within 14 days of the due date, the Provider reserves the right to temporarily suspend Website operations.</li>
        <li style={{ marginBottom: '0.5rem' }}><strong>Legal Recovery:</strong> Temporary suspension during the Initial Term does NOT release the Client from their contractual obligation. Remaining monthly dues for the mandatory 10-month period will continue to accrue and will be legally recovered via collection procedures or formal legal action.</li>
        <li><strong>Reactivation:</strong> If the Client clears all outstanding balance dues, Website access and operational status will be fully restored.</li>
      </ul>
      <p style={{ marginBottom: '0.75rem' }}>4.3 <strong>Overdue Default Protocol (Indefinite Term - Month 11 onwards):</strong></p>
      <ul style={{ marginBottom: '2rem', paddingLeft: '1.5rem' }}>
        <li style={{ marginBottom: '0.5rem' }}><strong>Notification:</strong> The Provider will inform the Client of payment default.</li>
        <li style={{ marginBottom: '0.5rem' }}><strong>Suspension (14 Days Overdue):</strong> The Website will be temporarily suspended after 14 days of non-payment.</li>
        <li><strong>Contract Termination (30 Days Overdue):</strong> If payment is not cleared within 30 days of the due date, the Provider reserves the right to permanently terminate the service, erase hosted data, and release the infrastructure, while informing the Client.</li>
      </ul>

      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '1rem' }}>5. Limitation of Liability</h2>
      <p style={{ marginBottom: '2rem' }}>5.1 The Provider shall not be held liable for indirect, incidental, or consequential damages resulting from temporary technical downtime, internet service provider outages, or third-party infrastructure interruptions.</p>
    </div>
  );
}
