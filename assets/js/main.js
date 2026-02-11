// assets/js/main.js - Versão simplificada para scroll único

// assets/js/main.js - Versão corrigida para scroll único

document.addEventListener('DOMContentLoaded', function () {
    initializeCommonFeatures();
    initializeSinglePageFeatures();
});

function initializeCommonFeatures() {
    // Adicionar estilos para notificações (mantido do original)
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
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);

    // Contador animado para estatísticas (mantido do original)
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target;
                    const target = parseInt(statNumber.textContent.replace('+', ''));

                    animateCounter(statNumber, target);
                    observer.unobserve(statNumber);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => observer.observe(stat));
    }

    // Sistema de tabs para componentes (mantido do original)
    const componentTabs = document.querySelectorAll('.component-tab');
    if (componentTabs.length > 0) {
        componentTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                const componentId = this.getAttribute('data-component');

                componentTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                document.querySelectorAll('.component-details').forEach(detail => {
                    detail.classList.remove('active');
                });

                const targetDetails = document.getElementById(componentId);
                if (targetDetails) {
                    targetDetails.classList.add('active');
                }
            });
        });
    }

    // Download buttons com simulação (mantido do original)
    const downloadButtons = document.querySelectorAll('.download-btn');
    if (downloadButtons.length > 0) {
        downloadButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();

                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A preparar download...';
                this.disabled = true;

                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                    showNotification('Download iniciado! Verifique a sua pasta de downloads.', 'success');
                }, 1500);
            });
        });
    }

    // Inicializar mapa da localização ISEP (mantido do original)
    if (document.getElementById('map')) {
        initializeISEPMap();
    }
}

function initializeSinglePageFeatures() {
    // Configurar navegação suave e highlight ativo
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Configurar smooth scroll para links de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Se for um link interno (começa com #)
            if (href.startsWith('#')) {
                e.preventDefault();

                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Scroll suave para a seção
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });

                    // Fechar menu móvel se estiver aberto
                    const navMenu = document.getElementById('navMenu');
                    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

                    if (navMenu && navMenu.classList.contains('show')) {
                        navMenu.classList.remove('show');
                        if (mobileMenuBtn) {
                            mobileMenuBtn.setAttribute('aria-expanded', 'false');
                        }
                    }
                }
            }
            // Se for um link externo (como equipa.html), deixar navegar normalmente
        });
    });

    // Observador de interseção para highlight de seção ativa
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;

                // Remover active apenas dos links internos
                navLinks.forEach(link => {
                    if (link.getAttribute('href').startsWith('#')) {
                        link.classList.remove('active');
                    }
                });

                // Adicionar active ao link correspondente (apenas links internos)
                const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Configurar menu móvel (mantido do original)
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('show');
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', function (e) {
            if (!e.target.closest('nav') && !e.target.closest('.mobile-menu-btn')) {
                navMenu.classList.remove('show');
                if (mobileMenuBtn) {
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });

        // Fechar menu ao clicar em um link (qualquer link)
        document.querySelectorAll('#navMenu a').forEach(link => {
            link.addEventListener('click', function () {
                // Pequeno delay para garantir que a navegação aconteça primeiro
                setTimeout(() => {
                    navMenu.classList.remove('show');
                    if (mobileMenuBtn) {
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    }
                }, 100);
            });
        });
    }

    // Verificar URL atual para destacar link correto no carregamento
    highlightCurrentLink();
}

function highlightCurrentLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;

    // Remover active de todos os links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Se estamos na página principal e tem hash
    if (currentPath.includes('index.html') || currentPath === '/' || currentPath.includes('.html') === false) {
        if (currentHash) {
            // Destacar link correspondente ao hash
            const link = document.querySelector(`.nav-link[href="${currentHash}"]`);
            if (link) {
                link.classList.add('active');
            }
        } else {
            // Se não tem hash, destacar primeiro link ou deixar sem destaque
            const firstLink = document.querySelector('.nav-link[href^="#"]');
            if (firstLink) {
                firstLink.classList.add('active');
            }
        }
    } else if (currentPath.includes('equipa.html')) {
        // Se estamos na página da equipa, destacar o link da equipa
        const equipaLink = document.querySelector('.nav-link[href*="equipa.html"]');
        if (equipaLink) {
            equipaLink.classList.add('active');
        }
    }
}

