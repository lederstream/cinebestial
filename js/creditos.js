class CreditSystem {
    static async getCreditos(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('creditos')
            .eq('user_id', userId)
            .single();
        
        if (error) throw error;
        return data?.creditos || 0;
    }

    static async addCreditos(userId, cantidad, motivo) {
        // Transacción para actualizar créditos y registrar movimiento
        const { data, error } = await supabase.rpc('add_creditos', {
            user_id: userId,
            cantidad,
            motivo
        });
        
        if (error) throw error;
        return data;
    }

    static async deductCreditos(userId, cantidad, motivo) {
        const { data, error } = await supabase.rpc('deduct_creditos', {
            user_id: userId,
            cantidad,
            motivo
        });
        
        if (error) throw error;
        return data;
    }

    static async getMovimientos(userId) {
        const { data, error } = await supabase
            .from('credito_movimientos')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    }
}

// En Supabase, necesitas crear estas funciones en SQL:
/*
CREATE OR REPLACE FUNCTION add_creditos(
    user_id uuid,
    cantidad numeric,
    motivo text
) RETURNS numeric AS $$
DECLARE
    nuevo_saldo numeric;
BEGIN
    UPDATE profiles 
    SET creditos = COALESCE(creditos, 0) + cantidad
    WHERE profiles.user_id = add_creditos.user_id
    RETURNING creditos INTO nuevo_saldo;
    
    INSERT INTO credito_movimientos (user_id, cantidad, motivo, tipo)
    VALUES (add_creditos.user_id, add_creditos.cantidad, add_creditos.motivo, 'recarga');
    
    RETURN nuevo_saldo;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION deduct_creditos(
    user_id uuid,
    cantidad numeric,
    motivo text
) RETURNS numeric AS $$
DECLARE
    nuevo_saldo numeric;
BEGIN
    UPDATE profiles 
    SET creditos = COALESCE(creditos, 0) - cantidad
    WHERE profiles.user_id = deduct_creditos.user_id
    AND COALESCE(creditos, 0) >= deduct_creditos.cantidad
    RETURNING creditos INTO nuevo_saldo;
    
    IF nuevo_saldo IS NULL THEN
        RAISE EXCEPTION 'Saldo insuficiente';
    END IF;
    
    INSERT INTO credito_movimientos (user_id, cantidad, motivo, tipo)
    VALUES (deduct_creditos.user_id, deduct_creditos.cantidad, deduct_creditos.motivo, 'compra');
    
    RETURN nuevo_saldo;
END;
$$ LANGUAGE plpgsql;
*/