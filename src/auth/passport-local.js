import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import { encryptPassword, comparePassword } from "../config/bcrypt.js";
import { UserService } from "../services/user.service.js";
import { CartService } from "../services/cart.service.js";
const userService = new UserService();
const cartService = new CartService();

const localStrategy = LocalStrategy;
const githubStrategy = GitHubStrategy;

// variables
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

passport.use(
  "register",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const usuarioSaved = await userService.getUserByEmail({ email });
      if (usuarioSaved) {
        req.flash(
          "errorMessage",
          "El usuario ya existe en nuestra Base de datos. Por favor, elija otro nombre de usuario."
        );
        return done(null, false);
      } else {
        const hashPass = await encryptPassword(password);

        const newCart = await cartService.create();
        const newUser = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          age: req.body.age,
          cart: newCart._id,
          password: hashPass,
          role: req.body.role || "user",
        };
        const response = await userService.create(newUser);
        console.log("Nuevo usuario registrado: ", response);
        return done(null, response);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {

      const usuarioSaved = await userService.getUserByEmail({ email });
      if (!usuarioSaved) {
        req.flash(
          "errorMessage",
          "El usuario ingresado no existe. Por favor, regístrese."
        );
        return done(null, false);
      }
      const isTruePassword = await comparePassword(
        password,
        usuarioSaved.password
      );
      if (!isTruePassword) {
        req.flash(
          "errorMessage",
          "La contraseña ingresada es incorrecta. Por favor, intente nuevamente."
        );
        return done(null, false);
      }

      return done(null, usuarioSaved);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // _id de mongo
});

passport.deserializeUser(async (id, done) => {
  const user = await userService.getOne(id);
  done(null, user);
});

/** Auth GITHUB */
passport.use(
  new githubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = {
        username: profile.username,
        password: null,
      };
      const userSaved = await userService.getUserByUsername({
        username: user.username,
      });
      if (userSaved) {
        return done(null, userSaved);
      } else {
        const response = await userService.create(user);
        return done(null, response);
      }
    }
  )
);

export { passport };