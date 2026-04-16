import sql from "@/lib/db";
import Link from "next/link";
import { deleteProduct } from "../../actions/adminProducts";

export const metadata = { title: "Manage Products | AuraStore" };

export default async function AdminProductsPage() {
  const products = await sql`SELECT * FROM products ORDER BY created_at DESC`;

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Manage Products</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          + Add Product
        </Link>
      </div>

      <div style={{ background: "var(--surface-color)", borderRadius: "12px", border: "1px solid var(--border-color)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--bg-color)", borderBottom: "2px solid var(--border-color)" }}>
              <th style={{ padding: "1rem" }}>Image</th>
              <th style={{ padding: "1rem" }}>Name</th>
              <th style={{ padding: "1rem" }}>Price</th>
              <th style={{ padding: "1rem" }}>Stock</th>
              <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                  No products found. Add one to get started.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "1rem", width: "80px" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "8px", overflow: "hidden", background: "var(--bg-color)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.image_url || `https://placehold.co/100x100/1e293b/f8fafc?text=IMG`} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  </td>
                  <td style={{ padding: "1rem", fontWeight: 600 }}>{product.name}</td>
                  <td style={{ padding: "1rem", color: "var(--primary)", fontWeight: 600 }}>${Number(product.price).toFixed(2)}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ padding: "0.25rem 0.75rem", background: product.stock > 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", color: product.stock > 0 ? "#10b981" : "#ef4444", borderRadius: "999px", fontSize: "0.85rem", fontWeight: 600 }}>
                      {product.stock}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <button type="submit" style={{ color: "#ef4444", background: "transparent", border: "none", cursor: "pointer", fontWeight: 600, padding: "0.5rem" }}>
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
