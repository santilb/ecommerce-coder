import dotenv from 'dotenv';

import multer from 'multer';
import path from 'path';
import { dirname } from "path";
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);

//export const __dirname = path.dirname(__filename);
const __dirname = dirname(__filename);
console.log(path.join(__dirname, 'public/uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: (req, file, cb) => {
    console.log(file)
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });

//--------------------logger----------------
import winston from "winston";

dotenv.config();
export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.colorize({ all: true }),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "warn",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        }),
      ),
    }),
  ],
});

//---------mongoose---------

import { connect } from 'mongoose';

export async function connectMongo() {
  try {
    console.log(" USER: "+process.env.MONGO_USER+" PASS: "+process.env.MONGO_PASS+" DB: "+process.env.DB_NAME);
    await connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@coderhouse.ai8ozim.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    );
  } catch (e) {
    logger.warn('Cannot connect to database');
  }
}

//----------------bcrypt------------------------------
import bcrypt from 'bcrypt';
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) =>
  bcrypt.compareSync(password, hashPassword);

//----------------nodemailer --------------
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const enviarCorreo = (address, name) => {
  const result = transport.sendMail({
    from: process.env.GOOGLE_EMAIL,
    to: address,
    subject: 'CODER Ecommerce - Registration succesful',
    html: `
              <div>
                  <h1>Bienvenido a CODER Ecomm</h1>
                  <p>Gracias por registrarte ${name}!!</p>
                  <p>Esperamos que encuentres lo que estas buscando!</p>
              </div>
              <div>
              <h4>Te saluda el equipo de CODER Ecomm</h4>
              </div>
          `,
  });
};