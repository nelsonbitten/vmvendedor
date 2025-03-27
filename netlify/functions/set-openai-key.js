import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 204, 
      headers 
    };
  }

  try {
    // Verificar token
    const authHeader = event.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Token não fornecido' })
      };
    }

    const token = authHeader.split(' ')[1];
    
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Token inválido ou expirado' })
      };
    }

    const { apiKey } = JSON.parse(event.body || '{}');

    if (!apiKey?.startsWith('sk-')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'API key inválida' })
      };
    }

    // Inicializar cliente Supabase
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
    );

    // Salvar a API key na tabela de configurações
    const { error: upsertError } = await supabase
      .from('config')
      .upsert({ 
        key: 'openai_api_key',
        value: apiKey,
        updated_at: new Date().toISOString()
      });

    if (upsertError) {
      console.error('Erro ao salvar API key:', upsertError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Erro ao salvar API key' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'API key configurada com sucesso' })
    };

  } catch (error) {
    console.error('Erro:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro interno do servidor' })
    };
  }
}