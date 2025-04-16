document.addEventListener('DOMContentLoaded', function() {
    fetch('servicios.json')
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector('.services-container');
            container.innerHTML = ''; // Limpiar contenedor
            
            data.servicios.forEach((servicio, index) => {
                const card = createServiceCard(servicio, index);
                container.appendChild(card);
            });
            
            // Inicializar eventos después de cargar
            initServiceEvents();
        })
        .catch(error => {
            console.error('Error al cargar servicios:', error);
            // Mostrar mensaje de error al usuario
            document.querySelector('.services-container').innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h4>Error al cargar los servicios</h4>
                    <p>Por favor, intenta recargar la página o contacta al soporte técnico.</p>
                    <button class="btn btn-outline-light ripple" onclick="window.location.reload()">
                        <i class="fas fa-sync-alt me-2"></i>Recargar
                    </button>
                </div>
            `;
        });
  });
  
  function createServiceCard(servicio, index) {
    // Determinar el tipo de plan (meses o créditos)
    const planType = servicio.planes[0].hasOwnProperty('creditos') ? 'creditos' : 'meses';
    
    const planRadios = servicio.planes.map((plan, i) => {
        const id = `${servicio.nombre.replace(/\s+/g, '')}${plan[planType]}${planType === 'creditos' ? 'c' : 'm'}${index}`;
        const labelText = planType === 'creditos' 
            ? `${plan.creditos} Crédito${plan.creditos > 1 ? 's' : ''}`
            : `${plan.meses} Mes${plan.meses > 1 ? 'es' : ''}`;
        
        return `
            <input type="radio" class="btn-check" name="${servicio.nombre.replace(/\s+/g, '')}Plan${index}" 
                   id="${id}" autocomplete="off" ${i === 0 ? "checked" : ""} 
                   data-price="${plan.precio}" data-${planType}="${plan[planType]}">
            <label class="btn btn-outline-light ripple" for="${id}">
                ${labelText}
            </label>
        `;
    }).join('');
  
    const caracteristicas = servicio.caracteristicas.map(c => `
        <li><i class="fas fa-check-circle"></i> ${c}</li>
    `).join('');
  
    const precioDefault = servicio.planes[0].precio;
    const planValue = servicio.planes[0][planType];
  
    const card = document.createElement('div');
    card.className = "col-md-6 col-lg-4 col-xl-3 service-item";
    card.setAttribute('data-category', servicio.categoria);
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (index % 4) * 100);
    
    card.innerHTML = `
        <div class="service-card h-100">
            <div class="position-relative overflow-hidden">
                <img src="${servicio.imagen}" class="img-fluid w-100" alt="${servicio.nombre}" loading="lazy">
                <span class="category-badge">${servicio.categoria}</span>
                <div class="service-overlay"></div>
            </div>
            <div class="card-body p-3">
                <h5 class="card-title">${servicio.nombre}</h5>
                <p class="card-text">${servicio.descripcion}</p>
                
                ${servicio.planes.length > 1 ? `
                <div class="plan-selector mb-3">
                    <div class="btn-group btn-group-sm w-100" role="group">
                        ${planRadios}
                    </div>
                </div>` : ''}
                
                <div class="price-tag" data-price-original="S/${precioDefault.toFixed(2)}" data-price-currency="PEN">
                    S/${precioDefault.toFixed(2)}
                </div>
                <ul class="service-features">${caracteristicas}</ul>
                <div class="service-actions">
                    <button class="btn btn-gradient btn-sm ripple add-to-cart" 
                        data-product='${JSON.stringify({ 
                            name: servicio.nombre, 
                            price: precioDefault, 
                            category: servicio.categoria, 
                            image: servicio.imagen,
                            [planType]: planValue
                        })}'>
                        <i class="fas fa-cart-plus me-1"></i>Contratar
                    </button>
                    <button class="btn btn-outline-light btn-sm ripple view-details" 
                        data-bs-toggle="modal" 
                        data-bs-target="#productModal"
                        data-product="${servicio.nombre}"
                        data-image="${servicio.imagen}"
                        data-description="${servicio.descripcion}"
                        data-features='${JSON.stringify(servicio.caracteristicas)}'
                        data-plans='${JSON.stringify(servicio.planes)}'
                        data-plan-type="${planType}">
                        <i class="fas fa-info-circle me-1"></i>Detalles
                    </button>
                </div>
            </div>
        </div>
    `;
  
    return card;
  }
  
  function initServiceEvents() {
    // Eventos para selectores de planes
    document.querySelectorAll('.plan-selector input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const price = parseFloat(this.getAttribute('data-price'));
            const parentCard = this.closest('.service-card');
            
            // Determinar si es por meses o créditos
            const planType = this.hasAttribute('data-meses') ? 'meses' : 'creditos';
            const planValue = this.getAttribute(`data-${planType}`);
            
            // Actualizar precio mostrado
            const priceTag = parentCard.querySelector('.price-tag');
            priceTag.textContent = `S/${price.toFixed(2)}`;
            priceTag.setAttribute('data-price-original', `S/${price.toFixed(2)}`);
            
            // Actualizar botón de añadir al carrito
            const addToCartBtn = parentCard.querySelector('.add-to-cart');
            const productData = JSON.parse(addToCartBtn.getAttribute('data-product'));
            productData.price = price;
            productData[planType] = planValue;
            // Eliminar el otro tipo de plan si existe
            if (planType === 'meses') {
                delete productData.creditos;
            } else {
                delete productData.meses;
            }
            addToCartBtn.setAttribute('data-product', JSON.stringify(productData));
        });
    });
    
    // Eventos para botones de detalles
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            setupProductModal(
                this.getAttribute('data-product'),
                this.getAttribute('data-image'),
                this.getAttribute('data-description'),
                JSON.parse(this.getAttribute('data-features')),
                JSON.parse(this.getAttribute('data-plans')),
                this.getAttribute('data-plan-type')
            );
        });
    });
    
    // Refrescar AOS para animaciones
    AOS.refresh();
  }
  
  function setupProductModal(name, image, description, features, plans, planType) {
    // Configurar el modal con los datos del producto
    document.getElementById('productTitle').textContent = name;
    document.getElementById('productMainImage').src = image;
    document.getElementById('productDescription').textContent = description;
    
    // Actualizar características
    const featuresList = document.getElementById('productFeatures');
    featuresList.innerHTML = '';
    features.forEach(feature => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-check-circle"></i> ${feature}`;
        featuresList.appendChild(li);
    });
    
    // Actualizar planes en el modal si hay más de uno
    const plansContainer = document.getElementById('productPlans');
    if (plans.length > 1) {
        plansContainer.style.display = 'block';
        plansContainer.innerHTML = '';
        plans.forEach((plan, index) => {
            const planElement = document.createElement('div');
            planElement.className = 'form-check mb-2';
            
            const planValue = planType === 'creditos' ? plan.creditos : plan.meses;
            const planLabel = planType === 'creditos' 
                ? `${plan.creditos} Crédito${plan.creditos > 1 ? 's' : ''}`
                : `${plan.meses} Mes${plan.meses > 1 ? 'es' : ''}`;
            
            planElement.innerHTML = `
                <input class="form-check-input" type="radio" name="productPlan" id="modalPlan${index}" 
                    ${index === 0 ? 'checked' : ''} data-price="${plan.precio}" data-${planType}="${planValue}">
                <label class="form-check-label" for="modalPlan${index}">
                    ${planLabel} - S/${plan.precio.toFixed(2)}
                </label>
            `;
            plansContainer.appendChild(planElement);
        });
        
        // Eventos para cambios de plan en el modal
        document.querySelectorAll('#productPlans .form-check-input').forEach(radio => {
            radio.addEventListener('change', function() {
                const price = this.getAttribute('data-price');
                document.getElementById('productPrice').textContent = `S/${parseFloat(price).toFixed(2)}`;
                
                // Determinar si es por meses o créditos
                const planType = this.hasAttribute('data-meses') ? 'meses' : 'creditos';
                const planValue = this.getAttribute(`data-${planType}`);
                
                // Actualizar los datos del botón de añadir al carrito
                const addToCartModalBtn = document.getElementById('addToCartBtn');
                const productData = JSON.parse(addToCartModalBtn.getAttribute('data-product'));
                productData.price = parseFloat(price);
                productData[planType] = planValue;
                // Eliminar el otro tipo de plan si existe
                if (planType === 'meses') {
                    delete productData.creditos;
                } else {
                    delete productData.meses;
                }
                addToCartModalBtn.setAttribute('data-product', JSON.stringify(productData));
            });
        });
    } else {
        plansContainer.style.display = 'none';
    }
    
    // Configurar el botón de añadir al carrito en el modal
    const firstPlan = plans[0];
    const addToCartModalBtn = document.getElementById('addToCartBtn');
    addToCartModalBtn.setAttribute('data-product', JSON.stringify({
        name: name,
        price: firstPlan.precio,
        [planType]: firstPlan[planType],
        image: image
    }));
  }