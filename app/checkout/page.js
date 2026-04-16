import sql from "../../lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { placeOrder } from "../actions/checkout";

export const metadata = {
  title: 'Checkout | AuraStore'
}

export default async function CheckoutPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login?returnUrl=/checkout');
  }

  // Fetch cart items
  const cartItems = await sql`
    SELECT c.quantity, p.name, p.price
    FROM carts c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ${session.userId}
  `;

  if (cartItems.length === 0) {
    redirect('/cart');
  }

  const total = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="page-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>Checkout</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) 1fr', gap: '2rem' }}>
        
        <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Shipping & Payment Details</h2>
          <form action={placeOrder} id="checkout-form">
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name</label>
              <input type="text" name="name" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Shipping Address</label>
              <textarea name="address" required rows="3" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)', fontFamily: 'inherit' }}></textarea>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Card Information</label>
              <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-color)', color: 'var(--text-muted)' }}>
                Mock Payment - No real card needed
              </div>
            </div>
          </form>
        </div>

        <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Order Summary</h2>
          
          <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cartItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span>{item.quantity}x {item.name}</span>
                <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: 800, fontSize: '1.25rem' }}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <button type="submit" form="checkout-form" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
