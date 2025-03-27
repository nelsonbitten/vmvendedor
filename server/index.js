const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2a$10$XQgC1hbmHJ3m6jjsHVqzge.Y9RVzXu1xJ1qtUKKj6HGgQIL7J4WLi'; // Default: "admin123"

let openaiClient = null;

// **Rota de remarketing - Colocada aqui para garantir que seja verificada primeiro**
app.get('/remarketing', (req, res) => {
  const remarketingData = {
    text: "Texto do remarketing do dia",
    image: "http://link-da-imagem.com/imagem.jpg"  // Substitua pelo URL real da sua imagem
  };

  res.json(remarketingData);  // Retorna os dados como JSON
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

// Set OpenAI API key (protected endpoint)
app.post('/api/admin/set-openai-key', authenticateToken, (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: 'API key is required' });
  }

  try {
    openaiClient = new OpenAI({
      apiKey: apiKey
    });
    res.json({ message: 'OpenAI API key set successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set OpenAI API key' });
  }
});

// Chat completion endpoint
app.post('/api/chat', async (req, res) => {
  if (!openaiClient) {
    return res.status(503).json({ error: 'OpenAI client not configured' });
  }

  const { message } = req.body;

  try {
    const completion = await openaiClient.chat.completions.create({
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

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
});

// Serve o frontend (site) na URL raiz
app.use(express.static('public'));  // Serve os arquivos da pasta 'public' apenas após as rotas de API

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
