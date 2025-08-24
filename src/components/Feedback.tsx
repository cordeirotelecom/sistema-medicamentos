'use client';

import { useState } from 'react';
import { Star, MessageCircle, Send, CheckCircle } from 'lucide-react';

interface FeedbackProps {
  onSubmit?: (feedback: { rating: number; comment: string; helpful: boolean }) => void;
}

export default function Feedback({ onSubmit }: FeedbackProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0 || helpful === null) {
      alert('Por favor, avalie nossa recomendação e nos diga se foi útil.');
      return;
    }

    const feedbackData = {
      rating,
      comment: comment.trim(),
      helpful
    };

    if (onSubmit) {
      onSubmit(feedbackData);
    }

    setSubmitted(true);
    
    // Simular envio
    setTimeout(() => {
      console.log('Feedback enviado:', feedbackData);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Obrigado pelo seu feedback!</h3>
          <p className="text-gray-600">
            Sua avaliação nos ajuda a melhorar continuamente nosso serviço.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-8">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Avalie nossa recomendação
          </h3>
          <p className="text-gray-600">
            Sua opinião é importante para melhorarmos nosso serviço
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avaliação por estrelas */}
          <div className="text-center">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Como você avalia nossa orientação?
            </label>
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {rating > 0 && (
                <span>
                  {rating === 1 && 'Muito ruim'}
                  {rating === 2 && 'Ruim'}
                  {rating === 3 && 'Regular'}
                  {rating === 4 && 'Bom'}
                  {rating === 5 && 'Excelente'}
                </span>
              )}
            </div>
          </div>

          {/* Utilidade */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Esta recomendação foi útil para você?
            </label>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => setHelpful(true)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  helpful === true
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                }`}
              >
                👍 Sim, foi útil
              </button>
              <button
                type="button"
                onClick={() => setHelpful(false)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  helpful === false
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                }`}
              >
                👎 Não foi útil
              </button>
            </div>
          </div>

          {/* Comentário opcional */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Comentários adicionais (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
              placeholder="Conte-nos como podemos melhorar ou se você gostaria de adicionar algo..."
            />
          </div>

          {/* Botão de envio */}
          <div className="text-center">
            <button
              type="submit"
              disabled={rating === 0 || helpful === null}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              <Send className="h-4 w-4" />
              Enviar Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
