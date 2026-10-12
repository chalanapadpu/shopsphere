
import { Link } from 'react-router-dom';

function Navbar({ cartCount, onOpenCart }) {
    return (
        <nav className="navbar">
            <Link to="/" className="brand-link">
                <h2>ShopSphere.</h2>
            </Link>

            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/#contact">Contact</Link>

                <Link to="/cart" className="cart-link">
                    Cart ({cartCount})
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
