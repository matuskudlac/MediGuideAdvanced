// Cart utility functions for localStorage management

export const getCart = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product, quantity = 1) => {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);

    // Calculate total quantity if item already exists in cart
    const currentCartQuantity = existingItem ? existingItem.quantity : 0;
    const totalQuantity = currentCartQuantity + quantity;

    // Check stock availability
    const availableStock = product.stock_quantity || 0;

    if (totalQuantity > availableStock) {
        const remainingStock = availableStock - currentCartQuantity;
        throw new Error(
            remainingStock > 0
                ? `Only ${remainingStock} more item(s) available. You already have ${currentCartQuantity} in your cart.`
                : `Cannot add more items. You already have ${currentCartQuantity} in your cart (max available).`
        );
    }

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
            stock_quantity: product.stock_quantity, // Store for reference
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Dispatch custom event to notify cart update
    window.dispatchEvent(new Event('cartUpdated'));

    return cart;
};

export const removeFromCart = (productId) => {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Dispatch custom event to notify cart update
    window.dispatchEvent(new Event('cartUpdated'));

    return updatedCart;
};

export const updateCartQuantity = (productId, quantity) => {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
        if (quantity <= 0) {
            return removeFromCart(productId);
        }

        // Check stock availability
        const availableStock = item.stock_quantity || 0;
        if (quantity > availableStock) {
            throw new Error(`Only ${availableStock} item(s) available in stock.`);
        }

        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));

        // Dispatch custom event to notify cart update
        window.dispatchEvent(new Event('cartUpdated'));
    }

    return cart;
};

export const clearCart = () => {
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
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
