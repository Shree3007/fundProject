const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Temporarily enable CORS for all origins for debugging purposes.
// IMPORTANT: Revert this to a specific origin (or environment variable) for production!
app.use(cors());
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
