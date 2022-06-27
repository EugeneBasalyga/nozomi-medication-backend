const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3001
const app = express();
app.use(cors());
app.use(express.json()); //accept json data with post requests
app.use('/', require('./routes')); //import routes
app.listen(PORT, () => {
  console.log('server listening on port: ', PORT)
});