// Configura suscripción a cambios en Supabase
function setupRealtime() {
    const channel = supabase
        .channel('schema-db-changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public' },
            (payload) => handleRealtimeUpdate(payload)
        )
        .subscribe();

    return () => supabase.removeChannel(channel);
}

function handleRealtimeUpdate(payload) {
    switch(payload.table) {
        case 'credito_movimientos':
            if (payload.new.user_id === currentUser.id) {
                showNotification(`Créditos ${payload.new.tipo === 'recarga' ? 'agregados' : 'deducidos'}: S/${payload.new.cantidad}`);
            }
            break;
        case 'productos':
            if (payload.new.proveedor_id === currentUser.id) {
                showNotification(`Producto ${payload.eventType === 'INSERT' ? 'agregado' : 'actualizado'}: ${payload.new.nombre}`);
            }
            break;
    }
}

function showNotification(message) {
    const toast = document.createElement('div');
    toast.className = 'toast show position-fixed bottom-0 end-0 m-3';
    toast.innerHTML = `
        <div class="toast-body bg-success text-white">
            ${message}
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}