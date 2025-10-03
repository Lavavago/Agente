import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Loader2, ShoppingBag, Volume2, VolumeX, Pause } from 'lucide-react';
import './ProductCatalog.css';

// ===============================================
// MOCK DEPENDENCIES
// ===============================================

// Componente Mock: AnimatedAvatar
const AnimatedAvatar = ({ mood, size }) => {
  const sizeClass = size === 'small' ? 'w-8 h-8' : size === 'large' ? 'w-full h-full' : 'w-10 h-10';
  const icon = mood === 'thinking' ? '🤔' : mood === 'happy' ? '😊' : '🤖';
  return (
    <div className={`rounded-full flex items-center justify-center flex-shrink-0 bg-blue-900 ${sizeClass} shadow-lg`}>
      <span className="text-white text-xl">{icon}</span>
    </div>
  );
};

// Hook Mock: useAvatarMood
const useAvatarMood = (messages, loading) => {
  const mood = loading ? 'thinking' : 'neutral';
  const isTyping = loading;
  const isThinking = loading;
  return { mood, isTyping, isThinking };
};

// Componente Mock: AudioControls
const AudioControls = ({ isEnabled, isSpeaking, onToggle, onStop, volume, onChangeVolume }) => {
    return (
        <div className="flex items-center space-x-3 bg-gray-100 p-2 rounded-full shadow-inner border border-gray-200">
            <button 
                onClick={onToggle} 
                className={`p-1 rounded-full transition-colors ${isEnabled ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600 hover:bg-gray-400'}`}
                title={isEnabled ? "Desactivar Audio" : "Activar Audio"}
            >
                {isEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            {isSpeaking && (
                <button 
                    onClick={onStop} 
                    className="p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    title="Detener Habla"
                >
                    <Pause className="w-4 h-4" />
                </button>
            )}
            {/* Control de Volumen simulado */}
            <div className="hidden sm:flex items-center space-x-2">
                <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                    disabled={!isEnabled}
                    className="w-16 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>
    );
};

// ===============================================
// LÓGICA DE LA APLICACIÓN (useApp)
// ===============================================

const mockProducts = [
  // CLAVE: He agregado una propiedad 'color' para facilitar el mockup visual de la 'imagen'
  { nombre: "Sillón Modular Lusso", descripcion: "Elegante sofá de tres plazas...", precio: 1200.00, descuento: 20, disponible: true, imagen: "https://placehold.co/120x120/4CAF50/ffffff?text=SOFA", color: "bg-green-600" },
  { nombre: "Mesa de Centro Nórdica", descripcion: "Madera de roble macizo...", precio: 350.50, descuento: 5, disponible: true, imagen: "https://placehold.co/120x120/3F51B5/ffffff?text=MESA", color: "bg-indigo-600" },
  { nombre: "Silla Ergonómica Pro", descripcion: "Malla transpirable y soporte lumbar...", precio: 180.99, descuento: 30, disponible: false, imagen: "https://placehold.co/120x120/9C27B0/ffffff?text=SILLA", color: "bg-purple-600" },
  { nombre: "Lámpara de Pie Minimalista", descripcion: "Diseño moderno en metal negro.", precio: 89.99, descuento: 0, disponible: true, imagen: "https://placehold.co/120x120/FF9800/ffffff?text=LAMP", color: "bg-orange-600" },
  { nombre: "Estantería Flotante Fina", descripcion: "Estantes de pared de alta resistencia.", precio: 65.00, descuento: 10, disponible: true, imagen: "https://placehold.co/120x120/00BCD4/ffffff?text=EST", color: "bg-cyan-600" },
  { nombre: "Escritorio Ejecutivo", descripcion: "Amplia superficie y cajones con llave.", precio: 499.00, descuento: 0, disponible: true, imagen: "https://placehold.co/120x120/FF5722/ffffff?text=ESC", color: "bg-deep-orange-600" },
];

let nextMessageId = 4;

// Hook useApp (Simula el contexto de la aplicación)
const useApp = () => {
  const mockProductsStable = useMemo(() => mockProducts, []);
    
  const initialMessages = useMemo(() => [
    { id: 1, sender: 'agent', text: '¡Hola! Soy tu asistente de diseño. ¿En qué puedo ayudarte hoy? Escribe "catálogo" para ver nuestros productos.', products: null, audio: { isEnabled: false } },
  ], []);

  const [messages, setMessages] = useState(initialMessages);
  const [loading, setLoading] = useState(false);
  const [audioState, setAudioState] = useState({ isEnabled: true, isSpeaking: false, volume: 1 });

  const sendMessage = useCallback(async (text) => {
    const userMessage = { id: nextMessageId++, sender: 'user', text, products: null };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simular API delay

    let agentResponseText = "Gracias por tu consulta. Dame un momento para buscar esa información.";
    let agentProducts = null; 
    
    const textLower = text.toLowerCase();

    // Simulación de audio
    if(audioState.isEnabled) {
        setAudioState(prev => ({ ...prev, isSpeaking: true }));
        setTimeout(() => {
          setAudioState(prev => ({ ...prev, isSpeaking: false }));
        }, 1000);
    }


    if (textLower.includes('hola')) {
        agentResponseText = "¡Hola! ¿Cómo estás? Dime qué producto te interesa o si buscas algo en particular.";
        agentProducts = null;
    } else if (textLower.includes('modular')) {
        agentResponseText = "¡Excelente elección! Aquí tienes el Sillón Modular Lusso:";
        agentProducts = mockProductsStable.filter(p => p.nombre.toLowerCase().includes('modular'));
    } else if (textLower.includes('catálogo') || textLower.includes('productos') || textLower.includes('ver catálogo')) {
        agentResponseText = "Estos son los productos disponibles en nuestro catálogo más popular:";
        agentProducts = mockProductsStable; 
    } else if (textLower.includes('populares')) {
        agentResponseText = "Estos son nuestros productos más populares en este momento:";
        agentProducts = mockProductsStable.filter(p => p.descuento > 10); 
    } else if (textLower.includes('mesas')) {
        agentResponseText = "Encontramos las siguientes mesas para ti:";
        agentProducts = mockProductsStable.filter(p => p.nombre.toLowerCase().includes('mesa')); 
    }

    setMessages(prev => [...prev, { id: nextMessageId++, sender: 'agent', text: agentResponseText, products: agentProducts }]);
    setLoading(false);
  }, [mockProductsStable, audioState.isEnabled]); 

  return {
    messages,
    loading,
    error: null,
    sendMessage,
    products: mockProductsStable, 
    audio: {
        ...audioState,
        toggleAudio: () => setAudioState(prev => ({ ...prev, isEnabled: !prev.isEnabled })),
        stopSpeaking: () => setAudioState(prev => ({ ...prev, isSpeaking: false })),
        changeVolume: (v) => setAudioState(prev => ({ ...prev, volume: v }))
    }
  };
};

// ===============================================
// 1. COMPONENTES DE VISUALIZACIÓN DE PRODUCTOS
// (Implementa el diseño de 2 columnas compacto)
// ===============================================

const ProductCard = ({ product }) => {
  const basePrice = product.precio || 0; 
  const discount = product.descuento || 0;
  // Calculamos el precio final y lo redondeamos a 2 decimales
  const finalPrice = (basePrice * (1 - discount / 100)).toFixed(2);
  const basePriceFormatted = basePrice.toFixed(2);
  
  // Estado para mostrar/ocultar el formulario de compra
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  
  // URL de imagen por defecto si no hay imagen
  const defaultImageUrl = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48";
  
  return (
    <div className="product-card"> 
      
      {/* Imagen del producto */}
      <div className="product-card-image" style={{
        backgroundImage: `url(${product.imagen || defaultImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        {/* Etiqueta de disponibilidad */}
        <div className={`product-card-tag ${product.disponible ? 'tag-available' : 'tag-sold-out'}`}>
          {product.disponible ? 'DISPONIBLE' : 'AGOTADO'}
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="product-card-content"> 
        
        {/* Nombre del Producto */}
        <h3 className="product-card-name">
          {product.nombre}
        </h3>
        
        {/* Precios y Descuento */}
        <div className="product-card-price-group"> 
          
          {/* Precio actual */}
          <span className="product-card-price">
            {`$${finalPrice}`}
          </span>
          
          {/* Precio anterior (tachado) */}
          {discount > 0 && (
            <span className="product-card-old-price">
              ${basePriceFormatted}
            </span>
          )}
          
          {/* Descuento */}
          {discount > 0 && (
            <span className="product-card-discount">
              -{discount}%
            </span>
          )}
        </div>
        
        {/* Botón de acción */}
        <div 
          className="product-card-action" 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowPurchaseForm(true);
          }}
          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
        >
          <ShoppingBag className="w-4 h-4" />
        </div>
      </div>
      
      {/* Formulario de compra */}
       {showPurchaseForm && (
         <div 
           className="purchase-form-overlay"
           onClick={(e) => {
             // Solo cerrar si se hace clic en el overlay, no en el formulario
             if (e.target.className === 'purchase-form-overlay') {
               setShowPurchaseForm(false);
             }
           }}
         >
           <div className="purchase-form-container" onClick={(e) => e.stopPropagation()}>
             <h3>Comprar {product.nombre}</h3>
             <form className="purchase-form">
               <input type="text" placeholder="Nombre completo" required />
               <input type="email" placeholder="Email" required />
               <input type="tel" placeholder="Teléfono" required />
               <input type="text" placeholder="Dirección de envío" required />
               
               {/* Campos de tarjeta de crédito */}
               <div className="card-section">
                 <h4>Información de pago</h4>
                 <input type="text" placeholder="Número de tarjeta" required />
                 <div className="card-details">
                   <input type="text" placeholder="MM/AA" required />
                   <input type="text" placeholder="CVV" required />
                 </div>
                 <input type="text" placeholder="Nombre en la tarjeta" required />
               </div>
               
               <div className="form-actions">
                 <button 
                   type="button" 
                   onClick={() => setShowPurchaseForm(false)}
                   className="cancel-button"
                 >
                   Cancelar
                 </button>
                 <button 
                   type="submit" 
                   onClick={(e) => {
                     e.preventDefault();
                     alert(`¡Gracias por tu compra de ${product.nombre}!`);
                     setShowPurchaseForm(false);
                   }}
                   className="confirm-button"
                 >
                   Confirmar Compra
                 </button>
               </div>
             </form>
           </div>
         </div>
       )}
    </div>
  );
};

// Componente para la rejilla de productos
const ProductsGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
        <div className="text-center text-[10px] text-gray-500 mt-2 p-1 border border-dashed rounded-lg bg-gray-100 w-full">
            No se encontraron productos válidos para mostrar.
        </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 mt-2 p-4 bg-gray-50 rounded-xl shadow-inner w-full" style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)'}}> 
      {products.map((product, index) => (
        <ProductCard key={product.nombre + index + product.precio} product={product} /> 
      ))}
    </div>
  );
};

// ===============================================
// 2. COMPONENTE DE MENSAJE
// ===============================================

const ChatMessage = ({ message, mood, isTyping, isThinking }) => {
  const isUser = message.sender === 'user';
  const productsToShow = message.products; 
  
  const messageTextLower = message.text ? message.text.toLowerCase() : '';
  const isCatalogMessage = messageTextLower.includes('catálogo') ||
                           messageTextLower.includes('productos disponibles');

  const messageClass = isUser ? 'user-message' : 'agent-message';
  
  // CLAVE: Determina si el mensaje del agente debe tener el estilo de ancho completo
     const contentClass = isUser 
    ? 'message-content user-message-content' 
    : productsToShow && productsToShow.length > 0
      // Aplicamos la clase message-agent-products para los mensajes con productos
      ? 'message-content agent-message-content message-agent-products w-full'
      : 'message-content agent-message-content';

  const isProductListEmpty = productsToShow && productsToShow.length === 0;
  
  const shouldSuppressAgentText = !isUser && isCatalogMessage && isProductListEmpty;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`message ${messageClass}`}
    >
      <div className="message-avatar">
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <AnimatedAvatar 
            mood={mood}
            isTyping={isTyping}
            isThinking={isThinking}
            size="small"
          />
        )}
      </div>
      <div className={contentClass}>
        {/* RENDERIZADO DEL TEXTO */}
        {!shouldSuppressAgentText && <p>{message.text}</p>}
        
        {/* RENDERIZADO CRÍTICO DEL CATÁLOGO */}
        {productsToShow && productsToShow.length > 0 && <ProductsGrid products={productsToShow} />}

        {/* Mensaje de no encontrados */}
        {isProductListEmpty && isCatalogMessage && (
            <ProductsGrid products={[]} />
        )}
      </div>
    </motion.div>
  );
};

// ===============================================
// 3. COMPONENTE PRINCIPAL (FurnitureGPTDesign)
// ===============================================

export default function FurnitureGPTDesign() {
  const { messages, loading, sendMessage, audio } = useApp();
  
  const [inputMessage, setInputMessage] = useState('');
  const chatContainerRef = useRef(null);
  const { mood, isTyping, isThinking } = useAvatarMood(messages, loading);

  const handleSendMessage = async (message) => {
    await sendMessage(message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !loading) {
      handleSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleQuickMessage = (message) => {
    if (!loading) { 
        handleSendMessage(message);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="furniture-gpt-container">
      <div className="container">
        <header className="header">
          <h1 className="title">ServicioAgente - Consulta con IA</h1>
          <div className="logo-placeholder">
            <AnimatedAvatar 
              mood={mood}
              isTyping={isTyping}
              isThinking={isThinking}
              size="large"
            />
          </div>
        </header>
        
        {/* Audio Controls */}
        <div className="audio-controls-container">
          <AudioControls
            isEnabled={audio.isEnabled}
            isSpeaking={audio.isSpeaking}
            volume={audio.volume}
            onToggle={audio.toggleAudio}
            onStop={audio.stopSpeaking}
            onChangeVolume={audio.changeVolume}
          />
        </div>
        
        <main className="content">
          <p className="welcome-text">¡Bienvenido! Consulta productos y obtén respuestas inteligentes.</p>
          <p className="slogan">Revoluciona tu experiencia de compra con IA</p>
          
          <div className="options-container">
            <button 
              className="option-button"
              onClick={() => handleQuickMessage('Ver catálogo')}
              disabled={loading}
            >
              Ver catálogo más popular
            </button>
            <button 
              className="option-button"
              onClick={() => handleQuickMessage('Productos populares')}
              disabled={loading}
            >
              Productos más populares
            </button>
            <button 
              className="option-button"
              onClick={() => handleQuickMessage('modular')}
              disabled={loading}
            >
              Buscar sillones modulares
            </button>
            <button 
              className="option-button"
              onClick={() => handleQuickMessage('Hola')}
              disabled={loading}
            >
              Saluda al agente
            </button>
          </div>

          {/* Chat Messages Area */}
          {messages.length > 0 && (
            <div 
              ref={chatContainerRef}
              className="chat-messages"
            >
              <AnimatePresence>
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    mood={mood}
                    isTyping={isTyping}
                    isThinking={isThinking}
                  />
                ))}
              </AnimatePresence>
              
              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="agent-message"
                >
                  <div className="message-avatar">
                    <AnimatedAvatar 
                      mood="typing"
                      isTyping={true}
                      isThinking={false}
                      size="small"
                    />
                  </div>
                  <div className="message-content typing">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="input-container">
            <input 
              type="text" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Pregúntame cualquier cosa..." 
              className="input-field" 
              disabled={loading}
            />
            <button type="submit" className="upload-button" disabled={loading || !inputMessage.trim()}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </main>
      </div>
      
      {/* Estilos CSS Base */}
      <style>{`
        .furniture-gpt-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background-color: #f0f4f8;
          margin: 0;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        .container {
          width: 90%;
          max-width: 800px;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          padding: 30px;
          text-align: center;
          box-sizing: border-box;
        }
        
        @media (max-width: 640px) {
            .container {
                padding: 20px 15px;
            }
        }

        .header {
          margin-bottom: 1rem;
        }

        .audio-controls-container {
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
        }

        .title {
          font-size: 2rem;
          font-weight: 700;
          color: #1e3a8a; /* Azul corporativo */
        }
        
        @media (max-width: 640px) {
            .title {
                font-size: 1.5rem;
            }
        }

        .logo-placeholder {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin: 1.5rem auto 1rem;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
          background: #3b82f6; 
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .welcome-text {
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .slogan {
          font-size: 0.9rem;
          color: #6b7280;
          margin-top: 0;
        }

        .options-container {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-top: 1.5rem;
          margin-bottom: 2rem;
        }

        .option-button {
          background-color: #e5e7eb;
          border: 1px solid #d1d5db;
          border-radius: 25px; 
          padding: 8px 15px;
          font-size: 0.85rem;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .option-button:hover:not(:disabled) {
          background-color: #d1d5db;
          color: #1f2937;
          transform: translateY(-1px);
        }
        
        .option-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: #f0f0f0;
          transform: none;
        }

        .chat-messages {
          max-height: 450px; 
          overflow-y: auto;
          margin: 1rem 0;
          text-align: left;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 1rem;
          background-color: #fafafa;
          scroll-behavior: smooth;
        }

        .chat-messages::-webkit-scrollbar {
            width: 6px;
        }
        .chat-messages::-webkit-scrollbar-thumb {
            background-color: #c9d8e5;
            border-radius: 3px;
        }
        .chat-messages::-webkit-scrollbar-track {
            background-color: #f0f4f8;
        }


        .message {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .user-message {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user-message .message-avatar {
          background: #1e3a8a;
          color: white;
        }

        .agent-message .message-avatar {
          background: #3b82f6; 
          color: white;
        }

        .message-content {
          background: white;
          padding: 12px 16px;
          border-radius: 18px;
          max-width: 75%; 
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          font-size: 0.9rem;
          line-height: 1.4;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px; 
          white-space: pre-wrap; 
        }
        
        /* Asegura que el contenedor se expanda para la lista de productos */
        .agent-message-with-products {
          max-width: 100% !important; 
          padding: 10px; 
          background-color: #ffffff; 
          border: 1px solid #e5e7eb;
          align-items: stretch;
        }

        .message-content p {
          margin: 0; 
          padding: 0 6px; 
          color: inherit;
        }


        .user-message .message-content {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
          border-bottom-right-radius: 2px;
        }
        
        .agent-message .message-content {
            border-bottom-left-radius: 2px;
        }

        .typing {
          display: flex;
          align-items: center;
          background: #e9ecef;
          padding: 12px;
          border-radius: 18px;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
        }

        .typing-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #999;
          animation: typing 1.4s infinite ease-in-out;
        }

        @keyframes typing {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        .input-container {
          display: flex;
          align-items: center;
          border: 1px solid #c9d8e5;
          border-radius: 25px;
          padding: 6px 15px;
          margin-top: 2rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          background-color: #fff;
        }

        .input-field {
          flex-grow: 1;
          border: none;
          font-size: 1rem;
          padding: 5px;
          outline: none;
          background: none;
        }

        .upload-button {
          background: #3b82f6;
          border: none;
          cursor: pointer;
          padding: 10px;
          margin-left: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          border-radius: 50%;
          transition: background-color 0.3s ease, transform 0.1s ease;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
        }

        .upload-button:hover:not(:disabled) {
          background-color: #2563eb;
          transform: scale(1.05);
        }

        .upload-button:disabled {
          opacity: 0.6;
          background-color: #93c5fd;
          cursor: not-allowed;
        }





        .agent-message .message-content.agent-message-with-products {
  /* ¡LA CLAVE! Forzar al 100% de ancho disponible dentro del contenedor padre */
  max-width: 100% !important; 
  width: 100% !important; 
  
  /* Estilos visuales del catálogo */
  padding: 10px; 
  background-color: #f7f9fb; 
  border: 1px solid #e5e7eb;
  align-items: stretch;
  border-bottom-left-radius: 18px !important; 
}

      `}</style>
    </div>
  );
}
