const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 5000;
app.use(cors({
  origin: '*'
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes'));



const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.set('strictQuery', true);
mongoose
  .connect(
    'mongodb+srv://moxiemit:1Q40suKNihEscfGq@techmiti23.esevzgv.mongodb.net/?retryWrites=true&w=majority',
    connectionParams
  )
  .then(() => {
    console.log('Connected to the database ');
    app.listen(port, function (err) {
      if (err) {
        console.log(`Error in running the server :${err}`);
      }

      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error(`Error connecting to the database. ${err}`);
  });
