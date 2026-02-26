let currentSlide = 0;

// Sample products for when backend is unavailable
const SAMPLE_PRODUCTS = [
    { id: 1, name: 'Premium Wireless Headphones', price: 249.99, discountPrice: 199.99, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', rating: 4.5, reviewCount: 128 },
    { id: 2, name: 'Smart Watch Pro', price: 349.99, discountPrice: 299.99, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', rating: 4.8, reviewCount: 256 },
    { id: 3, name: 'Running Shoes Ultra', price: 149.99, discountPrice: 119.99, category: 'Sportswear', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', rating: 4.6, reviewCount: 89 },
    { id: 4, name: 'Designer Sunglasses', price: 199.99, discountPrice: 149.99, category: 'Accessories', imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300', rating: 4.3, reviewCount: 67 },
    { id: 5, name: 'Leather Laptop Bag', price: 179.99, discountPrice: 149.99, category: 'Accessories', imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300', rating: 4.7, reviewCount: 145 },
    { id: 6, name: 'Wireless Earbuds', price: 169.99, discountPrice: 129.99, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300', rating: 4.4, reviewCount: 198 },
    { id: 7, name: 'Fitness Tracker Band', price: 79.99, discountPrice: 59.99, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300', rating: 4.2, reviewCount: 312 },
    { id: 8, name: 'Denim Jacket Classic', price: 129.99, discountPrice: 99.99, category: 'Clothing', imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300', rating: 4.5, reviewCount: 76 }
];

function initSlider() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    const totalSlides = slides.length;
    
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }, 5000);
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        document.querySelectorAll('.slider-dot')[i]?.classList.remove('active');
    });
    
    slides[index]?.classList.add('active');
    document.querySelectorAll('.slider-dot')[index]?.classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    if (totalSlides === 0) return;
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
}

function prevSlide() {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    if (totalSlides === 0) return;
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(currentSlide);
}

function loadFeaturedProducts() {
    const grid = document.getElementById('featuredProducts');
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading-products"><div class="loader"></div></div>';
    
    fetchAPI('/api/products/featured', 'GET')
        .then(products => {
            if (!products || products.length === 0) {
                grid.innerHTML = SAMPLE_PRODUCTS.slice(0, 4).map(product => createProductCard(product)).join('');
                return;
            }
            
            grid.innerHTML = products.slice(0, 4).map((product, index) => {
                const card = createProductCard(product);
                setTimeout(() => {
                    const cardElement = grid.children[index];
                    if (cardElement) cardElement.classList.add('animate-in');
                }, index * 100);
                return card;
            }).join('');
        })
        .catch(error => {
            console.log('Using sample products (backend unavailable):', error.message);
            grid.innerHTML = SAMPLE_PRODUCTS.slice(0, 4).map(product => createProductCard(product)).join('');
        })
        .finally(() => hideLoading());
}

function loadBestsellers() {
    const grid = document.getElementById('bestsellersGrid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading-products"><div class="loader"></div></div>';
    
    fetchAPI('/api/products?page=0&size=4&sortBy=rating&sortDir=desc', 'GET')
        .then(data => {
            if (!data || !data.content || data.content.length === 0) {
                grid.innerHTML = SAMPLE_PRODUCTS.slice(4, 8).map(product => createProductCard(product)).join('');
                return;
            }
            
            grid.innerHTML = data.content.map((product, index) => {
                const card = createProductCard(product);
                setTimeout(() => {
                    const cardElement = grid.children[index];
                    if (cardElement) cardElement.classList.add('animate-in');
                }, index * 100);
                return card;
            }).join('');
        })
        .catch(error => {
            console.log('Using sample products (backend unavailable):', error.message);
            grid.innerHTML = SAMPLE_PRODUCTS.slice(4, 8).map(product => createProductCard(product)).join('');
        })
        .finally(() => hideLoading());
}

function addToCart(productId, quantity = 1) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        showToast('Please login to add items to cart', 'warning');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }
    
    showLoading();
    
    fetchAPI(`/api/cart/add?productId=${productId}&quantity=${quantity}`, 'POST')
        .then(() => {
            showToast('Product added to cart', 'success');
            loadCartCount();
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
            showToast(error.message || 'Error adding to cart', 'error');
        })
        .finally(() => hideLoading());
}

function loadCartCount() {
    const token = localStorage.getItem('token');
    const badge = document.getElementById('cartBadge');
    
    if (!badge) return;
    
    if (!token) {
        badge.textContent = '0';
        return;
    }
    
    fetchAPI('/api/cart/count', 'GET')
        .then(data => {
            if (data && data.count !== undefined) {
                const newCount = data.count;
                const currentCount = parseInt(badge.textContent) || 0;
                badge.textContent = newCount;
                
                if (newCount > currentCount && currentCount > 0) {
                    badge.classList.add('pulse');
                    setTimeout(() => badge.classList.remove('pulse'), 300);
                }
            }
        })
        .catch(error => {
            console.error('Error loading cart count:', error);
            badge.textContent = '0';
        });
}

function updateCartBadge() {
    loadCartCount();
}

function checkAuth() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    const loginBtnWrapper = document.getElementById('loginBtnWrapper');
    const userWrapper = document.getElementById('userWrapper');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userDropdownName = document.getElementById('userDropdownName');
    const adminLinkItem = document.getElementById('adminLinkItem');
    const userAvatar = document.getElementById('userAvatar');
    const mobileLoginLink = document.getElementById('mobileLoginLink');
    const mobileAccountLink = document.getElementById('mobileAccountLink');
    const mobileAdminLink = document.getElementById('mobileAdminLink');
    const mobileLogoutLink = document.getElementById('mobileLogoutLink');
    
    if (token && userData) {
        try {
            const user = JSON.parse(userData);
            
            if (loginBtnWrapper) loginBtnWrapper.style.display = 'none';
            if (userWrapper) userWrapper.style.display = 'block';
            if (userNameDisplay) userNameDisplay.textContent = `${user.firstName}`;
            if (userDropdownName) userDropdownName.textContent = `${user.firstName} ${user.lastName}`;
            if (userAvatar) userAvatar.textContent = user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';
            
            if (user.role === 'ADMIN') {
                if (adminLinkItem) adminLinkItem.style.display = 'flex';
                if (mobileAdminLink) mobileAdminLink.style.display = 'block';
            } else {
                if (adminLinkItem) adminLinkItem.style.display = 'none';
                if (mobileAdminLink) mobileAdminLink.style.display = 'none';
            }
            
            if (mobileLoginLink) mobileLoginLink.parentElement.style.display = 'none';
            if (mobileAccountLink) mobileAccountLink.style.display = 'block';
            if (mobileLogoutLink) mobileLogoutLink.style.display = 'block';
        } catch (e) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (loginBtnWrapper) loginBtnWrapper.style.display = 'flex';
            if (userWrapper) userWrapper.style.display = 'none';
            if (adminLinkItem) adminLinkItem.style.display = 'none';
        }
    } else {
        if (loginBtnWrapper) loginBtnWrapper.style.display = 'flex';
        if (userWrapper) userWrapper.style.display = 'none';
        if (adminLinkItem) adminLinkItem.style.display = 'none';
        
        if (mobileLoginLink) mobileLoginLink.parentElement.style.display = 'block';
        if (mobileAccountLink) mobileAccountLink.style.display = 'none';
        if (mobileAdminLink) mobileAdminLink.style.display = 'none';
        if (mobileLogoutLink) mobileLogoutLink.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast('Logged out successfully', 'success');
    setTimeout(() => window.location.href = 'index.html', 1000);
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput?.value?.trim();
    
    if (query) {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.nav-hamburger');
    const body = document.body;
    
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
    if (hamburger) {
        hamburger.classList.toggle('active');
    }
    if (body) {
        body.style.overflow = mobileMenu?.classList.contains('active') ? 'hidden' : '';
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.nav-hamburger');
    const body = document.body;
    
    if (mobileMenu) mobileMenu.classList.remove('active');
    if (hamburger) hamburger.classList.remove('active');
    if (body) body.style.overflow = '';
}

window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = mobileSearchInput.value.trim();
                if (query) {
                    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }
});

window.addEventListener('load', function() {
    setTimeout(() => {
        hideLoading();
    }, 500);
});

setTimeout(() => {
    hideLoading();
}, 3000);

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initSlider,
        nextSlide,
        prevSlide,
        goToSlide,
        loadFeaturedProducts,
        loadBestsellers,
        addToCart,
        loadCartCount,
        updateCartBadge,
        checkAuth,
        logout,
        performSearch,
        toggleMobileMenu
    };
}
