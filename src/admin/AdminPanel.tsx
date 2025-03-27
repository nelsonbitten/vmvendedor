import React, { useState, useEffect } from "react";
import {
  FileText,
  Mail,
  Settings as Cog,
  LogOut,
  BarChart2,
  ArrowUpToLine as Upload,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../lib/supabaseClient";

const dummyData = [
  { name: "Seg", value: 24 },
  { name: "Ter", value: 18 },
  { name: "Qua", value: 30 },
  { name: "Qui", value: 22 },
  { name: "Sex", value: 25 },
  { name: "Sáb", value: 15 },
  { name: "Dom", value: 10 },
];

interface AdminPanelProps {
  onClose: () => void;
  isDarkMode: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, isDarkMode }) => {
  const [activeMenu, setActiveMenu] = useState<
    "dashboard" | "posts" | "remarketing" | "settings"
  >("dashboard");
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [date, setDate] = useState("");
  const [itemList, setItemList] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalContent, setModalContent] = useState<any | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase.from("conteudos").select("*");
        if (error) throw error;
        setItemList(data || []);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const hoje = new Date().toISOString().split("T")[0];
    if (activeMenu === "remarketing") {
      const encontrado = itemList.find(
        (item) => item.type === "remarketing" && item.date === hoje
      );
      if (encontrado) {
        setText(encontrado.text || "");
        setDate(encontrado.date || "");
        setImage(null);
      } else {
        setText("");
        setDate(hoje);
        setImage(null);
      }
    } else {
      setText("");
      setDate("");
      setImage(null);
    }
  }, [activeMenu, itemList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const { data, error: insertError } = await supabase
        .from("conteudos")
        .insert([
          {
            text,
            date,
            image: image ? image.name : "",
            type: activeMenu,
          },
        ]);
      if (insertError) throw insertError;
      setSuccess("Enviado com sucesso!");
      setText("");
      setImage(null);
      setDate("");
      if (data && data.length > 0) {
        setItemList((prev) => [...prev, data[0]]);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao salvar no Supabase");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Tem certeza que deseja excluir este item?");
    if (!confirmDelete) return;
    try {
      const { error } = await supabase.from("conteudos").delete().eq("id", id);
      if (error) throw error;
      setItemList(itemList.filter((item) => item.id !== id));
    } catch (err: any) {
      console.error("Erro ao deletar:", err.message);
      setError("Erro ao deletar item");
    }
  };

  const renderList = (type: "remarketing" | "posts") => (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">
        {type === "posts" ? "Posts Cadastrados" : "Remarketing Cadastrados"}
      </h3>
      <ul className="space-y-4">
        {itemList
          .filter((item) => item.type === type)
          .map((item) => (
            <li
              key={item.id}
              className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex gap-4 items-start"
            >
              {item.image && (
                <img
                  src={`https://qzxdjjczgbluvjnjkmve.supabase.co/storage/v1/object/public/imagens/${item.image}`}
                  alt="preview"
                  className="w-16 h-16 rounded object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-sm mb-1 line-clamp-2">{item.text}</p>
                {item.date && (
                  <p className="text-xs text-gray-500">Data: {item.date}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button
                  onClick={() => setModalContent(item)}
                  className="text-blue-500 hover:underline text-xs flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" /> Ver
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 text-xs hover:underline"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        {itemList.filter((item) => item.type === type).length === 0 && (
          <p className="text-sm text-gray-500">
            Nenhum conteúdo cadastrado ainda.
          </p>
        )}
      </ul>
    </div>
  );

  const renderForm = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md max-w-2xl mx-auto w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Texto</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Imagem</label>
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer text-sm hover:bg-gray-200 dark:hover:bg-gray-800">
            <Upload className="w-4 h-4" />
            <span>{image?.name || "Escolher arquivo"}</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                setImage(e.target.files ? e.target.files[0] : null)
              }
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-all text-sm font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Salvar"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
      {success && <p className="text-green-500 mt-4 text-sm">{success}</p>}

      {activeMenu === "remarketing" && renderList("remarketing")}
      {activeMenu === "posts" && renderList("posts")}
    </div>
  );

  const renderDashboard = () => (
    <div className="max-w-4xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-6">Bem-vinda, Layssa.</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {[
          "Acessos Diários",
          "Mensagens Completas",
          "Mensagens Incompletas",
        ].map((title, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={dummyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                />
                <XAxis dataKey="name" stroke={isDarkMode ? "#ccc" : "#333"} />
                <YAxis stroke={isDarkMode ? "#ccc" : "#333"} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return renderDashboard();
      case "posts":
      case "remarketing":
        return renderForm();
      case "settings":
        return (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configurações futuras aqui.
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <aside
        className={`w-64 p-6 border-r space-y-6 ${
          isDarkMode
            ? "border-gray-700 bg-gray-800"
            : "bg-white border-gray-200"
        }`}
      >
        <h2 className="text-xl font-bold">Painel Admin</h2>
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActiveMenu("dashboard")}
            className={`flex items-center gap-2 text-left px-3 py-2 rounded-lg transition-colors ${
              activeMenu === "dashboard"
                ? "bg-teal-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <BarChart2 className="w-4 h-4" /> Dashboard
          </button>
          <button
            onClick={() => setActiveMenu("posts")}
            className={`flex items-center gap-2 text-left px-3 py-2 rounded-lg transition-colors ${
              activeMenu === "posts"
                ? "bg-teal-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <FileText className="w-4 h-4" /> Posts
          </button>
          <button
            onClick={() => setActiveMenu("remarketing")}
            className={`flex items-center gap-2 text-left px-3 py-2 rounded-lg transition-colors ${
              activeMenu === "remarketing"
                ? "bg-teal-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <Mail className="w-4 h-4" /> Remarketing
          </button>
          <button
            onClick={() => setActiveMenu("settings")}
            className={`flex items-center gap-2 text-left px-3 py-2 rounded-lg transition-colors ${
              activeMenu === "settings"
                ? "bg-teal-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <Cog className="w-4 h-4" /> Configurações
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-left px-3 py-2 text-red-500 hover:underline mt-4"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </nav>
      </aside>
      <main className="flex-1 px-4 py-8 md:px-12 lg:px-24 overflow-y-auto">
        {renderContent()}
      </main>
      {modalContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-md w-full">
            {modalContent.image && (
              <img
                src={`https://qzxdjjczgbluvjnjkmve.supabase.co/storage/v1/object/public/imagens/${modalContent.image}`}
                alt="visualização"
                className="w-full h-auto rounded mb-4"
              />
            )}
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {modalContent.text}
            </p>
            <button
              onClick={() => setModalContent(null)}
              className="mt-4 w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
