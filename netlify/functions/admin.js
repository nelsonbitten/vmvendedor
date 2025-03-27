exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Aqui você trataria os dados enviados no corpo da requisição
    const body = JSON.parse(event.body || '{}');

    const { text, date, image, type } = body;

    // Simula o salvamento (você pode substituir por DB ou arquivo depois)
    const savedPost = {
      id: Date.now(),
      text,
      date,
      image,
      type,
    };

    // Retorno obrigatório para evitar o erro do JSON
    return {
      statusCode: 200,
      body: JSON.stringify(savedPost),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Erro ao processar dados' }),
    };
  }
};
