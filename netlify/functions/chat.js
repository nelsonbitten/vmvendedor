import { OpenAI } from 'openai';
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
    // Inicializar cliente Supabase
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
    );

    // Buscar API key do Supabase
    const { data, error } = await supabase
      .from('config')
      .select('value')
      .eq('key', 'openai_api_key')
      .single();

    if (error || !data?.value) {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ 
          error: 'API não configurada',
          message: 'Por favor, configure a API key da OpenAI primeiro'
        })
      };
    }

    const openaiKey = data.value;
    const { message } = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Mensagem não fornecida' })
      };
    }

    const openai = new OpenAI({ apiKey: openaiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um assistente especializado em vendas, focado em ajudar vendedores a maximizar suas vendas e lidar com objeções de clientes de forma profissional."
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        response: completion.choices[0].message.content 
      })
    };

  } catch (error) {
    console.error('Erro:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erro ao processar mensagem',
        details: error.message
      })
    };
  }
}