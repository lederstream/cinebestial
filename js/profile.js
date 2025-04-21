class UserProfile {
    constructor() {
        this.initEventListeners();
        this.loadUserData();
        this.loadCreditHistory();
    }

    async initEventListeners() {
        document.getElementById('rechargeForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.rechargeCredits();
        });

        document.getElementById('updateProfileForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.updateProfile();
        });
    }

    async loadUserData() {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;
            
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();
            
            if (profileError) throw profileError;

            document.getElementById('profileName').textContent = profile.nombre;
            document.getElementById('profileEmail').textContent = user.email;
            document.getElementById('profileType').textContent = profile.tipo === 'proveedor' ? 'Proveedor' : 'Cliente';
            document.getElementById('creditBalance').textContent = profile.creditos?.toFixed(2) || '0.00';

            // Fill form fields
            document.getElementById('inputName').value = profile.nombre;
            document.getElementById('inputEmail').value = user.email;
            
            // Show/hide sections based on user type
            if (profile.tipo === 'proveedor') {
                document.getElementById('supplierSection').classList.remove('d-none');
            } else {
                document.getElementById('clientSection').classList.remove('d-none');
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    async loadCreditHistory() {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;
            
            const { data: history, error } = await CreditSystem.getMovimientos(user.id);
            if (error) throw error;
            
            const historyTable = document.getElementById('creditHistory');
            historyTable.innerHTML = history.map(record => `
                <tr>
                    <td>${new Date(record.created_at).toLocaleString()}</td>
                    <td class="${record.tipo === 'recarga' ? 'text-success' : 'text-danger'}">
                        ${record.tipo === 'recarga' ? '+' : '-'}${record.cantidad}
                    </td>
                    <td>${record.motivo}</td>
                </tr>
            `).join('') || '<tr><td colspan="3" class="text-center">No hay movimientos</td></tr>';
        } catch (error) {
            console.error('Error loading credit history:', error);
        }
    }

    async rechargeCredits() {
        const amount = parseFloat(document.getElementById('rechargeAmount').value);
        
        if (!amount || amount <= 0) {
            alert('Ingresa un monto válido');
            return;
        }
        
        try {
            const userId = (await supabase.auth.getUser()).data.user.id;
            
            await CreditSystem.addCreditos(
                userId, 
                amount, 
                'Recarga manual desde perfil'
            );
            
            alert(`¡Recarga exitosa de S/${amount.toFixed(2)}!`);
            document.getElementById('rechargeForm').reset();
            this.loadUserData();
            this.loadCreditHistory();
        } catch (error) {
            console.error('Error recharging credits:', error);
            alert('Error al recargar créditos');
        }
    }

    async updateProfile() {
        const newName = document.getElementById('inputName').value.trim();
        const newPassword = document.getElementById('inputPassword').value;
        
        try {
            const updates = {};
            if (newName) updates.nombre = newName;
            
            // Update profile if name changed
            if (newName) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({ nombre: newName })
                    .eq('user_id', (await supabase.auth.getUser()).data.user.id);
                
                if (profileError) throw profileError;
            }
            
            // Update password if provided
            if (newPassword) {
                const { error: authError } = await supabase.auth.updateUser({
                    password: newPassword
                });
                
                if (authError) throw authError;
            }
            
            alert('Perfil actualizado correctamente');
            this.loadUserData();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error al actualizar perfil');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('profilePage')) {
        new UserProfile();
    }
});