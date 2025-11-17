// ============================================
// CONFIGURAÇÕES INICIAIS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    initHeroSlider();
    initScrollAnimations();
    initSmoothScroll();
});

// ============================================
// HEADER SCROLL
// ============================================

function initHeader() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ============================================
// HERO SLIDER
// ============================================

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Troca de slide a cada 5 segundos
    setInterval(nextSlide, 5000);
}

// ============================================
// ANIMAÇÕES NO SCROLL
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Elementos para animar
    const elementsToAnimate = document.querySelectorAll(`
        .suite-card,
        .diferencial-card,
        .testimonial-card,
        .experience-item,
        .intro-text,
        .intro-image
    `);
    
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// PARALLAX EFFECT (OPCIONAL)
// ============================================

window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroSlider = document.querySelector('.hero-slider');
    
    if (heroSlider && scrolled <= window.innerHeight) {
        heroSlider.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ============================================
// CONTADOR DE STATS (OPCIONAL)
// ============================================

function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 20);
    });
}

// Ativar contador quando visível
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ============================================
// MENU MOBILE (SE NECESSÁRIO)
// ============================================

function initMobileMenu() {
    const menuToggle = document.createElement('button');
    menuToggle.classList.add('menu-toggle');
    menuToggle.innerHTML = '☰';
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    
    const header = document.querySelector('.header .container');
    const nav = document.querySelector('.nav');
    
    if (window.innerWidth <= 768) {
        header.insertBefore(menuToggle, nav);
        
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.innerHTML = nav.classList.contains('active') ? '✕' : '☰';
        });
    }
}

// Chamar função no resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        location.reload();
    }, 250);
});

// ============================================
// LAZY LOADING DE IMAGENS (PERFORMANCE)
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ============================================
// VÍDEOS MARQUEE - CARREGAMENTO LAZY E OTIMIZADO
// ============================================

function initVideos() {
    const videos = document.querySelectorAll('.video-card video');
    
    // Observer para carregar vídeos quando entrarem no viewport
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                
                // Se o vídeo ainda não foi carregado
                if (video.readyState === 0) {
                    video.load();
                }
                
                // Tentar reproduzir
                const playPromise = video.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('Vídeo reproduzindo:', video.src);
                    }).catch(error => {
                        console.log('Erro ao reproduzir vídeo:', error);
                    });
                }
                
                // Parar de observar após carregar
                videoObserver.unobserve(video);
            }
        });
    }, {
        rootMargin: '50px' // Carregar um pouco antes de aparecer
    });
    
    // Observar todos os vídeos
    videos.forEach(video => {
        videoObserver.observe(video);
    });
}

// Iniciar vídeos quando a página carregar
window.addEventListener('load', initVideos);

// Fallback para navegadores mais antigos
if (!('IntersectionObserver' in window)) {
    setTimeout(() => {
        const videos = document.querySelectorAll('.video-card video');
        videos.forEach(video => {
            video.load();
            video.play().catch(() => {});
        });
    }, 1000);
}

// ============================================
// UTILITÁRIOS
// ============================================

// Prevenir comportamento padrão de links vazios
document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', e => e.preventDefault());
});

// Console log para debug
console.log('🎉 Motel Xenon - Landing Page carregada com sucesso!');
