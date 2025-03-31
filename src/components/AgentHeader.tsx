import React from "react";

interface AgentHeaderProps {
  nome: string;
  especialidade: string;
  descricao: string;
  imagem: string;
  isDarkMode: boolean;
}

const AgentHeader: React.FC<AgentHeaderProps> = ({
  nome,
  especialidade,
  descricao,
  imagem,
  isDarkMode,
}) => {
  console.log("🔍 Renderizando AgentHeader com:", nome, imagem);

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border mb-4 shadow ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 text-white"
          : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      <div className="relative">
        <img
          src={imagem}
          alt={nome}
          className="w-16 h-16 rounded-full object-cover border-2 border-teal-500 shadow-md"
        />
        {/* Bolinha de status */}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-ping" />
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{nome}</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
            Online
          </span>
        </div>

        <p className="text-sm font-medium text-teal-500">{especialidade}</p>
        <p
          className={`text-sm mt-1 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {descricao}
        </p>
      </div>
    </div>
  );
};

export default AgentHeader;
