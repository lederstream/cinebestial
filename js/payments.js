class PaymentGateway {
    static async createPaymentIntent(amount) {
        const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });
        return await response.json();
    }

    static async handleStripeCheckout(amount) {
        const { clientSecret } = await this.createPaymentIntent(amount);
        
        const stripe = Stripe('TU_STRIPE_PUBLIC_KEY');
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.origin + '/success' }
        });
        
        if (error) throw error;
    }
}

// Ejemplo en checkout.html
document.getElementById('payButton').addEventListener('click', async () => {
    await PaymentGateway.handleStripeCheckout(cartTotal);
});