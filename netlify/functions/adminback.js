import bcrypt from 'bcryptjs';
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  try {
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (e) {
      console.error('Erro ao fazer parse do JSON:', e, 'Body recebido:', event.body);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'JSON inválido',
          details: 'O corpo da requisição deve ser um JSON válido'
        })
      };
    }

    const { password } = requestBody;

    if (!password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Senha não fornecida' })
      };
    }

    // Senha fixa "1234" para simplificar
    if (password !== '1234') {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Senha incorreta' })
      };
    }

    // Gerar token com duração de 24h
    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET || 'chave-super-secreta-2025',
      { expiresIn: '24h' }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ token })
    };

  } catch (error) {
    console.error('Erro:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: error.message
      })
    };
  }
}