class ReviewSystem {
    static async addReview(productId, userId, rating, comment) {
        const { data, error } = await supabase
            .from('reviews')
            .insert([{
                product_id: productId,
                user_id: userId,
                rating,
                comment
            }]);
        
        if (error) throw error;
        return data;
    }

    static async getProductReviews(productId) {
        const { data, error } = await supabase
            .from('reviews')
            .select('*, profiles(nombre)')
            .eq('product_id', productId);
        
        if (error) throw error;
        return data;
    }
}

// Ejemplo de uso en product-details.html
document.getElementById('reviewForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await ReviewSystem.addReview(
        productId, 
        currentUser.id, 
        document.getElementById('rating').value,
        document.getElementById('comment').value
    );
    alert('¡Reseña enviada!');
});