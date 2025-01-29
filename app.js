require('dotenv').config();
const express = require('express');
const searchRoutes = require('./routes/searchRoutes');
const pagesRoutes = require('./routes/pagesRoutes');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', searchRoutes);
app.use('/', pagesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});