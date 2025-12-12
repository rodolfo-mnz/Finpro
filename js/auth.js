// Sistema de Autenticação Global
// Gerencia o estado de login em todas as páginas

class AuthManager {
    constructor() {
        this.user = null;
        this.isLoggedIn = false;
        this.init();
    }

    init() {
        // Verifica se há usuário logado
        this.checkAuth();
        // Atualiza a UI
        this.updateUI();
    }

    checkAuth() {
        const loggedIn = sessionStorage.getItem('loggedIn');
        const userStr = sessionStorage.getItem('user');
        
        if (loggedIn === 'true' && userStr) {
            try {
                this.user = JSON.parse(userStr);
                this.isLoggedIn = true;
            } catch (e) {
                console.error('Erro ao parsear dados do usuário:', e);
                this.logout();
            }
        } else {
            this.isLoggedIn = false;
            this.user = null;
        }
    }

    login(userData) {
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('loggedIn', 'true');
        this.user = userData;
        this.isLoggedIn = true;
        this.updateUI();
    }

    logout() {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('selectedPlano');
        sessionStorage.removeItem('selectedValor');
        this.user = null;
        this.isLoggedIn = false;
        this.updateUI();
    }

    getUser() {
        return this.user;
    }

    isAuthenticated() {
        return this.isLoggedIn;
    }

    updateUI() {
        // Atualiza o header em todas as páginas
        this.updateHeader();
    }

    updateHeader() {
        const authButtons = document.querySelector('.auth-buttons');
        if (!authButtons) return;

        if (this.isLoggedIn && this.user) {
            // Usuário logado - mostra menu do usuário
            authButtons.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="display: flex; align-items: center; gap: 8px; color: var(--accent);">
                        <span style="font-size: 1.2rem;">👤</span>
                        <span style="font-weight: 600;">${this.user.nome || this.user.email}</span>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <a href="planos.html" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Planos</a>
                        <button class="btn btn-primary" onclick="authManager.logoutAndRedirect()" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Sair</button>
                    </div>
                </div>
            `;
        } else {
            // Usuário não logado - mostra botões de login/cadastro
            authButtons.innerHTML = `
                <a href="login.html" class="btn btn-outline">Entrar</a>
                <button class="btn btn-primary" id="register-btn">Cadastrar</button>
            `;
            
            // Reativa o botão de cadastro se existir
            const registerBtn = document.getElementById('register-btn');
            if (registerBtn) {
                registerBtn.addEventListener('click', function() {
                    window.location.href = 'index.html#registration';
                });
            }
        }
    }

    logoutAndRedirect() {
        if (confirm('Deseja realmente sair?')) {
            this.logout();
            window.location.href = 'index.html';
        }
    }

    requireAuth(redirectTo = 'login.html') {
        if (!this.isAuthenticated()) {
            window.location.href = redirectTo;
            return false;
        }
        return true;
    }
}

// Instância global
const authManager = new AuthManager();

// Atualiza quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    authManager.updateUI();
});

// Atualiza quando há mudanças no storage (outras abas)
window.addEventListener('storage', function(e) {
    if (e.key === 'loggedIn' || e.key === 'user') {
        authManager.checkAuth();
        authManager.updateUI();
    }
});
