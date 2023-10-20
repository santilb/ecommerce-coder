import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import { dirname } from "path";
import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import { Server } from 'socket.io';
import { iniPassport } from './config/passport.config.js';
import errorHandler from './middlewares/error.js';
import { authRouter } from './routes/authRouter.js';
import cartRouter from './routes/cartRouter.js';
import chatRouter from './routes/chatRouter.js';
import loggerRouter from './routes/loggerRouter.js';
import mockRouter from './routes/mockRouter.js';
import productsRouter from './routes/productsRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import { connectMongo, logger } from './utils/utils.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;


connectMongo().then(() => {
  logger.info('Plugged Mongo')
});

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@coderhouse.ai8ozim.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
      ttl: 3660,
    }),
    secret: 'secreto',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Render carpeta public
app.use(express.static(path.join(__dirname, 'public')));

//Passport Login
iniPassport();
app.use(passport.initialize());
app.use(passport.session());

//doc Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion Ecommerce",
      description: "Documentación Ecommerce",
    },
  },
  apis: [`${__dirname.replace(/\/[^/]*$/, '/')}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', authRouter);

app.use('/chat', chatRouter);
app.use('/current', viewsRouter);
app.use('/loggerTest', loggerRouter);
app.use('/mockingproducts', mockRouter);
app.use('/', viewsRouter);
app.use(errorHandler);

const handlebars = exphbs.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
});
app.engine("handlebars", handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.get('*', async (req, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'No se encuentra implementada la ruta',
    data: {},
  });
});

const httpServer = app.listen(PORT, () => {
  console.log(
    `🚀 Server started on port ${PORT}. 
      at ${new Date().toLocaleString()}`
  )
});

const socketServer = new Server(httpServer);
socketServer.on('Connection', (socket) => {
  logger.info(`New client connected to Chat ${ipClient}`);
  socket.emit('msg_back_to_front', { msg: 'Cliente Conectado' });

  socket.on('Mensaje pusheado a BD', (data) => {
    socket.broadcast.emit('updateChat');
  });
});

export default app;