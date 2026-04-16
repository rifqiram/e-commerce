import AuthForm from "../../components/AuthForm";
import Link from 'next/link';
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Sign Up | AuraStore'
};

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    redirect(session.role === 'admin' ? '/admin' : '/');
  }

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div style={{ background: 'var(--surface-color)', padding: '3rem', borderRadius: '16px', border: '1px solid var(--border-color)', width: '100%', maxWidth: '400px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>Create Account</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center' }}>Join AuraStore and enjoy premium shopping.</p>
        
        <AuthForm type="register" />
        
        <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
