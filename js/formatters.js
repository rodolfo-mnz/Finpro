// Input formatting utilities

class InputFormatter {
    static formatCPF(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        
        if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (value.length > 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        } else if (value.length > 3) {
            value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        }
        
        input.value = value;
        return value.replace(/\D/g, '');
    }
    
    static formatPhone(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        
        if (value.length > 10) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length > 6) {
            value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        } else if (value.length > 0) {
            value = value.replace(/(\d{0,2})/, '($1');
        }
        
        input.value = value;
        return value.replace(/\D/g, '');
    }
    
    static formatAgency(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 6) {
            value = value.substring(0, 6);
        }
        
        // Add dash for agency with digit
        if (value.length > 4) {
            value = value.replace(/(\d{4})(\d{1,2})/, '$1-$2');
        }
        
        input.value = value;
        return value.replace(/\D/g, '');
    }
    
    static formatAccount(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.substring(0, 10);
        }
        
        // Add dash for account with digit
        if (value.length > 6) {
            value = value.replace(/(\d{6})(\d{1,4})/, '$1-$2');
        }
        
        input.value = value;
        return value.replace(/\D/g, '');
    }
}

// Initialize formatters when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const cpfInput = document.getElementById('cpf');
    const phoneInput = document.getElementById('telefone');
    const agencyInput = document.getElementById('agencia');
    const accountInput = document.getElementById('conta');
    
    if (cpfInput) {
        cpfInput.addEventListener('input', function() {
            InputFormatter.formatCPF(this);
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            InputFormatter.formatPhone(this);
        });
    }
    
    if (agencyInput) {
        agencyInput.addEventListener('input', function() {
            InputFormatter.formatAgency(this);
        });
    }
    
    if (accountInput) {
        accountInput.addEventListener('input', function() {
            InputFormatter.formatAccount(this);
        });
    }
});