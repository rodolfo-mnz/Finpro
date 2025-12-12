// Login handling

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Setup password visibility toggle
    setupPasswordToggle();
});

function setupPasswordToggle() {
    // Get all toggle password buttons
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            
            if (passwordInput) {
                // Toggle password visibility
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    this.classList.add('active');
                    this.setAttribute('aria-label', 'Ocultar senha');
                } else {
                    passwordInput.type = 'password';
                    this.classList.remove('active');
                    this.setAttribute('aria-label', 'Mostrar senha');
                }
            }
        });
    });
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Entrando...';
    errorMessage.style.display = 'none';
    
    try {
        const response = await apiRequest('/api/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Usa o authManager para fazer login
            if (typeof authManager !== 'undefined') {
                authManager.login(data.user);
            } else {
                // Fallback se authManager não estiver disponível
                sessionStorage.setItem('user', JSON.stringify(data.user));
                sessionStorage.setItem('loggedIn', 'true');
            }
            
            // Redireciona para a página inicial (usuário pode navegar livremente)
            window.location.href = 'index.html';
        } else {
            // Show error
            errorText.textContent = data.message || 'Erro ao fazer login';
            errorMessage.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Entrar';
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        errorText.textContent = 'Erro de conexão. Verifique se o servidor está rodando.';
        errorMessage.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Entrar';
    }
}

