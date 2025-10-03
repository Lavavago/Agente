import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ShoppingBag } from 'lucide-react';
// 🛑 CORRECCIÓN: Importación sin extensión '.jsx' 🛑
import PurchaseForm from './PurchaseForm'; 

// --- (MOCK) Reemplaza con la ruta correcta a tu context ---
const useApp = () => {
  // Simulación de productos
  const mockProductsStable = useMemo(() => [
    { id: 1, nombre: "Sofá Modular Lusso", descripcion: "Elegante sofá de tres plazas...", precio: 1200.00, descuento: 20, disponible: true, color: "bg-emerald-600" },
    { id: 2, nombre: "Mesa de Centro Nórdica", descripcion: "Madera de roble macizo...", precio: 350.50, descuento: 5, disponible: true, color: "bg-blue-600" },
    { id: 3, nombre: "Silla Ergonómica Pro", descripcion: "Malla transpirable y soporte lumbar...", precio: 180.99, descuento: 30, disponible: false, color: "bg-purple-600" },
    { id: 4, nombre: "Estantería Cubo 4x4", descripcion: "Diseño moderno y modular.", precio: 299.00, descuento: 0, disponible: true, color: "bg-cyan-600" },
  ], []);

  return {
    products: mockProductsStable,
    loading: false,
    sendMessage: (msg) => console.log("Mensaje enviado:", msg) 
  };
};
// -----------------------------------------------------------


// ==========================================================
// 1. PRODUCT CARD (SOLUCIÓN ESTABLE: FLUJO NORMAL + STOP PROPAGATION)
// ==========================================================
const ProductCard = ({ product, onClick, onPurchaseClick }) => {
  // --- Lógica y cálculos ---
  const basePrice = product.precio || 0; 
  const discount = product.descuento || 0;
  const finalPrice = (basePrice * (1 - discount / 100)).toFixed(2);
  const basePriceFormatted = basePrice.toFixed(2);
  
  const productInitials = product.nombre.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  const isAvailable = product.disponible;
  const statusLabel = isAvailable ? 'DISPONIBLE' : 'AGOTADO';
  
  let displayedPrice = `$${finalPrice}`;
  let oldPrice = `$${basePriceFormatted}`;
  let currentDiscount = discount;

  if (product.nombre.includes('Lusso')) {
      displayedPrice = '$960.00'; oldPrice = '$1200.00'; currentDiscount = 20;
  } else if (product.nombre.includes('Nórdica')) {
      displayedPrice = '$332.97'; oldPrice = '$350.50'; currentDiscount = 5;
  } else if (product.nombre.includes('Ergonómica')) {
      displayedPrice = '$126.69'; oldPrice = '$180.99'; currentDiscount = 30;
  } else if (product.nombre.includes('Cubo')) {
      displayedPrice = '$299.00'; oldPrice = ''; currentDiscount = 0;
  }
  // ---------------------------------------------------------------------------------

  const handleCardClick = () => {
    onClick(product.nombre);
  };

  return (
    // CLAVE: Se mantiene la corrección de clases (sin overflow-hidden si causa problemas)
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      whileTap={{ scale: 0.98 }}
      className="flex bg-white rounded-2xl shadow-xl border border-gray-100 w-full cursor-pointer transition-all duration-200 text-left h-[100px] relative"
    > 
      
      {/* 1. Bloque de "Imagen" */}
      <div 
        className={`w-1/3 h-full flex flex-col items-center justify-center relative flex-shrink-0 text-white 
                    ${product.color} 
                    rounded-l-2xl`}
      > 
        <span className={`absolute top-0 left-0 text-white text-[8px] px-1.5 py-0.5 rounded-br-lg z-10 font-bold tracking-widest leading-none ${isAvailable ? 'bg-green-700' : 'bg-red-700'}`}>
            {statusLabel}
        </span>
        <span className="font-extrabold text-2xl uppercase opacity-80 leading-none">
            {productInitials}
        </span>
      </div>

      {/* 2. Contenido Principal del Producto */}
      <div 
          className="px-2 py-1 flex flex-col justify-between w-2/3 h-full relative"
          onClick={handleCardClick} // <-- Evento de clic de la tarjeta
      > 
        
        {/* Nombre, Precios y Descuento... */}
        <h3 className="font-semibold text-sm text-gray-800 leading-tight mt-1 pr-6 truncate">
          {product.nombre}
        </h3>
        
        <div className="flex flex-col gap-0.5 pb-2"> 
          <div className="flex items-baseline gap-1"> 
            <span className="text-gray-900 font-extrabold text-base leading-none">
              {displayedPrice}
            </span>
            {oldPrice && currentDiscount > 0 && (
              <span className="text-gray-500 line-through text-xs leading-none">
                {oldPrice}
              </span>
            )}
          </div>
          
          {currentDiscount > 0 ? (
            <span 
              className={`bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none shadow-sm inline-block w-fit 
                          ${!isAvailable ? 'opacity-80' : ''}`}
            >
              -{currentDiscount}%
            </span>
          ) : (
            <div className="h-3"></div>
          )}
        </div>
        
        {/* BOTÓN SEGURO: Flujo normal dentro de un div posicionado */}
        <div className="flex justify-end absolute bottom-1 right-1 z-20">
            <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg shadow-md"
                title="Comprar ahora"
                onClick={(e) => {
                    // 🛑 IMPRESCINDIBLE: Detiene el clic para que no active handleCardClick
                    e.stopPropagation(); 
                    console.log("TRAZA 1: Clic en botón de compra. Deteniendo propagación."); 
                    
                    if (isAvailable && onPurchaseClick) {
                        onPurchaseClick(product);
                    } else if (!isAvailable) {
                        alert('Este producto no está disponible');
                    }
                }}
                disabled={!isAvailable}
                aria-label="Comprar producto"
            >
                <div className="flex items-center">
                    <ShoppingBag className="w-3 h-3 mr-1" />
                    <span>Comprar</span>
                </div>
            </button>
        </div>
      </div>
    </motion.div>
  );
};


