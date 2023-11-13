import React, {useState, useEffect} from 'react';
import './MainPage.css';

const backend_url = process.env.REACT_APP_BACKEND_API;

function MainPage() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
    const totalCost = cart.reduce((previous_cost, item) => (previous_cost + item.buy_quantity * item.shoes_price), 0);

    useEffect(() => {
        fetch(`${backend_url}/api/v1/products`)
            .then(response => response.json())
            .then(data => setProducts(data.products))
            .catch(error => console.error('Error on fetching products:', error));
        
        setCart(JSON.parse(localStorage.getItem('cart')) || []);
    }, []);

    function updateCart(newCart)
    {
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    }

    function addToCart(product) {
        updateCart([...cart, { ...product, buy_quantity: 1 }]);
    };

    function isInCart(productID) {
        return cart.some(item => item.shoes_ID === productID);
    }

    function increaseQuantity(updatingItem) {
        updateCart(cart.map((item) => {
            if (item.shoes_ID === updatingItem.shoes_ID)
                return {...item, buy_quantity: item.buy_quantity + 1};
            return item;
        }));
    }

    function decreaseQuantity(updatingItem) {
        updateCart(cart.map(item => {
            if (item.shoes_ID === updatingItem.shoes_ID)
                return {...item, buy_quantity: item.buy_quantity - 1};
            return item;
        }).filter(item => item.buy_quantity > 0));
    }

    function removeItem(deleteItem) {
        updateCart(cart.filter(item => item.shoes_ID !== deleteItem.shoes_ID));
    }

    return (
        <div className="main-container">
            <div className="product column-container">
                <div className="logo-at-top">
                <img src="/img/nike.png" alt="G-Sneaker" />
                </div>
                <div className="column-title">
                <h2>Our Products</h2>
                </div>
                <div className="product column-body">
                    {products.map((product) => (
                        <div className="product-item-container" key={product.shoes_ID}>
                            <div style={{ backgroundColor: product.shoes_color }} className="product-item-image-container">
                                <img src={product.shoes_image_path} alt="" />
                            </div>
                            <h3 className="product-item-name">{product.shoes_name}</h3>
                            <p className="product-item-description">{product.shoes_description}</p>
                            <div className="product-item-sell-area">
                                <span className="product-item-price">${product.shoes_price}</span>
                                {!isInCart(product.shoes_ID) ? (
                                    <span className="add-to-cart-btn" onClick={() => addToCart(product)}>ADD TO CART</span>
                                ) : (
                                    <div className="added-to-cart-container">
                                        <img src="/img/check.png" alt="" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="cart column-container">
                <div className="logo-at-top">
                    <img src="/img/nike.png" alt="G-Sneaker" />
                </div>
                <div className="column-title">
                    <h2>Your cart</h2>
                    <h2 className="total-cost">${totalCost.toFixed(2)}</h2>
                </div>
                {(cart.length === 0) ? (
                    <p className="no-item">Your cart is empty.</p>
                ) : (
                    <div className="cart column-body">
                        {cart.map((item) => (
                            <div className="cart-item-container" key={item.shoes_ID}>
                                <div style={{ backgroundColor: item.shoes_color }} className="cart-item-image">
                                    <img src={item.shoes_image_path} alt="" />
                                </div>
                                <div className="cart-item-info-zone">
                                    <div className="cart-item-name">{item.shoes_name}</div>
                                    <div className="cart-item-price">${item.shoes_price}</div>
                                    <div className="cart-item-quantity-control-zone">
                                        <div className="cart-item-quantity-adjust">
                                            <span className="item-dec-quantity" onClick={() => decreaseQuantity(item)}>-</span>
                                            <span className="item-quantity">{item.buy_quantity}</span>
                                            <span className="item-inc-quantity" onClick={() => increaseQuantity(item)}>+</span>
                                        </div>
                                        <div className="cart-item-remove" onClick={() => removeItem(item)}>
                                            <img src="/img/trash.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
  );
}

export default MainPage;