import { Header } from "@/components/Header";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import fundoImg from "@/assets/fundo.png";
import scratchOverlayImg from "@/assets/scratch-overlay.png";
import { useNavigate } from "react-router-dom";
import { Confetti } from "@/components/Confetti";
import winSound from "@/assets/som.mp3";

const prizes = [
  { id: 1, name: "iPhone 17 Pro Max", image: "/images/1.png" },
  { id: 2, name: "JBL Boombox 3", image: "/images/2.png" },
  { id: 3, name: "JBL Flip 6", image: "/images/3.png" },
  { id: 4, name: "Smart Watch Pro", image: "/images/4.png" },
  { id: 5, name: "Apple Watch Series 9", image: "/images/5.png" },
  { id: 6, name: "Apple Watch Ultra", image: "/images/6.png" },
  { id: 7, name: "Macbook Pro M3", image: "/images/7.png" },
  { id: 8, name: "iPad Pro 12.9", image: "/images/8.png" },
  { id: 9, name: "Apple Watch SE", image: "/images/9.png" },
  { id: 10, name: "Apple Watch Series 8", image: "/images/10.png" },
  { id: 11, name: "JBL Charge 5", image: "/images/11.png" },
  { id: 12, name: "Fone JBL Tune 760NC", image: "/images/12.png" },
  { id: 13, name: "iPad Air", image: "/images/13.png" },
  { id: 14, name: "iPhone 15", image: "/images/14.png" },
  { id: 15, name: "JBL Quantum 910", image: "/images/15.png" },
  { id: 16, name: "Macbook Pro", image: "/images/16.png" },
];

