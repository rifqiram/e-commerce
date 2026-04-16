'use server';

import sql from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function placeOrder(formData) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  /* Extract form data (mock shipping/billing in real app) */
  // const address = formData.get('address');
  
  // 1. Fetch Cart
  const cartItems = await sql`
    SELECT c.quantity, p.id as product_id, p.price, p.stock
    FROM carts c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ${session.userId}
  `;

  if (cartItems.length === 0) {
    redirect('/cart');
  }

  // 2. Calculate Total
  const total = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  // 3. Create Order
  const orders = await sql`
    INSERT INTO orders (user_id, total_price, status)
    VALUES (${session.userId}, ${total}, 'pending')
    RETURNING id
  `;
  const orderId = orders[0].id;

  // 4. Create Order Items and decrease stock
  // Doing it in a loop for simplicity, in a real app a transaction is better
  for (const item of cartItems) {
    await sql`
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES (${orderId}, ${item.product_id}, ${item.quantity}, ${item.price})
    `;
    
    // Decrement stock
    await sql`
      UPDATE products 
      SET stock = stock - ${item.quantity}
      WHERE id = ${item.product_id}
    `;
  }

  // 5. Clear Cart
  await sql`DELETE FROM carts WHERE user_id = ${session.userId}`;

  // Redirect to success
  redirect(`/checkout/success?order_id=${orderId}`);
}
