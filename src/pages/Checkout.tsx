import { useState, useEffect } from 'react';
import { ShoppingBag, Star, Tag, TruckIcon, CreditCard } from 'lucide-react';

function Checkout() {
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5:00

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handlePayment = () => {
    window.location.href = 'https://seucheckout.com';
  };

  return (
    <div className="min-h-screen bg-white font-['TikTok_Sans'] flex flex-col">
      <main className="max-w-md mx-auto px-3 flex-1 flex flex-col w-full">
        
        {/* Cabeçalho */}
        <header className="mb-1 pt-3">
          <h1 
            className="text-black mb-1 text-center" 
            style={{ 
              fontSize: '16px', 
              fontFamily: "'TikTok Sans', sans-serif",
              fontWeight: 700
            }}
          >
            Resumo do pedido
          </h1>
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <CreditCard className="w-3.5 h-3.5" style={{ color: '#13599a' }} />
            <span 
              className="text-xs" 
              style={{ 
                fontSize: '11px', 
                color: '#13599a',
                fontFamily: "'TikTok Sans', sans-serif",
                fontWeight: 600
              }}
            >
              Finalização da compra segura garantida
            </span>
          </div>
          
   <div
  className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-2"
  style={{
    width: '100vw',
    height: '15px',
    backgroundImage: "url('/images/gradi.jpg')",
    backgroundRepeat: 'repeat-x',
    backgroundSize: 'auto 100%',
    backgroundPosition: 'center',
  }}
/>

        </header>

        {/* Produto - Raspadinha */}
        <section className="mb-2 flex-shrink-0">
          <div className="mb-3">
            <h2 className="text-base font-bold text-black" style={{ fontSize: '15px' }}>
              Raspadinha TikTok Shop
            </h2>
           
          </div>
           <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 text-[#b27e09] fill-[#b27e09]" />
              <span className="text-xs font-medium text-[#b27e09]" style={{ fontSize: '11px' }}>
                Melhor escolha! 549 unidades resgatadas hoje
              </span>
            </div>

          {/* Card do produto */}
          <div className="bg-white p-3 mb-1">
            <div className="flex items-start gap-2">
              {/* Imagem do produto */}
              <div className="flex-shrink-0">
                <img
                  src="/images/jbl.png"
                  alt="Caixa De Som Boombox 3 Bluetooth"
                  className="w-16 h-16 object-contain"
                />
              </div>

              {/* Informações do produto */}
              <div className="flex-1 min-w-0">
                {/* Nome do Produto */}
                <h3 className="font-semibold text-gray-600 text-sm" style={{ fontSize: '13px', lineHeight: '0.5' }}>
                  Caixa De Som Boombox 3 Bluetooth
                </h3>

                {/* Badge "Caixa de som" */}
                <div className="">
                  <span className="text-gray-600 text-xs font-semibold"
                    style={{ fontFamily: "'TikTok Sans', sans-serif", fontSize: '11px' }}>
                    Caixa de som
                  </span>
                </div>

                {/* Devolução gratuita */}
                <div className="inline-flex items-center px-1 py-[2px] bg-gray-100 rounded-md ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 text-[#F8CB1D]"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM15.7071 9.29289C16.0976 9.68342 16.0976 10.3166 15.7071 10.7071L12.0243 14.3899C11.4586 14.9556 10.5414 14.9556 9.97568 14.3899L8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929C8.68342 10.9024 9.31658 10.9024 9.70711 11.2929L11 12.5858L14.2929 9.29289C14.6834 8.90237 15.3166 8.90237 15.7071 9.29289Z"
                    />
                  </svg>
                 <span className=" font-semibold text-[9px] text-gray-700 ml-1">
                    Devolução gratuita
                  </span>
                </div>

                {/* Preços com selector */}
                <div className="flex items-center justify-between ">
                  <div className="flex flex-col gap-[1px]">
                    <div className="flex items-center ">
                      <span className="text-base font-extrabold text-[#E11D48]" style={{ fontSize: '14px' }}>
                        R$ 00,00
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-[1px]">
                      <span className="text-xs text-gray-400 line-through">R$ 2.849,05</span>
                      <span className="px-1 py-0.5 bg-red-100 text-[#E11D48] text-xs font-extrabold rounded"
                        style={{ fontFamily: "'TikTok Sans', sans-serif", fontSize: '10px' }}>
                        -100%
                      </span>
                    </div>
                  </div>
                  
                  {/* Selector de quantidade */}
                  <div className="flex items-center gap-[1px] bg-gray-100 rounded px-2 py-1">
                    <button className="text-gray-700 hover:text-gray-900 font-bold text-sm border-r border-gray-300 pr-2">
  –
</button>

                    <span className="font-medium text-gray-800 mx-1 text-sm" style={{ color: '#374151' }}>1</span>
                    <button className="text-gray-700 hover:text-gray-900 font-bold text-sm border-l border-gray-300 pl-2">
  +
</button>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desconto TikTok Shop - COM BORDAS QUE SAEM 100% */}
          <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen py-2 my-2 border-y-8 border-gray-200">
            <div className="max-w-md mx-auto px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-[#ED2549]"
                  fill="none"
                >
                  {/* Contorno */}
                  <path
                    d="M20 12c0-1.1.9-2 2-2V6
                      c0-1.1-.9-2-2-2H4
                      C2.9 4 2 4.9 2 6v4
                      c1.1 0 2 .9 2 2s-.9 2-2 2v4
                      c0 1.1.9 2 2 2h16
                      c1.1 0 2-.9 2-2v-4
                      c-1.1 0-2-.9-2-2z"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Check */}
                  <path
                    d="M8 12.5l2.2 2.2L16 9"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                  <span
                    className="text-xs font-bold text-gray-800"
                    style={{ fontFamily: "'TikTok Sans', sans-serif", fontSize: '15px' }}
                  >
                    Desconto do TikTok Shop
                  </span>
                </div>
                <span
                  className="px-2 py-0.5 bg-pink-100 text-[#E11D48] text-xs font-extrabold rounded"
                  style={{ fontFamily: "'TikTok Sans', sans-serif", fontSize: '15px' }}
                >
                  - 100%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Resumo do pedido */}
        <section className="mb-3 flex-shrink-0">
          <h2 className="text-base font-bold text-black mb-3" style={{ fontSize: '15px' }}>
            Resumo do pedido
          </h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-extrabold text-sm text-gray-900">Subtotal do produto</span>
              <span className=" font-extrabold text-sm text-gray-600 mr-4">R$ 00,00</span>
            </div>
          
            <div className="p-2 ">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-xs text-gray-900">Preço Original</span>
              <span className="font-semibold text-xs text-gray-600 line-through">R$ 2.849,05</span>  
            </div>
            
            <div className="flex justify-between ">
              <span className=" font-semibold text-xs text-gray-900">Desconto da Raspadinha</span>
              <span className="font-semibold text-xs font-medium text-red-600">- R$ 2.849,05</span>
            </div>
            </div>
          </div>
        </section>

        {/* Badge economia - COM BORDAS QUE SAEM 100% */}
        <div className=" flex-shrink-0 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
          <div className="bg-pink-100 border-y border-pink-100">
            <div className="max-w-md mx-auto px-3 py-2">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-[#ED2549]"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM8.39747 15.5534C8.64413 15.2206 9.11385 15.1508 9.44661 15.3975C10.175 15.9373 11.0541 16.25 12 16.25C12.9459 16.25 13.825 15.9373 14.5534 15.3975C14.8862 15.1508 15.3559 15.2206 15.6025 15.5534C15.8492 15.8862 15.7794 16.3559 15.4466 16.6025C14.4742 17.3233 13.285 17.75 12 17.75C10.715 17.75 9.5258 17.3233 8.55339 16.6025C8.22062 16.3559 8.15082 15.8862 8.39747 15.5534Z"
                  />
                  <path d="M16 10.5C16 11.3284 15.5523 12 15 12C14.4477 12 14 11.3284 14 10.5C14 9.67157 14.4477 9 15 9C15.5523 9 16 9.67157 16 10.5Z" />
                  <path d="M10 10.5C10 11.3284 9.55229 12 9 12C8.44772 12 8 11.3284 8 10.5C8 9.67157 8.44772 9 9 9C9.55229 9 10 9.67157 10 10.5Z" />
                </svg>
                <span className="text-xs font-medium text-rose-900">
                  Você está economizando <strong className="font-bold">R$ 2.849,00</strong> nesse pedido.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mb-1 p-2 flex-shrink-0">
          <span className="text-base font-bold text-gray-900" style={{ fontSize: '16px' }} >Total (1 item)</span>
          <span className="text-lg font-bold text-[#E11D48]" style={{ fontSize: '16px' }}>
            R$ 00,00
          </span>
        </div>

        {/* Caixa de aviso principal */}
        <div className=" p-2 border border-dashed border-pink-500 bg-pink-50 rounded-lg flex-shrink-0">
          <p
            className="text-xs font-bold text-gray-900 text-center"
            style={{ fontSize: '12px', lineHeight: '1.4' }}
          >
            Você ganhou um produto grátis na Raspadinha do TikTok Shop. O desconto é válido exclusivamente para o item resgatado. Para concluir o envio, informe o endereço e pague somente o frete.
          </p>
        </div>

        {/* Frete */}
       <div className="flex mb-2 items-center gap-2  p-2 rounded-lg flex-shrink-0 ml-10">
          <TruckIcon className="w-4 h-4 text-red-500" />
          <div className="flex items-center text-xs text-gray-700 ">
            Calcule o seu frete clicando no botão abaixo
          </div>
        </div>

        {/* Botão principal - FIXADO no final */}
       
          <button
            onClick={handlePayment}
            className="w-full bg-[#F43F5E] text-white font-bold py-3 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
            style={{ 
              fontSize: '15px',
              fontFamily: "'TikTok Sans', sans-serif",
              fontWeight: 700
            }}
          >
            Fazer pedido
            <div className="text-xs font-normal text-pink-100 mt-1">
              Seu prêmio se expira em {formatTime(timeLeft)}
            </div>
          </button>
    
      </main>
    </div>
  );
}

export default Checkout;