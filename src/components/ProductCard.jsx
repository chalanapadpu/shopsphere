
function ProductCard({ product, onViewProduct }) {
    return (
        <article className="product-card">
            <div className="product-image">
                <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                />
            </div>

            <p className="category">{product.category}</p>

            <h3>{product.name}</h3>

            <p className="price">
                ₹{product.price.toLocaleString('en-IN')}
            </p>

            <button
                type="button"
                onClick={() => onViewProduct(product)}
            >
                View Product
            </button>
        </article>
    );
}

export default ProductCard;

