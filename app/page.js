import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="hero animate-fade-in">
      <h1 className="hero-title">
        The Future of <br />
        <span style={{ 
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Online Shopping
        </span>
      </h1>
      <p className="hero-subtitle">
        Experience premium quality products with an ultra-fast checkout process and stunning modern design.
      </p>
      
      <div className="hero-actions">
        <Link href="/products" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
          Shop Now
        </Link>
        <Link href="/about" className="btn btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
          Learn More
        </Link>
      </div>

      <div style={{ marginTop: '4rem', opacity: 0.5, display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <p style={{ fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Trusted by Modern Brands</p>
      </div>
    </div>
  );
}
