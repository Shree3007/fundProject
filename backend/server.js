const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Configure CORS to allow requests from your frontend's Vercel URL
const corsOptions = {
  origin: 'https://fund-project-neon.vercel.app', // Your frontend's URL on Vercel
  optionsSuccessStatus: 200 // For legacy browser support
}
app.use(cors(corsOptions));
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
})

const depositsRouter = require('./routes/deposits');
const customersRouter = require('./routes/customers');

app.use('/deposits', depositsRouter);
app.use('/customers', customersRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
