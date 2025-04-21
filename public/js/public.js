class AdminSystem {
    static async getAllUsers() {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    }

    static async updateUserStatus(userId, isActive) {
        const { error } = await supabase
            .from('profiles')
            .update({ is_active: isActive })
            .eq('user_id', userId);
        
        if (error) throw error;
    }

    static async generateCreditReport() {
        const { data, error } = await supabase
            .from('credito_movimientos')
            .select('*, profiles(nombre)')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    }
}

// Uso en admin.html
document.addEventListener('DOMContentLoaded', async () => {
    if (document.getElementById('adminDashboard')) {
        const users = await AdminSystem.getAllUsers();
        const report = await AdminSystem.generateCreditReport();
        
        console.log("Usuarios:", users);
        console.log("Reporte de créditos:", report);
    }
});