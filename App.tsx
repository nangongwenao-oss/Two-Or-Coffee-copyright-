import React, { useState, useEffect } from 'react';
import { COFFEE_MENU } from './constants';
import { CoffeeHero, CartItem, GeneratedImageMap } from './types';
import CoffeeCard from './components/CoffeeCard';
import { generateCharacterCard } from './services/geminiService';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [images, setImages] = useState<GeneratedImageMap>({});
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [generationStarted, setGenerationStarted] = useState(false);

  // Initialize images on load (sequentially to avoid rate limits if any)
  useEffect(() => {
    const loadImages = async () => {
      setGenerationStarted(true);
      for (const item of COFFEE_MENU) {
        setLoadingImages(prev => ({ ...prev, [item.id]: true }));
        try {
          const url = await generateCharacterCard(item.prompt, item.id);
          setImages(prev => ({ ...prev, [item.id]: url }));
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingImages(prev => ({ ...prev, [item.id]: false }));
        }
      }
    };

    if (!generationStarted) {
      loadImages();
    }
  }, [generationStarted]);

  const addToCart = (item: CoffeeHero) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen pb-24 overflow-x-hidden">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#2a2a2a] border-b-4 border-[#ff003c] shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-10 h-10 bg-[#E6D7C3] rounded flex items-center justify-center text-2xl border-2 border-white">
               二
             </div>
             <div>
               <h1 className="text-white font-black text-xl leading-none tracking-widest uppercase">Two Or Coffee</h1>
               <span className="text-[#00ffcc] text-xs font-mono">SYSTEM.ONLINE // 二货咖啡</span>
             </div>
          </div>
          
          <button 
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative p-2 text-[#00ffcc] hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#ff003c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-wuxia text-slate-800 mb-2">梁山泊 · 咖啡义结</h2>
          <p className="font-mono text-slate-600 text-sm">TAP CARD TO REVEAL HERO & ORDER</p>
          <div className="w-24 h-1 bg-slate-800 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {COFFEE_MENU.map((item) => (
            <CoffeeCard 
              key={item.id} 
              item={item} 
              imageUrl={images[item.id]} 
              onAddToCart={addToCart}
              isLoadingImage={loadingImages[item.id] || !images[item.id]}
            />
          ))}
        </div>
      </main>

      {/* FLOATING CART SUMMARY (Mobile Sticky) */}
      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 z-40">
           <button 
             onClick={() => setIsCartOpen(true)}
             className="w-full bg-slate-900 text-[#00ffcc] border-2 border-[#00ffcc] shadow-[0_0_15px_rgba(0,255,204,0.3)] py-4 px-6 rounded-lg flex justify-between items-center font-mono font-bold"
           >
             <span>{cart.length} ITEMS</span>
             <span>TOTAL: ¥{totalAmount}</span>
           </button>
        </div>
      )}

      {/* CART MODAL / DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-[#D6C6B0] w-full max-w-md max-h-[90vh] sm:rounded-2xl rounded-t-2xl flex flex-col shadow-2xl overflow-hidden border-4 border-slate-900">
            
            {/* Cart Header */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center border-b-4 border-[#ff003c]">
              <h2 className="text-xl font-mono font-bold text-[#00ffcc]">YOUR LOOT</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-white hover:text-[#ff003c] text-2xl">&times;</button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-10 opacity-50 font-mono">
                  <p>EMPTY STASH</p>
                  <p className="text-xs mt-2">Go recruit some heroes.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-white/50 p-3 rounded border border-slate-400">
                    <div>
                      <h4 className="font-bold text-slate-900">{item.name}</h4>
                      <p className="text-xs text-slate-600 font-mono">¥{item.price} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">¥{item.price * item.quantity}</span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            <div className="p-4 bg-white border-t border-slate-300">
              <div className="flex justify-between items-center mb-4 text-xl font-black text-slate-900">
                <span>TOTAL</span>
                <span>¥ {totalAmount}</span>
              </div>
              <button 
                disabled={cart.length === 0}
                className="w-full bg-[#ff003c] text-white font-mono font-bold py-4 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d40032] transition-colors"
                onClick={() => {
                  alert('ORDER SENT TO THE MARSHES! (Demo only)');
                  setCart([]);
                  setIsCartOpen(false);
                }}
              >
                CONFIRM DEPLOYMENT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;