// ============================================
// CONFIGURAÇÕES INICIAIS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Performance optimizations
    optimizePerformance();
    
    initHeader();
    initHeroSlider();
    initScrollAnimations();
    initSmoothScroll();
    initSuiteTabs();
    lazyLoadVideos();
    optimizeMarquees(); // Nova função para marquees
    initPhoneMask(); // Máscara de telefone
});

// ============================================
// OTIMIZAÇÕES DE PERFORMANCE
// ============================================

function optimizePerformance() {
    // Desabilitar animações se usuário prefere movimento reduzido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition-smooth', 'none');
        document.documentElement.style.setProperty('--transition-fast', 'none');
        
        // Pausar todas as animações de marquee
        document.querySelectorAll('.videos-marquee-track, .video-marquee-track').forEach(track => {
            track.style.animationPlayState = 'paused';
        });
    }
    
    // Prevenir scroll horizontal
    document.body.style.overflowX = 'hidden';
    
    // Otimizar touch events com passive listeners
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });
    
    // Prevenir overscroll bounce
    document.body.style.overscrollBehavior = 'none';
}

// ============================================
// LAZY LOADING DE VÍDEOS
// ============================================

function lazyLoadVideos() {
    const videos = document.querySelectorAll('video[data-src]');
    
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    const source = video.querySelector('source');
                    
                    if (source && source.dataset.src) {
                        source.src = source.dataset.src;
                        video.load();
                        videoObserver.unobserve(video);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        videos.forEach(video => videoObserver.observe(video));
    }
}

// ============================================
// HEADER SCROLL
// ============================================

function initHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        lastScroll = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (lastScroll > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ============================================
// HERO SLIDER
// ============================================

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Troca de slide a cada 5 segundos com performance otimizada
    const sliderInterval = setInterval(nextSlide, 5000);
    
    // Pausar slider quando tab não está ativa
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(sliderInterval);
        }
    });
}

// ============================================
// ANIMAÇÕES NO SCROLL
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
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
        element.style.willChange = 'opacity, transform';
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
            const targetId = this.getAttribute('href');
            
            // Ignorar links vazios ou apenas "#"
            if (!targetId || targetId === '#') {
                e.preventDefault();
                return false;
            }
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                // Scroll suave
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                return false;
            }
        }, { passive: false });
    });
}

// ============================================
// PARALLAX EFFECT - DESABILITADO
// ============================================
// Função removida para evitar conflitos de scroll com marquees

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

// REMOVIDO: location.reload() no resize estava causando bugs de reload constante

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
// ABAS DAS SUÍTES
// ============================================

function initSuiteTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            const parentCard = this.closest('.suite-card');
            
            // Remover active de todos os botões e conteúdos do card
            parentCard.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            parentCard.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Adicionar active no botão clicado
            this.classList.add('active');
            
            // Mostrar conteúdo correspondente
            const targetContent = parentCard.querySelector(`#${targetTab}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// ============================================
// UTILITÁRIOS
// ============================================

// Prevenir comportamento padrão de links vazios
document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', e => e.preventDefault(), { passive: false });
});

// Fix para scroll no iOS
document.addEventListener('touchmove', function(e) {
    // Permitir scroll normal
}, { passive: true });

// ============================================
// MÁSCARA DE TELEFONE BRASILEIRO
// ============================================

function initPhoneMask() {
    const phoneInput = document.getElementById('clientPhone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
            
            if (value.length > 11) {
                value = value.slice(0, 11); // Limita a 11 dígitos
            }
            
            // Aplica a máscara
            if (value.length <= 10) {
                // Formato: (00) 0000-0000
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            } else {
                // Formato: (00) 00000-0000
                value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
            }
            
            e.target.value = value;
        });
        
        // Permite apenas números, parênteses, espaço e hífen
        phoneInput.addEventListener('keypress', function(e) {
            const char = String.fromCharCode(e.which);
            if (!/[0-9]/.test(char)) {
                e.preventDefault();
            }
        });
    }
}

// ============================================
// WHATSAPP MODAL
// ============================================

function openWhatsAppModal() {
    const modal = document.getElementById('whatsappModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeWhatsAppModal() {
    const modal = document.getElementById('whatsappModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

async function submitWhatsApp(event) {
    event.preventDefault();
    
    const name = document.getElementById('clientName').value;
    
    // Preparar dados para o webhook no formato solicitado
    const webhookURL = 'https://hook.us2.make.com/fbc3dcrvjt5m1ctf8nv2hvawquvms86u';
    
    // Enviar dados de forma simples - sem estrutura aninhada
    const leadData = {
        "NOME": name,
        "EMAIL": "",
        "TELEFONE": "",
        "PERGUNTA": "Cliente ganhou garrafa de vinho - promoção landing page",
        "PLATAFORMA": "Google Ads",
        "FONTE": "Landing Page Motel Xenon - Promo Vinho",
        "QUANDO": new Date().toISOString(),
        "traffic_source": "Google Ads"
    };
    
    console.log('Enviando dados para webhook:', leadData);
    
    try {
        // Enviar dados para o webhook do Make.com
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leadData)
        });
        
        const responseText = await response.text();
        
        if (response.ok) {
            console.log('✅ Dados enviados com sucesso!', responseText);
        } else {
            console.log('❌ Erro na resposta do webhook:', response.status, responseText);
        }
    } catch (error) {
        console.log('❌ Erro ao enviar dados para webhook:', error);
        // Continua o fluxo mesmo se houver erro no webhook
    }
    
    // Número do WhatsApp do Motel Xenon
    const whatsappNumber = '554884688350';
    
    // Mensagem personalizada com promoção da garrafa de vinho
    const message = `🍷 Olá! Meu nome é ${name} e acabei de ganhar uma garrafa de vinho!\n\nGostaria de fazer minha reserva no Motel Xenon e resgatar minha garrafa de vinho de cortesia!`;
    
    // Criar URL do WhatsApp
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Disparar evento de conversão do Google Ads
    if (typeof gtag_report_conversion === 'function') {
        gtag_report_conversion(whatsappURL);
    } else {
        // Fallback se a função não estiver disponível
        window.open(whatsappURL, '_blank');
    }
    
    // Fechar modal
    closeWhatsAppModal();
    
    // Limpar formulário
    document.getElementById('whatsappForm').reset();
}

// Fechar modal ao clicar fora
window.addEventListener('click', function(event) {
    const modal = document.getElementById('whatsappModal');
    if (event.target === modal) {
        closeWhatsAppModal();
    }
});

// ============================================
// OTIMIZAÇÃO AVANÇADA DE MARQUEES
// ============================================

function optimizeMarquees() {
    const marqueeSelectors = [
        '.videos-marquee-track',
        '.video-marquee-track'
    ];
    
    marqueeSelectors.forEach(selector => {
        const tracks = document.querySelectorAll(selector);
        
        tracks.forEach(track => {
            // Intersection Observer para pausar quando fora da viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Dentro da viewport - continuar animação
                        track.style.animationPlayState = 'running';
                        
                        // Carregar vídeos lazy
                        const videos = track.querySelectorAll('video');
                        videos.forEach(video => {
                            if (!video.src && video.dataset.src) {
                                video.src = video.dataset.src;
                                video.load();
                            }
                        });
                    } else {
                        // Fora da viewport - pausar animação
                        track.style.animationPlayState = 'paused';
                        
                        // Pausar vídeos
                        const videos = track.querySelectorAll('video');
                        videos.forEach(video => {
                            if (!video.paused) {
                                video.pause();
                            }
                        });
                    }
                });
            }, {
                rootMargin: '100px',
                threshold: 0.1
            });
            
            observer.observe(track);
        });
    });
    
    // Simples debounce para scroll
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        document.body.classList.add('is-scrolling');
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('is-scrolling');
        }, 150);
    }, { passive: true });
}

// Console log para debug
console.log('🎉 Motel Xenon - Landing Page carregada com sucesso!');
