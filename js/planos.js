// Planos page handling

document.addEventListener('DOMContentLoaded', function() {
    // Aguarda o authManager carregar
    setTimeout(() => {
        checkAuth();
        setupPlanos();
    }, 100);
});

function checkAuth() {
    // Usa o authManager se disponível, senão usa fallback
    if (typeof authManager !== 'undefined' && authManager.isAuthenticated()) {
        return true;
    }
    
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn || loggedIn !== 'true') {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function setupPlanos() {
    const planoButtons = document.querySelectorAll('.selecionar-plano');
    
    planoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planoCard = this.closest('.plano-card');
            const plano = planoCard.getAttribute('data-plano');
            const valor = planoCard.getAttribute('data-valor');
            
            // Store selected plan in sessionStorage
            sessionStorage.setItem('selectedPlano', plano);
            sessionStorage.setItem('selectedValor', valor);
            
            // Redirect to payment page
            window.location.href = 'pagamento.html';
        });
    });
}

// Logout é gerenciado pelo authManager agora

