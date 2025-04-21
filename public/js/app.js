// Enrutamiento completo
const routes = {
    '/': 'home',
    '/productos': 'products',
    '/carrito': 'cart',
    '/checkout': 'checkout',
    '/perfil': 'profile',
    '/proveedor': 'supplier',
    '/admin': 'admin'
};

async function router() {
    const path = window.location.pathname;
    const route = routes[path] || 'home';
    
    // Verificar autenticación para rutas protegidas
    const protectedRoutes = ['/perfil', '/carrito', '/checkout', '/proveedor'];
    const { data: { user } } = await supabase.auth.getUser();
    
    if (protectedRoutes.includes(path) && !user) {
        window.location.href = '/';
        return;
    }

    // Cargar el módulo correspondiente
    switch(route) {
        case 'home':
            if (!document.getElementById('homePage')) {
                window.location.href = '/productos';
                return;
            }
            // Código para home
            break;
            
        case 'products':
            if (!document.getElementById('productsPage')) {
                window.location.href = '/';
                return;
            }
            new ProductPage();
            break;
            
        case 'cart':
            if (!document.getElementById('cartPage')) {
                window.location.href = '/';
                return;
            }
            new CartCheckout();
            break;
            
        case 'profile':
            if (!document.getElementById('profilePage')) {
                window.location.href = '/';
                return;
            }
            new UserProfile();
            break;
            
        case 'supplier':
            if (!document.getElementById('supplierDashboard')) {
                window.location.href = '/';
                return;
            }
            new SupplierDashboard();
            break;
            
        default:
            document.getElementById('main-content').innerHTML = '<h1>Página no encontrada</h1>';
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth(); // Desde auth.js
    await router();
});

window.addEventListener('popstate', router);