// Função para animar contador (mantida do original)
function animateCounter(element, target) {
    const hasPlus = element.textContent.includes('+');
    const duration = 2000;
    const step = target / (duration / 16);
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

// Função para inicializar mapa ISEP (mantida do original)
function initializeISEPMap() {
    const isepCoords = [41.1780, -8.6081];

    const map = L.map('map').setView(isepCoords, 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: '<i class="fas fa-university"></i>',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });

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

    L.control.scale().addTo(map);
}

// Função para mostrar notificações (mantida do original)
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });

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

const modalEtica = document.getElementById("modalEtica");
const modalTermos = document.getElementById("modalTermos");

document.getElementById("openEtica").addEventListener("click", function (e) {
    e.preventDefault();
    modalEtica.classList.add("active");
});

document.getElementById("openTermos").addEventListener("click", function (e) {
    e.preventDefault();
    modalTermos.classList.add("active");
});

document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => {
        modalEtica.classList.remove("active");
        modalTermos.classList.remove("active");
    });
});

window.addEventListener("click", function (e) {
    if (e.target.classList.contains("custom-modal")) {
        e.target.classList.remove("active");
    }
});

document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("searchInput");
    const suggestionsBox = document.getElementById("searchSuggestions");
    const searchableElements = document.querySelectorAll("h1, h2, h3, h4, p, li");

    function normalize(text) {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[.,!?;:()]/g, "");
    }

    function clearHighlights() {
        document.querySelectorAll("mark.search-highlight").forEach(mark => {
            const parent = mark.parentNode;
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize();
        });
    }

    function highlightAndScroll(term) {

        clearHighlights();

        const normalizedTerm = normalize(term);
        let firstMatch = null;

        searchableElements.forEach(el => {

            const originalText = el.textContent;
            const normalizedText = normalize(originalText);

            if (normalizedText.includes(normalizedTerm)) {

                const regex = new RegExp("(" + term + ")", "gi");
                el.innerHTML = originalText.replace(regex, '<mark class="search-highlight">$1</mark>');

                if (!firstMatch) {
                    firstMatch = el;
                }
            }
        });

        if (firstMatch) {
            firstMatch.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }

    let wordsSet = new Set();

    searchableElements.forEach(el => {
        const words = el.textContent.split(/\s+/);
        words.forEach(word => {
            const cleaned = normalize(word);
            if (cleaned.length > 3) {
                wordsSet.add(cleaned);
            }
        });
    });

    const wordsArray = Array.from(wordsSet);

    searchInput.addEventListener("input", function () {

        const value = normalize(this.value);
        suggestionsBox.innerHTML = "";

        if (value.length < 2) {
            suggestionsBox.style.display = "none";
            clearHighlights();
            return;
        }

        const matches = wordsArray.filter(word => word.includes(value));

        if (matches.length === 0) {
            suggestionsBox.style.display = "none";
            return;
        }

        matches.slice(0, 8).forEach(match => {

            const div = document.createElement("div");
            div.textContent = match;

            div.addEventListener("click", function () {
                searchInput.value = match;
                suggestionsBox.style.display = "none";
                highlightAndScroll(match);
            });

            suggestionsBox.appendChild(div);
        });

        suggestionsBox.style.display = "block";
    });

    searchInput.addEventListener("keyup", function () {
        if (this.value.trim() === "") {
            clearHighlights();
            suggestionsBox.style.display = "none";
        }
    });

    searchInput.addEventListener("blur", function () {
        if (searchInput.value.trim() === "") {
            clearHighlights();
        }
    });

    document.addEventListener("click", function (e) {

        if (!e.target.closest(".search-container")) {

            suggestionsBox.style.display = "none";

            if (searchInput.value.trim() === "") {
                clearHighlights();
            }
        }
    });


});