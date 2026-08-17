
import React from 'react';

interface ReportEmailProps {
  reportType: 'Weekly' | 'Monthly';
  fromDate: string;
  toDate: string;
  grossRevenue: number;
  netRevenue: number;
  totalCommissions: number;
  newCustomers: number;
  ordersByRegion: { USACanada: number; Europe: number; UK: number };
  orderStatusCounts: Record<string, number>;
  totalInfluencers: number;
  newInfluencers: number;
  topInfluencers: {
    name: string;
    referral_code: string;
    customers: number;
    commission: number;
  }[];
}

export const ReportEmail: React.FC<ReportEmailProps> = ({
  reportType,
  fromDate,
  toDate,
  grossRevenue,
  netRevenue,
  totalCommissions,
  newCustomers,
  ordersByRegion,
  orderStatusCounts,
  totalInfluencers,
  newInfluencers,
  topInfluencers,
}) => (
  <html style={{ fontFamily: 'sans-serif', backgroundColor: '#111', color: '#eee' }}>
    <head>
      <title>{`Webs Bača - Executive ${reportType} Report`}</title>
    </head>
    <body style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>Webs Bača - Executive {reportType} Report</h1>
        <p style={{ color: '#999' }}>
          {new Date(fromDate).toLocaleDateString()} – {new Date(toDate).toLocaleDateString()}
        </p>
      </header>

      <main>
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0, color: '#aaa' }}>💰 Gross Revenue</h3>
            <p style={{ fontSize: '2em', margin: 0 }}>${grossRevenue.toFixed(2)}</p>
          </div>
          <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0, color: '#aaa' }}>🚀 Net Profit</h3>
            <p style={{ fontSize: '2em', margin: 0 }}>${netRevenue.toFixed(2)}</p>
          </div>
          <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0, color: '#aaa' }}>📈 New Customers</h3>
            <p style={{ fontSize: '2em', margin: 0 }}>{newCustomers}</p>
          </div>
          <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0, color: '#aaa' }}>🤝 Partner Commissions</h3>
            <p style={{ fontSize: '2em', margin: 0 }}>${totalCommissions.toFixed(2)}</p>
          </div>
        </section>

        <section>
          <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>Detailed Breakdown</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div>
              <h3>Revenue by Region</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '10px 0' }}>USA/Canada</td>
                    <td style={{ textAlign: 'right' }}>{ordersByRegion.USACanada} orders</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '10px 0' }}>Europe</td>
                    <td style={{ textAlign: 'right' }}>{ordersByRegion.Europe} orders</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 0' }}>UK</td>
                    <td style={{ textAlign: 'right' }}>{ordersByRegion.UK} orders</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3>Order Status</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {Object.entries(orderStatusCounts).map(([status, count]) => (
                    <tr key={status} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ padding: '10px 0' }}>{status}</td>
                      <td style={{ textAlign: 'right' }}>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section>
            <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>Influencer Performance</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '20px' }}>
                <div>
                    <h3>Total Influencers</h3>
                    <p style={{ fontSize: '1.5em', margin: 0 }}>{totalInfluencers}</p>
                </div>
                <div>
                    <h3>New Influencers This Period</h3>
                    <p style={{ fontSize: '1.5em', margin: 0 }}>{newInfluencers}</p>
                </div>
            </div>
            <h3>Top 3 Influencers</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #333' }}>
                        <th style={{ textAlign: 'left', padding: '10px 0' }}>Name</th>
                        <th style={{ textAlign: 'right', padding: '10px 0' }}>Customers</th>
                        <th style={{ textAlign: 'right', padding: '10px 0' }}>Commission</th>
                    </tr>
                </thead>
                <tbody>
                {topInfluencers.map((influencer) => (
                    <tr key={influencer.referral_code} style={{ borderBottom: '1px solid #333' }}>
                        <td style={{ padding: '10px 0' }}>{influencer.name}</td>
                        <td style={{ textAlign: 'right' }}>{influencer.customers}</td>
                        <td style={{ textAlign: 'right' }}>${influencer.commission.toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>

      </main>
    </body>
  </html>
);
