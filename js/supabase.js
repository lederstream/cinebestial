const supabase = supabase.createClient(
    'https://brzsayjqohyhpssfgqct.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyenNheWpxb2h5aHBzc2ZncWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMTU5MzYsImV4cCI6MjA2MDU5MTkzNn0.4JNO1yeUcuSnJXOMN_bZRlugDQZFbkyqYgWyQYkUFF8'
  );
  
  async function obtenerProductos() {
    const { data, error } = await supabase
      .from('productos')
      .select('*');
  
    if (error) {
      console.error('❌ Error al obtener productos:', error);
    } else {
      console.log('✅ Productos desde Supabase:', data);
    }
  }
  
  obtenerProductos();
  