const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
const path = require('path');
require('dotenv').config();

const app = express();

dbConnection();

app.use(express.static('public'));

app.use(cors());

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});