import { useState, useEffect } from 'react';
import CardPresente from './cards-present/cards';
import './App.css';

export default function App() {

  const [secaoAtiva, setSecaoAtiva] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [presenteSelecionado, setPresenteSelecionado] = useState(null);
  const [jaConfirmou, setJaConfirmou] = useState(() => {
    // Quando o site abre, ele procura no celular se existe a chave 'rsvpStatus'
    return localStorage.getItem('rsvpStatus') || null;
  });

  // Formulário RSVP
  const [step, setStep] = useState(1); // NOVO ESTADO AQUI
  const [nome, setNome] = useState('');
  const [presenca, setPresenca] = useState('Sim');
  const [quantidade, setQuantidade] = useState(0);
  const [acompanhantes, setAcompanhantes] = useState([]);
  const [isEnviando, setIsEnviando] = useState(false);
  const [mapaCarregado, setMapaCarregado] = useState(false);

  // ==========================================
  // DADOS DA LISTA DE PRESENTES
  // ==========================================
  const PIX = '00020101021126580014br.gov.bcb.pix0136b57082f3-3cfb-40cc-b970-204fd78baec35204000053039865802BR5922RODRIGO SILVA DE SOUZA6008CAMACARI62070503***6304F92C'
  const CARDCRED = 'https://link.mercadopago.com.br/rodrigoesanile'
  const listaDePresentes = [
    { id: 1, titulo: '12 meses de netflix para os noivos', valor: 'R$ 243,60', imagem: 'presentes/12-netflix.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 2, titulo: 'Cesto para roupas dobrável', valor: 'R$ 49,54', imagem: 'presentes/cesto-roupa.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 3, titulo: 'Look fit pra noivinha', valor: 'R$ 363,00', imagem: 'presentes/look-fit.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 4, titulo: 'Panela de pressão 4,2l', valor: 'R$ 197,91', imagem: 'presentes/panela-pressao.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 5, titulo: 'Cota pro noivo deixar o cabelo na régua 6 meses', valor: 'R$ 150,00', imagem: 'presentes/cabelo-regua.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 6, titulo: 'Ventilador de coluna', valor: 'R$ 144,49', imagem: 'presentes/ventilador.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 7, titulo: 'Pra não dizer que não dei nada', valor: 'R$ 50,00', imagem: 'presentes/nao-dei-nada.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 8, titulo: 'Picador/triturador de alimentos', valor: 'R$ 75,92', imagem: 'presentes/picador.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 9, titulo: 'Boleira de vidro', valor: 'R$ 73,01', imagem: 'presentes/boleira.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 10, titulo: 'Cota pra ajudar na lua de mel', valor: 'R$ 960,00', imagem: 'presentes/lua-de-mel.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 11, titulo: 'Cota pra não jogar buquê', valor: 'R$ 263,13', imagem: 'presentes/não-jogar-buquê.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 12, titulo: 'Porta pão Grande Retrátil', valor: 'R$ 79,88', imagem: 'presentes/porta-pao.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 13, titulo: 'Conjunto de assadeiras 3 peças', valor: 'R$ 56,99', imagem: 'presentes/conjunto-assadeiras.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 14, titulo: 'Jogo de panela 6 peças', valor: 'R$ 769,99', imagem: 'presentes/jogodepanela.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 15, titulo: 'Cota pro noivo não se atrasar', valor: 'R$ 133,46', imagem: 'presentes/noivo-nao-atrasar.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 16, titulo: 'Despertador pra noiva', valor: 'R$ 103,62', imagem: 'presentes/despertador-noiva.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 17, titulo: 'Kit de colcha p/ casal', valor: 'R$ 93,33', imagem: 'presentes/kit-colcha-casal.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 18, titulo: 'Kit de toalha', valor: 'R$ 123,17', imagem: 'presentes/kit-toalha.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 19, titulo: 'Multiprocessador de alimentos', valor: 'R$ 407,92', imagem: 'presentes/despertador-noiva.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 20, titulo: 'Eu dei o melhor presente!', valor: 'R$ 5.000,00', imagem: 'presentes/melhor-presente.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 21, titulo: 'Jogo de Talheres 24 peças', valor: 'R$ 71,05', imagem: 'presentes/jogo-talher.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 22, titulo: 'Kit com duas jarras de vidro', valor: 'R$ 72,60', imagem: 'presentes/kit-jarras.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 23, titulo: 'Kit 11 potes de vidro', valor: 'R$ 127,42', imagem: 'presentes/kit-potes.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 24, titulo: 'Cota pra não surtar', valor: 'R$ 230,00', imagem: 'presentes/surtar.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 25, titulo: 'Cota despedida de solteiro', valor: 'R$ 553,25', imagem: 'presentes/despedida-noivo.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 26, titulo: 'Conjunto assadeira de vidro', valor: 'R$ 123,17', imagem: 'presentes/kit-assadeiras-inox.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 27, titulo: 'Kit de copos de vidro 450ml', valor: 'R$ 41,60', imagem: 'presentes/kit-copos.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 28, titulo: 'Utensílios p/ cozinha em Geral', valor: 'R$ 49,30  ', imagem: 'presentes/utensilios.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 29, titulo: 'Conjunto de jantar 10 peças', valor: 'R$ 228,65', imagem: 'presentes/conjunto-jantar.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 30, titulo: 'Coberdrom Cobertor casal', valor: 'R$ 93,49', imagem: 'presentes/edredom.webp', pixCopiaECola: PIX, linkCartao: CARDCRED },
    { id: 31, titulo: 'Cota aposentadoria', valor: 'R$ 5.232,00', imagem: 'presentes/aposentadoria.webp', pixCopiaECola: PIX, linkCartao: CARDCRED }
  ];

  // ==========================================
  // CONTAGEM REGRESSIVA
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
      textoTelegram = `💍 *Nova Confirmação!*\n\n✅ *${nome.trim().toUpperCase()}* confirmou presença!`;
      const nomesValidos = acompanhantes.filter(a => a.trim() !== '');
      if (nomesValidos.length > 0) {
        textoTelegram += `\n👨‍👩‍👧 *Acompanhantes (${nomesValidos.length}):* ${nomesValidos.join(', ')}`;
      }
    } else {
      textoTelegram = `😔 *Aviso de Ausência*\n\nO(a) convidado(a) *${nome.toUpperCase}* informou não comparecer.`;
    }

    try {
      const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;
      const textConvert = encodeURIComponent(textoTelegram);
      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${textConvert}&parse_mode=Markdown`;

      const resposta = await fetch(url);
      const resultado = await resposta.json();

      if (!resultado.ok) throw new Error("Erro");
      mostrarAviso("Confirmação enviada com sucesso! 🎉");
      fecharModalRSVP();

      // SALVA NO CELULAR DO CONVIDADO E ATUALIZA O SITE
      localStorage.setItem('rsvpStatus', presenca); // Salva 'Sim' ou 'Não'
      setJaConfirmou(presenca);

    } catch (error) {
      console.error("Erro no processo:", error);
      mostrarAviso("Erro ao processar. Tente novamente.");
    } finally {
      setIsEnviando(false);
    }
  };

  // Nova função para resetar o modal ao fechar
  const fecharModalRSVP = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setStep(1);
      setNome('');
      setPresenca('Sim');
      setQuantidade(0);
      setAcompanhantes([]);
    }, 500); // Aguarda a animação de fechar
  };

  const trocarSecao = (e, secao) => {
    if (e) e.preventDefault();
    setSecaoAtiva(secao);
    // Reinicia o carregamento do mapa toda vez que entrar na aba Cerimônia
    if (secao === 'cerimonia') {
      setMapaCarregado(false);
    }
  };

  const abrirModalPresente = (presente) => {
    setPresenteSelecionado(presente);
  };

  const copiarPix = () => {
    if (presenteSelecionado && presenteSelecionado.pixCopiaECola) {
      navigator.clipboard.writeText(presenteSelecionado.pixCopiaECola);
      mostrarAviso("Código Pix copiado! 📋");
    }
  };

  return (
    <div className="app-container">
      {/* MENU SUPERIOR DESKTOP */}


      {/* MENU INFERIOR MOBILE */}
      <nav className="mobile-navbar">
        <a href="#" className={`mobile-icon ${secaoAtiva === 'home' ? 'active' : ''}`} onClick={(e) => trocarSecao(e, 'home')}>
          <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
          <span className="menu-text">Início</span>
        </a>
        <a href="#" className={`mobile-icon ${secaoAtiva === 'cerimonia' ? 'active' : ''}`} onClick={(e) => trocarSecao(e, 'cerimonia')}>
          <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
          <span className="menu-text">Local</span>
        </a>
        <a href="#" className={`mobile-icon ${secaoAtiva === 'galeria' ? 'active' : ''}`} onClick={(e) => trocarSecao(e, 'galeria')}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2" /><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" /></svg>
          <span className="menu-text">Fotos</span>
        </a>
        <a href="#" className={`mobile-icon ${secaoAtiva === 'presentes' ? 'active' : ''}`} onClick={(e) => trocarSecao(e, 'presentes')}>
          <svg viewBox="0 0 24 24"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1h-4v-2h4zM9 4c.55 0 1 .45 1 1h-4c0-.55.45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76 12 7.4l1 1.36L15.38 12 17 10.83 14.92 8H20v6z" /></svg>
          <span className="menu-text">Presentes</span>
        </a>
      </nav>

      {/* TELA PRINCIPAL */}
      <section className="hero-split">
        <div className="hero-imagem">
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop" alt="Rodrigo e Saniele" />

          <div className="countdown-container">
            <div className="countdown-box"><span>{tempo.dias}</span><small>Dias</small></div>
            <div className="countdown-box"><span>{tempo.horas}</span><small>Horas</small></div>
            <div className="countdown-box"><span>{tempo.minutos}</span><small>Min</small></div>
            <div className="countdown-box"><span>{tempo.segundos}</span><small>Seg</small></div>
          </div>
        </div>

        <div className="hero-papel">
          <nav className="navbar desktop-only">
            <ul className="nav-links">
              <li><a href="#" className={secaoAtiva === 'home' ? 'active' : ''} onClick={(e) => trocarSecao(e, 'home')}>Início</a></li>
              <li><a href="#" className={secaoAtiva === 'cerimonia' ? 'active' : ''} onClick={(e) => trocarSecao(e, 'cerimonia')}>Cerimônia</a></li>
              <li><a href="#" className={secaoAtiva === 'galeria' ? 'active' : ''} onClick={(e) => trocarSecao(e, 'galeria')}>Galeria</a></li>
              <li><a href="#" className={secaoAtiva === 'presentes' ? 'active' : ''} onClick={(e) => trocarSecao(e, 'presentes')}>Presentes</a></li>
            </ul>
          </nav>

          {/* HOME COM OS NOVOS BOTÕES */}
          {secaoAtiva === 'home' && (
            <div className="conteudo-animado">
              <h1 className="hero-titulo">Rodrigo & Saniele</h1>
              <p className="data-casamento">06 de Setembro de 2026</p>

              <div className="home-botoes">
                {/* LÓGICA DO BOTÃO DE RSVP COM MEMÓRIA */}
                {!jaConfirmou ? (
                  // Se nunca respondeu, mostra o botão normal
                  <button className="btn-view-more" onClick={() => setIsModalOpen(true)}>
                    Confirmar Presença
                  </button>
                ) : jaConfirmou === 'Sim' ? (
                  // Se respondeu que VAI
                  <button className="btn-view-more" disabled style={{ backgroundColor: '#2f3b1c', opacity: 1, cursor: 'default' }}>
                    ✅ Presença Confirmada
                  </button>
                ) : (
                  // Se respondeu que NÃO VAI
                  <button className="btn-view-more btn-secundario" disabled style={{ cursor: 'default' }}>
                    ❌ Ausência Registrada
                  </button>
                )}
                <button className="btn-view-more btn-secundario" onClick={() => trocarSecao(null, 'cerimonia')}>📍 Localização do Evento</button>
                <button className="btn-view-more btn-secundario btn-lista" onClick={() => trocarSecao(null, 'presentes')}>🎁 Lista de Presentes</button>
              </div>
            </div>
          )}

          {/* CERIMÔNIA */}
          {secaoAtiva === 'cerimonia' && (
            <div className="conteudo-animado page-section">
              <div className="cerimonia-content">
                <div className="cerimonia-dados">
                  <h3>Espaço Beliza</h3>
                  <p><strong>Data:</strong> 06 / 09 / 2026 às 15:00</p>
                  <p><strong>Endereço:</strong> Rua da linha, Verde horizonte, Camaçari - BA</p>
                </div>
                <div className="mapa-container" style={{ position: 'relative', minHeight: '200px' }}>
                  {/* Mostra a animação enquanto o mapa não carrega */}
                  {!mapaCarregado && (
                    <div className="spinner-container">
                      <div className="spinner"></div>
                    </div>
                  )}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15641.190493550048!2d-38.31991914339503!3d-12.726960578090916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7166b003ba700e5%3A0x9f9b9129eb0cb3f2!2sEspa%C3%A7o%20Beliza!5e0!3m2!1spt-BR!2sbr!4v1784472844182!5m2!1spt-BR!2sbr"
                    width="100%" height="200"
                    style={{ border: 0, opacity: mapaCarregado ? 1 : 0, transition: 'opacity 0.5s' }}
                    allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    onLoad={() => setMapaCarregado(true)}
                  >
                  </iframe>
                </div>
              </div>
            </div>
          )}

          {/* GALERIA */}
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

          {/* PRESENTES */}
          {secaoAtiva === 'presentes' && (
            <div className="conteudo-animado page-section">
              <h2 className="section-title">Lista de Presentes</h2>
              <p className="section-subtitle">Sua presença é nosso maior presente!</p>

              <div className="presentes-grid">
                {listaDePresentes.map((presente, index) => (
                  <CardPresente
                    key={presente.id || index}
                    imagem={presente.imagem}
                    titulo={presente.titulo}
                    valor={presente.valor}
                    onPresentear={() => abrirModalPresente(presente)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MODAL PAGAMENTO (PIX / CARTÃO) */}
      {presenteSelecionado && (
        <div className="modal-overlay active">
          <div className="modal-pagamento">
            <button className="fechar-modal" onClick={() => setPresenteSelecionado(null)}>✕</button>
            <h2 className="pagamento-titulo">Presentear</h2>
            <p className="pagamento-item">{presenteSelecionado.titulo}</p>
            <p className="pagamento-valor">{presenteSelecionado.valor}</p>

            <div className="qr-code-container">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(presenteSelecionado.pixCopiaECola)}`} alt="QR Code Pix" />
            </div>

            <p className="dica-pix">Escaneie o QR Code ou copie o código abaixo:</p>

            <button className="btn-view-more btn-copiar" onClick={copiarPix}>📋 Copiar Pix (Copia e Cola)</button>

            {/* Renderiza o botão do cartão SOMENTE se houver um link na lista de presentes */}
            {presenteSelecionado.linkCartao && (
              <a href={presenteSelecionado.linkCartao} target="_blank" rel="noopener noreferrer" className="btn-view-more btn-cartao">💳 Pagar com Cartão</a>
            )}
          </div>
        </div>
      )}

      {/* MODAL RSVP EM ETAPAS */}
      {isModalOpen && (
        <div className="modal-overlay active">
          <div className="carta-antiga">
            <button className="fechar-modal" onClick={fecharModalRSVP}>✕</button>
            <h2 className="carta-titulo">Confirme sua presença</h2>

            <form onSubmit={(e) => e.preventDefault()}>

              {/* PASSO 1: Vai ou não vai? */}
              {step === 1 && (
                <div className="step-container animar-entrada">
                  <p className="carta-texto">Você poderá celebrar este dia conosco?</p>
                  <div className="rsvp-botoes">
                    <button type="button" className="btn-view-more" onClick={() => { setPresenca('Sim'); setStep(2); }}>Sim, eu irei!</button>
                    <button type="button" className="btn-view-more btn-secundario" onClick={() => { setPresenca('Não'); setStep(2); }}>Infelizmente não</button>
                  </div>
                </div>
              )}

              {/* PASSO 2: Nome Completo */}
              {step === 2 && (
                <div className="step-container animar-entrada">
                  <p className="carta-texto">Qual o seu nome completo?</p>
                  <input type="text" className="input-carta" placeholder="Digite seu nome..." required value={nome} onChange={(e) => setNome(e.target.value)} />

                  <div className="rsvp-botoes">
                    <button type="button" className="btn-view-more btn-secundario" onClick={() => setStep(1)}>Voltar</button>

                    {/* Se a pessoa não vai, ela já finaliza aqui */}
                    {presenca === 'Não' ? (
                      <button type="button" className="btn-view-more" disabled={isEnviando || !nome.trim()} onClick={enviarTelegram}>
                        {isEnviando ? <><span className="spinner spinner-small"></span> Aguarde...</> : "Confirmar Ausência"}
                      </button>
                    ) : (
                      <button type="button" className="btn-view-more" disabled={!nome.trim()} onClick={() => setStep(3)}>Próximo</button>
                    )}
                  </div>
                </div>
              )}

              {/* PASSO 3: Vai levar alguém? (Só aparece se Presença = Sim) */}
              {step === 3 && presenca === 'Sim' && (
                <div className="step-container animar-entrada">
                  <p className="carta-texto">Você levará acompanhantes?</p>
                  <select className="input-carta" value={quantidade} onChange={handleQuantidadeChange}>
                    <option value="0">Irei sozinho(a)</option>
                    <option value="1">1 acompanhante</option>
                    <option value="2">2 acompanhantes</option>
                    <option value="3">3 acompanhantes</option>
                    <option value="4">4 acompanhantes</option>
                  </select>

                  <div className="rsvp-botoes">
                    <button type="button" className="btn-view-more btn-secundario" onClick={() => setStep(2)}>Voltar</button>

                    {/* Se escolheu 0 acompanhantes, já envia. Se for mais, vai pro passo 4 */}
                    {quantidade === 0 ? (
                      <button type="button" className="btn-view-more" disabled={isEnviando} onClick={enviarTelegram}>
                        {isEnviando ? <><span className="spinner spinner-small"></span> Aguarde...</> : "Enviar Confirmação"}
                      </button>
                    ) : (
                      <button type="button" className="btn-view-more" onClick={() => setStep(4)}>Próximo</button>
                    )}
                  </div>
                </div>
              )}

              {/* PASSO 4: Nome dos Acompanhantes (Só aparece se Quantidade > 0) */}
              {step === 4 && presenca === 'Sim' && quantidade > 0 && (
                <div className="step-container animar-entrada">
                  <p className="carta-texto">Nomes dos acompanhantes:</p>
                  <div className="acompanhantes-container">
                    {acompanhantes.map((acompanhante, index) => (
                      <input key={index} type="text" className="input-carta" placeholder={`Nome do Acompanhante ${index + 1}`} required value={acompanhante} onChange={(e) => handleAcompanhanteChange(index, e.target.value)} />
                    ))}
                  </div>

                  <div className="rsvp-botoes">
                    <button type="button" className="btn-view-more btn-secundario" onClick={() => setStep(3)}>Voltar</button>
                    <button type="button" className="btn-view-more" disabled={isEnviando || acompanhantes.some(a => !a.trim())} onClick={enviarTelegram}>
                      {isEnviando ? <><span className="spinner spinner-small"></span> Aguarde...</> : "Enviar Confirmação"}
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        </div>
      )}
      <div className={`toast-notificacao ${toastMsg ? 'mostrar' : ''}`}>{toastMsg}</div>
    </div>
  );
}