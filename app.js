require('dotenv').config();
const express = require('express');
const searchRoutes = require('./routes/searchRoutes');
const pagesRoutes = require('./routes/pagesRoutes');
const path = require('path');

const app = express();
const PORT = 3000;

// Configurar o diretório das views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar arquivos estáticos (CSS, imagens, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Usar as rotas de busca
app.use('/searchApi', searchRoutes);
app.use('/', pagesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});