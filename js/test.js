// En tu consola JavaScript o en un archivo de pruebas (test.js)

// 1. Prueba de Registro
async function testRegistro() {
    try {
      const { user, profile } = await registerUser(
        'cliente@test.com',
        'password123',
        'cliente',
        'Cliente Test'
      );
      console.log('Registro exitoso:', user, profile);
    } catch (error) {
      console.error('Error en registro:', error.message);
    }
  }
  
  // 2. Prueba de Login
  async function testLogin() {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email: 'cliente@test.com',
        password: 'password123'
      });
      if (error) throw error;
      console.log('Login exitoso:', user);
    } catch (error) {
      console.error('Error en login:', error.message);
    }
  }
  
  // 3. Prueba de Créditos
  async function testCreditos() {
    try {
      const userId = (await supabase.auth.getUser()).data.user.id;
      
      // Recargar
      await CreditSystem.addCreditos(userId, 100, 'Prueba recarga');
      console.log('Recarga exitosa');
      
      // Ver saldo
      const saldo = await CreditSystem.getCreditos(userId);
      console.log('Saldo actual:', saldo);
      
      // Gastar
      await CreditSystem.deductCreditos(userId, 50, 'Prueba compra');
      console.log('Deducción exitosa');
      
      // Ver movimientos
      const movimientos = await CreditSystem.getMovimientos(userId);
      console.log('Movimientos:', movimientos);
    } catch (error) {
      console.error('Error en créditos:', error.message);
    }
  }
  
  // 4. Prueba Proveedor
  async function testProveedor() {
    try {
      // Registrar proveedor
      const { user, profile } = await registerUser(
        'proveedor@test.com',
        'password123',
        'proveedor',
        'Proveedor Test'
      );
      
      // Agregar producto
      const producto = await SupplierPanel.agregarProducto({
        proveedor_id: user.id,
        nombre: 'Producto Test',
        descripcion: 'Descripción de prueba',
        precio: 29.99,
        stock: 100,
        categoria: 'electronica'
      });
      console.log('Producto agregado:', producto);
    } catch (error) {
      console.error('Error en proveedor:', error.message);
    }
  }
  
  // Ejecutar pruebas
  testRegistro();
  testLogin();
  testCreditos();
  testProveedor();