const ScratchGame = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState(3);
  const [currentRound, setCurrentRound] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [scratchCards, setScratchCards] = useState<string[]>([]);
  const [isScratching, setIsScratching] = useState(false);
  const [overlayLoaded, setOverlayLoaded] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isCanvasBlocked, setIsCanvasBlocked] = useState(true);
  const [shouldAutoStart, setShouldAutoStart] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayImageRef = useRef<HTMLImageElement | null>(null);
  const lastProgressCheck = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Carregar a imagem de overlay
  useEffect(() => {
    const img = new Image();
    img.src = scratchOverlayImg;
    img.onload = () => {
      console.log("Overlay carregado com sucesso");
      overlayImageRef.current = img;
      setOverlayLoaded(true);
    };
    img.onerror = () => {
      console.error("Erro ao carregar overlay");
      setOverlayLoaded(false);
    };
  }, []);

  // Detectar tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Inicializar áudio
  useEffect(() => {
    audioRef.current = new Audio(winSound);
    audioRef.current.volume = 0.7;
    audioRef.current.preload = "auto";
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Tocar som quando a modal de vitória for exibida
  useEffect(() => {
    if (showWinModal && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.log("Erro ao reproduzir áudio:", error);
      });
    }
  }, [showWinModal]);

  // Função centralizada para avançar rodada
  const advanceRound = useCallback(() => {
    setAttempts(prev => {
      const newAttempts = prev - 1;
      if (newAttempts > 0) {
        setCurrentRound(prevRound => prevRound + 1);
      }
      return newAttempts;
    });
  }, []);

  // Gerar cartas da raspadinha - Sempre perde nas 2 primeiras, ganha na terceira
  const generateScratchCards = useCallback((round: number) => {
    if (round === 0 || round === 1) {
      // Rodadas de perda - apenas imagens diferentes
      const losingImages = [
        "/images/1.png", "/images/3.png", "/images/4.png",
        "/images/5.png", "/images/6.png", "/images/7.png",
        "/images/8.png", "/images/9.png", "/images/10.png"
      ];
      
      const positions = [...losingImages];
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }
      
      return positions.slice(0, 9);
    } else {
      // Rodada de vitória - 3 imagens iguais da JBL (2.png)
      const winningImage = "/images/2.png";
      const positions = Array(9).fill(null);
      
      // Posicionar 3 imagens iguais
      let winningCount = 0;
      while (winningCount < 3) {
        const randomIndex = Math.floor(Math.random() * 9);
        if (!positions[randomIndex]) {
          positions[randomIndex] = winningImage;
          winningCount++;
        }
      }
      
      // Preencher o resto com imagens diferentes
      const otherImages = [
        "/images/1.png", "/images/3.png", "/images/4.png",
        "/images/5.png", "/images/6.png", "/images/7.png"
      ];
      
      let otherIndex = 0;
      for (let i = 0; i < 9; i++) {
        if (!positions[i]) {
          positions[i] = otherImages[otherIndex];
          otherIndex++;
        }
      }
      
      // Embaralhar
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }
      
      return positions;
    }
  }, []);

  // Inicializar cartas da raspadinha quando o round mudar
  useEffect(() => {
    if (currentRound >= 0 && currentRound <= 2) {
      console.log("Iniciando rodada:", currentRound);
      const newScratchCards = generateScratchCards(currentRound);
      setScratchCards(newScratchCards);
      
      // Resetar estado do jogo para nova rodada
      setGameStarted(false);
      setIsCanvasBlocked(true);
      setScratchProgress(0);
      setIsScratching(false);
      setIsInitializing(true);
      
      // Pequeno delay para garantir que o DOM foi atualizado
      setTimeout(() => {
        if (overlayLoaded && canvasRef.current) {
          initializeCanvas();
          setIsInitializing(false);
        } else {
          console.log("Aguardando overlay carregar para rodada", currentRound);
          setIsInitializing(true);
        }
      }, 100);
    }
  }, [currentRound, overlayLoaded, generateScratchCards]);

  // Se shouldAutoStart for true, iniciar o jogo automaticamente
  useEffect(() => {
    if (shouldAutoStart && overlayLoaded && !isInitializing) {
      console.log("Iniciando jogo automaticamente após modal de perda");
      handleStartGame();
      setShouldAutoStart(false);
    }
  }, [shouldAutoStart, overlayLoaded, isInitializing]);

  // Calcular tamanhos responsivos
  const getResponsiveSizes = useCallback(() => {
    if (windowSize.width < 375) {
      return {
        canvasSize: windowSize.width - 40,
        containerWidth: windowSize.width - 32,
        fontSize: {
          small: '0.7rem',
          base: '0.8rem',
          large: '1rem',
          xlarge: '1.2rem'
        },
        cardHeight: '160px'
      };
    } else if (windowSize.width < 640) {
      return {
        canvasSize: 400,
        containerWidth: '400px',
        fontSize: {
          small: '0.75rem',
          base: '0.9rem',
          large: '1.1rem',
          xlarge: '1.3rem'
        },
        cardHeight: '180px'
      };
    } else {
      return {
        canvasSize: 420,
        containerWidth: '420px',
        fontSize: {
          small: '0.8rem',
          base: '1rem',
          large: '1.25rem',
          xlarge: '1.5rem'
        },
        cardHeight: '200px'
      };
    }
  }, [windowSize.width]);

  const responsiveSizes = getResponsiveSizes();

  // Inicializar canvas para raspadinha com overlay
  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !overlayImageRef.current) {
      console.log("Canvas ou overlay não disponível para inicialização");
      return;
    }

    // Definir tamanho do canvas
    canvas.width = responsiveSizes.canvasSize;
    canvas.height = responsiveSizes.canvasSize;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      console.log("Contexto 2D não disponível");
      return;
    }

    // Limpar canvas completamente
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Resetar configurações do contexto
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    
    // Desenhar a imagem de overlay
    ctx.drawImage(overlayImageRef.current, 0, 0, canvas.width, canvas.height);

    // Resetar estado de progresso
    setScratchProgress(0);
    lastProgressCheck.current = 0;
    
    console.log("Canvas inicializado para rodada", currentRound);
  }, [responsiveSizes.canvasSize, currentRound]);

  // Função para iniciar o jogo
  const handleStartGame = useCallback(() => {
    if (!overlayLoaded) {
      console.log("Aguardando overlay carregar...");
      return;
    }
    
    if (isInitializing) {
      console.log("Aguardando inicialização...");
      return;
    }
    
    // Primeiro inicializar o canvas
    initializeCanvas();
    
    // Depois iniciar o jogo
    setGameStarted(true);
    setIsCanvasBlocked(false);
    
    console.log("Jogo iniciado para rodada", currentRound);
  }, [overlayLoaded, isInitializing, initializeCanvas, currentRound]);

  // Função de raspagem
  const handleScratchStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!gameStarted || isCanvasBlocked || attempts <= 0 || currentRound > 2 || 
        isScratching || showWinModal || showLoseModal || !overlayLoaded) {
      console.log("Condição de raspagem não atendida:", {
        gameStarted, isCanvasBlocked, attempts, currentRound,
        isScratching, showWinModal, showLoseModal, overlayLoaded
      });
      return;
    }
    
    e.preventDefault();
    setIsScratching(true);
    scratchAtPosition(e);
  }, [gameStarted, isCanvasBlocked, attempts, currentRound, isScratching, showWinModal, showLoseModal, overlayLoaded]);

  const handleScratchMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!gameStarted || isCanvasBlocked || !isScratching || showWinModal || showLoseModal || !overlayLoaded) return;
    
    e.preventDefault();
    scratchAtPosition(e);
  }, [gameStarted, isCanvasBlocked, isScratching, showWinModal, showLoseModal, overlayLoaded]);

  const handleScratchEnd = useCallback(() => {
    if (!gameStarted || isCanvasBlocked) return;
    
    setIsScratching(false);
    calculateProgress();
    
    // Verificar vitória após pequeno delay
    setTimeout(() => {
      if (scratchProgress >= 70) {
        checkWinCondition();
      }
    }, 100);
  }, [gameStarted, isCanvasBlocked, scratchProgress]);

  const scratchAtPosition = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !overlayImageRef.current) {
      console.log("Canvas ou overlay não disponível para raspagem");
      return;
    }

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      // Para touch
      if (e.touches.length === 0) return;
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Para mouse
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    // Ajustar coordenadas para o tamanho do canvas
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    x *= scaleX;
    y *= scaleY;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Configurar para raspagem
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = 1;
    
    // Desenhar círculo para raspagem
    ctx.beginPath();
    const brushSize = Math.max(25, responsiveSizes.canvasSize * 0.1);
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();

    // Verificar progresso periodicamente
    const now = Date.now();
    if (now - lastProgressCheck.current > 250) {
      calculateProgress();
      lastProgressCheck.current = now;
    }
  }, [responsiveSizes.canvasSize]);

  // Calcular progresso da raspagem
  const calculateProgress = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const totalPixels = pixels.length / 4;
    const progress = (transparentPixels / totalPixels) * 100;
    const newProgress = Math.min(100, Math.round(progress));
    
    setScratchProgress(newProgress);
    
    // Verificar se atingiu condição de vitória
    if (newProgress >= 70) {
      setTimeout(() => {
        checkWinCondition();
      }, 200);
    }
  }, []);

  const checkWinCondition = useCallback(() => {
    if (scratchProgress >= 70) {
      if (currentRound === 2) {
        // Terceira rodada - Ganha
        handleWin();
      } else {
        // Primeira e segunda rodadas - Perde
        handleLose();
      }
    }
  }, [scratchProgress, currentRound]);

  const handleWin = useCallback(() => {
    setShowConfetti(true);
    
    setTimeout(() => {
      setShowWinModal(true);
      setShowConfetti(false);
    }, 1500);
  }, []);

  const handleLose = useCallback(() => {
    setTimeout(() => {
      setShowLoseModal(true);
    }, 500);
  }, []);

  const handleCloseLoseModal = useCallback(() => {
    setShowLoseModal(false);
    advanceRound();
  }, [advanceRound]);

  const handlePlayAgainFromLose = useCallback(() => {
    setShowLoseModal(false);
    advanceRound();
    setShouldAutoStart(true);
  }, [advanceRound]);

  const handleConfirmWin = useCallback(() => {
    setShowWinModal(false);
    setAttempts(prev => prev - 1);
    
    // Redirecionar para checkout após ganhar na terceira rodada
    navigate('/checkout');
  }, [navigate]);

  const handlePlayAgainFromWin = useCallback(() => {
    setShowWinModal(false);
    setGameStarted(false);
    setIsCanvasBlocked(true);
    setScratchProgress(0);
    
    // Reinicializar canvas
    setTimeout(() => {
      if (overlayLoaded && canvasRef.current) {
        initializeCanvas();
      }
    }, 100);
  }, [overlayLoaded, initializeCanvas]);

  // Debug: Logar estado atual
  useEffect(() => {
    console.log("Estado atual:", {
      gameStarted,
      isCanvasBlocked,
      overlayLoaded,
      currentRound,
      attempts,
      scratchProgress,
      shouldAutoStart,
      isInitializing
    });
  }, [gameStarted, isCanvasBlocked, overlayLoaded, currentRound, attempts, scratchProgress, shouldAutoStart, isInitializing]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Overlay escuro com transparência */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${fundoImg})` }}
      />
      <div className="absolute inset-0 bg-black/60 z-10"></div>
      
      {/* Conteúdo sobre o overlay */}
      <div className="relative z-20 flex flex-col min-h-screen">
        <Header />
        
        {/* Confetti */}
        {showConfetti && <Confetti />}

        {/* Conteúdo Principal */}
        <div className="flex-1 pb-24 sm:pb-32 pt-16">
          {/* Logo e Título */}
          <div className="max-w-md mx-auto px-4 mb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img
                src="/images/lgtiktok.png"
                alt="TikTok Shop"
                className="w-8 h-8"
              />
              <h1 className="text-white font-extrabold text-xl">Sua Raspadinha</h1>
            </div>
            <p className="text-center text-[#1af9f8] font-bold">
              Tentativas restante: {attempts}/3
            </p>
          </div>

          {/* Área da Raspadinha */}
          <div className="max-w-md mx-auto px-4 mb-4">
            <div 
              className="relative mx-auto bg-gradient-to-br from-[#2a4a5a] to-[#1a2a3a] rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/30"
              style={{ 
                width: '100%', 
                maxWidth: responsiveSizes.containerWidth,
                height: responsiveSizes.canvasSize 
              }}
            >
              {/* Grid de imagens por baixo - Só mostra quando overlay estiver carregado */}
              {overlayLoaded ? (
                <div className="absolute inset-0 grid grid-cols-3 gap-1 p-2">
                  {scratchCards.map((image, index) => (
                    <div key={index} className="bg-[#c3ffff]/20 rounded-lg flex items-center justify-center p-1">
                      <img 
                        src={image} 
                        alt={`Prêmio ${index + 1}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error(`Erro ao carregar imagem: ${image}`);
                          e.currentTarget.src = "/images/1.png"; // Fallback
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                // Placeholder enquanto overlay não carrega
                <div className="absolute inset-0 grid grid-cols-3 gap-1 p-2">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <div key={index} className="bg-gray-300 animate-pulse rounded-lg flex items-center justify-center p-1">
                      <div className="w-full h-full bg-gray-400 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Canvas para raspagem com overlay */}
              {overlayLoaded && (
                <canvas
                  ref={canvasRef}
                  width={responsiveSizes.canvasSize}
                  height={responsiveSizes.canvasSize}
                  className={`absolute inset-0 w-full h-full ${
                    isCanvasBlocked ? 'cursor-not-allowed' : 'cursor-crosshair'
                  } touch-none`}
                  onMouseDown={handleScratchStart}
                  onMouseMove={handleScratchMove}
                  onMouseUp={handleScratchEnd}
                  onMouseLeave={handleScratchEnd}
                  onTouchStart={handleScratchStart}
                  onTouchMove={handleScratchMove}
                  onTouchEnd={handleScratchEnd}
                  style={{ touchAction: 'none' }}
                />
              )}

              {/* Overlay de bloqueio quando não iniciado */}
              {isCanvasBlocked && overlayLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-[#ff3c5c] flex items-center justify-center mb-3 animate-pulse">
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white"
                    >
                      <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-white text-sm font-medium text-center px-4">
                    Clique em "Jogar Agora" para iniciar
                  </p>
                </div>
              )}

              {/* Indicador de carregamento */}
              {!overlayLoaded || isInitializing ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl">
                  <div className="text-center">
                    <div className="loader mb-3"></div>
                    <p className="text-white text-sm font-medium">
                      {isInitializing ? "Preparando jogo..." : "Carregando overlay..."}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Botão Jogar Agora */}
          <div className="max-w-md mx-auto px-4 mb-6">
            <Button
              onClick={handleStartGame}
              disabled={!overlayLoaded || gameStarted || attempts <= 0 || isInitializing}
              className={`
                w-full
                ${gameStarted ? 'bg-[#a82c44] hover:bg-[#a82c44] cursor-not-allowed' : 'bg-[#ff3c5c] hover:bg-[#ff2a4a]'}
                text-white
                font-bold
                py-6
                rounded-lg
                text-lg
                shadow-lg
                ${gameStarted ? 'shadow-none opacity-70' : 'shadow-red-500/40 hover:shadow-red-500/60'}
                transition-all
                duration-200
                ${(!overlayLoaded || attempts <= 0 || isInitializing) ? 'cursor-not-allowed opacity-50' : ''}
                relative
                overflow-hidden
                border-0
                active:scale-[0.98]
              `}
            >
              <div className="flex items-center justify-center gap-3">
                {!overlayLoaded || isInitializing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Carregando...</span>
                  </>
                ) : gameStarted ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                      <g id="SVGRepo_iconCarrier"> 
                        <path d="M17.1668 11.1733C17.1668 12.5307 17.1668 9.81592 17.1668 11.1733ZM17.1668 11.1733C17.1668 12.5307 17.1668 13.8881 17.1668 13.8881M17.1668 11.1733C17.1668 9.81592 20.0001 9.81592 20.0001 11.1733C20.0001 12.5307 20.0001 12.8701 20.0001 18.2997C20.0001 23.7294 7.85591 23.7756 5.68023 18.2997C4.87315 16.2684 5.01308 16.7027 4.2713 14.941C3.52953 13.1794 5.97114 12.1286 6.9472 13.8881C7.92326 15.6477 8.66677 18.4383 8.66677 17.2817C8.66677 16.125 8.66677 12.5307 8.66677 11.1733C8.66677 9.81592 8.66677 5.37546 8.66677 4.01805C8.66677 2.66065 11.5001 2.66065 11.5001 4.01805M17.1668 11.1733C17.1668 9.81592 14.3239 9.81592 14.3334 11.1733M14.3334 11.1733C14.3334 9.81592 11.5001 9.81592 11.5001 11.1733C11.5001 11.4976 11.5001 3.66565 11.5001 4.01805M14.3334 11.1733C14.3334 11.4976 14.3334 10.8209 14.3334 11.1733ZM14.3334 11.1733C14.3477 13.2094 14.3334 13.8881 14.3334 13.8881M11.5001 13.8881C11.5001 13.8881 11.5001 7.41019 11.5001 4.01805" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round"></path> 
                      </g>
                    </svg>
                    <span>Raspe Aqui</span>
                  </>
                ) : (
                  <>
                    <svg
                      width="24"
                      height="24"
                      viewBox="-0.5 0 7 7"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white"
                    >
                      <path d="M296.494737,3608.57322 L292.500752,3606.14219 C291.83208,3605.73542 291,3606.25002 291,3607.06891 L291,3611.93095 C291,3612.7509 291.83208,3613.26444 292.500752,3612.85767 L296.494737,3610.42771 C297.168421,3610.01774 297.168421,3608.98319 296.494737,3608.57322"
                        transform="translate(-291 -3606)"
                      />
                    </svg>
                    <span>Jogar Agora</span>
                  </>
                )}
              </div>
            </Button>
          </div>

          {/* Card Informativo */}
          <div className="max-w-md mx-auto px-4 mb-6">
            <div className="relative rounded-xl p-5 shadow-lg overflow-hidden"
                 style={{
                   backgroundColor: '#FFEAEA',
                   border: '2px dashed #FF4D5A',
                   borderRadius: '16px',
                   boxShadow: '0 4px 20px rgba(255, 77, 90, 0.1)'
                 }}>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg width="28" 
                       height="28" 
                       viewBox="0 0 24 24" 
                       fill="#FF4D5A" 
                       xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <path d="M21,8h-.106A4.192,4.192,0,0,0,21,7a3.718,3.718,0,0,0-4-4c-2.164,0-3.969,2.271-5,3.928C10.969,5.271,9.164,3,7,3A3.718,3.718,0,0,0,3,7a4.192,4.192,0,0,0,.106,1H3A1,1,0,0,0,2,9v3a1,1,0,0,0,1,1h8V10h2v3h8a1,1,0,0,0,1-1V9A1,1,0,0,0,21,8ZM7.556,8C5,8,5,7.6,5,7,5,5.207,6.142,5,7,5c1.113,0,2.419,1.583,3.308,3Zm8.888,0H13.692c.889-1.417,2.2-3,3.308-3,.858,0,2,.207,2,2C19,7.6,19,8,16.444,8ZM13,15h7v5a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V15h7v4h2Z"></path>
                    </g>
                  </svg>
                </div>
                
                <div className="flex-1">
                  <p className="text-[#1A1A1A] font-extrabold mb-2 leading-tight tracking-tight">
                    Reúna 3 imagens iguais e conquiste seu prêmio!
                  </p>
                  <p className="text-[#1A1A1A] leading-tight tracking-tight text-justify">
                    O prêmio correspondente será automaticamente adicionado na sua Caixa Premiada. 
                    Ao completar as três raspadinhas, você pode adquirir sua Caixa!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Prêmios */}
          <div className="max-w-md mx-auto px-4 mb-8">
            <div className="relative bg-white rounded-lg shadow-lg min-h-[550px] flex flex-col overflow-hidden">
              
              {/* Borda esquerda azul */}
              <span className="absolute left-0 top-0 h-full w-2 bg-[#1af9f8]" />

              {/* Borda direita rosa */}
              <span className="absolute right-0 top-0 h-full w-2 bg-[#ff3c5c]" />

              {/* Conteúdo */}
              <div className="relative p-4 flex flex-col h-full">
                <h3
                  className="text-gray-900 font-extrabold text-center mb-3 text-lg"
                  style={{ fontSize: responsiveSizes.fontSize.large }}
                >
                  Prêmios da Raspadinha
                </h3>

                <p
                  className="text-gray-600 text-center mb-4"
                  style={{ fontSize: responsiveSizes.fontSize.base }}
                >
                  A cada rodada você tem a chance de adquirir um desses produtos{" "}
                  <strong className="text-[#ff3c5c]">100% de GRAÇA!</strong>
                </p>

                {/* Grid com scroll */}
                <div
                  className="grid grid-cols-3 gap-3 overflow-y-auto pr-2 scrollbar-custom"
                  style={{ height: 420 }}
                >
                  {prizes.map((prize) => (
                    <div
                      key={prize.id}
                      className="bg-gray-50 rounded-lg p-3 flex flex-col items-center justify-center border border-gray-200 hover:border-[#1af9f8] transition-all"
                    >
                      {overlayLoaded ? (
                        <img
                          src={prize.image}
                          alt={prize.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-contain mb-2"
                          onError={(e) => {
                            console.error(`Erro ao carregar prêmio: ${prize.image}`);
                            e.currentTarget.src = "/images/1.png";
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 animate-pulse rounded-lg mb-2"></div>
                      )}
                      <p
                        className="text-gray-800 text-center font-medium leading-tight"
                        style={{ fontSize: responsiveSizes.fontSize.small }}
                      >
                        {prize.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Perda */}
        {showLoseModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm mx-auto overflow-hidden">
              <div className="p-6 pt-0">
                <div className="flex items-center justify-center my-4">
                  <span className="text-6xl">😭</span>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Não foi dessa vez
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Você ainda tem {attempts - 1} tentativas disponíveis! Tente novamente clicando no botão abaixo.
                  </p>
                  
                  <Button
                    onClick={handlePlayAgainFromLose}
                    className="w-full bg-[#ff3c5c] hover:bg-[#ff2a4a] text-white font-bold py-3 rounded-lg text-lg shadow-lg shadow-red-500/40"
                  >
                    Tentar Novamente
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Vitória */}
        {showWinModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm mx-auto overflow-hidden">
              <div className="p-6 pt-0">
                <div className="flex items-center justify-center my-4">
                  <span className="text-3xl mr-2">🎁</span>
                  <span className="text-3xl text-[#ff3c5c] font-extrabold">Parabéns!</span>
                </div>

                <div className="text-center mb-6">
                  <div className="mb-4">
                    <p className="text-[#ff3c5c] font-bold mb-2 text-lg">
                      Você ganhou um
                    </p>
                    <div className="bg-white text-black font-bold py-2 px-4 rounded-lg inline-block">
                      Caixa De Som Boombox 3 Bluetooth Preta JBL
                    </div>
                  </div>
                  
                  <img 
                    src="/images/jbl.png" 
                    alt="JBL Boombox"
                    className="w-30 h-30 mx-auto mb-6 object-contain"
                  />
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleConfirmWin}
                    className="w-full bg-[#ff3c5c] hover:bg-[#ff2a4a] text-white font-bold py-3 rounded-lg text-lg shadow-lg shadow-red-500/40"
                  >
                    Resgatar Prêmio
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 320px) {
          .max-w-md {
            max-width: 95%;
          }
        }
        
        canvas {
          border-radius: 0.75rem;
        }

        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #ff3c5c, #1af9f8);
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ff2a4a, #0bd4d3);
        }

        /* Loader para overlay */
        .loader {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid #ff3c5c;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Animação de pulsação */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }

        /* Animação de fade-in */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }

        /* Efeito de desabilitado */
        .cursor-not-allowed {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ScratchGame;