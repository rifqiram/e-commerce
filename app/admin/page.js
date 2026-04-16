import sql from "@/lib/db";

export const metadata = {
  title: 'Admin Dashboard | AuraStore'
}

export default async function AdminOverview() {
  const productsCount = await sql`SELECT count(*) FROM products`;
  const ordersCount = await sql`SELECT count(*) FROM orders`;
  const usersCount = await sql`SELECT count(*) FROM users`;
  const revenueResult = await sql`SELECT sum(total_price) as total FROM orders`;

  const stats = [
    { label: 'Total Products', value: productsCount[0].count },
    { label: 'Total Orders', value: ordersCount[0].count },
    { label: 'Total Users', value: usersCount[0].count },
    { label: 'Total Revenue', value: `$${parseFloat(revenueResult[0].total || 0).toFixed(2)}` },
  ];

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600 }}>{stat.label}</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
