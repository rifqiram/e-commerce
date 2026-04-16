import Link from 'next/link';
import { addToCart } from '../app/actions/cart';

export default function ProductCard({ product }) {
  // Use a generated gradient as placeholder if no image
  const placeholderImg = `https://placehold.co/600x400/1e293b/f8fafc?text=${encodeURIComponent(product.name)}`;
  
  return (
    <div className="product-card">
      <Link href={`/products/${product.id}`} className="product-image-container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={product.image_url || placeholderImg} 
          alt={product.name} 
          className="product-image"
        />
      </Link>
      <div className="product-info">
        <Link href={`/products/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-price">${Number(product.price).toFixed(2)}</p>
        <form action={addToCart}>
          <input type="hidden" name="product_id" value={product.id} />
          <input type="hidden" name="quantity" value="1" />
          <button type="submit" className="btn btn-primary add-to-cart-btn">Add to Cart</button>
        </form>
      </div>
    </div>
  );
}