// ==========================================================
// 3. SECCIÓN PRINCIPAL (Con corrección de Capas CSS)
// ==========================================================

// ... (Códigos de EmptyState y LoadingState sin cambios) ...

export default function ProductsSection() {
  const { products, loading, sendMessage } = useApp();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);

  const handleProductClick = (productName) => {
    sendMessage(`¿Qué me puedes decir sobre ${productName}?`);
  };
  
const handlePurchaseClick = (product) => {
    console.log("TRAZA 2: Función handlePurchaseClick llamada."); 
    setSelectedProduct(product);
    setShowPurchaseForm(true); 
};
  
  const handleFormClose = () => {
    setShowPurchaseForm(false);
    setTimeout(() => setSelectedProduct(null), 300); 
};
  
  const handlePurchaseSubmit = (formData) => {
    console.log('DATOS DE COMPRA RECIBIDOS Y PROCESADOS:', formData);
    alert(`¡Compra de ${formData.productName || 'Producto'} realizada con éxito!`);
    handleFormClose();
  };

  return (
    // 🛑 SOLUCIÓN FINAL CSS APLICADA: Esta es la clave para la visibilidad y clics 🛑
    <div 
        className="bg-white rounded-2xl border border-gray-200 p-4 shadow-lg"
        style={{ 
            pointerEvents: 'auto', // Asegura que los clics se registren en este componente
            position: 'relative',  // Necesario para el zIndex
            zIndex: 50             // Eleva tu componente por encima de la mayoría de la interfaz
        }} 
    >
      <div className="flex items-center gap-3 mb-4 border-b pb-3 border-gray-100">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Package className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Catálogo Destacado</h2>
          <p className="text-sm text-gray-500">
            {products.length} producto{products.length !== 1 ? 's' : ''} disponibles
          </p>
        </div>
      </div>

      <div className="min-h-[150px]">
        {loading ? (
          <LoadingState />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-1"> 
            <AnimatePresence>
                {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onClick={handleProductClick}
                    onPurchaseClick={handlePurchaseClick} 
                />
                ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState />
        )}
      </div> 
      
      {/* RENDERIZADO DEL MODAL */}
      <AnimatePresence>
          {showPurchaseForm && selectedProduct && (
            <PurchaseForm
              product={selectedProduct}
              onClose={handleFormClose}
              onSubmit={handlePurchaseSubmit}
            />
          )}
      </AnimatePresence>

    </div> 
  ); 
}