import { Header } from "@/components/Header";
import { Confetti } from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import fundoImg from "@/assets/fundo.png";
import caixaPremiadaImg from "@/assets/caixa-premiada.png";

// Tipos para os parâmetros UTM
interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  [key: string]: string | undefined;
}

const Landing = () => {
  const navigate = useNavigate();

  // Função para extrair parâmetros da URL
  const extractUTMParams = (): UTMParams => {
    const params: UTMParams = {};
    const urlParams = new URLSearchParams(window.location.search);
    
    // Parâmetros UTM padrão
    const utmKeys = [
      'utm_source',
      'utm_medium', 
      'utm_campaign',
      'utm_term',
      'utm_content',
      'gclid',
      'fbclid',
      'ttclid'
    ];
    
    utmKeys.forEach(key => {
      const value = urlParams.get(key);
      if (value) {
        params[key] = value;
      }
    });

    return params;
  };

  // Função para salvar UTM no localStorage
  const saveUTMParams = () => {
    try {
      const utmParams = extractUTMParams();
      
      // Verificar se há parâmetros UTM
      const hasUTMParams = Object.keys(utmParams).length > 0;
      
      if (hasUTMParams) {
        // Salvar os parâmetros UTM atuais
        localStorage.setItem('utm_params', JSON.stringify(utmParams));
        
        // Registrar timestamp da captura
        localStorage.setItem('utm_capture_timestamp', new Date().toISOString());
        
        // Log para debug (remover em produção)
        console.log('UTM parameters saved:', utmParams);
        
        // Opcional: Salvar histórico de UTM (últimos 10)
        const utmHistory = JSON.parse(localStorage.getItem('utm_history') || '[]');
        utmHistory.unshift({
          ...utmParams,
          timestamp: new Date().toISOString(),
          page: window.location.pathname
        });
        
        // Manter apenas os últimos 10 registros
        if (utmHistory.length > 10) {
          utmHistory.pop();
        }
        
        localStorage.setItem('utm_history', JSON.stringify(utmHistory));
      }
      
      return hasUTMParams;
    } catch (error) {
      console.error('Error saving UTM parameters:', error);
      return false;
    }
  };

  // Função para carregar UTM do localStorage
  const loadUTMParams = (): UTMParams | null => {
    try {
      const stored = localStorage.getItem('utm_params');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading UTM parameters:', error);
      return null;
    }
  };

  // Função para limpar parâmetros UTM (opcional)
  const clearUTMParams = () => {
    localStorage.removeItem('utm_params');
    localStorage.removeItem('utm_capture_timestamp');
  };

  // Efeito para capturar UTM na montagem do componente
  useEffect(() => {
    const saved = saveUTMParams();
    
    if (saved) {
      console.log('UTM parameters captured and saved successfully');
    }
    
    // Opcional: Limpar parâmetros após X tempo (descomentar se necessário)
    // const clearTimeout = setTimeout(clearUTMParams, 30 * 24 * 60 * 60 * 1000); // 30 dias
    // return () => clearTimeout(clearTimeout);
  }, []);

  // Função para navegar com preservação dos parâmetros UTM
  const handleNavigateWithUTM = (path: string) => {
    // Carregar UTM salvo
    const savedUTM = loadUTMParams();
    
    // Se houver UTM salvo, adicionar à navegação
    if (savedUTM && Object.keys(savedUTM).length > 0) {
      const url = new URL(path, window.location.origin);
      Object.entries(savedUTM).forEach(([key, value]) => {
        if (value) {
          url.searchParams.set(key, value);
        }
      });
      
      navigate(url.pathname + url.search);
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <Confetti />
      <div className="min-h-screen flex flex-col">
        <main 
          className="flex-1 flex flex-col items-center justify-center px-4 mt-[-80px] pb-8 relative"
          style={{
            backgroundImage: `url(${fundoImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground flex items-center gap-2 animate-in fade-in slide-in-from-top duration-700">
              <span className="text-5xl">🎉</span>
              Parabéns!
            </h1>
            
            <p className="text-lg md:text-xl font-semibold leading-relaxed text-foreground px-2 animate-in fade-in slide-in-from-bottom duration-700 delay-150">
              Você recebeu <span className="text-tiktok-cyan font-bold">3 raspadinhas </span> para ganhar produtos 100% de graça
            </p>
            
            <div className="py-6 animate-in zoom-in duration-700 delay-300">
              <img 
                src={caixaPremiadaImg}
                alt="Caixa Premiada TikTok Shop"
                className="w-52 md:w-60 h-auto drop-shadow-2xl animate-float"
              />
            </div>

            <p className="text-lg md:text-xl font-semibold leading-relaxed text-foreground px-2 animate-in fade-in slide-in-from-bottom duration-700 delay-150">
              Clique no botão abaixo para resgatar suas raspadinhas
            </p>

            <Button
              onClick={() => handleNavigateWithUTM("/scratch-game")}
              size="lg"
              className="gradient-button text-foreground font-bold text-lg px-12 py-6 rounded-full pulse-glow shadow-2xl hover:scale-105 transition-transform duration-300 animate-in zoom-in duration-700 delay-500"
            >
              QUERO RASPAR AGORA
            </Button>

      
          </div>
        </main>
      </div>
    </>
  );
};

export default Landing;