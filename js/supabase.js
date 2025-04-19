// 👇 Reemplaza con tus datos reales de Supabase
const supabaseUrl = 'https://brzsayjqohyhpssfgqct.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyenNheWpxb2h5aHBzc2ZncWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMTU5MzYsImV4cCI6MjA2MDU5MTkzNn0.4JNO1yeUcuSnJXOMN_bZRlugDQZFbkyqYgWyQYkUFF8';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
    const { data, error } = await supabase
      .from('productos')
      .select('*');
  
    if (error) {
      console.error('❌ Error al conectar con Supabase:', error.message);
    } else {
      console.log('✅ Conexión exitosa. Datos:', data);
    }
  });
  
