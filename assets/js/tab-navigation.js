// assets/js/tab-navigation.js

document.addEventListener('DOMContentLoaded', function() {
    // Elementos da navegação
    const navLinks = document.querySelectorAll('.nav-link:not([href="equipa.html"])');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    // Seção ativa
    let activeSection = 'home';
    
    // Função para ativar uma seção
    function activateSection(sectionId) {
        // Remover active de todas as seções e links
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Ativar nova seção
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            activeSection = sectionId;
            
            // Ativar link correspondente
            const correspondingLink = document.querySelector(`.nav-link[data-tab="${sectionId}"]`);
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
            
            // Scroll suave para a seção
            if (sectionId !== 'home') {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }
    }
    
    // Configurar eventos de clique nos links de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const tabId = this.getAttribute('data-tab');
            if (tabId) {
                activateSection(tabId);
                
                // Fechar menu móvel se estiver aberto
                if (navMenu.classList.contains('show')) {
                    navMenu.classList.remove('show');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
    
    // Menu móvel
    mobileMenuBtn.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('show');
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('nav') && !e.target.closest('.mobile-menu-btn')) {
            navMenu.classList.remove('show');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Observador de interseção para highlights automáticos
    const sections = document.querySelectorAll('.content-section');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                if (sectionId !== activeSection) {
                    // Atualizar link ativo
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('data-tab') === sectionId) {
                            link.classList.add('active');
                        }
                    });
                    activeSection = sectionId;
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Sistema de tabs para componentes
    const componentTabs = document.querySelectorAll('.component-tab');
    if (componentTabs.length > 0) {
        componentTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const componentId = this.getAttribute('data-component');
                
                // Remover active de todas as tabs
                componentTabs.forEach(t => t.classList.remove('active'));
                
                // Adicionar active à tab clicada
                this.classList.add('active');
                
                // Esconder todos os detalhes
                document.querySelectorAll('.component-details').forEach(detail => {
                    detail.classList.remove('active');
                });
                
                // Mostrar detalhes correspondentes
                const targetDetails = document.getElementById(componentId);
                if (targetDetails) {
                    targetDetails.classList.add('active');
                }
            });
        });
    }
    
    // Download buttons com simulação
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Animação de loading
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A preparar download...';
            this.disabled = true;
            
            // Simular download
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                
                // Notificação de sucesso
                showNotification('Download iniciado! Verifique a sua pasta de downloads.', 'success');
                
                // Ativar aba de download se não estiver ativa
                if (window.location.hash !== '#download') {
                    activateSection('download');
                }
            }, 1500);
        });
    });
    
    // Função para mostrar notificações
    function showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Adicionar ao body
        document.body.appendChild(notification);
        
        // Animação de entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Fechar notificação
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto-fechar após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Inicializar mapa se existir
    if (document.getElementById('map')) {
        initializeMap();
    }
});

// Função para inicializar o mapa
function initializeMap() {
    // Coordenadas do ISEP
    const isepCoords = [41.1780, -8.6081];
    
    // Criar mapa
    const map = L.map('map').setView(isepCoords, 16);
    
    // Adicionar camada do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Marcador personalizado
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: '<i class="fas fa-university"></i>',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
    
    // Adicionar marcador do ISEP
    L.marker(isepCoords, { icon: customIcon }).addTo(map)
        .bindPopup(`
            <div class="map-popup">
                <h3>ISEP - Instituto Superior de Engenharia do Porto</h3>
                <p><i class="fas fa-map-marker-alt"></i> Rua Dr. António Bernardino de Almeida, 431</p>
                <p><i class="fas fa-phone"></i> +351 228 340 500</p>
                <p><i class="fas fa-globe"></i> <a href="https://www.isep.ipp.pt" target="_blank">www.isep.ipp.pt</a></p>
            </div>
        `)
        .openPopup();
    
    // Adicionar controle de escala
    L.control.scale().addTo(map);
}