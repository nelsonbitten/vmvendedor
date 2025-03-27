import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const ApiKeyConfig: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSetApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.startsWith('sk-')) {
      setError('API key inválida');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/.netlify/functions/set-openai-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ apiKey })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao configurar API key');
      }

      setSuccess('API key configurada com sucesso!');
      setTimeout(() => setSuccess(''), 2000);

    } catch (err) {
      console.error('Erro:', err);
      setError(err instanceof Error ? err.message : 'Erro ao configurar API key');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Configurar API Key</h2>
      <form onSubmit={handleSetApiKey} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">OpenAI API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 rounded-md shadow-sm bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="sk-..."
            required
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar API Key'
          )}
        </button>
      </form>
    </div>
  );
};

export default ApiKeyConfig;
