document.addEventListener('DOMContentLoaded', function() {
    // 1. Inicialización de componentes
    initAOS();
    initCurrencyConverter(); // Mejorado
    initScrollEffects();
    initCategoryFilters();
    initRippleEffects();
    initTypingEffect();
    initCountAnimations();
    initPreloader();
    initProductModals();
    initForms();
    initLoadMoreButton();
});

function initAOS() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
}
    
    // Cambiar clase del navbar al hacer scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Filtro de categorías
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            const services = document.querySelectorAll('.service-item');
            
            services.forEach(service => {
                if (category === 'all' || service.getAttribute('data-category') === category) {
                    service.style.display = 'block';
                    service.setAttribute('data-aos', 'fade-up');
                } else {
                    service.style.display = 'none';
                }
            });
            
            // Refrescar AOS para las animaciones
            AOS.refresh();
        });
    });
    
    // Efecto ripple para botones
    document.querySelectorAll('.ripple').forEach(button => {
        button.addEventListener('click', function(e) {
            // Solo si el elemento clickeado no es un input
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.classList.add('ripple-effect');
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
        });
    });
    
    // Cambiar clase active del navbar al hacer scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Efecto de escritura en el hero
    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        const words = ['en un solo lugar', 'para toda la familia', 'sin límites', 'en HD/4K'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isEnd = false;
        
        function type() {
            const currentWord = words[wordIndex];
            const currentChar = currentWord.substring(0, charIndex);
            typingElement.textContent = currentChar;
            
            if (!isDeleting && charIndex < currentWord.length) {
                // Escribiendo
                charIndex++;
                setTimeout(type, 100);
            } else if (isDeleting && charIndex > 0) {
                // Borrando
                charIndex--;
                setTimeout(type, 50);
            } else {
                // Cambiar palabra
                isDeleting = !isDeleting;
                if (!isDeleting) {
                    wordIndex = (wordIndex + 1) % words.length;
                }
                setTimeout(type, 1000);
            }
        }
        
        // Iniciar el efecto de escritura
        setTimeout(type, 1000);
    }
    
    // Animación de conteo para las estadísticas
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    function animateCountUp() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const suffix = stat.textContent.includes('%') ? '%' : '';
            const duration = 2000;
            const startTime = performance.now();
            
            function updateCount(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const currentCount = Math.floor(progress * target);
                
                stat.textContent = currentCount + (suffix ? suffix : '');
                
                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                }
            }
            
            requestAnimationFrame(updateCount);
        });
    }
    
    // Activar la animación cuando la sección es visible
    const statsSection = document.querySelector('.stats-section');
    
    function checkStatsVisibility() {
        const rect = statsSection.getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight * 0.75) && 
                         (rect.bottom >= window.innerHeight * 0.25);
        
        if (isVisible) {
            animateCountUp();
            window.removeEventListener('scroll', checkStatsVisibility);
        }
    }
    
    if (statsSection) {
        window.addEventListener('scroll', checkStatsVisibility);
        // Verificar al cargar la página por si ya está visible
        checkStatsVisibility();
    }
    
    // Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                setTimeout(function() {
                    preloader.remove();
                }, 500);
            }, 1000);
        });
    }
    
    // Modal de producto
    const productModal = document.getElementById('productModal');
    if (productModal) {
        productModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const serviceCard = button.closest('.service-card');
            const productTitle = button.getAttribute('data-product');
            
            // Configurar el modal con los datos del producto
            document.getElementById('productTitle').textContent = productTitle;
            
            // Obtener la imagen principal
            const mainImage = serviceCard.querySelector('img').src;
            document.getElementById('productMainImage').src = mainImage;
            
            // Configurar la primera miniatura con la imagen principal
            const thumbnails = document.querySelectorAll('.product-thumbnail');
            thumbnails[0].querySelector('img').src = mainImage;
            
            // Obtener el precio
            const price = serviceCard.querySelector('.price-tag').textContent;
            document.getElementById('productPrice').textContent = price;
            
            // Obtener la descripción
            const description = serviceCard.querySelector('.card-text').textContent;
            document.getElementById('productDescription').textContent = description;
            
            // Clonar características
            const featuresList = document.getElementById('productFeatures');
            featuresList.innerHTML = '';
            const originalFeatures = serviceCard.querySelectorAll('.service-features li');
            originalFeatures.forEach(feature => {
                const li = document.createElement('li');
                li.innerHTML = feature.innerHTML;
                featuresList.appendChild(li);
            });
            
            // Configurar botón de añadir al carrito
            const addToCartBtn = document.getElementById('addToCartBtn');
            const originalAddToCart = serviceCard.querySelector('.add-to-cart');
            if (originalAddToCart) {
                addToCartBtn.setAttribute('data-product', originalAddToCart.getAttribute('data-product'));
            }
        });
    }
    
    // Cambiar imagen de producto al hacer clic en miniatura
    document.querySelectorAll('.product-thumbnail').forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const thumbnails = this.parentElement.querySelectorAll('.product-thumbnail');
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const mainImage = this.closest('.product-gallery').querySelector('#productMainImage');
            mainImage.src = this.querySelector('img').src;
        });
    });
    
    // Formulario de contacto
    document.getElementById('contactForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Mostrar notificación de éxito
        const toast = document.createElement('div');
        toast.className = 'position-fixed bottom-0 end-0 p-3';
        toast.style.zIndex = '11';
        toast.innerHTML = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-success text-white">
                    <strong class="me-auto">¡Mensaje enviado!</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body bg-dark">
                    Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.
                </div>
            </div>
        `;
        document.body.appendChild(toast);
        
        // Eliminar la notificación después de 5 segundos
        setTimeout(() => {
            toast.remove();
        }, 5000);
        
        // Resetear el formulario
        this.reset();
    });
    
    // Formulario de registro
    document.getElementById('registerForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        if (!document.getElementById('acceptTerms').checked) {
            alert('Debes aceptar los términos y condiciones');
            return;
        }
        
        // Mostrar notificación de éxito
        const toast = document.createElement('div');
        toast.className = 'position-fixed bottom-0 end-0 p-3';
        toast.style.zIndex = '11';
        toast.innerHTML = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-success text-white">
                    <strong class="me-auto">¡Registro exitoso!</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body bg-dark">
                    Ahora puedes iniciar sesión con tus credenciales.
                </div>
            </div>
        `;
        document.body.appendChild(toast);
        
        // Eliminar la notificación después de 5 segundos
        setTimeout(() => {
            toast.remove();
        }, 5000);
        
        const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        registerModal.hide();
        this.reset();
    });
    
    // Formulario de login
    document.getElementById('loginForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Validación simple
        if (!email || !password) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        // Mostrar notificación de éxito
        const toast = document.createElement('div');
        toast.className = 'position-fixed bottom-0 end-0 p-3';
        toast.style.zIndex = '11';
        toast.innerHTML = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-success text-white">
                    <strong class="me-auto">¡Bienvenido!</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body bg-dark">
                    Has iniciado sesión correctamente.
                </div>
            </div>
        `;
        document.body.appendChild(toast);
        
        // Eliminar la notificación después de 5 segundos
        setTimeout(() => {
            toast.remove();
        }, 5000);
        
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();
        this.reset();
    });
    
    // Botón "Cargar más servicios"
    document.querySelector('.load-more-btn')?.addEventListener('click', function() {
        // Simular carga de más servicios
        this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Cargando...';
        this.disabled = true;
        
        setTimeout(() => {
            // Aquí iría la lógica para cargar más servicios
            this.innerHTML = '<i class="fas fa-check me-2"></i>Servicios cargados';
            
            // Mostrar notificación
            const toast = document.createElement('div');
            toast.className = 'position-fixed bottom-0 end-0 p-3';
            toast.style.zIndex = '11';
            toast.innerHTML = `
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-success text-white">
                        <strong class="me-auto">¡Servicios cargados!</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body bg-dark">
                        Se han cargado más servicios para ti.
                    </div>
                </div>
            `;
            document.body.appendChild(toast);
            
            // Eliminar la notificación después de 5 segundos
            setTimeout(() => {
                toast.remove();
                this.innerHTML = '<i class="fas fa-sync-alt me-2"></i>Cargar más servicios';
                this.disabled = false;
            }, 5000);
        }, 2000);
    });



    function initCurrencyConverter() {
        const exchangeRate = 3.70; // Tasa de cambio PEN a USD
        let currentCurrency = 'PEN'; // Moneda por defecto (soles)
        
        // Crear el botón toggle en el navbar
        const currencyToggle = document.createElement('div');
        currencyToggle.className = 'currency-toggle-container';
        currencyToggle.innerHTML = `
            <button class="currency-toggle-btn" title="Cambiar entre Soles y Dólares">
                <span class="currency-icon">S/</span>
                <span class="toggle-label">Mostrar en $</span>
            </button>
        `;
        
        // Insertar en el navbar
        const navbar = document.querySelector('.navbar .navbar-collapse');
        if (navbar) {
            navbar.appendChild(currencyToggle);
            
            // Event listener para el botón
            const toggleBtn = currencyToggle.querySelector('.currency-toggle-btn');
            toggleBtn.addEventListener('click', function() {
                const newCurrency = currentCurrency === 'PEN' ? 'USD' : 'PEN';
                convertAllPrices(newCurrency);
                updateToggleButton(newCurrency);
                showCurrencyNotification(newCurrency);
                currentCurrency = newCurrency; // Actualizar el estado actual
            });
        }
        
        // Función para convertir todos los precios
        function convertAllPrices(targetCurrency) {
            const priceElements = document.querySelectorAll('[data-price-original], .price-tag, .product-price, .price');
            
            // Si no hay elementos con data-price-original, inicializamos
            if (priceElements.length === 0) {
                initializeOriginalPrices();
            }
            
            priceElements.forEach(element => {
                // Obtener el precio original guardado
                const originalPrice = element.getAttribute('data-price-original');
                const originalCurrency = element.getAttribute('data-price-currency') || 'PEN';
                
                // Extraer el valor numérico
                const numericValue = parseFloat(originalPrice.replace(/[^\d.]/g, ''));
                
                if (!isNaN(numericValue)) {
                    let convertedValue, symbol;
                    
                    if (targetCurrency === 'USD') {
                        convertedValue = originalCurrency === 'PEN' ? numericValue / exchangeRate : numericValue;
                        symbol = '$';
                    } else { // targetCurrency === 'PEN'
                        convertedValue = originalCurrency === 'USD' ? numericValue * exchangeRate : numericValue;
                        symbol = 'S/';
                    }
                    
                    // Formatear el número (2 decimales)
                    const formattedValue = convertedValue.toFixed(2);
                    
                    // Actualizar el elemento
                    element.textContent = `${symbol}${formattedValue}`;
                }
            });
        }
        
        // Inicializar los precios originales
        function initializeOriginalPrices() {
            const elements = document.querySelectorAll('.price-tag, .product-price, .price');
            elements.forEach(element => {
                const priceText = element.textContent.trim();
                if (priceText.includes('S/') || priceText.includes('$')) {
                    element.setAttribute('data-price-original', priceText);
                    element.setAttribute('data-price-currency', priceText.includes('S/') ? 'PEN' : 'USD');
                }
            });
        }
        
        // Actualizar el texto del botón toggle
        function updateToggleButton(currency) {
            const toggleBtn = document.querySelector('.currency-toggle-btn');
            if (!toggleBtn) return;
            
            const icon = toggleBtn.querySelector('.currency-icon');
            const label = toggleBtn.querySelector('.toggle-label');
            
            if (currency === 'PEN') {
                icon.textContent = 'S/';
                label.textContent = 'Mostrar en $';
                toggleBtn.classList.remove('usd-active');
            } else {
                icon.textContent = '$';
                label.textContent = 'Mostrar en S/';
                toggleBtn.classList.add('usd-active');
            }
        }
            
        
        // Mostrar notificación de cambio de moneda
        function showCurrencyNotification(currency) {
            // Eliminar notificación existente si hay una
            const existingNotification = document.querySelector('.currency-notification');
            if (existingNotification) {
                existingNotification.remove();
            }
            
            const notification = document.createElement('div');
            notification.className = 'currency-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <span class="currency-symbol">${currency === 'PEN' ? 'S/' : '$'}</span>
                    <span class="notification-text">Mostrando precios en ${currency === 'PEN' ? 'Soles' : 'Dólares'}</span>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Animación de entrada
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            // Eliminar después de 3 segundos
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }
        
        // Inicializar los precios al cargar la página
        initializeOriginalPrices();
    }