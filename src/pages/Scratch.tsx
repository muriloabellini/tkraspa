import { Header } from "@/components/Header";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import fundoImg from "@/assets/fundo.png";
import logoImg from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";

const prizes = [
  { id: 1, name: "iPhone ", image: "/images/1.png" },
  { id: 2, name: "JBL Boombox", image: "/images/2.png" },
  { id: 3, name: "JBL Flip", image: "/images/3.png" },
  { id: 4, name: "SmartWatch", image: "/images/4.png" },
  { id: 5, name: "Apple Watch", image: "/images/5.png" },
  { id: 6, name: "Apple Watch 6", image: "/images/6.png" },
  { id: 7, name: "Macbook", image: "/images/7.png" },
  { id: 8, name: "iPad Pro", image: "/images/8.png" },
  { id: 9, name: "Apple Watch", image: "/images/9.png" },
  { id: 10, name: "Apple Watch 7", image: "/images/10.png" },
  { id: 11, name: "JBL Mini", image: "/images/11.png" },
  { id: 12, name: "Fone JBL", image: "/images/12.png" },
  { id: 13, name: "Ipad", image: "/images/13.png" },
  { id: 14, name: "Iphone", image: "/images/14.png" },
  { id: 15, name: "Fone JBL", image: "/images/15.png" },
  { id: 16, name: "Macbook", image: "/images/16.png" },
];

const winners = [
  {
    id: 1,
    name: "Eduarda L.",
    product: "MacBook",
    testimonial: "Minha caixa premiada chegou em 4 dias, eu pensei até que ia demorar mais. Muito obrigada TikTok Shop 🙏",
    stars: 5,
    location: "São Paulo",
    productImage: "/images/d1.png"
  },
  {
    id: 2,
    name: "Carlos M.",
    product: "iPhone 14",
    testimonial: "Incrível! Ganhei um iPhone 14 novo. Muito feliz com a raspadinha!",
    stars: 5,
    location: "Rio de Janeiro",
    productImage: "/images/d1.png"
  },
  {
    id: 3,
    name: "Ana P.",
    product: "iPad Air",
    testimonial: "Adorei! Produto original e entrega rápida. Recomendo!",
    stars: 5,
    location: "Belo Horizonte",
    productImage: "/images/d1.png"
  },
  {
    id: 4,
    name: "Roberto S.",
    product: "SmartWatch",
    testimonial: "Surpreso com a qualidade do produto! Chegou antes do prazo.",
    stars: 5,
    location: "Brasília",
    productImage: "/images/d1.png"
  },
  {
    id: 5,
    name: "Mariana F.",
    product: "Fone",
    testimonial: "Produto excelente e entrega super rápida! Valeu cada centavo.",
    stars: 5,
    location: "Porto Alegre",
    productImage: "/images/d1.png"
  },
];

const faqs = [
  {
    question: "Como funciona as raspadinhas da Caixa Premiada?",
    answer: "Você compra sua caixa por R$ 100,00 e recebe raspadinhas digitais. Raspe para descobrir qual prêmio você ganhou!",
  },
  {
    question: "Eu posso ter quantas raspadinhas na minha Caixa Premiada?",
    answer: "Cada caixa vem com 5 raspadinhas digitais. Você pode comprar quantas caixas quiser!",
  },
  {
    question: "Como faço para raspar e saber qual raspadinha vou ganhar?",
    answer: "Após a compra, você receberá acesso às suas raspadinhas digitais. Basta clicar e arrastar para raspar e descobrir seu prêmio!",
  },
  {
    question: "Os produtos são originais?",
    answer: "Sim! Todos os produtos são 100% originais e vêm com garantia do fabricante.",
  },
  {
    question: "Os produtos vem com garantia?",
    answer: "Sim! Todos os produtos têm garantia oficial do fabricante de 1 ano.",
  },
];

