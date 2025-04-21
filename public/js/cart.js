class CartSystem {
    static async crearCarrito(userId) {
        const { data, error } = await supabase
            .from('carritos')
            .insert([{ user_id: userId }])
            .select();
        
        if (error) throw error;
        return data[0];
    }

    static async getCarritoActivo(userId) {
        const { data, error } = await supabase
            .from('carritos')
            .select('*, items:carrito_items(*, producto:productos(*))')
            .eq('user_id', userId)
            .eq('estado', 'activo')
            .maybeSingle();
        
        if (error) throw error;
        return data;
    }

    static async agregarItem(carritoId, productoId, cantidad = 1) {
        const { data, error } = await supabase
            .from('carrito_items')
            .upsert(
                { carrito_id: carritoId, producto_id: productoId, cantidad },
                { onConflict: 'carrito_id,producto_id' }
            )
            .select();
        
        if (error) throw error;
        return data[0];
    }

    static async checkout(carritoId) {
        // 1. Obtener total del carrito
        const { data: carrito, error: carritoError } = await supabase
            .rpc('get_carrito_total', { carrito_id: carritoId });
        
        if (carritoError) throw carritoError;
        
        // 2. Verificar créditos
        const saldo = await CreditSystem.getCreditos(carrito.user_id);
        if (saldo < carrito.total) {
            throw new Error('Saldo insuficiente');
        }
        
        // 3. Descontar créditos
        await CreditSystem.deductCreditos(
            carrito.user_id,
            carrito.total,
            `Compra carrito #${carritoId}`
        );
        
        // 4. Marcar carrito como completado
        const { data, error } = await supabase
            .from('carritos')
            .update({ estado: 'completado' })
            .eq('id', carritoId)
            .select();
        
        if (error) throw error;
        
        // 5. Registrar venta
        await this.registrarVenta(carritoId, carrito.user_id, carrito.total);
        
        return data[0];
    }

    static async registrarVenta(carritoId, userId, total) {
        const { error } = await supabase
            .from('ventas')
            .insert([{
                carrito_id: carritoId,
                user_id: userId,
                total,
                estado: 'completada'
            }]);
        
        if (error) throw error;
        return true;
    }
}