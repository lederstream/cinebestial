// Configura Supabase
const supabaseUrl = 'TU_SUPABASE_URL';
const supabaseKey = 'TU_SUPABASE_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Elementos del DOM
const authButtons = document.getElementById('auth-buttons');
let currentUser = null;
let userProfile = null;

// Verificar sesión al cargar
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
});

async function checkAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (user) {
        currentUser = user;
        // Obtener perfil adicional
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();
        
        if (!profileError) userProfile = profile;
        updateAuthUI();
    }
}

// Actualizar UI de autenticación
function updateAuthUI() {
    if (currentUser) {
        const userType = userProfile?.tipo === 'proveedor' ? ' (Proveedor)' : '';
        authButtons.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user-circle me-1"></i> ${currentUser.email}${userType}
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="/perfil">Mi Perfil</a></li>
                    ${userProfile?.tipo === 'proveedor' ? 
                      '<li><a class="dropdown-item" href="/proveedor">Panel Proveedor</a></li>' : ''}
                    <li><hr class="dropdown-divider"></li>
                    <li><button class="dropdown-item" onclick="logout()">Cerrar Sesión</button></li>
                </ul>
            </div>
        `;
    } else {
        authButtons.innerHTML = `
            <button class="btn btn-outline-light me-2" data-bs-toggle="modal" data-bs-target="#loginModal">
                <i class="fas fa-sign-in-alt me-1"></i> Iniciar Sesión
            </button>
            <div class="btn-group">
                <button type="button" class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
                    <i class="fas fa-user-plus me-1"></i> Registrarse
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#registerClientModal">Como Cliente</a></li>
                    <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#registerSupplierModal">Como Proveedor</a></li>
                </ul>
            </div>
        `;
    }
}

// Modales de autenticación (agrega esto al HTML)
function showLoginModal() {
    // Implementación con Bootstrap
}

// Cerrar sesión
async function logout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        currentUser = null;
        userProfile = null;
        updateAuthUI();
        window.location.href = '/';
    }
}

// Registrar usuario
async function registerUser(email, password, tipo, nombre) {
    // 1. Registrar en Auth
    const { data: { user }, error: authError } = await supabase.auth.signUp({
        email,
        password
    });
    
    if (authError) throw authError;
    
    // 2. Guardar perfil adicional
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([{
            user_id: user.id,
            email,
            nombre,
            tipo,
            creditos: tipo === 'cliente' ? 0 : null
        }]);
    
    if (profileError) throw profileError;
    
    return { user, profile };
}