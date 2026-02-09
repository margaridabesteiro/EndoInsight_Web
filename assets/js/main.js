// assets/js/main.js

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na página da equipa
    const isEquipaPage = window.location.pathname.includes('equipa.html');
    
    // Inicializar funcionalidades comuns
    initializeCommonFeatures();
    
    // Inicializar funcionalidades específicas da página
    if (isEquipaPage) {
        initializeEquipaPage();
    } else {
        initializeMainPage();
    }
});

function initializeCommonFeatures() {
    // Smooth scroll para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignorar se for apenas #
            if (href === '#') return;
            
            // Se for um link para outra página com âncora
            if (href.includes('.html#')) {
                // Permitir navegação normal
                return;
            }
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Scroll suave
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Adicionar estilos para notificações
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 1000;
            transform: translateX(150%);
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 400px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left: 4px solid #28a745;
        }
        
        .notification-info {
            border-left: 4px solid var(--azul-claro);
        }
        
        .notification i {
            font-size: 1.2rem;
        }
        
        .notification-success i {
            color: #28a745;
        }
        
        .notification-info i {
            color: var(--azul-claro);
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--texto-claro);
            cursor: pointer;
            margin-left: auto;
            padding: 5px;
            border-radius: 4px;
            transition: all 0.3s;
        }
        
        .notification-close:hover {
            background-color: var(--cinza-medio);
            color: var(--texto-escuro);
        }
        
        .custom-marker {
            font-size: 1.5rem;
            color: var(--rosa-escuro);
            text-align: center;
        }
        
        .map-popup h3 {
            color: var(--rosa-escuro);
            margin-bottom: 10px;
            font-size: 1rem;
        }
        
        .map-popup p {
            margin: 5px 0;
            font-size: 0.9rem;
        }
        
        .map-popup a {
            color: var(--rosa-escuro);
            text-decoration: none;
        }
        
        .map-popup a:hover {
            text-decoration: underline;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);
}

function initializeMainPage() {
    // Contador animado para estatísticas
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const target = parseInt(statNumber.textContent.replace('+', ''));
                
                // Animar contador
                animateCounter(statNumber, target);
                
                // Deixar de observar após animação
                observer.unobserve(statNumber);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
    
    // Função para animar contador
    function animateCounter(element, target) {
        const hasPlus = element.textContent.includes('+');
        const duration = 2000; // 2 segundos
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (hasPlus && current === target) {
                element.textContent = target.toFixed(0) + '+';
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    // Vídeo placeholder click
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            this.innerHTML = `
                <iframe width="100%" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                    title="Demonstração do Simulador" frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;
        });
    }
}

function initializeEquipaPage() {
    // Galeria lightbox
    const galleryImages = document.querySelectorAll('.galeria-grid img');
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            openLightbox(this.src, this.alt);
        });
    });
    
    // Função para abrir lightbox
    function openLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${src}" alt="${alt}">
                <div class="lightbox-caption">${alt}</div>
                <button class="lightbox-close"><i class="fas fa-times"></i></button>
                <button class="lightbox-nav lightbox-prev"><i class="fas fa-chevron-left"></i></button>
                <button class="lightbox-nav lightbox-next"><i class="fas fa-chevron-right"></i></button>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Fechar lightbox
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', () => closeLightbox(lightbox));
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox(lightbox);
            }
        });
        
        // Navegação entre imagens (simplificada)
        const images = Array.from(galleryImages);
        const currentIndex = images.findIndex(img => img.src === src);
        
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const prevIndex = (currentIndex - 1 + images.length) % images.length;
                closeLightbox(lightbox);
                setTimeout(() => {
                    openLightbox(images[prevIndex].src, images[prevIndex].alt);
                }, 300);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const nextIndex = (currentIndex + 1) % images.length;
                closeLightbox(lightbox);
                setTimeout(() => {
                    openLightbox(images[nextIndex].src, images[nextIndex].alt);
                }, 300);
            });
        }
        
        // Fechar com ESC
        document.addEventListener('keydown', function handleKeydown(e) {
            if (e.key === 'Escape') {
                closeLightbox(lightbox);
                document.removeEventListener('keydown', handleKeydown);
            }
        });
    }
    
    function closeLightbox(lightbox) {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            if (lightbox.parentNode) {
                lightbox.parentNode.removeChild(lightbox);
            }
            document.body.style.overflow = 'auto';
        }, 300);
    }
    
    // Adicionar estilos para lightbox
    const lightboxStyles = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 1;
            transition: opacity 0.3s;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        
        .lightbox-content img {
            max-width: 100%;
            max-height: 70vh;
            border-radius: 8px;
        }
        
        .lightbox-caption {
            color: white;
            text-align: center;
            padding: 10px;
            font-size: 1.1rem;
        }
        
        .lightbox-close {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            transition: background 0.3s;
        }
        
        .lightbox-close:hover {
            background: rgba(255,255,255,0.3);
        }
        
        .lightbox-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            transition: background 0.3s;
        }
        
        .lightbox-nav:hover {
            background: rgba(255,255,255,0.3);
        }
        
        .lightbox-prev {
            left: 20px;
        }
        
        .lightbox-next {
            right: 20px;
        }
    `;
    
    const existingLightboxStyle = document.querySelector('#lightbox-styles');
    if (!existingLightboxStyle) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'lightbox-styles';
        styleSheet.textContent = lightboxStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Animar elementos da cronologia quando visíveis
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        timelineObserver.observe(item);
    });
}