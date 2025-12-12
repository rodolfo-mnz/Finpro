// Calculadoras page with React - Robust Version

const { useState, useEffect, useRef } = React;

// Juros Compostos Calculator
function JurosCompostosCalc() {
    const [capital, setCapital] = useState(10000);
    const [taxa, setTaxa] = useState(1);
    const [tempo, setTempo] = useState(12);
    const [resultado, setResultado] = useState(null);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const calcular = () => {
        const taxaDecimal = taxa / 100;
        const montante = capital * Math.pow(1 + taxaDecimal, tempo);
        const juros = montante - capital;
        
        setResultado({
            capital: capital,
            juros: juros,
            montante: montante,
            rendimento: (juros / capital) * 100
        });

        // Update chart if it exists
        if (chartInstance.current && chartRef.current) {
            const labels = [];
            const valores = [];
            for (let i = 0; i <= tempo; i++) {
                labels.push(`Mês ${i}`);
                valores.push(capital * Math.pow(1 + taxaDecimal, i));
            }
            chartInstance.current.data.labels = labels;
            chartInstance.current.data.datasets[0].data = valores;
            chartInstance.current.update('active');
        }
    };

    useEffect(() => {
        calcular();
    }, [capital, taxa, tempo]);

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

            const labels = [];
            const valores = [];
            const taxaDecimal = taxa / 100;
            for (let i = 0; i <= tempo; i++) {
                labels.push(`Mês ${i}`);
                valores.push(capital * Math.pow(1 + taxaDecimal, i));
            }

            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Crescimento do Investimento',
                        data: valores,
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
                                callback: (value) => 'R$ ' + (value / 1000).toFixed(0) + 'k'
                            }
                        },
                        x: {
                            grid: { display: false, drawBorder: false },
                            ticks: { 
                                color: '#ffde59', 
                                maxTicksLimit: 12, 
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
    }, [isMounted, capital, taxa, tempo]);

    return (
        <div className="calculator-card">
            <h2>Calculadora de Juros Compostos</h2>
            <p className="calc-description">Calcule o crescimento do seu investimento com juros compostos</p>
            
            <div className="calc-inputs">
                <div className="input-group">
                    <label>Capital Inicial (R$)</label>
                    <input 
                        type="number" 
                        value={capital} 
                        onChange={(e) => setCapital(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="100"
                    />
                </div>
                <div className="input-group">
                    <label>Taxa de Juros Mensal (%)</label>
                    <input 
                        type="number" 
                        value={taxa} 
                        onChange={(e) => setTaxa(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.1"
                    />
                </div>
                <div className="input-group">
                    <label>Período (meses)</label>
                    <input 
                        type="number" 
                        value={tempo} 
                        onChange={(e) => setTempo(parseInt(e.target.value) || 0)}
                        min="1"
                        step="1"
                    />
                </div>
            </div>

            {resultado && (
                <div className="calc-results">
                    <div className="result-item">
                        <span className="result-label">Capital Inicial:</span>
                        <span className="result-value">R$ {resultado.capital.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">Juros Acumulados:</span>
                        <span className="result-value positive">R$ {resultado.juros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="result-item highlight">
                        <span className="result-label">Montante Final:</span>
                        <span className="result-value">R$ {resultado.montante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">Rendimento Total:</span>
                        <span className="result-value positive">+{resultado.rendimento.toFixed(2)}%</span>
                    </div>
                </div>
            )}

            <div className="calc-chart">
                <canvas ref={chartRef} style={{ width: '100%', height: '100%' }}></canvas>
            </div>
        </div>
    );
}

// Investment Calculator
function InvestimentoCalc() {
    const [valorMensal, setValorMensal] = useState(500);
    const [taxaAnual, setTaxaAnual] = useState(12);
    const [anos, setAnos] = useState(10);
    const [resultado, setResultado] = useState(null);

    const calcular = () => {
        const taxaMensal = taxaAnual / 12 / 100;
        const meses = anos * 12;
        let montante = 0;

        for (let i = 0; i < meses; i++) {
            montante = (montante + valorMensal) * (1 + taxaMensal);
        }

        const totalInvestido = valorMensal * meses;
        const ganhos = montante - totalInvestido;

        setResultado({
            montante,
            totalInvestido,
            ganhos,
            rendimento: (ganhos / totalInvestido) * 100
        });
    };

    useEffect(() => {
        calcular();
    }, [valorMensal, taxaAnual, anos]);

    return (
        <div className="calculator-card">
            <h2>Calculadora de Investimento Mensal</h2>
            <p className="calc-description">Simule investimentos mensais e veja seu patrimônio crescer</p>
            
            <div className="calc-inputs">
                <div className="input-group">
                    <label>Valor Mensal (R$)</label>
                    <input 
                        type="number" 
                        value={valorMensal} 
                        onChange={(e) => setValorMensal(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="50"
                    />
                </div>
                <div className="input-group">
                    <label>Taxa de Juros Anual (%)</label>
                    <input 
                        type="number" 
                        value={taxaAnual} 
                        onChange={(e) => setTaxaAnual(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.5"
                    />
                </div>
                <div className="input-group">
                    <label>Período (anos)</label>
                    <input 
                        type="number" 
                        value={anos} 
                        onChange={(e) => setAnos(parseInt(e.target.value) || 0)}
                        min="1"
                        step="1"
                    />
                </div>
            </div>

            {resultado && (
                <div className="calc-results">
                    <div className="result-item">
                        <span className="result-label">Total Investido:</span>
                        <span className="result-value">R$ {resultado.totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">Ganhos com Juros:</span>
                        <span className="result-value positive">R$ {resultado.ganhos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="result-item highlight">
                        <span className="result-label">Patrimônio Final:</span>
                        <span className="result-value">R$ {resultado.montante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">Rendimento Total:</span>
                        <span className="result-value positive">+{resultado.rendimento.toFixed(2)}%</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// Empréstimo Calculator
function EmprestimoCalc() {
    const [valor, setValor] = useState(10000);
    const [taxa, setTaxa] = useState(2.5);
    const [parcelas, setParcelas] = useState(12);
    const [resultado, setResultado] = useState(null);

    const calcular = () => {
        const taxaDecimal = taxa / 100;
        const pmt = valor * (taxaDecimal * Math.pow(1 + taxaDecimal, parcelas)) / (Math.pow(1 + taxaDecimal, parcelas) - 1);
        const total = pmt * parcelas;
        const juros = total - valor;

        setResultado({
            valorParcela: pmt,
            totalPago: total,
            juros: juros,
            cet: ((Math.pow(1 + taxaDecimal, parcelas) - 1) * 100).toFixed(2)
        });
    };

    useEffect(() => {
        calcular();
    }, [valor, taxa, parcelas]);

    return (
        <div className="calculator-card">
            <h2>Calculadora de Empréstimo</h2>
            <p className="calc-description">Calcule parcelas, juros totais e CET do seu empréstimo</p>
            
            <div className="calc-inputs">
                <div className="input-group">
                    <label>Valor do Empréstimo (R$)</label>
                    <input 
                        type="number" 
                        value={valor} 
                        onChange={(e) => setValor(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="100"
                    />
                </div>
                <div className="input-group">
                    <label>Taxa de Juros Mensal (%)</label>
                    <input 
                        type="number" 
                        value={taxa} 
                        onChange={(e) => setTaxa(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.1"
                    />
                </div>
                <div className="input-group">
                    <label>Número de Parcelas</label>
                    <input 
                        type="number" 
                        value={parcelas} 
                        onChange={(e) => setParcelas(parseInt(e.target.value) || 0)}
                        min="1"
                        step="1"
                    />
                </div>
            </div>

            {resultado && (
                <div className="calc-results">
                    <div className="result-item highlight">
                        <span className="result-label">Valor da Parcela:</span>
                        <span className="result-value">R$ {resultado.valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">Total a Pagar:</span>
                        <span className="result-value">R$ {resultado.totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">Juros Totais:</span>
                        <span className="result-value negative">R$ {resultado.juros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">CET (Custo Efetivo Total):</span>
                        <span className="result-value">{resultado.cet}%</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// Financiamento Calculator
function FinanciamentoCalc() {
    const [valorImovel, setValorImovel] = useState(300000);
    const [entrada, setEntrada] = useState(60000);
    const [taxa, setTaxa] = useState(0.8);
    const [anos, setAnos] = useState(30);
    const [resultado, setResultado] = useState(null);

    const calcular = () => {
        const financiado = valorImovel - entrada;
        const meses = anos * 12;
        const taxaDecimal = taxa / 100;
        const pmt = financiado * (taxaDecimal * Math.pow(1 + taxaDecimal, meses)) / (Math.pow(1 + taxaDecimal, meses) - 1);
        const total = pmt * meses + entrada;

        setResultado({
            financiado,
            valorParcela: pmt,
            totalPago: total,
            juros: total - valorImovel
        });
    };

    useEffect(() => {
        calcular();
    }, [valorImovel, entrada, taxa, anos]);

    return (
        <div className="calculator-card">
            <h2>Calculadora de Financiamento Imobiliário</h2>
            <p className="calc-description">Simule o financiamento do seu imóvel</p>
            
            <div className="calc-inputs">
                <div className="input-group">
                    <label>Valor do Imóvel (R$)</label>
                    <input 
                        type="number" 
                        value={valorImovel} 
                        onChange={(e) => setValorImovel(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="1000"
                    />
                </div>
                <div className="input-group">
                    <label>Valor da Entrada (R$)</label>
                    <input 
                        type="number" 
                        value={entrada} 
                        onChange={(e) => setEntrada(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="1000"
                    />
                </div>
                <div className="input-group">
                    <label>Taxa de Juros Anual (%)</label>
                    <input 
                        type="number" 
                        value={taxa} 
                        onChange={(e) => setTaxa(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.1"
                    />
                </div>
                <div className="input-group">
                    <label>Prazo (anos)</label>
                    <input 
                        type="number" 
                        value={anos} 
                        onChange={(e) => setAnos(parseInt(e.target.value) || 0)}
                        min="1"
                        step="1"
                    />
                </div>
            </div>

            {resultado && (
                <div className="calc-results">
                    <div className="result-item">
                        <span className="result-label">Valor Financiado:</span>
                        <span className="result-value">R$ {resultado.financiado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="result-item highlight">
                        <span className="result-label">Valor da Parcela:</span>
                        <span className="result-value">R$ {resultado.valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">Total a Pagar:</span>
                        <span className="result-value">R$ {resultado.totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">Juros Totais:</span>
                        <span className="result-value negative">R$ {resultado.juros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// Aposentadoria Calculator
function AposentadoriaCalc() {
    const [idadeAtual, setIdadeAtual] = useState(30);
    const [idadeAposentadoria, setIdadeAposentadoria] = useState(65);
    const [aporteMensal, setAporteMensal] = useState(1000);
    const [taxa, setTaxa] = useState(8);
    const [resultado, setResultado] = useState(null);

    const calcular = () => {
        const anos = idadeAposentadoria - idadeAtual;
        const meses = anos * 12;
        const taxaMensal = taxa / 12 / 100;
        let montante = 0;

        for (let i = 0; i < meses; i++) {
            montante = (montante + aporteMensal) * (1 + taxaMensal);
        }

        const rendaMensal = montante * (taxaMensal / (1 - Math.pow(1 + taxaMensal, -240)));

        setResultado({
            montante,
            rendaMensal,
            totalAportado: aporteMensal * meses
        });
    };

    useEffect(() => {
        calcular();
    }, [idadeAtual, idadeAposentadoria, aporteMensal, taxa]);

    return (
        <div className="calculator-card">
            <h2>Calculadora de Aposentadoria</h2>
            <p className="calc-description">Planeje sua aposentadoria e descubra quanto você precisa investir</p>
            
            <div className="calc-inputs">
                <div className="input-group">
                    <label>Idade Atual</label>
                    <input 
                        type="number" 
                        value={idadeAtual} 
                        onChange={(e) => setIdadeAtual(parseInt(e.target.value) || 0)}
                        min="18"
                        step="1"
                    />
                </div>
                <div className="input-group">
                    <label>Idade Desejada para Aposentadoria</label>
                    <input 
                        type="number" 
                        value={idadeAposentadoria} 
                        onChange={(e) => setIdadeAposentadoria(parseInt(e.target.value) || 0)}
                        min={idadeAtual}
                        step="1"
                    />
                </div>
                <div className="input-group">
                    <label>Aporte Mensal (R$)</label>
                    <input 
                        type="number" 
                        value={aporteMensal} 
                        onChange={(e) => setAporteMensal(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="100"
                    />
                </div>
                <div className="input-group">
                    <label>Taxa de Retorno Anual (%)</label>
                    <input 
                        type="number" 
                        value={taxa} 
                        onChange={(e) => setTaxa(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.5"
                    />
                </div>
            </div>

            {resultado && (
                <div className="calc-results">
                    <div className="result-item">
                        <span className="result-label">Total Aportado:</span>
                        <span className="result-value">R$ {resultado.totalAportado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="result-item highlight">
                        <span className="result-label">Patrimônio Acumulado:</span>
                        <span className="result-value">R$ {resultado.montante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="result-item highlight">
                        <span className="result-label">Renda Mensal Estimada:</span>
                        <span className="result-value positive">R$ {resultado.rendaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// CDB Calculator
function CDBCalc() {
    const [valor, setValor] = useState(10000);
    const [taxa, setTaxa] = useState(120);
    const [prazo, setPrazo] = useState(365);
    const [resultado, setResultado] = useState(null);

    const calcular = () => {
        const taxaDecimal = taxa / 100;
        const rendimento = valor * (taxaDecimal / 100) * (prazo / 365);
        const ir = rendimento * 0.15;
        const liquido = rendimento - ir;
        const montante = valor + liquido;

        setResultado({
            rendimento,
            ir,
            liquido,
            montante,
            rentabilidade: (liquido / valor) * 100
        });
    };

    useEffect(() => {
        calcular();
    }, [valor, taxa, prazo]);

    return (
        <div className="calculator-card">
            <h2>Calculadora de CDB</h2>
            <p className="calc-description">Calcule o rendimento líquido do seu CDB</p>
            
            <div className="calc-inputs">
                <div className="input-group">
                    <label>Valor do Investimento (R$)</label>
                    <input 
                        type="number" 
                        value={valor} 
                        onChange={(e) => setValor(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="100"
                    />
                </div>
                <div className="input-group">
                    <label>Taxa (% do CDI)</label>
                    <input 
                        type="number" 
                        value={taxa} 
                        onChange={(e) => setTaxa(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="1"
                    />
                </div>
                <div className="input-group">
                    <label>Prazo (dias)</label>
                    <input 
                        type="number" 
                        value={prazo} 
                        onChange={(e) => setPrazo(parseInt(e.target.value) || 0)}
                        min="1"
                        step="1"
                    />
                </div>
            </div>

            {resultado && (
                <div className="calc-results">
                    <div className="result-item">
                        <span className="result-label">Rendimento Bruto:</span>
                        <span className="result-value">R$ {resultado.rendimento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">Imposto de Renda:</span>
                        <span className="result-value negative">R$ {resultado.ir.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">Rendimento Líquido:</span>
                        <span className="result-value positive">R$ {resultado.liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="result-item highlight">
                        <span className="result-label">Valor Final:</span>
                        <span className="result-value">R$ {resultado.montante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">Rentabilidade Líquida:</span>
                        <span className="result-value positive">+{resultado.rentabilidade.toFixed(2)}%</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// Main Calculator App Component
function CalculadorasApp({ activeCalc = 'juros-compostos' }) {
    const renderCalculator = () => {
        switch(activeCalc) {
            case 'juros-compostos':
                return <JurosCompostosCalc />;
            case 'investimento':
                return <InvestimentoCalc />;
            case 'emprestimo':
                return <EmprestimoCalc />;
            case 'financiamento':
                return <FinanciamentoCalc />;
            case 'aposentadoria':
                return <AposentadoriaCalc />;
            case 'cdb':
                return <CDBCalc />;
            default:
                return <JurosCompostosCalc />;
        }
    };

    return renderCalculator();
}

// Initialize
(function() {
    'use strict';
    
    let initialized = false;
    
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
    
    function init() {
        if (initialized) return;
        
        waitForDependencies(() => {
            const calcButtons = document.querySelectorAll('.calc-tab-btn');
            const container = document.getElementById('calculators-container');
            
            if (!container || typeof ReactDOM === 'undefined') {
                setTimeout(init, 100);
                return;
            }
            
            const root = ReactDOM.createRoot(container);
            let currentCalc = 'juros-compostos';

            const renderCalc = () => {
                root.render(<CalculadorasApp activeCalc={currentCalc} />);
            };

            calcButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    calcButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentCalc = this.getAttribute('data-calc');
                    renderCalc();
                });
            });

            // Initial render
            setTimeout(() => {
                renderCalc();
                initialized = true;
            }, 200);
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
})();
