// Sistema de carrito
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartIcon = document.querySelector('.cart-icon');
const cartBadge = document.querySelector('.cart-badge');

// Función para guardar el carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para actualizar el carrito
function updateCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    let total = 0;
    
    // Limpiar el carrito
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="5" class="text-center py-4">Tu carrito está vacío</td></tr>';
        cartBadge.textContent = '0';
        cartTotalElement.textContent = 'S/. 0.00';
        return;
    }
    
    // Agregar items al carrito
    cart.forEach((item, index) => {
        total += item.price;
        
        // Tabla del carrito
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image}" width="50" height="50" class="rounded me-3" alt="${item.name}">
                    <span>${item.name}</span>
                </div>
            </td>
            <td>S/. ${item.price.toFixed(2)}</td>
            <td>1</td>
            <td>S/. ${item.price.toFixed(2)}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        cartItemsContainer.appendChild(row);
    });
    
    // Actualizar totales
    cartBadge.textContent = cart.length;
    cartTotalElement.textContent = `S/. ${total.toFixed(2)}`;
    
    // Guardar carrito
    saveCart();
    
    // Agregar evento a los botones de eliminar
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cart.splice(index, 1);
            updateCart();
            
            // Mostrar notificación
            showToast('Producto eliminado', 'El producto ha sido eliminado de tu carrito.');
        });
    });
}

// Función para mostrar notificación
function showToast(title, message) {
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '11';
    toast.innerHTML = `
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-danger text-white">
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body bg-dark">
                ${message}
            </div>
        </div>
    `;
    document.body.appendChild(toast);
    
    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Agregar producto al carrito
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const product = JSON.parse(this.getAttribute('data-product'));
        cart.push(product);
        updateCart();
        
        // Animación del ícono del carrito
        cartIcon.classList.add('animate__animated', 'animate__bounce');
        setTimeout(() => {
            cartIcon.classList.remove('animate__animated', 'animate__bounce');
        }, 1000);
        
        // Mostrar notificación
        showToast('¡Producto agregado!', `${product.name} ha sido añadido al carrito.`);
    });
});

// Botón de añadir al carrito en el modal de producto
document.getElementById('addToCartBtn')?.addEventListener('click', function() {
    const product = JSON.parse(this.getAttribute('data-product'));
    cart.push(product);
    updateCart();
    
    // Cerrar el modal
    const productModal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    productModal.hide();
    
    // Animación del ícono del carrito
    cartIcon.classList.add('animate__animated', 'animate__bounce');
    setTimeout(() => {
        cartIcon.classList.remove('animate__animated', 'animate__bounce');
    }, 1000);
    
    // Mostrar notificación
    showToast('¡Producto agregado!', `${product.name} ha sido añadido al carrito.`);
});

// Finalizar compra
document.getElementById('checkoutBtn')?.addEventListener('click', function() {
    if (cart.length === 0) {
        showToast('Carrito vacío', 'Tu carrito está vacío. Agrega productos antes de finalizar.');
        return;
    }
    
    const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    cartModal.hide();
    
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    confirmationModal.show();
    
    // Vaciar el carrito después de la compra
    cart = [];
    updateCart();
});

// Inicializar el carrito al cargar la página
updateCart();