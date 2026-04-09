import express from 'express'
import 'dotenv/config'

import sequelize from './db/index.js'

import TasksRoute from './routes/tasks.route.js'

const API_VERSION = process.env.API_VERSION || 'v1'

const app = express()

app.use(express.json()); //? to parse JSON data - usually used in API requests

app.use((req, res, next) => {
  //! CORS (Cross-Origin Resource Sharing) headers
  res.setHeader('Access-Control-Allow-Origin', '*'); //? Allow requests from any origin (Host)
  //! For preflight requests (OPTIONS), you can also specify allowed methods and headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); //? Allow specific HTTP methods
  //! By default Content-Type (application/json) is not allowed, so we need to allow it explicitly
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control'); //? Allow specific headers, Allow Cache-Control header to prevent caching issues
  next();
})

// app.use(HomeRoute)
app.use(`/api/${API_VERSION}/`, TasksRoute)

app.use('/', (req, res) => {
    res.status(404).send('<h1>404 Not Found</h1><br/><p>The requested resource was not found on this server.</p>')
})

//? Sync all defined models to the DB - this will create the tables if they don't exist (and do nothing if they already exist)
await sequelize.sync();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})