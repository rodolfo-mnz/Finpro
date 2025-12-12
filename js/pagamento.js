// Payment page handling

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadResumo();
    setupPaymentForm();
    setupFormatters();
});

function checkAuth() {
    const loggedIn = sessionStorage.getItem('loggedIn');
    const selectedPlano = sessionStorage.getItem('selectedPlano');
    
    if (!loggedIn || loggedIn !== 'true' || !selectedPlano) {
        // Redirect to planos if not authenticated or no plan selected
        window.location.href = 'planos.html';
        return;
    }
}

function loadResumo() {
    const plano = sessionStorage.getItem('selectedPlano');
    const valor = parseFloat(sessionStorage.getItem('selectedValor') || '0');
    
    const planoNomes = {
        'basico': 'Plano Básico',
        'premium': 'Plano Premium',
        'vip': 'Plano VIP'
    };
    
    document.getElementById('resumo-plano').textContent = planoNomes[plano] || plano;
    document.getElementById('resumo-valor').textContent = `R$ ${valor.toFixed(2).replace('.', ',')}`;
    document.getElementById('resumo-total').textContent = `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function setupFormatters() {
    // Format card number
    const numeroCartao = document.getElementById('numero-cartao');
    if (numeroCartao) {
        numeroCartao.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = value;
        });
    }
    
    // Format validity date
    const validade = document.getElementById('validade');
    if (validade) {
        validade.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // Format CPF - usando a mesma lógica do cadastro
    const cpfTitular = document.getElementById('cpf-titular');
    if (cpfTitular) {
        cpfTitular.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            // Limita a 11 dígitos
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            // Formata conforme o tamanho
            if (value.length > 9) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            } else if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
            }
            
            e.target.value = value;
        });
    }
}

function setupPaymentForm() {
    const form = document.getElementById('pagamento-form');
    
    if (form) {
        form.addEventListener('submit', handlePayment);
    }
}

async function handlePayment(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    
    // Show loading
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    
    // Collect payment data
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const plano = sessionStorage.getItem('selectedPlano');
    const valor = sessionStorage.getItem('selectedValor');
    
    const paymentData = {
        type: 'payment',
        user_email: user.email,
        user_nome: user.nome,
        plano: plano,
        valor: valor,
        nome_cartao: document.getElementById('nome-cartao').value,
        numero_cartao: document.getElementById('numero-cartao').value.replace(/\s/g, ''),
        validade: document.getElementById('validade').value,
        cvv: document.getElementById('cvv').value,
        cpf_titular: document.getElementById('cpf-titular').value.replace(/\D/g, ''),
        parcelas: document.getElementById('parcelas').value,
        timestamp: new Date().toISOString()
    };
    
    try {
        // Send payment data to server
        const response = await apiRequest('/api/pagamento', {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Show success message and redirect
            alert('Pagamento processado com sucesso! Redirecionando...');
            
            // Clear session
            sessionStorage.removeItem('selectedPlano');
            sessionStorage.removeItem('selectedValor');
            
            // Redirect to success page or home
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            alert('Erro ao processar pagamento. Tente novamente.');
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao processar pagamento:', error);
        alert('Erro de conexão. Verifique se o servidor está rodando.');
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

