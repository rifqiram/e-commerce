import sql from "../../lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { removeFromCart, updateQuantity } from "../actions/cart";

export const metadata = {
  title: 'Your Cart | AuraStore'
}

export default async function CartPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login?returnUrl=/cart');
  }

  // Fetch cart items
  const cartItems = await sql`
    SELECT c.id as cart_id, c.quantity, p.id as product_id, p.name, p.price, p.image_url, p.stock
    FROM carts c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ${session.userId} 
    ORDER BY c.created_at DESC
  `;

  const total = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem' }}>
      <h1 className="page-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--surface-color)', borderRadius: '16px' }}>
          <h2>Your cart is empty</h2>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Looks like you have not added anything yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr', gap: '2rem' }}>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.cart_id} style={{
                display: 'flex', gap: '1rem', padding: '1.5rem', background: 'var(--surface-color)', 
                borderRadius: '12px', marginBottom: '1rem', border: '1px solid var(--border-color)',
                alignItems: 'center'
              }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--background-light)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image_url || `https://placehold.co/100x100/1e293b/f8fafc?text=${encodeURIComponent(item.name.substring(0, 2))}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{item.name}</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: 600 }}>${Number(item.price).toFixed(2)}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-color)', padding: '0.25rem', borderRadius: '8px' }}>
                    <form action={updateQuantity.bind(null, item.cart_id, item.quantity - 1)}>
                      <button type="submit" style={{ padding: '0.25rem 0.5rem', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                    </form>
                    <span>{item.quantity}</span>
                    <form action={updateQuantity.bind(null, item.cart_id, item.quantity + 1)}>
                      <button type="submit" disabled={item.quantity >= item.stock} style={{ padding: '0.25rem 0.5rem', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                    </form>
                  </div>
                  
                  <form action={removeFromCart}>
                    <input type="hidden" name="cart_id" value={item.cart_id} />
                    <button type="submit" style={{ fontSize: '0.85rem', color: '#ef4444', background: 'transparent', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary" style={{
            background: 'var(--surface-color)', padding: '2rem', borderRadius: '16px',
            border: '1px solid var(--border-color)', height: 'fit-content'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Order Summary</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: 800, fontSize: '1.25rem' }}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <form action="/checkout" method="GET">
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                Proceed to Checkout
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
