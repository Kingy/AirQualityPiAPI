const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./src/routes/');
const db = require('./src/database/');  // Import sequelize instance

const app = express();

// Middlewares
app.use(helmet());

app.use(cors({
  origin: '*'
}));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(routes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Sync database
db.sync()
  .then(() => {
    console.log('Database synced');
    // Then start listening for requests
    const PORT = process.env.PORT || 8888;

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Error syncing database', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
