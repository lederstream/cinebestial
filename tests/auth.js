const { registerUser, loginUser } = require('../js/auth');
const supabase = require('../js/supabase');

describe('Sistema de Autenticación', () => {
  let testEmail = `test${Math.random().toString(36).substring(7)}@test.com`;
  
  test('Registro de cliente', async () => {
    const { user, profile } = await registerUser(
      testEmail,
      'password123',
      'cliente',
      'Test User'
    );
    
    expect(user).toBeDefined();
    expect(user.email).toBe(testEmail);
    expect(profile.tipo).toBe('cliente');
  });
  
  test('Login de usuario', async () => {
    const { user, error } = await loginUser(testEmail, 'password123');
    
    expect(error).toBeNull();
    expect(user.email).toBe(testEmail);
  });
  
  test('Registro con email existente debe fallar', async () => {
    await expect(
      registerUser(testEmail, 'password123', 'cliente', 'Test User')
    ).rejects.toThrow();
  });
});

// Ejecutar con: npm test