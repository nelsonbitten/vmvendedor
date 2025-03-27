import bcrypt from 'bcryptjs';

// Gerar hash para a senha "123"
const password = '123';
bcrypt.hash(password, 10).then(hash => {
  console.log('Hash gerado:', hash);
});