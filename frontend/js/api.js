const API_BASE_URL = 'http://localhost:8080/api';
const API_TIMEOUT = 15000;

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
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
        config.signal = controller.signal;
        
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            clearTimeout(timeoutId);
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'login.html';
                throw new Error('Session expired. Please login again.');
            }
            
            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'An error occurred' }));
                throw new Error(error.message || 'Request failed');
            }
            
            if (response.status === 204) {
                return null;
            }
            
            return response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout. Please try again.');
            }
            throw error;
        }
    },
    
    async get(endpoint) {
        return this.request(endpoint, 'GET', null, true);
    },
    
    async post(endpoint, data) {
        return this.request(endpoint, 'POST', data, true);
    },
    
    async put(endpoint, data) {
        return this.request(endpoint, 'PUT', data, true);
    },
    
    async delete(endpoint) {
        return this.request(endpoint, 'DELETE', null, true);
    }
};

async function fetchAPI(endpoint, method = 'GET', data = null) {
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
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    config.signal = controller.signal;
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        clearTimeout(timeoutId);
        
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
            throw new Error('Session expired. Please login again.');
        }
        
        if (!response.ok) {
            const err = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(err.message || 'Request failed');
        }
        
        if (response.status === 204) {
            return null;
        }
        
        return response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout. Please try again.');
        }
        throw error;
    }
}

function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.classList.remove('hidden');
    }
    clearTimeout(loadingTimeout);
    loadingTimeout = setTimeout(() => {
        hideLoading();
    }, 15000);
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            overlay.classList.add('hidden');
            overlay.style.display = 'none';
            overlay.style.opacity = '1';
        }, 300);
    }
    clearTimeout(loadingTimeout);
}

let loadingTimeout;

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    if (type === 'info') icon = 'info-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.style.animation = 'slideIn 0.3s ease forwards';
    });
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
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
