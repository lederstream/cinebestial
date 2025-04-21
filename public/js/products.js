class ProductPage {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.initEventListeners();
        this.loadProducts();
        this.loadCategories();
    }

    initEventListeners() {
        document.getElementById('searchButton').addEventListener('click', () => {
            this.currentPage = 1;
            this.loadProducts();
        });

        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.currentPage = 1;
                this.loadProducts();
            }
        });

        document.getElementById('categoryFilter').addEventListener('change', () => {
            this.currentPage = 1;
            this.loadProducts();
        });

        document.getElementById('prevPage').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadProducts();
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            this.currentPage++;
            this.loadProducts();
        });
    }

    async loadProducts() {
        try {
            const searchTerm = document.getElementById('searchInput').value;
            const category = document.getElementById('categoryFilter').value;
            
            let query = supabase
                .from('productos')
                .select('*, profiles(nombre)', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage - 1);

            if (searchTerm) {
                query = query.ilike('nombre', `%${searchTerm}%`);
            }

            if (category && category !== 'all') {
                query = query.eq('categoria', category);
            }

            const { data: products, count, error } = await query;

            if (error) throw error;

            this.renderProducts(products);
            this.updatePagination(count);
        } catch (error) {
            console.error('Error loading products:', error);
            alert('Error al cargar productos');
        }
    }

    renderProducts(products) {
        const container = document.getElementById('productsContainer');
        
        if (products.length === 0) {
            container.innerHTML = '<div class="col-12 text-center py-5"><h4>No se encontraron productos</h4></div>';
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${product.imagen_url || 'https://via.placeholder.com/300'}" class="card-img-top product-image" alt="${product.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${product.nombre}</h5>
                        <p class="card-text text-muted">${product.descripcion || 'Sin descripción'}</p>
                        <p class="text-primary">Proveedor: ${product.profiles.nombre}</p>
                    </div>
                    <div class="card-footer bg-white">
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="h5 mb-0">S/${product.precio.toFixed(2)}</span>
                            <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                                <i class="fas fa-cart-plus"></i> Agregar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => this.addToCart(e.target.dataset.id));
        });
    }

    async loadCategories() {
        try {
            const { data: categories, error } = await supabase
                .from('productos')
                .select('categoria')
                .not('categoria', 'is', null);
            
            if (error) throw error;

            const uniqueCategories = [...new Set(categories.map(c => c.categoria))];
            const categorySelect = document.getElementById('categoryFilter');
            
            uniqueCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        document.getElementById('pageInfo').textContent = `Página ${this.currentPage} de ${totalPages}`;
        
        document.getElementById('prevPage').disabled = this.currentPage <= 1;
        document.getElementById('nextPage').disabled = this.currentPage >= totalPages;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('productsPage')) {
        new ProductPage();
    }
});