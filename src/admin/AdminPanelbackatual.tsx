import React, { useState, useEffect } from 'react';
import { FileText, Mail, Settings as Cog, LogOut, BarChart2, AlertCircle, Users, ArrowUpToLine as Upload } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabaseClient';

const dummyData = [
  { name: 'Seg', value: 24 },
  { name: 'Ter', value: 18 },
  { name: 'Qua', value: 30 },
  { name: 'Qui', value: 22 },
  { name: 'Sex', value: 25 },
  { name: 'Sáb', value: 15 },
  { name: 'Dom', value: 10 },
];

interface AdminPanelProps {
  onClose: () => void;
  isDarkMode: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, isDarkMode }) => {
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'posts' | 'remarketing' | 'avisos' | 'clientes' | 'settings'>('dashboard');
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [date, setDate] = useState('');
  const [itemList, setItemList] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase.from('conteudos').select('*');
        if (error) throw error;
        setItemList(data || []);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      }
    };
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      const { data, error: insertError } = await supabase.from('conteudos').insert([
        {
          text,
          date,
          image: image ? image.name : '',
          type: activeMenu
        }
      ]);

      if (insertError) throw insertError;

      setSuccess('Enviado com sucesso!');
      setText('');
      setImage(null);
      setDate('');
      if (data && data.length > 0) {
        setItemList([...itemList, data[0]]);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar no Supabase');
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md max-w-2xl mx-auto w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Texto</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" rows={4} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Imagem</label>
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer text-sm hover:bg-gray-200 dark:hover:bg-gray-800">
            <Upload className="w-4 h-4" />
            <span>{image?.name || 'Escolher arquivo'}</span>
            <input type="file" className="hidden" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-all text-sm font-medium" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
      {success && <p className="text-green-500 mt-4 text-sm">{success}</p>}
    </div>
  );

  const renderDashboard = () => (
    <div className="max-w-4xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-6">Bem-vinda, Layssa.</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {['Acessos Diários', 'Mensagens Completas', 'Mensagens Incompletas'].map((title, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={dummyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="name" stroke={isDarkMode ? '#ccc' : '#333'} />
                <YAxis stroke={isDarkMode ? '#ccc' : '#333'} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );

  const renderClientes = () => (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Clientes</h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {[{ nome: 'João Silva', status: 'Ativo', contato: 'joao@email.com' }, { nome: 'Maria Oliveira', status: 'Inativo', contato: 'maria@email.com' }].map((cliente, i) => (
          <li key={i} className="py-4 flex items-start justify-between">
            <div>
              <p className="font-medium">{cliente.nome}</p>
              <p className="text-sm text-gray-500">{cliente.contato}</p>
            </div>
            <span className={`px-3 py-1 text-xs rounded-full font-medium ${cliente.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{cliente.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard': return renderDashboard();
      case 'posts':
      case 'remarketing':
      case 'avisos': return renderForm();
      case 'clientes': return renderClientes();
      case 'settings': return <p className="text-sm text-gray-500 dark:text-gray-400">Configurações futuras aqui.</p>;
      default: return null;
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <aside className={`w-64 p-6 border-r space-y-6 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'bg-white border-gray-200'}`}>
        <h2 className="text-xl font-bold">Painel Admin</h2>
        <nav className="flex flex-col gap-2">
          <button onClick={() => setActiveMenu('dashboard')} className={`flex items-center gap-2 text-left px-3 py-2 rounded-lg transition-colors ${activeMenu === 'dashboard' ? 'bg-teal-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            <BarChart2 className="w-4 h-4" /> Dashboard
          </button>
          <button onClick={() => setActiveMenu('posts')} className={`flex items-center gap-2 text-left px-3 py-2 rounded-lg transition-colors ${activeMenu === 'posts' ? 'bg-teal-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            <FileText className="w-4 h-4" /> Posts
          </button>
          <button onClick={() => setActiveMenu('remarketing')} className={`flex items-center gap-2 text-left px-3 py-2 rounded-lg transition-colors ${activeMenu === 'remarketing' ? 'bg-teal-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            <Mail className="w-4 h-4" /> Remarketing
          </button>
          <button onClick={() => setActiveMenu('avisos')} className={`flex items-center gap-2 text-left px-3 py-2 rounded-lg transition-colors ${activeMenu === 'avisos' ? 'bg-teal-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            <AlertCircle className="w-4 h-4" /> Avisos
          </button>
          <button onClick={() => setActiveMenu('clientes')} className={`flex items-center gap-2 text-left px-3 py-2 rounded-lg transition-colors ${activeMenu === 'clientes' ? 'bg-teal-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            <Users className="w-4 h-4" /> Clientes
          </button>
          <button onClick={() => setActiveMenu('settings')} className={`flex items-center gap-2 text-left px-3 py-2 rounded-lg transition-colors ${activeMenu === 'settings' ? 'bg-teal-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            <Cog className="w-4 h-4" /> Configurações
          </button>
          <button onClick={onClose} className="flex items-center gap-2 text-left px-3 py-2 text-red-500 hover:underline mt-4">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </nav>
      </aside>
      <main className="flex-1 px-4 py-8 md:px-12 lg:px-24 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPanel;