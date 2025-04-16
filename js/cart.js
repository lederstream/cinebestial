document.addEventListener('DOMContentLoaded', function() {
    // Carrito de compras
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const cartBtn = document.querySelector('.cart-icon');
    const cartBadge = document.querySelector('.cart-badge');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const pagoManualSection = document.getElementById('pagoManual');
    
    // Actualizar el badge del carrito
    function updateCartBadge() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartBadge.textContent = totalItems;
        if (totalItems > 0) {
            cartBadge.style.display = 'flex';
        } else {
            cartBadge.style.display = 'none';
        }
    }
    
    // Renderizar items del carrito
    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4">Tu carrito está vacío</td>
                </tr>
            `;
            cartTotalElement.textContent = 'S/. 0.00';
            checkoutBtn.disabled = true;
            pagoManualSection.style.display = 'none';
            return;
        }
        
        checkoutBtn.disabled = false;
        cartItemsContainer.innerHTML = '';
        
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${item.name}" class="img-thumbnail me-3" style="width: 60px;">
                        <div>
                            <h6 class="mb-0">${item.name}</h6>
                            <small class="text-muted">${item.category}</small>
                        </div>
                    </div>
                </td>
                <td>S/. ${item.price.toFixed(2)}</td>
                <td>
                    <div class="input-group" style="width: 120px;">
                        <button class="btn btn-outline-light decrease-quantity" data-index="${index}" type="button">-</button>
                        <input type="text" class="form-control bg-transparent text-center text-white quantity-input" value="${item.quantity}" readonly>
                        <button class="btn btn-outline-light increase-quantity" data-index="${index}" type="button">+</button>
                    </div>
                </td>
                <td>S/. ${itemTotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger btn-sm remove-item" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            cartItemsContainer.appendChild(tr);
        });
        
        cartTotalElement.textContent = `S/. ${total.toFixed(2)}`;
        pagoManualSection.style.display = cart.length > 0 ? 'block' : 'none';
    }
    
    // Añadir servicio al carrito
    function addToCart(product) {
        const existingItem = cart.find(item => item.name === product.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        renderCartItems();
        
        // Mostrar notificación
        showNotification(`${product.name} añadido al carrito`);
    }
    
    // Eliminar item del carrito
    function removeItem(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        renderCartItems();
        
        // Mostrar notificación
        showNotification('Servicio eliminado del carrito');
    }
    
    // Actualizar cantidad
    function updateQuantity(index, change) {
        const newQuantity = cart[index].quantity + change;
        
        if (newQuantity < 1) {
            removeItem(index);
            return;
        }
        
        cart[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        renderCartItems();
    }
    
    // Mostrar notificación
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle me-2"></i>
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Event listeners
    document.addEventListener('click', function(e) {
        // Añadir al carrito
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            e.preventDefault();
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const product = JSON.parse(button.dataset.product);
            addToCart(product);
        }
        
        // Eliminar item
        if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
            const button = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
            const index = parseInt(button.dataset.index);
            removeItem(index);
        }
        
        // Aumentar cantidad
        if (e.target.classList.contains('increase-quantity') || e.target.closest('.increase-quantity')) {
            const button = e.target.classList.contains('increase-quantity') ? e.target : e.target.closest('.increase-quantity');
            const index = parseInt(button.dataset.index);
            updateQuantity(index, 1);
        }
        
        // Disminuir cantidad
        if (e.target.classList.contains('decrease-quantity') || e.target.closest('.decrease-quantity')) {
            const button = e.target.classList.contains('decrease-quantity') ? e.target : e.target.closest('.decrease-quantity');
            const index = parseInt(button.dataset.index);
            updateQuantity(index, -1);
        }
        
        // Finalizar compra
        if (e.target === checkoutBtn || e.target.closest('#checkoutBtn')) {
            e.preventDefault();
            $('#cartModal').modal('hide');
            $('#confirmationModal').modal('show');
        }
    });
    
    // Inicializar carrito
    updateCartBadge();
    renderCartItems();
    
    // Cargar productos desde servicios.js
    if (typeof loadServices === 'function') {
        loadServices();
    }
});