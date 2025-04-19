  // 1. Importar cliente de Supabase
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

  // 2. Tus claves de Supabase
  const supabaseUrl = 'https://brzsayjqohyhpssfgqct.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyenNheWpxb2h5aHBzc2ZncWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMTU5MzYsImV4cCI6MjA2MDU5MTkzNn0.4JNO1yeUcuSnJXOMN_bZRlugDQZFbkyqYgWyQYkUFF8';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 3. Función para mostrar productos
  async function cargarProductos() {
    const { data: productos, error } = await supabase.from('productos').select('*');

    if (error) {
      console.error('Error al cargar productos:', error.message);
      return;
    }

    const contenedor = document.querySelector('#services-container');
    contenedor.innerHTML = '';

    productos.forEach((producto) => {
      const beneficiosHTML = producto.beneficios.map(b => `
        <p class="text-xs text-white flex items-center gap-2">
          <i class="fa-solid fa-check-double text-cyan-400"></i> ${b}
        </p>`).join('');

      const cardHTML = `
        <div class="rounded-xl bg-[#111] shadow-md overflow-hidden p-4 mb-4">
          <div class="w-full overflow-hidden rounded-xl mb-2">
            <img src="${producto.imagen}" class="w-full object-cover" alt="${producto.titulo}">
          </div>
          <div class="px-2">
            <h2 class="text-lg text-white font-bold">${producto.titulo}</h2>
            <p class="text-sm text-white mb-2">${producto.descripcion}</p>
            <p class="text-cyan-400 font-bold text-lg mb-2">S/${producto.precio.toFixed(2)}</p>
            ${beneficiosHTML}
          </div>
          <div class="flex justify-end mt-3">
            <a href="${producto.link_compra}" class="bg-fuchsia-600 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold">
              <i class="fa-solid fa-cart-shopping"></i> CONTRATAR
            </a>
          </div>
        </div>
      `;

      contenedor.insertAdjacentHTML('beforeend', cardHTML);
    });
  }

//buscador de productos
  function mostrarProductos(lista) {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = '';
  
    lista.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'producto';
      card.innerHTML = `
        <h2>${prod.nombre}</h2>
        <p>Precio: S/. ${prod.precio}</p>
        <p>Stock: ${prod.stock} unidades</p>
      `;
      contenedor.appendChild(card);
    });
  }
  
  document.getElementById('buscador').addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = productosCargados.filter(p =>
      p.nombre.toLowerCase().includes(texto)
    );
    mostrarProductos(filtrados);
  });
  // 4. Ejecutar al cargar
  cargarProductos();

  