const Scratch = () => {
  const [showRestOfPage, setShowRestOfPage] = useState(false);
  const [showButton, setShowButton] = useState(false); // Novo estado para o botão
  const [currentWinner, setCurrentWinner] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVolumeButton, setShowVolumeButton] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Estados para o scroll por arraste
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeftState] = useState(0);

  // Carregar script do Vturb
  useEffect(() => {
    if ((window as any).__vturbPlayerLoaded) return;

    if (window.customElements && window.customElements.get("vturb-anchor-button")) {
      (window as any).__vturbPlayerLoaded = true;
      return;
    }

    const src = "https://scripts.converteai.net/62cd5971-f5e0-4eb3-ac2a-04f377917e2e/players/6917885cbb5c359210e829c5/v4/player.js";
    if (!document.querySelector(`script[src="${src}"]`)) {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        (window as any).__vturbPlayerLoaded = true;
        setVideoLoaded(true);
        
        // Configurar o player após carregar
        setTimeout(() => {
          configureVturbPlayer();
        }, 1000);
      };
    } else {
      (window as any).__vturbPlayerLoaded = true;
      setVideoLoaded(true);
      setTimeout(() => {
        configureVturbPlayer();
      }, 1000);
    }
  }, []);

  // Timer para mostrar o restante da página após 5 segundos
  useEffect(() => {
    if (!videoLoaded) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowRestOfPage(true);
          setShowButton(true); // Mostrar o botão quando o tempo acabar
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [videoLoaded]);

  const configureVturbPlayer = () => {
    const player = document.querySelector('vturb-smartplayer') as any;
    if (player) {
      player.style.width = "100%";
      player.style.maxWidth = "500px";
      player.style.height = "460px";
      player.style.borderRadius = "12px";
      player.style.overflow = "hidden";
      
      setTimeout(() => {
        setShowVolumeButton(true);
      }, 2000);
    }
  };

  // Funções para scroll por arraste
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const nextWinner = () => {
    setCurrentWinner((prev) => (prev + 1) % winners.length);
  };

  const prevWinner = () => {
    setCurrentWinner((prev) => (prev - 1 + winners.length) % winners.length);
  };

  const handleStartScratch = () => {
    navigate('/scratch-game');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* VSL Section with Background Image */}
      <div className="relative min-h-[45vh] bg-white mt-[-35px]">
        {/* Imagem cobrindo apenas 70% */}
        <div 
          className="absolute top-0 left-0 right-0 h-[85%]"
          style={{
            backgroundImage: `url(${fundoImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col items-center max-w-sm mx-auto w-full space-y-6 px-4 pt-28 pb-8">
          <div
            className="text-center space-y-1 animate-in fade-in slide-in-from-top duration-700"
            style={{
              maxHeight: "120px",
              overflow: "hidden",
              marginTop: "4px"
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              <span className="text-tiktok-cyan">Assista o vídeo</span>{" "}
              <span className="text-white">abaixo para</span>
            </h2>

            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              <span className="text-white">liberar suas </span>
              <span className="text-secondary">raspadinhas</span>
            </h2>

            <p className="text-md text-white pt-1 leading-tight">
              Ganhe prêmios com produtos avaliados em até{" "}
              <span className="text-white font-bold">R$ 10.349,50</span>{" "}
              por apenas{" "}
              <span className="text-tiktok-cyan font-bold">R$ 100,00</span>
            </p>
          </div>

          {/* VSL Video Area - Container Melhorado */}
          <div className="w-full max-w-[500px] bg-black rounded-2xl flex items-center justify-center border-2 border-border/50 shadow-2xl animate-in zoom-in duration-700 delay-150 relative overflow-hidden">
            
            {/* Player Vturb */}
            <div className="w-full flex justify-center relative">
              <vturb-smartplayer
                id="vid-6917885cbb5c359210e829c5"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  height: "100%",
                  display: "block",
                  margin: "0 auto",
                  borderRadius: "12px",
                  overflow: "hidden"
                }}
              ></vturb-smartplayer>

              {/* Botão de Volume Overlay */}
              {showVolumeButton && (
                <button
                  onClick={toggleMute}
                  className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all duration-200 z-10"
                  style={{
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white" />
                  )}
                </button>
              )}

              {/* Indicador de Áudio */}
              {!isMuted && (
                <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  <span>Áudio ON</span>
                </div>
              )}

             
            </div>

            {/* Instruções de Áudio */}
            <div className="absolute -bottom-8 left-0 right-0 text-center">
              <p className="text-xs text-white/80 bg-black/50 px-3 py-1 rounded-full inline-block">
                {isMuted ? "Clique no ícone de som para ativar o áudio" : "Áudio ativado"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botão 1 - Aparece após 5 segundos, ANTES da seção de prêmios */}
      {showButton && (
        <div className="px-6 animate-in fade-in duration-500">
          <Button
            size="lg"
            className="w-full font-bold text-lg py-6 rounded-full shadow-2xl uppercase tracking-wider mb-6"
            style={{ 
              backgroundColor: '#ff3c5c',
              color: 'white'
            }}
            onClick={() => {
              window.scrollTo(0, 0);
              handleStartScratch();
            }}
          >
            INICIAR RASPADINHA
          </Button>
        </div>
      )}

      {/* Prizes Section - Horizontal Scroll SIMPLES */}
      <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
        <div className="flex items-center gap-2 text-lg font-bold justify-center">
          <span className="text-2xl">🎁</span>
          <span className="text-black">Prêmios da Raspadinha:</span>
        </div>
        
        <div className="relative px-5">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 pb-3 cursor-grab active:cursor-grabbing"
            style={{ 
              scrollbarWidth: "thin",
              scrollbarColor: '#ff3c5c #f0f0f0',
              msOverflowStyle: "none",
              userSelect: 'none'
            }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {prizes.map((prize, index) => (
              <div
                key={prize.id}
                className="min-w-[100px] rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer shadow-lg border-2 flex-shrink-0"
                style={{
                  backgroundColor: '#c3ffff',
                  borderColor: index === 0 ? '#80e5e5' : '#80e5e5',
                  animationDelay: `${index * 50}ms`
                }}
              >
                <div className="w-12 h-12 flex items-center justify-center">
                  <img 
                    src={prize.image} 
                    alt={prize.name}
                    className="w-full h-full object-contain"
                    draggable="false"
                  />
                </div>
                <p 
                  className="text-sm font-bold text-center whitespace-nowrap"
                  style={{ color: '#000000' }}
                >
                  {prize.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
   

      {/* Rest of Page - Shows after 5 seconds */}
      {showRestOfPage && (
        <div className="animate-in fade-in duration-1000">
          {/* Seção de Estatísticas */}
          <div className="w-full space-y-6 bg-white p-6">
            {[
              { 
                percent: "93%", 
                text: "dos clientes dizem ter recebido ",
                bold: "pelo menos 5x o valor pago",
                rest: " pela Caixa Premiada."
              },
              { 
                percent: "89%", 
                text: "dos clientes dizem ter recebido ",
                bold: "entre 3 a 5 dias úteis",
                rest: ""
              },
              { 
                percent: "97%", 
                text: "dos clientes dizem ter recebido ",
                bold: "pelo menos 1 produto da Apple",
                rest: "."
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div 
                    className="w-16 h-16 rounded-full border-[6px] flex items-center justify-center font-bold text-xl"
                    style={{ 
                      borderColor: '#ff3c5c',
                      color: '#ff3c5c'
                    }}
                  >
                    {item.percent}
                  </div>
                </div>
                <p className="text-gray-800 text-sm leading-relaxed flex-1">
                  {item.text}<span className="font-bold">{item.bold}</span>{item.rest}
                </p>
              </div>
            ))}
          </div>

          {/* Últimos Ganhadores Section */}
          <div className="bg-[#001010] py-12">
            <div className="max-w-md mx-auto w-full px-4 space-y-8">
              {/* Título */}
              <h2 className="text-xl font-bold text-center text-white">
                Últimos ganhadores
              </h2>
              
             {/* Card do Depoimento */}
            <div
                className="relative bg-white rounded-3xl overflow-hidden border-t-transparent border-b-transparent"
                style={{
                  borderLeft: "8px solid #00eaff",  // Azul
                  borderRight: "8px solid #ff3c5c", // Rosa
                  borderTop: "8px solid transparent",
                  borderBottom: "8px solid transparent",
                }}
              >
              {/* Imagem do Produto */}
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <img
                  src={winners[currentWinner].productImage}
                  alt={winners[currentWinner].product}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
              </div>

              {/* Conteúdo */}
              <div className="p-5 space-y-3">

                {/* Estrelas */}
                <div className="flex justify-center gap-1 text-yellow-400">
                  {[...Array(winners[currentWinner].stars)].map((_, i) => (
                    <svg 
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.905 
                      1.48 8.289L12 18.896l-7.416 4.604 1.48-8.289L0 
                      9.306l8.332-1.151z" />
                    </svg>
                  ))}
                </div>

                {/* Nome */}
                <h3 className="text-lg font-bold text-center text-gray-900">
                  {winners[currentWinner].name}
                </h3>

                {/* Depoimento */}
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  {winners[currentWinner].testimonial}
                </p>

                {/* Linha separadora */}
                <div className="w-full border-t border-gray-200 pt-3 flex justify-center">
                  {/* Localização */}
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>📍</span>
                    <span className="text-sm">{winners[currentWinner].location}</span>
                  </div>
                </div>
              </div>
            </div>


              {/* Controles de Navegação */}
              <div className="flex items-center justify-between px-4">
                {/* Seta Esquerda */}
                <button
                  onClick={prevWinner}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200"
                  aria-label="Depoimento anterior"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                {/* Indicadores do Carrossel */}
                <div className="flex justify-center gap-2">
                  {winners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentWinner(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentWinner
                          ? "bg-white"
                          : "bg-gray-600"
                      }`}
                      aria-label={`Ir para ganhador ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Seta Direita */}
                <button
                  onClick={nextWinner}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200"
                  aria-label="Próximo depoimento"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </div>

              <Button
                size="lg"
                className="w-full font-bold text-lg py-6 rounded-full shadow-2xl uppercase tracking-wider"
                style={{ 
                  backgroundColor: '#ff3c5c',
                  color: 'white'
                }}
                onClick={() => {
                  window.scrollTo(0, 0);
                  handleStartScratch();
                }}
              >
                INICIAR RASPADINHA
              </Button>

            </div>
          </div>
          <br />

          {/* FAQ Section */}
          <div className="w-full space-y-4 mb-12 px-4">
            <h2 className="text-xl font-bold text-center text-gray-900">
              Dúvidas Frequentes
            </h2>
            
            <Accordion type="single" collapsible className="w-full space-y-0">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-gray-300 last:border-b-0"
                >
                  <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-4 text-gray-900">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-700 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Footer */}
          <div className="bg-[#181818] py-6">
            <div className="max-w-md mx-auto w-full px-4">
              <div className="flex flex-col items-start gap-2">
                <img src={logoImg} alt="TikTok Shop" className="h-8" />
                <p className="text-xs text-white/60">
                  © 2025 TikTok Shop - Caixa Misteriosa
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scratch;