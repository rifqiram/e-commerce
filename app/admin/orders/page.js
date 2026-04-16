import sql from "@/lib/db";
import Link from "next/link";

export const metadata = { title: "Manage Orders | AuraStore" };

export default async function AdminOrdersPage() {
  const orders = await sql`
    SELECT o.id, o.total_price, o.status, o.created_at, u.name as customer_name, u.email as customer_email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Manage Orders</h1>
      </div>

      <div style={{ background: "var(--surface-color)", borderRadius: "12px", border: "1px solid var(--border-color)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--bg-color)", borderBottom: "2px solid var(--border-color)" }}>
              <th style={{ padding: "1rem" }}>Order ID</th>
              <th style={{ padding: "1rem" }}>Customer</th>
              <th style={{ padding: "1rem" }}>Date</th>
              <th style={{ padding: "1rem" }}>Total</th>
              <th style={{ padding: "1rem" }}>Status</th>
              <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                  No orders placed yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "1rem", fontWeight: 600, fontSize: "0.85rem" }}>
                    <span style={{ fontFamily: "monospace" }}>{order.id.split('-')[0]}</span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 600 }}>{order.customer_name}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{order.customer_email}</div>
                  </td>
                  <td style={{ padding: "1rem", color: "var(--text-muted)" }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "1rem", fontWeight: 600 }}>${Number(order.total_price).toFixed(2)}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ 
                      padding: "0.25rem 0.75rem", 
                      background: order.status === 'pending' ? "rgba(245, 158, 11, 0.1)" : "rgba(16, 185, 129, 0.1)", 
                      color: order.status === 'pending' ? "#f59e0b" : "#10b981", 
                      borderRadius: "999px", fontSize: "0.85rem", fontWeight: 600, textTransform: "capitalize" 
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <button style={{ color: "var(--primary)", background: "transparent", border: "none", cursor: "pointer", fontWeight: 600 }}>
                      View
                    </button>
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
