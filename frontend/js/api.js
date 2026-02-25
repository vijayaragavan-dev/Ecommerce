const API_BASE_URL = 'http://localhost:8080/api';

const api = {
    async request(endpoint, method = 'GET', data = null, authenticated = true) {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (authenticated) {
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        
        const config = {
            method,
            headers
        };
        
        if (data && method !== 'GET') {
            config.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'An error occurred' }));
            throw new Error(error.message || 'Request failed');
        }
        
        if (response.status === 204) {
            return null;
        }
        
        return response.json();
    },
    
    get(endpoint) {
        return this.request(endpoint, 'GET', null, true);
    },
    
    post(endpoint, data) {
        return this.request(endpoint, 'POST', data, true);
    },
    
    put(endpoint, data) {
        return this.request(endpoint, 'PUT', data, true);
    },
    
    delete(endpoint) {
        return this.request(endpoint, 'DELETE', null, true);
    }
};

function fetchAPI(endpoint, method = 'GET', data = null) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        method,
        headers
    };
    
    if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
    }
    
    return fetch(`${API_BASE_URL}${endpoint}`, config)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Request failed');
                });
            }
            
            if (response.status === 204) {
                return null;
            }
            
            return response.json();
        });
}

function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
    clearTimeout(loadingTimeout);
    loadingTimeout = setTimeout(() => {
        hideLoading();
    }, 10000);
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
    clearTimeout(loadingTimeout);
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createProductCard(product) {
    const discount = product.discountPrice ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;
    const imageUrl = product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image';
    
    return `
        <div class="product-card" onclick="window.location.href='product-detail.html?id=${product.id}'">
            <div class="product-image">
                <img src="${imageUrl}" alt="${product.name}">
                ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                <div class="product-actions">
                    <button class="product-action-btn" onclick="event.stopPropagation(); quickView(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="product-action-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <i class="fas fa-shopping-bag"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category || 'General'}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    ${product.discountPrice ? 
                        `<span class="current-price">$${product.discountPrice.toFixed(2)}</span>
                         <span class="original-price">$${product.price.toFixed(2)}</span>` : 
                        `<span class="current-price">$${product.price.toFixed(2)}</span>`
                    }
                </div>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating || 0)}
                    </div>
                    <span>(${product.reviewCount || 0})</span>
                </div>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}
