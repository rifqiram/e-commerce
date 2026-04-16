import Link from 'next/link';

export const metadata = {
  title: 'Order Successful | AuraStore'
}

export default async function CheckoutSuccessPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams?.order_id;

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ background: 'var(--surface-color)', padding: '3rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Order Placed Successfully!</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        
        {orderId && (
          <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', wordBreak: 'break-all' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Order ID:</span>
            <br/>
            <strong>{orderId}</strong>
          </div>
        )}
        
        <Link href="/products" className="btn btn-primary" style={{ padding: '1rem 2rem', width: '100%' }}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
