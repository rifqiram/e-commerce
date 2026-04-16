import Link from 'next/link';
import { getSession } from '@/lib/auth';

export default async function Navbar() {
  const session = await getSession();

  return (
    <nav className="navbar">
      <Link href="/" className="nav-brand">
        KikStore.
      </Link>
      <div className="nav-links">
        <Link href="/products" className="nav-link">Products</Link>
        <Link href="/cart" className="nav-link">Cart</Link>
        {session ? (
          <>
            <Link href="/admin" className="nav-link">Admin</Link>
            <a href="/api/auth/logout" className="btn btn-secondary" style={{ textDecoration: 'none' }}>Logout</a>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-secondary">Sign In</Link>
            <Link href="/register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
