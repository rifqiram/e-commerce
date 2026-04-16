'use server';

import sql from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function checkAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }
}

export async function addProduct(formData) {
  await checkAdmin();
  
  const name = formData.get('name');
  const description = formData.get('description');
  const price = parseFloat(formData.get('price'));
  const stock = parseInt(formData.get('stock'));
  const image_url = formData.get('image_url') || null;

  await sql`
    INSERT INTO products (name, description, price, stock, image_url)
    VALUES (${name}, ${description}, ${price}, ${stock}, ${image_url})
  `;

  revalidatePath('/admin/products');
  revalidatePath('/products');
  redirect('/admin/products');
}

export async function deleteProduct(formData) {
  await checkAdmin();
  const id = formData.get('id');
  
  await sql`DELETE FROM products WHERE id = ${id}`;
  
  revalidatePath('/admin/products');
  revalidatePath('/products');
}
