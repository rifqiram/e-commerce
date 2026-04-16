import sql from "../../../lib/db";
import { addToCart } from "../../actions/cart";
import { notFound } from "next/navigation";
import Image from "next/image";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const products = await sql`SELECT name, description FROM products WHERE id = ${id}`;
  if (products.length === 0) return { title: 'Product Not Found' };
  
  return {
    title: `${products[0].name} | AuraStore`,
    description: products[0].description,
  };
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const products = await sql`SELECT * FROM products WHERE id = ${id}`;
  const product = products[0];

  if (!product) {
    notFound();
  }

  const placeholderImg = `https://placehold.co/800x600/1e293b/f8fafc?text=${encodeURIComponent(product.name)}`;

  return (
    <div className="product-detail-container animate-fade-in" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '3rem',
      padding: '2rem 0'
    }}>
      <div className="product-gallery" style={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--surface-color)',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={product.image_url || placeholderImg} 
          alt={product.name} 
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>
      
      <div className="product-info-full">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>{product.name}</h1>
        <p style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '1.5rem' }}>
          ${Number(product.price).toFixed(2)}
        </p>
        
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
          {product.description || "No description provided for this premium item."}
        </p>

        <div style={{ marginBottom: '2rem',  background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
           <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Availability</p>
           <p style={{ color: product.stock > 0 ? '#10b981' : '#ef4444', fontWeight: 500 }}>
             {product.stock > 0 ? `In Stock (${product.stock} items)` : 'Out of Stock'}
           </p>
        </div>
        
        <form action={addToCart} style={{ display: 'flex', gap: '1rem' }}>
           <input type="hidden" name="product_id" value={product.id} />
           <input type="hidden" name="quantity" value="1" />
           <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }} disabled={product.stock <= 0}>
             {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
           </button>
        </form>
      </div>
    </div>
  );
}
