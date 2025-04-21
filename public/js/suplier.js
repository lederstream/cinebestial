class SupplierPanel {
    static async getProductos(proveedorId) {
        const { data, error } = await supabase
            .from('productos')
            .select('*')
            .eq('proveedor_id', proveedorId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    }

    static async agregarProducto(producto) {
        // Validar que el proveedor tenga créditos suficientes para publicar
        const costoPublicacion = 5; // Créditos por producto
        
        const { error: creditError } = await supabase.rpc('deduct_creditos', {
            user_id: producto.proveedor_id,
            cantidad: costoPublicacion,
            motivo: `Publicación producto: ${producto.nombre}`
        });
        
        if (creditError) throw creditError;
        
        // Crear el producto
        const { data, error } = await supabase
            .from('productos')
            .insert([producto])
            .select();
        
        if (error) throw error;
        return data[0];
    }

    static async actualizarProducto(id, updates) {
        const { data, error } = await supabase
            .from('productos')
            .update(updates)
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data[0];
    }

    static async eliminarProducto(id) {
        const { error } = await supabase
            .from('productos')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    }
}