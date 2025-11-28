// Cart utility functions for localStorage management

export const getCart = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product, quantity = 1) => {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            dosage: product.dosage,
            quantity: quantity,
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
};

export const removeFromCart = (productId) => {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    return updatedCart;
};

export const updateCartQuantity = (productId, quantity) => {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
        if (quantity <= 0) {
            return removeFromCart(productId);
        }
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    return cart;
};

export const clearCart = () => {
    localStorage.removeItem('cart');
    return [];
};

export const getCartTotal = () => {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartCount = () => {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
};
