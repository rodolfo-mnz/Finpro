// Investimentos page with React and dynamic charts - Robust Version

const { useState, useEffect, useRef } = React;

// Portfolio Card Component
function PortfolioCard({ title, value, change, changePercent, chartId }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !chartRef.current) return;

        const initChart = () => {
            if (typeof Chart === 'undefined') {
                setTimeout(initChart, 100);
                return;
            }

            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            if (!ctx) {
                setTimeout(initChart, 100);
                return;
            }

            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({ length: 30 }, (_, i) => `Dia ${i + 1}`),
                    datasets: [{
                        label: title,
                        data: Array.from({ length: 30 }, () => Math.random() * 1000 + 5000),
                        borderColor: '#ffde59',
                        backgroundColor: 'rgba(255, 222, 89, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 1000
                    },
                    plugins: {
                        legend: { display: false },
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
                            beginAtZero: false,
                            grid: { 
                                color: 'rgba(255, 222, 89, 0.1)',
                                drawBorder: false
                            },
                            ticks: { 
                                color: '#ffde59', 
                                font: { size: 11 },
                                callback: function(value) {
                                    return 'R$ ' + (value / 1000).toFixed(0) + 'k';
                                }
                            }
                        },
                        x: {
                            grid: { display: false, drawBorder: false },
                            ticks: { 
                                color: '#ffde59', 
                                maxTicksLimit: 5, 
                                font: { size: 11 }
                            }
                        }
                    }
                }
            });
        };

        initChart();

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [isMounted, title]);

    return (
        <div className="portfolio-card">
            <div className="portfolio-header">
                <h3>{title}</h3>
                <span className={`change ${change >= 0 ? 'positive' : 'negative'}`}>
                    {change >= 0 ? '↑' : '↓'} {Math.abs(changePercent)}%
                </span>
            </div>
            <div className="portfolio-value">R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div className="portfolio-chart">
                <canvas ref={chartRef} style={{ width: '100%', height: '100%' }}></canvas>
            </div>
        </div>
    );
}

// Investment Card Component
function InvestmentCard({ name, type, returnRate, minValue, risk, description }) {
    return (
        <div className="investment-card">
            <div className="investment-header">
                <div>
                    <h3>{name}</h3>
                    <span className="investment-type">{type}</span>
                </div>
                <div className="return-badge">
                    <span className="return-value">+{returnRate}%</span>
                    <span className="return-label">a.a.</span>
                </div>
            </div>
            <p className="investment-description">{description}</p>
            <div className="investment-details">
                <div className="detail-item">
                    <span className="detail-label">Investimento Mínimo:</span>
                    <span className="detail-value">R$ {minValue.toLocaleString('pt-BR')}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Risco:</span>
                    <span className={`risk-badge risk-${risk.toLowerCase()}`}>{risk}</span>
                </div>
            </div>
            <button className="btn btn-primary btn-block">Investir Agora</button>
        </div>
    );
}

