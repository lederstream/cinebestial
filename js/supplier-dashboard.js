class SupplierDashboard {
    constructor() {
        this.initEventListeners();
        this.loadProducts();
        this.loadCreditBalance();
    }

    async initEventListeners() {
        document.getElementById('addProductForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addProduct();
        });

        document.getElementById('reloadProducts').addEventListener('click', () => this.loadProducts());
    }

    async loadProducts() {
        try {
            const userId = (await supabase.auth.getUser()).data.user.id;
            const products = await SupplierPanel.getProductos(userId);
            
            const tableBody = document.getElementById('productsTableBody');
            tableBody.innerHTML = products.map(product => `
                <tr>
                    <td><img src="${product.imagen_url || 'https://via.placeholder.com/50'}" width="50"></td>
                    <td>${product.nombre}</td>
                    <td>S/${product.precio.toFixed(2)}</td>
                    <td>${product.stock}</td>
                    <td>${product.categoria}</td>
                    <td>
                        <button class="btn btn-sm btn-warning edit-product" data-id="${product.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-product" data-id="${product.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

            // Add event listeners to buttons
            document.querySelectorAll('.edit-product').forEach(btn => {
                btn.addEventListener('click', (e) => this.showEditModal(e.target.dataset.id));
            });

            document.querySelectorAll('.delete-product').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteProduct(e.target.dataset.id));
            });

        } catch (error) {
            console.error('Error loading products:', error);
            alert('Error al cargar productos');
        }
    }

    async addProduct() {
        const form = document.getElementById('addProductForm');
        const formData = new FormData(form);
        
        try {
            const userId = (await supabase.auth.getUser()).data.user.id;
            const imageFile = formData.get('productImage');
            
            // Upload image if exists
            let imageUrl = '';
            if (imageFile && imageFile.name) {
                const fileName = `products/${userId}/${Date.now()}-${imageFile.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(fileName, imageFile);
                
                if (uploadError) throw uploadError;
                
                imageUrl = supabase.storage
                    .from('product-images')
                    .getPublicUrl(uploadData.path).data.publicUrl;
            }

            const productData = {
                proveedor_id: userId,
                nombre: formData.get('productName'),
                descripcion: formData.get('productDescription'),
                precio: parseFloat(formData.get('productPrice')),
                stock: parseInt(formData.get('productStock')),
                categoria: formData.get('productCategory'),
                imagen_url: imageUrl
            };

            await SupplierPanel.agregarProducto(productData);
            form.reset();
            $('#addProductModal').modal('hide');
            await this.loadProducts();
            
            alert('Producto agregado exitosamente! Se han descontado 5 créditos por publicación.');
        } catch (error) {
            console.error('Error adding product:', error);
            alert(`Error: ${error.message}`);
        }
    }

    async loadCreditBalance() {
        try {
            const userId = (await supabase.auth.getUser()).data.user.id;
            const balance = await CreditSystem.getCreditos(userId);
            
            document.getElementById('creditBalance').textContent = balance.toFixed(2);
        } catch (error) {
            console.error('Error loading credit balance:', error);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('supplierDashboard')) {
        new SupplierDashboard();
    }
});