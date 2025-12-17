/* 
Project Name: 3D E-Commerce Fashion Store
Project Owner/Auther: OG -> Omkar R. Ghare
Project Technologies: HTML, CSS & JS.
*/

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburgerMenu.classList.remove('active');
            });
        });
    }
});

// Initialize Lottie
const lottieContainer = document.getElementById('lottie-drag');
if (lottieContainer) {
    lottie.loadAnimation({
        container: lottieContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://lottie.host/4b82c781-a621-4475-9273-046654922122/P2L7z5wW7h.json' // Example generic interaction Lottie
    });
}

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

const updateCartBadge = () => {
    const badge = document.querySelector('.badge');
    if (badge) {
        badge.textContent = cart.length;
    }
};

const addToCart = (productId, productName, productPrice) => {
    const existingProduct = cart.find(item => item.id === productId);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    
    // Show toast notification
    showToast(`${productName} added to cart!`);
};

const toggleFavorite = (button, productId, productName) => {
    const existingFavorite = favorites.find(item => item.id === productId);
    
    if (existingFavorite) {
        favorites = favorites.filter(item => item.id !== productId);
        button.classList.remove('active');
        showToast(`Removed from favorites`, 'info');
    } else {
        favorites.push({ id: productId, name: productName });
        button.classList.add('active');
        showToast(`Added to favorites!`);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
};

const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    gsap.timeline()
        .from(toast, {
            duration: 0.3,
            y: 20,
            opacity: 0,
            ease: "power3.out"
        })
        .to(toast, {
            duration: 0.3,
            y: -20,
            opacity: 0,
            ease: "power3.out",
            delay: 2.5
        }, "-=0")
        .call(() => toast.remove());
};

// Event listeners for Add to Cart and Favorite buttons
document.addEventListener('DOMContentLoaded', () => {
    // Add to Cart functionality
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = button.dataset.productId;
            const productName = button.dataset.productName;
            const productPrice = button.dataset.productPrice;
            
            addToCart(productId, productName, productPrice);
            
            // Animate button
            gsap.to(button, {
                scale: 1.2,
                duration: 0.2,
                ease: "back.out",
                onComplete: () => {
                    gsap.to(button, { scale: 1, duration: 0.2 });
                }
            });
        });
    });

    // Favorite button functionality
    document.querySelectorAll('.favorite-btn').forEach(button => {
        const productId = button.parentElement.parentElement.querySelector('[data-product-id]')?.dataset.productId || 
                         button.parentElement.parentElement.parentElement.querySelector('[data-product-id]')?.dataset.productId ||
                         Math.random().toString(36).substr(2, 9);
        
        const productName = button.closest('.product-card')?.querySelector('h4')?.textContent ||
                           button.closest('.arrival-card')?.querySelector('h4')?.textContent ||
                           'Product';

        // Check if already in favorites
        if (favorites.find(item => item.id === productId)) {
            button.classList.add('active');
            button.innerHTML = '<i class="fa-solid fa-heart"></i>';
        }

        button.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFavorite(button, productId, productName);

            // Animate heart
            gsap.to(button, {
                scale: 1.3,
                duration: 0.2,
                ease: "back.out",
                onComplete: () => {
                    gsap.to(button, { scale: 1, duration: 0.2 });
                }
            });
        });
    });

    updateCartBadge();
});

// Three.js 3D Viewer
const init3DViewer = () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = null; // Transparent background

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0xd4af37, 2); // Gold tint
    pointLight2.position.set(-5, -5, 2);
    scene.add(pointLight2);

    // Placeholder 3D Object (Abstract Fashion Art)
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a, 
        roughness: 0.2,
        metalness: 0.8,
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };

    animate();

    // Resize Handle
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
};

init3DViewer();

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Animation
const tl = gsap.timeline();
tl.from('.hero-subtitle', {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: "power3.out"
})
.from('.hero-title', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
}, "-=0.8")
.from('.hero-desc', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
}, "-=0.8")
.from('.hero-btns', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
}, "-=0.8")
.from('.hero-visual', {
    x: 50,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out"
}, "-=1.2");

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Animations for Sections
const sections = document.querySelectorAll('.section');

sections.forEach(section => {
    gsap.from(section.children, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });
});

// Product Slider Logic (Simple)
const slider = document.querySelector('.product-slider');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');

if (slider && prevBtn && nextBtn) {
    nextBtn.addEventListener('click', () => {
        slider.scrollBy({ left: 300, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -300, behavior: 'smooth' });
    });
}

// Countdown Timer
const updateCountdown = () => {
    const targetDate = new Date().getTime() + (12 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000 + 45 * 60 * 1000 + 32 * 1000);
    
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }, 1000);
};

updateCountdown();
