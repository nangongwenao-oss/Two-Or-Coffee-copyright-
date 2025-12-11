import React, { useState } from 'react';
import { CoffeeHero } from '../types';

interface CoffeeCardProps {
  item: CoffeeHero;
  imageUrl: string | null | undefined;
  onAddToCart: (item: CoffeeHero) => void;
  isLoadingImage: boolean;
}

const CoffeeCard: React.FC<CoffeeCardProps> = ({ item, imageUrl, onAddToCart, isLoadingImage }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(item);
  };

  return (
    <div className="relative w-full h-[450px] perspective-1000 group cursor-pointer" onClick={handleCardClick}>
      <div 
        className={`relative w-full h-full duration-700 transform-style-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* FRONT SIDE (The "Back" of the playing card - Logo/Info) */}
        <div className="absolute w-full h-full backface-hidden rounded-xl shadow-2xl overflow-hidden border-2 border-slate-800 bg-[#E6D7C3]">
          
          {/* Card Border Design */}
          <div className="absolute inset-2 border-2 border-slate-600 border-dashed rounded-lg flex flex-col items-center justify-between p-4">
            
            {/* Top Stats */}
            <div className="w-full flex justify-between font-mono text-xs text-slate-700">
              <span>ATK/999</span>
              <span>DEF/888</span>
            </div>

            {/* Central Logo/Text */}
            <div className="text-center space-y-4">
               <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center border-4 border-[#333]">
                  <span className="text-4xl">☕</span>
               </div>
               <h2 className="text-3xl font-black text-slate-900 font-wuxia tracking-widest">{item.name}</h2>
               <p className="text-slate-600 font-mono text-sm uppercase tracking-tighter">Two Or Coffee</p>
               <div className="bg-slate-900 text-[#E6D7C3] px-4 py-1 rounded-full font-bold">
                 ¥ {item.price}
               </div>
            </div>

            {/* Bottom Tech Deco */}
            <div className="w-full">
              <div className="h-1 w-full bg-slate-400 mb-1"></div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>SERIES: SHUIHU</span>
                <span>NO. {item.id.toUpperCase().slice(0, 3)}</span>
              </div>
            </div>
          </div>
          
          {/* Holographic overlay hint */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </div>

        {/* BACK SIDE (The "Front" of the playing card - Character Image) */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-black">
          {isLoadingImage ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#00ffcc] font-mono animate-pulse bg-slate-900">
               <span className="text-4xl mb-4">⚡</span>
               <span>DOWNLOADING HERO...</span>
               <span className="text-xs mt-2 text-slate-500">NEURAL LINK ACTIVE</span>
            </div>
          ) : imageUrl ? (
            <>
              <img src={imageUrl} alt={item.character} className="w-full h-full object-cover" />
              
              {/* Overlay UI */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 text-white">
                <h3 className="text-xl font-bold font-wuxia text-[#00ffcc] drop-shadow-[0_0_5px_rgba(0,255,204,0.8)]">
                  {item.character}
                </h3>
                <p className="text-xs text-slate-300 mb-3 font-mono line-clamp-2">{item.description}</p>
                
                <button 
                  onClick={handleBuyClick}
                  className="w-full bg-[#ff003c] hover:bg-[#d40032] text-white font-mono font-bold py-3 px-4 rounded-sm clip-path-polygon border-l-4 border-white active:scale-95 transition-transform flex items-center justify-center gap-2"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 95% 100%, 0 100%)'}}
                >
                  <span>ORDER NOW</span>
                  <span className="text-xs bg-black/20 px-1 rounded">¥{item.price}</span>
                </button>
              </div>
              
              {/* Rarity Tag */}
              <div className="absolute top-2 right-2 bg-yellow-500 text-black font-bold text-xs px-2 py-1 rounded shadow border border-white transform rotate-3">
                SSR
              </div>
            </>
          ) : (
            // FALLBACK / NO API KEY STATE
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-6 text-center border-4 border-slate-800 relative overflow-hidden">
               {/* Grid Background */}
               <div className="absolute inset-0 opacity-10" 
                    style={{ backgroundImage: 'linear-gradient(#00ffcc 1px, transparent 1px), linear-gradient(90deg, #00ffcc 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
               </div>
               
               <div className="z-10 bg-black/50 p-4 rounded-xl backdrop-blur-sm border border-slate-700">
                  <div className="text-6xl mb-4 opacity-50">🚫</div>
                  <h3 className="text-xl font-bold font-mono text-red-500 mb-2">SIGNAL LOST</h3>
                  <p className="text-xs text-slate-400 font-mono mb-4">
                     HERO DATA ENCRYPTED.<br/>
                     API_KEY REQUIRED FOR<br/>
                     VISUAL DECRYPTION.
                  </p>
                  <button 
                    onClick={handleBuyClick}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-mono text-xs font-bold py-2 px-4 rounded"
                  >
                    BLIND ORDER (¥{item.price})
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoffeeCard;