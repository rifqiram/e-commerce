import sql from "../../lib/db";
import ProductCard from "../../components/ProductCard";

export const metadata = {
  title: 'Products | AuraStore'
};

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const q = params?.q || '';

  // Fetch products from database optionally filtering by name
  let products;
  if (q) {
    const searchPattern = `%${q}%`;
    products = await sql`SELECT * FROM products WHERE name ILIKE ${searchPattern} ORDER BY created_at DESC`;
  } else {
    products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
  }

  return (
    <div className="container animate-fade-in">
      <header className="page-header">
        <h1 className="page-title">Discover Our Products</h1>
        <p className="page-subtitle">Premium quality for your everyday needs.</p>
        
        <form method="GET" action="/products" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', maxWidth: '500px', margin: '2rem auto 0' }}>
          <input 
            type="search" 
            name="q" 
            defaultValue={q} 
            placeholder="Search products..." 
            style={{ width: '100%', padding: '0.75rem 1.5rem', borderRadius: '999px 0 0 999px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--surface-color)', color: 'var(--text-color)' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '0 999px 999px 0', border: '1px solid var(--primary)' }}>
            Search
          </button>
        </form>
      </header>

      {products.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '4rem', background: 'var(--surface-color)', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No products found!</h2>
          <p style={{ color: 'var(--text-muted)' }}>{q ? `We couldn't find anything matching "${q}".` : "Check back later or contact support."}</p>
          {q && <a href="/products" className="btn btn-secondary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>Clear Search</a>}
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
