'use server';

import sql from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addToCart(formData) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const productId = formData.get('product_id');
  const quantity = parseInt(formData.get('quantity') || '1', 10);

  // Check if item already exists in cart for this user
  const existing = await sql`
    SELECT id, quantity FROM carts 
    WHERE user_id = ${session.userId} AND product_id = ${productId}
  `;

  if (existing.length > 0) {
    // Update quantity
    await sql`
      UPDATE carts 
      SET quantity = quantity + ${quantity} 
      WHERE id = ${existing[0].id}
    `;
  } else {
    // Insert new item
    await sql`
      INSERT INTO carts (user_id, product_id, quantity) 
      VALUES (${session.userId}, ${productId}, ${quantity})
    `;
  }

  revalidatePath('/cart');
  redirect('/cart');
}

export async function removeFromCart(formData) {
  const session = await getSession();
  if (!session) return;

  const cartId = formData.get('cart_id');
  
  await sql`
    DELETE FROM carts 
    WHERE id = ${cartId} AND user_id = ${session.userId}
  `;
  
  revalidatePath('/cart');
}

export async function updateQuantity(cartId, quantity) {
  const session = await getSession();
  if (!session) return;

  if (quantity <= 0) {
    await sql`DELETE FROM carts WHERE id = ${cartId} AND user_id = ${session.userId}`;
  } else {
    await sql`UPDATE carts SET quantity = ${quantity} WHERE id = ${cartId} AND user_id = ${session.userId}`;
  }

  revalidatePath('/cart');
}
