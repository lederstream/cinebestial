class CartCheckout {
    constructor() {
        this.initEventListeners();
        this.loadCart();
    }

    initEventListeners() {
        document.getElementById('checkoutButton').addEventListener('click', () => this.checkout());
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('update-quantity')) {
                this.updateQuantity(
                    e.target.dataset.id, 
                    parseInt(e.target.dataset.change)
                );
            }
            
            if (e.target.classList.contains('remove-item')) {
                this.removeItem(e.target.dataset.id);
            }
        });
    }

    async loadCart() {
        try {
            const userId = (await supabase.auth.getUser()).data.user.id;
            const cart = await CartSystem.getCarritoActivo(userId);
            
            if (!cart) {
                await CartSystem.crearCarrito(userId);
                return this.loadCart();
            }
            
            this.renderCart(cart);
            this.updateCartSummary(cart);
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    }

    renderCart(cart) {
        const container = document.getElementById('cartItems');
        
        if (!cart || cart.items.length === 0) {
            container.innerHTML = '<div class="text-center py-5"><h5>Tu carrito está vacío</h5></div>';
            document.getElementById('checkoutButton').disabled = true;
            return;
        }
        
        container.innerHTML = cart.items.map(item => `
            <div class="card mb-3">
                <div class="row g-0">
                    <div class="col-md-2">
                        <img src="${item.producto.imagen_url || 'https://via.placeholder.com/150'}" class="img-fluid rounded-start" alt="${item.producto.nombre}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${item.producto.nombre}</h5>
                            <p class="card-text">${item.producto.descripcion || ''}</p>
                            <p class="card-text"><small class="text-muted">Proveedor: ${cart.profiles.nombre}</small></p>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="card-body d-flex flex-column justify-content-between h-100">
                            <div class="d-flex align-items-center mb-3">
                                <button class="btn btn-sm btn-outline-secondary update-quantity" data-id="${item.id}" data-change="-1">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="mx-2">${item.cantidad}</span>
                                <button class="btn btn-sm btn-outline-secondary update-quantity" data-id="${item.id}" data-change="1">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <div class="text-end">
                                <h5>S/${(item.producto.precio * item.cantidad).toFixed(2)}</h5>
                                <button class="btn btn-sm btn-danger remove-item" data-id="${item.id}">
                                    <i class="fas fa-trash"></i> Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async updateQuantity(itemId, change) {
        try {
            const { data: item, error } = await supabase
                .from('carrito_items')
                .select('*')
                .eq('id', itemId)
                .single();
            
            if (error) throw error;
            
            const newQuantity = item.cantidad + change;
            
            if (newQuantity < 1) {
                await this.removeItem(itemId);
                return;
            }
            
            await supabase
                .from('carrito_items')
                .update({ cantidad: newQuantity })
                .eq('id', itemId);
            
            await this.loadCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Error al actualizar cantidad');
        }
    }

    async removeItem(itemId) {
        try {
            await supabase
                .from('carrito_items')
                .delete()
                .eq('id', itemId);
            
            await this.loadCart();
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Error al eliminar producto');
        }
    }

    async checkout() {
        try {
            const userId = (await supabase.auth.getUser()).data.user.id;
            const cart = await CartSystem.getCarritoActivo(userId);
            
            if (!cart || cart.items.length === 0) {
                alert('Tu carrito está vacío');
                return;
            }
            
            const confirmCheckout = confirm(`¿Confirmas tu compra por S/${cart.items.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0).toFixed(2)}?`);
            
            if (confirmCheckout) {
                await CartSystem.checkout(cart.id);
                alert('¡Compra realizada con éxito!');
                window.location.href = '/perfil';
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            alert(`Error: ${error.message}`);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cartPage')) {
        new CartCheckout();
    }
});