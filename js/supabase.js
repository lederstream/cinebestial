// 1. Importar cliente de Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 2. Tus claves de Supabase
const supabaseUrl = 'https://brzsayjqohyhpssfgqct.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyenNheWpxb2h5aHBzc2ZncWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMTU5MzYsImV4cCI6MjA2MDU5MTkzNn0.4JNO1yeUcuSnJXOMN_bZRlugDQZFbkyqYgWyQYkUFF8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Variable para almacenar productos cargados
let productosCargados = [];

// 3. Función para mostrar productos
async function cargarProductos() {
  try {
    const { data: productos, error } = await supabase.from('productos').select('*');

    if (error) {
      console.error('Error al cargar productos:', error.message);
      return;
    }

    productosCargados = productos; // Almacenar para búsqueda

    const contenedor = document.querySelector('#services-container');
    
    if (!contenedor) {
      console.warn('El contenedor #services-container no fue encontrado en el DOM');
      return;
    }

    contenedor.innerHTML = '';

    productos.forEach((producto, index) => {
      const beneficios = Array.isArray(producto.beneficios) ? producto.beneficios : [];
      
      const beneficiosHTML = beneficios.map(b => `
        <p class="text-xs text-white flex items-center gap-2">
          <i class="fa-solid fa-check-double text-cyan-400"></i> ${b}
        </p>`).join('');

      const cardHTML = `
        <div class="rounded-xl bg-[#111] shadow-md overflow-hidden p-4 mb-4" id="producto-${index}">
          <div class="w-full overflow-hidden rounded-xl mb-2">
            <img src="${producto.imagen || ''}" class="w-full object-cover" alt="${producto.titulo || 'Producto'}">
          </div>
          <div class="px-2">
            <h2 class="text-lg text-white font-bold">${producto.titulo || 'Sin título'}</h2>
            <p class="text-sm text-white mb-2">${producto.descripcion || ''}</p>
            <p class="text-cyan-400 font-bold text-lg mb-2">S/${producto.precio ? producto.precio.toFixed(2) : '0.00'}</p>
            ${beneficiosHTML}
          </div>
          <div class="flex justify-end mt-3">
            <a href="${producto.link_compra || '#'}" class="bg-fuchsia-600 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold">
              <i class="fa-solid fa-cart-shopping"></i> CONTRATAR
            </a>
          </div>
        </div>
      `;

      contenedor.insertAdjacentHTML('beforeend', cardHTML);
    });
  } catch (err) {
    console.error('Error inesperado al cargar productos:', err);
  }
}

// Buscador de productos
function mostrarProductos(lista) {
  const contenedor = document.getElementById('services-container');
  
  if (!contenedor) {
    console.warn('El contenedor #services-container no fue encontrado en el DOM');
    return;
  }

  contenedor.innerHTML = '';

  lista.forEach((prod, index) => {
    const card = document.createElement('div');
    card.className = 'producto';
    card.id = `producto-busqueda-${index}`;
    card.innerHTML = `
      <h2>${prod.nombre || 'Sin nombre'}</h2>
      <p>Precio: S/. ${prod.precio || '0.00'}</p>
      <p>Stock: ${prod.stock || '0'} unidades</p>
    `;
    contenedor.appendChild(card);
  });
}

// Configurar buscador
const buscador = document.getElementById('buscador-productos');
if (buscador) {
  buscador.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = productosCargados.filter(p =>
      p.nombre && p.nombre.toLowerCase().includes(texto)
    );
    mostrarProductos(filtrados);
  });
}

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#services-container')) {
    cargarProductos();
  }
});

// Generador simple de UUID
const generateUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});

// Registrar nuevo proveedor
const registerForm = document.getElementById('form-registro-proveedor');
if (registerForm) {
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('registro-nombre')?.value.trim() || '';
    const email = document.getElementById('registro-email')?.value.trim() || '';
    const password = document.getElementById('registro-password')?.value || '';
    const confirmPassword = document.getElementById('registro-confirmar-password')?.value || '';

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    let users = JSON.parse(localStorage.getItem('usuarios')) || [];

    if (users.some(u => u.email === email)) {
      alert("Este correo ya está registrado");
      return;
    }

    const nuevoUsuario = {
      id: generateUUID(),
      nombre: name,
      email: email,
      password: password,
      productos: []
    };

    users.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(users));

    alert("¡Registro exitoso! Ahora puedes iniciar sesión");
    registerForm.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('modal-registro'));
    if (modal) modal.hide();
  });
}

// Iniciar sesión
const loginForm = document.getElementById('form-login');
if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('login-email')?.value.trim() || '';
    const password = document.getElementById('login-password')?.value || '';

    let users = JSON.parse(localStorage.getItem('usuarios')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert("Correo o contraseña incorrectos");
      return;
    }

    sessionStorage.setItem('usuarioActivo', JSON.stringify(user));
    alert("¡Inicio de sesión exitoso!");

    loginForm.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('modal-login'));
    if (modal) modal.hide();

    mostrarPanelProveedor(user.nombre);
  });
}

// Mostrar panel del proveedor logeado
function mostrarPanelProveedor(nombre) {
  const contenedor = document.getElementById('panel-proveedor');
  if (contenedor) {
    contenedor.innerHTML = `<h3 class="text-white">Bienvenido, ${nombre}</h3>
    <p class="text-white">Aquí puedes subir tus productos.</p>`;
  }
}

// Verificar sesión activa
window.addEventListener('DOMContentLoaded', () => {
  try {
    const usuarioActivo = JSON.parse(sessionStorage.getItem('usuarioActivo'));
    if (usuarioActivo) {
      mostrarPanelProveedor(usuarioActivo.nombre);
    }
  } catch (err) {
    console.error('Error al verificar sesión activa:', err);
  }
});
