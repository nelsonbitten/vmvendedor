import React, { useState, useEffect } from 'react';

const Remarketing: React.FC = () => {
  const [remarketingText, setRemarketingText] = useState('');
  const [remarketingImage, setRemarketingImage] = useState<File | null>(null);
  const [remarketingDate, setRemarketingDate] = useState('');
  const [remarketingList, setRemarketingList] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch existing remarketing data
    const fetchRemarketing = async () => {
      try {
        const response = await fetch('/.netlify/functions/get-remarketing');
        const data = await response.json();
        setRemarketingList(data);
      } catch (err) {
        console.error('Erro ao buscar remarketing:', err);
      }
    };

    fetchRemarketing();
  }, []);

  const handleRemarketingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('text', remarketingText);
      formData.append('date', remarketingDate);
      if (remarketingImage) {
        formData.append('image', remarketingImage);
      }

      const response = await fetch('/.netlify/functions/remarketing', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cadastrar remarketing');
      }

      setSuccess('Remarketing cadastrado com sucesso!');
      setRemarketingText('');
      setRemarketingImage(null);
      setRemarketingDate('');
      setRemarketingList([...remarketingList, data]);
      setTimeout(() => setSuccess(''), 2000);

    } catch (err) {
      console.error('Erro:', err);
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar remarketing');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Remarketing</h2>
      <form onSubmit={handleRemarketingSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Texto do Remarketing do Dia</label>
          <textarea
            value={remarketingText}
            onChange={(e) => setRemarketingText(e.target.value)}
            className="w-full px-3 py-2 rounded-md shadow-sm bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Digite o texto do remarketing"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Imagem do Remarketing do Dia</label>
          <input
            type="file"
            onChange={(e) => setRemarketingImage(e.target.files ? e.target.files[0] : null)}
            className="w-full px-3 py-2 rounded-md shadow-sm bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data do Remarketing</label>
          <input
            type="date"
            value={remarketingDate}
            onChange={(e) => setRemarketingDate(e.target.value)}
            className="w-full px-3 py-2 rounded-md shadow-sm bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
            'Salvar Remarketing'
          )}
        </button>
      </form>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Remarketing Cadastrados</h3>
        <ul className="space-y-4">
          {remarketingList.map((item, index) => (
            <li key={index} className="p-4 bg-white rounded-md shadow-sm">
              <p className="text-sm font-medium">{item.text}</p>
              <p className="text-sm text-gray-500">{item.date}</p>
              {item.image && <img src={item.image} alt="Remarketing" className="mt-2 w-full h-auto" />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Remarketing;
