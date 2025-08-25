'use client';

import { useEffect, useState } from 'react';

interface BeforeUnloadHandlerProps {
  hasUnsavedChanges?: boolean;
}

export default function BeforeUnloadHandler({ hasUnsavedChanges = false }: BeforeUnloadHandlerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Sempre pergunta se quer salvar/sair
      const confirmationMessage = 'Tem certeza que deseja sair? Suas alterações podem ser perdidas.';
      
      // Para navegadores modernos
      e.preventDefault();
      e.returnValue = confirmationMessage;
      
      // Para navegadores mais antigos
      return confirmationMessage;
    };

    const handleUnload = () => {
      // Aqui você pode adicionar lógica para salvar dados no localStorage
      // antes do usuário sair completamente
      console.log('Usuário está saindo da aplicação');
    };

    // Adiciona os event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [isClient, hasUnsavedChanges]);

  // Este componente não renderiza nada visível
  return null;
}

// Hook personalizado para controlar quando mostrar o aviso
export function useBeforeUnload(hasUnsavedChanges: boolean = true) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        const confirmationMessage = 'Você tem alterações não salvas. Deseja realmente sair?';
        e.preventDefault();
        e.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
}

// Componente de modal personalizado para confirmação (alternativa mais elegante)
export function ConfirmExitModal({ 
  isOpen, 
  onConfirm, 
  onCancel 
}: { 
  isOpen: boolean; 
  onConfirm: () => void; 
  onCancel: () => void; 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Confirmar Saída
            </h3>
            <p className="text-sm text-gray-600">
              Suas alterações podem ser perdidas
            </p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-6">
          Você tem certeza que deseja sair? Todas as alterações não salvas serão perdidas.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sair sem Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
