import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [secaoAtiva, setSecaoAtiva] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Formulário RSVP
  const [nome, setNome] = useState('');
  const [presenca, setPresenca] = useState('Sim');
  const [quantidade, setQuantidade] = useState(0);
  const [acompanhantes, setAcompanhantes] = useState([]);
  const [isEnviando, setIsEnviando] = useState(false);

  // ==========================================
  // CONTAGEM REGRESSIVA PARA 06/09/2026
  // ==========================================
  const calcularTempo = () => {
    const dataCasamento = new Date(2026, 8, 6, 16, 0, 0).getTime();
    const agora = new Date().getTime();
    const diferenca = dataCasamento - agora;

    if (diferenca > 0) {
      return {
        dias: Math.floor(diferenca / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutos: Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((diferenca % (1000 * 60)) / 1000)
      };
    }
    return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
  };

  const [tempo, setTempo] = useState(calcularTempo());

  useEffect(() => {
    const timer = setInterval(() => setTempo(calcularTempo()), 1000);
    return () => clearInterval(timer);
  }, []);

  const mostrarAviso = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleQuantidadeChange = (e) => {
    const qtd = parseInt(e.target.value) || 0;
    setQuantidade(qtd);
    setAcompanhantes(Array(qtd).fill(''));
  };

  const handleAcompanhanteChange = (index, value) => {
    const novosAcompanhantes = [...acompanhantes];
    novosAcompanhantes[index] = value;
    setAcompanhantes(novosAcompanhantes);
  };

  const enviarTelegram = async (e) => {
    e.preventDefault();
    setIsEnviando(true);
    let textoTelegram = "";
    
    if (presenca === 'Sim') {
      textoTelegram = `💍 *Nova Confirmação!*\n\n✅ *${nome}* confirmou presença!`;
      const nomesValidos = acompanhantes.filter(a => a.trim() !== '');
      if (nomesValidos.length > 0) {
        textoTelegram += `\n👨‍👩‍👧 *Acompanhantes (${nomesValidos.length}):* ${nomesValidos.join(', ')}`;
      }
    } else {
      textoTelegram = `😔 *Aviso de Ausência*\n\nO(a) convidado(a) *${nome}* informou não comparecer.`;
    }
    
    try {
      const BOT_TOKEN = "SEU_TOKEN_AQUI"; 
      const CHAT_ID = "SEU_CHAT_ID_AQUI";
      const textConvert = encodeURIComponent(textoTelegram);
      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${textConvert}&parse_mode=Markdown`;
      
      const resposta = await fetch(url);
      const resultado = await resposta.json();
      
      if (!resultado.ok) throw new Error("Erro");
      mostrarAviso("Confirmação enviada com sucesso! 🎉");
      setIsModalOpen(false);
      setNome(''); setQuantidade(0); setAcompanhantes([]);
    } catch (error) {
      mostrarAviso("Erro ao enviar. Tente novamente.");
    } finally {
      setIsEnviando(false);
    }
  };

  const trocarSecao = (e, secao) => {
    e.preventDefault();
    setSecaoAtiva(secao);
  };

  return (
    <div className="app-container">
      {/* MENU SUPERIOR DESKTOP */}
      <nav className="navbar desktop-only">
        <ul className="nav-links">
          <li><a href="#" className={secaoAtiva === 'home' ? 'active' : ''} onClick={(e) => trocarSecao(e, 'home')}>Início</a></li>
          <li><a href="#" className={secaoAtiva === 'cerimonia' ? 'active' : ''} onClick={(e) => trocarSecao(e, 'cerimonia')}>Cerimônia</a></li>
          <li><a href="#" className={secaoAtiva === 'galeria' ? 'active' : ''} onClick={(e) => trocarSecao(e, 'galeria')}>Galeria</a></li>
          <li><a href="#" className={secaoAtiva === 'presentes' ? 'active' : ''} onClick={(e) => trocarSecao(e, 'presentes')}>Presentes</a></li>
        </ul>
      </nav>

      {/* MENU INFERIOR MOBILE COM TEXTO EM BAIXO DO ÍCONE */}
      <nav className="mobile-navbar">
        <a href="#" className={`mobile-icon ${secaoAtiva === 'home' ? 'active' : ''}`} onClick={(e) => trocarSecao(e, 'home')}>
          <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span className="menu-text">Início</span>
        </a>
        <a href="#" className={`mobile-icon ${secaoAtiva === 'cerimonia' ? 'active' : ''}`} onClick={(e) => trocarSecao(e, 'cerimonia')}>
          <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          <span className="menu-text">Local</span>
        </a>
        <a href="#" className={`mobile-icon ${secaoAtiva === 'galeria' ? 'active' : ''}`} onClick={(e) => trocarSecao(e, 'galeria')}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
          <span className="menu-text">Fotos</span>
        </a>
        <a href="#" className={`mobile-icon ${secaoAtiva === 'presentes' ? 'active' : ''}`} onClick={(e) => trocarSecao(e, 'presentes')}>
          <svg viewBox="0 0 24 24"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1h-4v-2h4zM9 4c.55 0 1 .45 1 1h-4c0-.55.45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76 12 7.4l1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>
          <span className="menu-text">Presentes</span>
        </a>
      </nav>

      {/* ==========================================
          TELA PRINCIPAL COM CONTEÚDO DINÂMICO
          ========================================== */}
      <section className="hero-split">
        <div className="hero-imagem">
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop" alt="Rodrigo e Saniele" />
          
          {/* A Contagem Regressiva que no mobile vai flutuar no topo do painel esquerdo */}
          <div className="countdown-container">
            <div className="countdown-box"><span>{tempo.dias}</span><small>Dias</small></div>
            <div className="countdown-box"><span>{tempo.horas}</span><small>Horas</small></div>
            <div className="countdown-box"><span>{tempo.minutos}</span><small>Min</small></div>
            <div className="countdown-box"><span>{tempo.segundos}</span><small>Seg</small></div>
          </div>
        </div>
        
        {/* PAPEL (CONTEÚDO DINÂMICO) */}
        <div className="hero-papel">
          
          {/* CONTEÚDO 1: INÍCIO */}
          {secaoAtiva === 'home' && (
            <div className="conteudo-animado">
              <p className="hero-subtitulo">save the date</p>
              <h1 className="hero-titulo">Rodrigo & Saniele</h1>
              
              {/* Data que aparece no lugar do cronômetro no mobile */}
              <p className="data-casamento">06 de Setembro de 2026</p>

              <p className="hero-texto">Com imensa alegria, convidamos você para celebrar o início da nossa família.</p>
              
              <button className="btn-view-more" onClick={() => setIsModalOpen(true)}>Confirmar Presença</button>
            </div>
          )}

          {/* CONTEÚDO 2: CERIMÔNIA */}
          {secaoAtiva === 'cerimonia' && (
            <div className="conteudo-animado page-section">
              <h2 className="section-title">Cerimônia</h2>
              <div className="cerimonia-content">
                <div className="cerimonia-dados">
                  <h3>Igreja Matriz de Jacobina</h3>
                  <p><strong>Data:</strong> 06 de Setembro de 2026 às 16:00</p>
                  <p><strong>Endereço:</strong> Praça da Matriz, Centro, Jacobina - BA</p>
                </div>
                <div className="mapa-container">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3910.147321528445!2d-40.51860000000001!3d-11.1824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x773356064dfca8b%3A0xc39f807212bf7744!2sIgreja%20Matriz%20Santo%20Ant%C3%B4nio!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" 
                    width="100%" height="300" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                  </iframe>
                </div>
              </div>
            </div>
          )}

          {/* CONTEÚDO 3: GALERIA */}
          {secaoAtiva === 'galeria' && (
            <div className="conteudo-animado page-section">
              <h2 className="section-title">Nossa Galeria</h2>
              <div className="galeria-grid">
                <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600" alt="Galeria 1" />
                <img src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600" alt="Galeria 2" />
                <img src="https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=600" alt="Galeria 3" />
                <img src="https://images.unsplash.com/photo-1519225495810-7517c296517a?q=80&w=600" alt="Galeria 4" />
                <img src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600" alt="Galeria 5" />
                <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600" alt="Galeria 6" />
              </div>
            </div>
          )}

          {/* CONTEÚDO 4: PRESENTES */}
          {secaoAtiva === 'presentes' && (
            <div className="conteudo-animado page-section">
              <h2 className="section-title">Lista de Presentes</h2>
              <p className="section-subtitle">Sua presença é nosso maior presente!</p>
              <div className="presentes-grid">
                
                <div className="card-presente">
                  <img src="https://images.unsplash.com/photo-1588693836371-d41a33c09f3e?q=80&w=400" alt="Cota Lua de Mel" />
                  <div className="card-info">
                    <h3>Cota Lua de Mel</h3>
                    <p>R$ 150</p>
                    <button className="btn-presente" onClick={() => alert("Exibir PIX aqui")}>Presentear</button>
                  </div>
                </div>

                <div className="card-presente">
                  <img src="https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=400" alt="Jantar" />
                  <div className="card-info">
                    <h3>Jantar Romântico</h3>
                    <p>R$ 200</p>
                    <button className="btn-presente" onClick={() => alert("Exibir PIX aqui")}>Presentear</button>
                  </div>
                </div>

                <div className="card-presente">
                  <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=400" alt="Jogo de Pratos" />
                  <div className="card-info">
                    <h3>Jogo de Pratos</h3>
                    <p>R$ 120</p>
                    <button className="btn-presente" onClick={() => alert("Exibir PIX aqui")}>Presentear</button>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </section>

      {/* MODAL RSVP */}
      {isModalOpen && (
        <div className="modal-overlay active">
          <div className="carta-antiga">
            <button className="fechar-modal" onClick={() => setIsModalOpen(false)}>✕</button>
            <h2 className="carta-titulo">RSVP</h2>
            <p className="carta-texto">Por favor, confirme sua presença.</p>

            <form onSubmit={enviarTelegram}>
              <input 
                type="text" 
                className="input-carta" 
                placeholder="Seu Nome Completo" 
                required 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              
              <select 
                className="input-carta" 
                value={presenca}
                onChange={(e) => {
                  setPresenca(e.target.value);
                  if (e.target.value === 'Não') {
                    setQuantidade(0);
                    setAcompanhantes([]);
                  }
                }}
              >
                <option value="Sim">Sim, eu irei!</option>
                <option value="Não">Infelizmente não poderei ir</option>
              </select>

              {presenca === 'Sim' && (
                <>
                  <select 
                    className="input-carta" 
                    value={quantidade} 
                    onChange={handleQuantidadeChange}
                  >
                    <option value="0">Irei sozinho(a)</option>
                    <option value="1">Levarei 1 acompanhante</option>
                    <option value="2">Levarei 2 acompanhantes</option>
                    <option value="3">Levarei 3 acompanhantes</option>
                    <option value="4">Levarei 4 acompanhantes</option>
                  </select>

                  <div className="acompanhantes-container">
                    {acompanhantes.map((acompanhante, index) => (
                      <input 
                        key={index}
                        type="text" 
                        className="input-carta" 
                        placeholder={`Nome do Acompanhante ${index + 1}`} 
                        required
                        value={acompanhante}
                        onChange={(e) => handleAcompanhanteChange(index, e.target.value)}
                      />
                    ))}
                  </div>
                </>
              )}

              <button type="submit" className="btn-view-more" disabled={isEnviando} style={{marginTop: '15px'}}>
                {isEnviando ? "Enviando..." : "Enviar Resposta"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast de Notificação */}
      <div className={`toast-notificacao ${toastMsg ? 'mostrar' : ''}`}>{toastMsg}</div>
    </div>
  );
}