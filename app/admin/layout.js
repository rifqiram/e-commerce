import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }) {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    redirect('/'); // Unauthorized users are booted
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', minHeight: 'calc(100vh - var(--nav-height))' }}>
      <aside style={{ background: 'var(--surface-color)', borderRight: '1px solid var(--border-color)', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--primary)' }}>Admin Dashboard</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/admin" style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--bg-color)', fontWeight: 600 }}>Overview</Link>
          <Link href="/admin/products" style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--bg-color)', fontWeight: 600 }}>Products</Link>
          <Link href="/admin/orders" style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--bg-color)', fontWeight: 600 }}>Orders</Link>
        </nav>
      </aside>
      
      <main style={{ padding: '3rem', background: 'var(--bg-color)' }}>
        {children}
      </main>
    </div>
  );
}
