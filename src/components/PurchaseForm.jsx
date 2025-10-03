// ===========================================
// Archivo: PurchaseForm.js (VERSIÓN FINAL)
// ===========================================
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XCircle, DollarSign, CreditCard } from 'lucide-react';

const PurchaseForm = ({ product, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    phone: '', 
    zip: '',   
    cardNumber: '', 
    quantity: 1,
  });

  const [errors, setErrors] = useState({}); // Mantener el estado de errores para futuras mejoras

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        // Limita la cantidad a números enteros, si es necesario
        [name]: name === 'quantity' ? parseInt(value) || 1 : value
    }));
    // Limpiar error (si existiera un sistema de validación)
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Calcula el precio total
  const basePrice = product.precio || 0;
  const discount = product.descuento || 0;
  const finalUnitPrice = basePrice * (1 - discount / 100);
  const total = (finalUnitPrice * formData.quantity).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.quantity < 1) {
        alert('La cantidad debe ser al menos 1.');
        return;
    }
    
    // Aquí podrías añadir una validación más completa antes de llamar a onSubmit
    
    // Llama a la función de envío que está en ProductsSection
    onSubmit({
        ...formData,
        productId: product.id,
        productName: product.nombre,
        finalPrice: total,
    });
  };

  return (
    // Overlay con desenfoque para el fondo
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <motion.div
        initial={{ y: "-100vh", opacity: 0 }}
        animate={{ y: "0", opacity: 1 }}
        exit={{ y: "100vh", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border border-gray-700"
      >
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Cerrar formulario"
        >
            <XCircle className="w-8 h-8" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white">Confirmar Pedido</h2>
          <p className="text-gray-400 mt-2">Estás a punto de comprar <span className="font-semibold text-cyan-400">{product.nombre}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECCIÓN 1: CONTACTO Y ENVÍO */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">1. Información de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Nombre Completo"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
              <input
                  type="email"
                  name="email"
                  placeholder="Email de Contacto"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
              <input
                  type="tel"
                  name="phone"
                  placeholder="Número de Teléfono"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
              <input
                type="text"
                name="address"
                placeholder="Dirección de Envío"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition md:col-span-2"
              />
              <input
                  type="number"
                  name="zip"
                  placeholder="Código Postal"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
              <input
                  type="number"
                  name="quantity"
                  placeholder="Cantidad"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
            </div>
          </div>
          
          {/* SECCIÓN 2: PAGO (SIMULACIÓN) */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
              2. Datos de Pago
              <CreditCard className="w-6 h-6" />
            </h3>
            <input
              type="text"
              name="cardNumber"
              placeholder="**** **** **** ****"
              value={formData.cardNumber}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              maxLength="16"
            />
          </div>
          
          {/* RESUMEN Y BOTONES */}
          <div className="pt-6 border-t border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <p className="text-2xl font-bold text-white">Total:</p>
                <p className="text-3xl font-extrabold text-cyan-400">${total}</p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-white bg-gray-600 rounded-full hover:bg-gray-500 transition-transform transform hover:scale-105"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full hover:from-cyan-600 hover:to-blue-600 transition-transform transform hover:scale-105 shadow-lg"
              >
                Confirmar y Pagar
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PurchaseForm;