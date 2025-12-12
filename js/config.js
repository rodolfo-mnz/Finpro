// Configuração da API
// Para desenvolvimento local, use: 'http://localhost:3000'
// Para produção (Render), use a URL do seu serviço Render
// Exemplo: 'https://seu-backend.onrender.com'

const API_CONFIG = {
    // URL base da API - será detectada automaticamente ou use a URL do Render
    BASE_URL: (function() {
        // Se estiver em produção e tiver uma variável de ambiente, use ela
        // Caso contrário, detecta automaticamente
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            // Em produção, tenta usar a mesma origem ou uma URL configurada
            // Você pode definir esta variável no HTML antes de carregar este arquivo
            return window.API_BASE_URL || window.location.origin;
        }
        // Desenvolvimento local
        return 'http://localhost:3000';
    })()
};

// Função auxiliar para fazer requisições à API
async function apiRequest(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {}),
        },
    };
    
    try {
        const response = await fetch(url, finalOptions);
        return response;
    } catch (error) {
        console.error('Erro na requisição à API:', error);
        throw error;
    }
}
