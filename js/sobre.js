// Sobre page with React and dynamic charts - Robust Version

const { useState, useEffect, useRef } = React;

// Mission Card Component
function MissionCard({ icon, title, description, values }) {
    return (
        <div className="mission-card">
            <div className="mission-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
            {values && (
                <ul className="mission-values">
                    {values.map((value, index) => (
                        <li key={index}>{value}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// Feature Card Component
function FeatureCard({ icon, title, description, highlight }) {
    return (
        <div className="feature-card-sobre">
            <div className="feature-icon-sobre">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
            {highlight && (
                <div className="feature-highlight">{highlight}</div>
            )}
        </div>
    );
}

// Timeline Item Component
function TimelineItem({ year, title, description, position }) {
    return (
        <div className={`timeline-item ${position}`}>
            <div className="timeline-year">{year}</div>
            <div className="timeline-content">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
}

// Team Stat Component
function TeamStat({ icon, number, label, description }) {
    return (
        <div className="team-stat-card">
            <div className="team-stat-icon">{icon}</div>
            <div className="team-stat-number">{number}</div>
            <div className="team-stat-label">{label}</div>
            <p className="team-stat-description">{description}</p>
        </div>
    );
}

// Security Badge Component
function SecurityBadge({ icon, title, description }) {
    return (
        <div className="security-badge-item">
            <div className="security-badge-icon">{icon}</div>
            <h4>{title}</h4>
            <p>{description}</p>
        </div>
    );
}

// Mission Grid Component
function MissionGrid() {
    const missionData = [
        {
            icon: '🎯',
            title: 'Nossa Missão',
            description: 'Empoderar pessoas para conquistar liberdade financeira através de tecnologia, educação e soluções inovadoras. Simplificamos o acesso a investimentos e planejamento financeiro, tornando o universo das finanças acessível a todos.',
            values: [
                'Transparência e ética em todas as operações',
                'Segurança máxima dos dados e privacidade',
                'Inovação contínua e foco no usuário',
                'Educação financeira acessível'
            ]
        },
        {
            icon: '💡',
            title: 'Nossa Visão',
            description: 'Ser a plataforma de investimentos mais confiável e inovadora do Brasil, democratizando o acesso a produtos financeiros de alta qualidade e transformando a vida financeira de milhões de brasileiros.',
            values: null
        },
        {
            icon: '🤝',
            title: 'Nossos Valores',
            description: 'Acreditamos que a tecnologia deve servir às pessoas, não o contrário. Por isso, colocamos nossos clientes no centro de todas as decisões e construímos soluções que realmente fazem diferença.',
            values: [
                'Integridade acima de tudo',
                'Inovação com propósito',
                'Transparência total',
                'Compromisso com resultados'
            ]
        }
    ];

    return (
        <>
            {missionData.map((mission, index) => (
                <MissionCard key={index} {...mission} />
            ))}
        </>
    );
}

// Features Grid Component
function FeaturesGrid() {
    const features = [
        {
            icon: '👥',
            title: 'Equipe Multidisciplinar',
            description: 'Especialistas em tecnologia e finanças trabalhando juntos para oferecer a melhor experiência.',
            highlight: '50+ profissionais'
        },
        {
            icon: '🔗',
            title: 'Integração Bancária',
            description: 'Plataforma conectada aos principais bancos do Brasil para uma visão completa da sua situação financeira.',
            highlight: '15+ bancos integrados'
        },
        {
            icon: '📊',
            title: 'Ferramentas Avançadas',
            description: 'Análise, simulação e acompanhamento de investimentos com tecnologia de ponta e inteligência artificial.',
            highlight: 'IA de última geração'
        },
        {
            icon: '💬',
            title: 'Suporte Dedicado',
            description: 'Atendimento humanizado e suporte 24/7 para garantir que você tenha a melhor experiência possível.',
            highlight: '24/7 disponível'
        },
        {
            icon: '📈',
            title: 'Resultados Comprovados',
            description: 'Milhares de clientes já transformaram suas finanças e alcançaram seus objetivos com a FinançasPro.',
            highlight: '98.5% satisfação'
        },
        {
            icon: '🛡️',
            title: 'Segurança Máxima',
            description: 'Criptografia de ponta a ponta, autenticação de dois fatores e conformidade com todas as regulamentações.',
            highlight: '100% seguro'
        }
    ];

    return (
        <>
            {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
            ))}
        </>
    );
}

// Timeline Component
function Timeline() {
    const timelineData = [
        { year: '2020', title: 'Fundação', description: 'A FinançasPro nasce com a missão de democratizar o acesso a investimentos de qualidade.', position: 'left' },
        { year: '2021', title: 'Primeiros 1.000 Clientes', description: 'Atingimos nossa primeira grande marca e validamos nosso modelo de negócio.', position: 'right' },
        { year: '2022', title: 'Expansão de Serviços', description: 'Lançamos calculadoras avançadas e integração com principais bancos brasileiros.', position: 'left' },
        { year: '2023', title: 'Reconhecimento', description: 'Somos reconhecidos como uma das fintechs mais inovadoras do Brasil pelo mercado.', position: 'right' },
        { year: '2024', title: 'Futuro', description: 'Continuamos inovando e expandindo para transformar a vida financeira de milhões de brasileiros.', position: 'left' }
    ];

    return (
        <div className="timeline-wrapper">
            {timelineData.map((item, index) => (
                <TimelineItem key={index} {...item} />
            ))}
        </div>
    );
}

// Team Stats Component
function TeamStats() {
    const stats = [
        {
            icon: '👨‍💼',
            number: '50+',
            label: 'Profissionais',
            description: 'Equipe multidisciplinar de especialistas'
        },
        {
            icon: '🎓',
            number: '85%',
            label: 'Com Pós-Graduação',
            description: 'Equipe altamente qualificada'
        },
        {
            icon: '🌍',
            number: '12',
            label: 'Países',
            description: 'Experiência internacional'
        },
        {
            icon: '⭐',
            number: '4.9/5',
            label: 'Avaliação',
            description: 'Satisfação dos clientes'
        }
    ];

    return (
        <>
            {stats.map((stat, index) => (
                <TeamStat key={index} {...stat} />
            ))}
        </>
    );
}

// Security Badges Component
function SecurityBadges() {
    const badges = [
        {
            icon: '🔒',
            title: 'Proteção de Dados',
            description: 'Criptografia AES-256 e armazenamento seguro em servidores certificados'
        },
        {
            icon: '🛡️',
            title: 'SSL 256-bit',
            description: 'Conexões seguras e protegidas em todas as transações'
        },
        {
            icon: '✅',
            title: 'Regulado pelo BACEN',
            description: 'Totalmente em conformidade com as regulamentações do Banco Central'
        },
        {
            icon: '🔐',
            title: 'Autenticação 2FA',
            description: 'Proteção adicional com autenticação de dois fatores'
        },
        {
            icon: '📋',
            title: 'Auditorias Regulares',
            description: 'Infraestrutura auditada regularmente por empresas especializadas'
        },
        {
            icon: '⚖️',
            title: 'LGPD Compliant',
            description: 'Total conformidade com a Lei Geral de Proteção de Dados'
        }
    ];

    return (
        <>
            {badges.map((badge, index) => (
                <SecurityBadge key={index} {...badge} />
            ))}
        </>
    );
}

// Initialize charts and React components
(function() {
    'use strict';
    
    let chartsInitialized = false;
    let reactComponentsInitialized = false;
    
    function waitForDependencies(callback, maxAttempts = 50) {
        let attempts = 0;
        
        function check() {
            attempts++;
            if (typeof Chart !== 'undefined' && 
                typeof React !== 'undefined' && 
                typeof ReactDOM !== 'undefined') {
                callback();
            } else if (attempts < maxAttempts) {
                setTimeout(check, 100);
            } else {
                console.error('Dependencies not loaded after maximum attempts');
            }
        }
        
        check();
    }
    
    function initCharts() {
        if (chartsInitialized) return;
        
        // Growth Chart
        const growthCtx = document.getElementById('growthChart');
        if (growthCtx && typeof Chart !== 'undefined') {
            try {
                new Chart(growthCtx, {
                    type: 'line',
                    data: {
                        labels: ['2020', '2021', '2022', '2023', '2024'],
                        datasets: [{
                            label: 'Crescimento de Clientes',
                            data: [0, 1000, 5000, 10000, 12847],
                            borderColor: '#ffde59',
                            backgroundColor: 'rgba(255, 222, 89, 0.1)',
                            borderWidth: 3,
                            tension: 0.4,
                            fill: true,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                            pointBackgroundColor: '#ffde59',
                            pointBorderColor: '#000'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: { duration: 1500 },
                        plugins: { 
                            legend: { 
                                display: true,
                                labels: {
                                    color: '#ffde59',
                                    font: { size: 12 }
                                }
                            },
                            tooltip: {
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                titleColor: '#ffde59',
                                bodyColor: '#ffde59',
                                borderColor: '#ffde59',
                                borderWidth: 1
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: { color: 'rgba(255, 222, 89, 0.1)', drawBorder: false },
                                ticks: { 
                                    color: '#ffde59',
                                    font: { size: 12 },
                                    callback: function(value) {
                                        return value.toLocaleString('pt-BR');
                                    }
                                }
                            },
                            x: {
                                grid: { display: false, drawBorder: false },
                                ticks: { color: '#ffde59', font: { size: 12 } }
                            }
                        }
                    }
                });
            } catch (e) {
                console.error('Error initializing growth chart:', e);
            }
        }

        // Security Chart
        const securityCtx = document.getElementById('securityChart');
        if (securityCtx && typeof Chart !== 'undefined') {
            try {
                new Chart(securityCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Criptografia', 'Autenticação', 'Monitoramento', 'Backup'],
                        datasets: [{
                            data: [35, 25, 25, 15],
                            backgroundColor: [
                                '#ffde59',
                                '#d4b84a',
                                '#b3a369',
                                '#8a7a4a'
                            ],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: { duration: 1500 },
                        plugins: {
                            legend: {
                                display: true,
                                position: 'bottom',
                                labels: {
                                    color: '#ffde59',
                                    font: { size: 11 },
                                    padding: 15
                                }
                            },
                            tooltip: {
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                titleColor: '#ffde59',
                                bodyColor: '#ffde59',
                                borderColor: '#ffde59',
                                borderWidth: 1
                            }
                        }
                    }
                });
            } catch (e) {
                console.error('Error initializing security chart:', e);
            }
        }
        
        chartsInitialized = true;
    }
    
    function initReactComponents() {
        if (reactComponentsInitialized) return;
        if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') return;
        
        // Mission Grid
        const missionGrid = document.getElementById('mission-grid');
        if (missionGrid) {
            const missionRoot = ReactDOM.createRoot(missionGrid);
            missionRoot.render(<MissionGrid />);
        }

        // Features Grid
        const featuresSobre = document.getElementById('features-sobre');
        if (featuresSobre) {
            const featuresRoot = ReactDOM.createRoot(featuresSobre);
            featuresRoot.render(<FeaturesGrid />);
        }

        // Timeline
        const timelineContainer = document.getElementById('timeline-container');
        if (timelineContainer) {
            const timelineRoot = ReactDOM.createRoot(timelineContainer);
            timelineRoot.render(<Timeline />);
        }

        // Team Stats
        const teamStats = document.getElementById('team-stats');
        if (teamStats) {
            const teamRoot = ReactDOM.createRoot(teamStats);
            teamRoot.render(<TeamStats />);
        }

        // Security Badges
        const securityBadges = document.getElementById('security-badges');
        if (securityBadges) {
            const badgesRoot = ReactDOM.createRoot(securityBadges);
            badgesRoot.render(<SecurityBadges />);
        }
        
        reactComponentsInitialized = true;
    }
    
    function animateStats() {
        const animateValue = (element, start, end, duration) => {
            if (!element) return;
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const value = Math.floor(progress * (end - start) + start);
                element.textContent = value.toLocaleString('pt-BR');
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        };

        const stats = document.querySelectorAll('.stat-value-sobre');
        stats.forEach(stat => {
            const text = stat.textContent;
            const number = parseInt(text.replace(/[^\d]/g, ''));
            if (number && number > 0) {
                animateValue(stat, 0, number, 2000);
            }
        });
    }
    
    // Main initialization
    function init() {
        waitForDependencies(() => {
            // Initialize static charts first
            setTimeout(() => {
                initCharts();
            }, 100);
            
            // Initialize React components
            setTimeout(() => {
                initReactComponents();
            }, 200);
            
            // Animate stats
            setTimeout(() => {
                animateStats();
            }, 500);
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

