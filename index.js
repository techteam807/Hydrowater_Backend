require('dotenv').config();
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const { createServer } = require('http');
const routes = require('./routes');
const {connect:connectDB} = require('./config/db');

const app = express();
const server = createServer(app);

app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use('/',routes);

app.get('/', (req, res) => {
  res.send("Backend of Wallet is running...")
});
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})

