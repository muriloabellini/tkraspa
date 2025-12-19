import { Header } from "@/components/Header";
import { Confetti } from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import fundoImg from "@/assets/fundo.png";
import caixaPremiadaImg from "@/assets/caixa-premiada.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <>
      <Confetti />
      <div className="min-h-screen flex flex-col ">
       
        <main 
          className="flex-1 flex flex-col items-center justify-center px-4 mt-[-120px] pb-8 relative"
          style={{
            backgroundImage: `url(${fundoImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"  />
          
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
                className="w-64 md:w-72 h-auto drop-shadow-2xl animate-float"
              />
            </div>

             <p className="text-lg md:text-xl font-semibold leading-relaxed text-foreground px-2 animate-in fade-in slide-in-from-bottom duration-700 delay-150">
              Clique no botão abaixo para resgatar suas raspadinhas
            </p>

            <Button
              onClick={() => navigate("/scratch-game")}
              size="lg"
              className="gradient-button text-foreground font-bold text-lg px-12 py-6 rounded-full pulse-glow shadow-2xl hover:scale-105 transition-transform duration-300 animate-in zoom-in duration-700 delay-500 "
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