// Market Ticker Component
function MarketTicker() {
    const [tickers, setTickers] = useState([
        { symbol: 'PETR4', price: 28.45, change: 1.23 },
        { symbol: 'VALE3', price: 67.89, change: -0.45 },
        { symbol: 'ITUB4', price: 23.12, change: 0.89 },
        { symbol: 'BBDC4', price: 15.67, change: 2.34 },
        { symbol: 'ABEV3', price: 12.34, change: -1.12 },
        { symbol: 'WEGE3', price: 45.67, change: 0.56 }
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTickers(prev => prev.map(ticker => ({
                ...ticker,
                price: Math.max(0.01, ticker.price + (Math.random() - 0.5) * 0.5),
                change: (Math.random() - 0.5) * 3
            })));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="ticker-container">
            {tickers.map((ticker, index) => (
                <div key={index} className="ticker-item">
                    <span className="ticker-symbol">{ticker.symbol}</span>
                    <span className="ticker-price">R$ {ticker.price.toFixed(2)}</span>
                    <span className={`ticker-change ${ticker.change >= 0 ? 'positive' : 'negative'}`}>
                        {ticker.change >= 0 ? '+' : ''}{ticker.change.toFixed(2)}%
                    </span>
                </div>
            ))}
        </div>
    );
}

// Portfolio Component
function PortfolioGrid() {
    const portfolioData = [
        { title: 'Ações Brasileiras', value: 125430.50, change: 1250.30, changePercent: 1.01, chartId: 'chart1' },
        { title: 'FIIs', value: 87560.20, change: 890.15, changePercent: 1.03, chartId: 'chart2' },
        { title: 'Criptomoedas', value: 45670.80, change: -320.50, changePercent: -0.70, chartId: 'chart3' },
        { title: 'Renda Fixa', value: 234100.00, change: 450.00, changePercent: 0.19, chartId: 'chart4' }
    ];

    return (
        <>
            {portfolioData.map((item, index) => (
                <PortfolioCard key={`portfolio-${index}`} {...item} />
            ))}
        </>
    );
}

// Investments Component
function InvestmentsGrid({ activeTab = 'acoes' }) {
    const investments = {
        acoes: [
            { name: 'PETR4 - Petrobras', type: 'Ação', returnRate: 24.5, minValue: 100, risk: 'Médio', description: 'Maior empresa de petróleo do Brasil com dividendos consistentes' },
            { name: 'VALE3 - Vale', type: 'Ação', returnRate: 18.7, minValue: 100, risk: 'Médio', description: 'Líder mundial em mineração de ferro e níquel' },
            { name: 'ITUB4 - Itaú', type: 'Ação', returnRate: 16.3, minValue: 100, risk: 'Baixo', description: 'Maior banco privado do Brasil com sólida base de clientes' },
            { name: 'ABEV3 - Ambev', type: 'Ação', returnRate: 12.8, minValue: 100, risk: 'Baixo', description: 'Maior cervejaria da América Latina com presença global' }
        ],
        fiis: [
            { name: 'HGLG11 - CSHG Logística', type: 'FII', returnRate: 14.2, minValue: 50, risk: 'Baixo', description: 'Fundos imobiliários focados em galpões logísticos' },
            { name: 'XPML11 - XP Malls', type: 'FII', returnRate: 11.5, minValue: 50, risk: 'Médio', description: 'Diversificação em shoppings centers premium' },
            { name: 'VISC11 - Vinci Shopping Centers', type: 'FII', returnRate: 13.8, minValue: 50, risk: 'Médio', description: 'Portfólio de shoppings em localizações estratégicas' }
        ],
        cripto: [
            { name: 'Bitcoin (BTC)', type: 'Criptomoeda', returnRate: 45.2, minValue: 100, risk: 'Alto', description: 'A maior e mais estabelecida criptomoeda do mundo' },
            { name: 'Ethereum (ETH)', type: 'Criptomoeda', returnRate: 38.7, minValue: 100, risk: 'Alto', description: 'Plataforma blockchain líder para contratos inteligentes' },
            { name: 'Cardano (ADA)', type: 'Criptomoeda', returnRate: 52.3, minValue: 100, risk: 'Alto', description: 'Blockchain de terceira geração com foco em sustentabilidade' }
        ],
        'renda-fixa': [
            { name: 'CDB Premium 120% CDI', type: 'Renda Fixa', returnRate: 14.4, minValue: 1000, risk: 'Baixo', description: 'CDB com rentabilidade acima do CDI, garantido pelo FGC' },
            { name: 'LCI 95% CDI', type: 'Renda Fixa', returnRate: 11.4, minValue: 5000, risk: 'Baixo', description: 'Letra de Crédito Imobiliário isenta de IR' },
            { name: 'Tesouro IPCA+ 2029', type: 'Renda Fixa', returnRate: 6.18, minValue: 30, risk: 'Baixo', description: 'Título público indexado à inflação com proteção real' }
        ]
    };

    return (
        <div className="investments-grid">
            {(investments[activeTab] || []).map((inv, index) => (
                <InvestmentCard key={`inv-${activeTab}-${index}`} {...inv} />
            ))}
        </div>
    );
}

// Initialize charts and React components - Robust version
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
    
    function initStaticCharts() {
        if (chartsInitialized) return;
        
        // Hero Chart
        const heroCtx = document.getElementById('heroChart');
        if (heroCtx && typeof Chart !== 'undefined') {
            try {
                new Chart(heroCtx, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                        datasets: [{
                            label: 'Crescimento do Portfólio',
                            data: [100000, 105000, 112000, 118000, 125000, 132000, 140000, 148000, 157000, 165000, 175000, 185000],
                            borderColor: '#ffde59',
                            backgroundColor: 'rgba(255, 222, 89, 0.1)',
                            borderWidth: 3,
                            tension: 0.4,
                            fill: true,
                            pointRadius: 0,
                            pointHoverRadius: 5
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: { duration: 1500 },
                        plugins: { 
                            legend: { display: false },
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
                                beginAtZero: false,
                                grid: { color: 'rgba(255, 222, 89, 0.1)', drawBorder: false },
                                ticks: { 
                                    color: '#ffde59', 
                                    callback: (value) => 'R$ ' + (value / 1000).toFixed(0) + 'k',
                                    font: { size: 12 }
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
                console.error('Error initializing hero chart:', e);
            }
        }

        // Trend Charts
        ['trendChart1', 'trendChart2', 'trendChart3'].forEach((id) => {
            const ctx = document.getElementById(id);
            if (ctx && typeof Chart !== 'undefined') {
                try {
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
                            datasets: [{
                                label: 'Volume',
                                data: Array.from({ length: 5 }, () => Math.random() * 100),
                                backgroundColor: '#ffde59',
                                borderRadius: 4,
                                borderSkipped: false
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            animation: { duration: 1000 },
                            plugins: { 
                                legend: { display: false },
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
                                    ticks: { color: '#ffde59', font: { size: 11 } }
                                },
                                x: {
                                    grid: { display: false, drawBorder: false },
                                    ticks: { color: '#ffde59', font: { size: 11 } }
                                }
                            }
                        }
                    });
                } catch (e) {
                    console.error(`Error initializing trend chart ${id}:`, e);
                }
            }
        });
        
        chartsInitialized = true;
    }
    
    function initReactComponents() {
        if (reactComponentsInitialized) return;
        if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') return;
        
        let currentTab = 'acoes';
        
        // Tab buttons
        const tabButtons = document.querySelectorAll('.tab-btn');
        const investmentsContainer = document.getElementById('investments-container');
        
        if (investmentsContainer) {
            const investmentsRoot = ReactDOM.createRoot(investmentsContainer);
            
            tabButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    tabButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentTab = this.getAttribute('data-tab');
                    investmentsRoot.render(<InvestmentsGrid activeTab={currentTab} />);
                });
            });
            
            investmentsRoot.render(<InvestmentsGrid activeTab={currentTab} />);
        }

        // Portfolio grid
        const portfolioGrid = document.getElementById('portfolio-grid');
        if (portfolioGrid) {
            const portfolioRoot = ReactDOM.createRoot(portfolioGrid);
            portfolioRoot.render(<PortfolioGrid />);
        }

        // Market ticker
        const marketTicker = document.getElementById('market-ticker');
        if (marketTicker) {
            const tickerRoot = ReactDOM.createRoot(marketTicker);
            tickerRoot.render(<MarketTicker />);
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

        const totalEl = document.getElementById('total-invested');
        const usersEl = document.getElementById('active-users');
        if (totalEl) {
            const text = totalEl.textContent;
            const number = parseInt(text.replace(/[^\d]/g, ''));
            if (number) animateValue(totalEl, 0, number, 2000);
        }
        if (usersEl) {
            const text = usersEl.textContent;
            const number = parseInt(text.replace(/[^\d]/g, ''));
            if (number) animateValue(usersEl, 0, number, 2000);
        }
    }
    
    // Main initialization
    function init() {
        waitForDependencies(() => {
            // Initialize static charts first
            setTimeout(() => {
                initStaticCharts();
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
