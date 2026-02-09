// assets/js/endoinsight.js

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as funcionalidades da página EndoInsight
    initVideoPlaceholder();
    initVendasMap();
    initRecomendacoesForm();
    initStarRatings();
    initComentariosAnimations();
});

// Função para placeholder de vídeo
function initVideoPlaceholder() {
    const videoPlaceholder = document.getElementById('videoPlaceholder');
    const realVideo = document.getElementById('realVideo');
    const videoFrame = document.getElementById('videoFrame');
    
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            // Esta função será atualizada quando o vídeo estiver disponível
            // Por enquanto, mostra uma mensagem
            showNotification('O vídeo de demonstração estará disponível em breve!', 'info');
            
            // Exemplo de como será quando o vídeo estiver disponível:
            // videoPlaceholder.style.display = 'none';
            // realVideo.style.display = 'block';
            // videoFrame.src = 'URL_DO_SEU_VIDEO_AQUI';
        });
    }
}

// Função para inicializar o mapa de vendas
function initVendasMap() {
    if (!document.getElementById('vendasMap')) return;
    
    // Coordenadas centradas em Portugal
    const portugalCenter = [39.3999, -8.2245];
    
    // Criar mapa
    const map = L.map('vendasMap').setView(portugalCenter, 7);
    
    // Adicionar camada do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Locais de venda (simulados)
    const locaisVenda = [
        {
            coords: [41.1780, -8.6081], // Porto (ISEP)
            tipo: 'university',
            nome: 'ISEP - Ponto de Demonstração',
            descricao: 'Demonstrações e vendas para instituições académicas',
            contacto: '22 834 0500',
            email: 'endoinsight@isep.ipp.pt'
        },
        {
            coords: [38.7223, -9.1393], // Lisboa
            tipo: 'hospital',
            nome: 'Hospital Santa Maria',
            descricao: 'Distribuidor oficial para hospitais de Lisboa',
            contacto: '21 780 5000',
            email: 'hsanta.maria@medequip.pt'
        },
        {
            coords: [40.2114, -8.4292], // Coimbra
            tipo: 'university',
            nome: 'Faculdade de Medicina de Coimbra',
            descricao: 'Centro de treino e vendas para estudantes',
            contacto: '23 985 1800',
            email: 'fmc@educamed.pt'
        },
        {
            coords: [41.5454, -8.4265], // Braga
            tipo: 'store',
            nome: 'HealthTech Store Braga',
            descricao: 'Loja especializada em tecnologia médica',
            contacto: '25 320 7890',
            email: 'braga@healthtechstore.com'
        },
        {
            coords: [37.0194, -7.9304], // Faro
            tipo: 'hospital',
            nome: 'Hospital de Faro',
            descricao: 'Distribuidor para o Algarve',
            contacto: '28 989 8000',
            email: 'hfaro@medequip.pt'
        },
        {
            coords: [39.7436, -8.8070], // Leiria
            tipo: 'university',
            nome: 'Escola Superior de Saúde de Leiria',
            descricao: 'Parceria para formação em saúde',
            contacto: '24 483 5400',
            email: 'esslei@educamed.pt'
        },
        {
            coords: [38.5667, -7.9000], // Évora
            tipo: 'store',
            nome: 'MedTech Solutions',
            descricao: 'Revendedor autorizado',
            contacto: '26 674 9320',
            email: 'evora@healthtechstore.com'
        }
    ];
    
    // Criar ícones personalizados
    const hospitalIcon = L.divIcon({
        className: 'custom-marker-hospital',
        html: '<i class="fas fa-hospital"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });
    
    const universityIcon = L.divIcon({
        className: 'custom-marker-university',
        html: '<i class="fas fa-university"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });
    
    const storeIcon = L.divIcon({
        className: 'custom-marker-store',
        html: '<i class="fas fa-shopping-cart"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });
    
    // Adicionar marcadores ao mapa
    locaisVenda.forEach(local => {
        let icon;
        
        switch(local.tipo) {
            case 'hospital':
                icon = hospitalIcon;
                break;
            case 'university':
                icon = universityIcon;
                break;
            case 'store':
                icon = storeIcon;
                break;
            default:
                icon = L.divIcon({
                    className: 'custom-marker',
                    html: '<i class="fas fa-map-marker-alt"></i>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 30],
                    popupAnchor: [0, -30]
                });
        }
        
        L.marker(local.coords, { icon: icon })
            .addTo(map)
            .bindPopup(`
                <div class="map-popup-custom">
                    <h3>${local.nome}</h3>
                    <p>${local.descricao}</p>
                    <div class="popup-contact">
                        <p><i class="fas fa-phone"></i> ${local.contacto}</p>
                        <p><i class="fas fa-envelope"></i> ${local.email}</p>
                    </div>
                </div>
            `);
    });
    
    // Adicionar controle de escala
    L.control.scale().addTo(map);
    
    // Adicionar busca de localização
    if (navigator.geolocation) {
        L.control.locate({
            position: 'topleft',
            drawCircle: true,
            follow: true,
            setView: true,
            keepCurrentZoomLevel: true,
            markerStyle: {
                weight: 1,
                opacity: 0.8,
                fillOpacity: 0.8
            },
            circleStyle: {
                weight: 1,
                stroke: true,
                color: '#136AEC',
                opacity: 0.5,
                fillOpacity: 0.15
            },
            icon: 'fas fa-location-arrow',
            metric: true,
            strings: {
                title: "Mostrar a minha localização",
                popup: "Está a {distance} {unit} deste ponto",
                outsideMapBoundsMsg: "Está fora dos limites do mapa"
            },
            locateOptions: {
                maxZoom: 16,
                watch: false,
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 10000
            }
        }).addTo(map);
    }
}

// Função para inicializar o formulário de recomendações
function initRecomendacoesForm() {
    const form = document.getElementById('recomendacaoForm');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar formulário
        if (!validateForm()) {
            return;
        }
        
        // Mostrar loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A enviar...';
        submitBtn.disabled = true;
        
        // Simular envio (em produção, usar fetch/axios)
        setTimeout(() => {
            // Construir mensagem
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Aqui normalmente enviaria para um servidor
            // Simular sucesso
            showNotification('Recomendação enviada com sucesso! Obrigado pelo seu feedback.', 'success');
            
            // Enviar email (simulado)
            sendEmailNotification(data);
            
            // Resetar formulário
            form.reset();
            resetStarRating();
            
            // Restaurar botão
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
    
    // Validação em tempo real
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// Funções de validação
function validateForm() {
    const form = document.getElementById('recomendacaoForm');
    let isValid = true;
    
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const errorDiv = field.parentElement.querySelector('.error-message') || createErrorDiv(field);
    
    // Remover mensagem de erro anterior
    errorDiv.textContent = '';
    field.classList.remove('error');
    
    // Validar campo
    let error = '';
    
    if (field.required && !field.value.trim()) {
        error = 'Este campo é obrigatório.';
    } else if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            error = 'Por favor, insira um email válido.';
        }
    } else if (field.id === 'mensagem' && field.value.length < 10) {
        error = 'A mensagem deve ter pelo menos 10 caracteres.';
    }
    
    // Mostrar erro se existir
    if (error) {
        errorDiv.textContent = error;
        field.classList.add('error');
        return false;
    }
    
    return true;
}

function createErrorDiv(field) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    field.parentElement.appendChild(errorDiv);
    return errorDiv;
}

// Função para inicializar sistema de estrelas
function initStarRatings() {
    // Sistema de estrelas nos comentários (só visual)
    // Sistema de estrelas no formulário já está configurado no HTML
}

function resetStarRating() {
    const stars = document.querySelectorAll('.rating-stars-input input');
    stars.forEach(star => {
        star.checked = false;
    });
}

// Função para enviar notificação por email (simulada)
function sendEmailNotification(data) {
    // Em produção, enviaria para um servidor que enviaria o email
    // Aqui apenas simulamos o envio
    const emailData = {
        to: '1221419@isep.ipp.pt',
        subject: `Nova Recomendação EndoInsight - ${data.tipo}`,
        body: `
Nome: ${data.nome}
Email: ${data.email}
Profissão: ${data.profissao || 'Não especificada'}
Tipo: ${data.tipo}
Prioridade: ${data.prioridade}
Avaliação: ${data.rating || 'Não avaliado'}
Mensagem: ${data.mensagem}
Newsletter: ${data.newsletter ? 'Sim' : 'Não'}
        `
    };
    
    console.log('Email simulado enviado:', emailData);
    
    // Em produção, usaria:
    // fetch('/api/send-email', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(emailData)
    // });
}

// Função para animações nos comentários
function initComentariosAnimations() {
    const comentarioCards = document.querySelectorAll('.comentario-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    comentarioCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    // Verificar se já existe uma notificação
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
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

// Adicionar estilos para erros de validação
const validationStyles = `
    .error-message {
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 5px;
    }
    
    .error {
        border-color: #e74c3c !important;
    }
    
    .error:focus {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = validationStyles;
document.head.appendChild(styleSheet);