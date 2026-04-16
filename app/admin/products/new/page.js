import { addProduct } from "../../../actions/adminProducts";

export const metadata = { title: "Add Product | Admin" };

export default function AddProductPage() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "2rem" }}>Add New Product</h1>

      <form action={addProduct} style={{ background: "var(--surface-color)", padding: "2rem", borderRadius: "16px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Product Name *</label>
          <input type="text" name="name" required style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-color)" }} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Description</label>
          <textarea name="description" rows="4" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-color)", fontFamily: "inherit" }}></textarea>
        </div>

        <div style={{ display: "flex", gap: "1.5rem" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Price ($) *</label>
            <input type="number" name="price" step="0.01" min="0" required style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-color)" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Stock *</label>
            <input type="number" name="stock" min="0" defaultValue="10" required style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-color)" }} />
          </div>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Image URL</label>
          <input type="url" name="image_url" placeholder="https://example.com/image.jpg" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-color)" }} />
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>Leave blank to use a generated placeholder.</p>
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: "1rem", marginTop: "1rem", fontSize: "1.05rem" }}>
          Create Product
        </button>

      </form>
    </div>
  );
}
