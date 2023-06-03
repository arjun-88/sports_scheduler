/* eslint-disable no-unused-vars */
const { request, response } = require("express");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
app.set("views", path.join(__dirname, "views"));
var csrf = require("tiny-csrf");
var cookieParser = require("cookie-parser");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
const flash = require("connect-flash");
//res.render(req.flash(type, message));

const passport = require("passport");
//const connectionEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

app.use(
  session({
    secret: "my-super-secret-key-217281726152615261562",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((User, done) => {
  console.log("Serializing user in session", User.id);
  done(null, User.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((User) => {
      done(null, User);
    })
    .catch((error) => {
      done(error, null);
    });
});

const { User, Sport, Session, SessionPlayer, sequelize, Sequelize } = require("./models");
app.set("view engine", "ejs");
app.get("/", async (request, response) => {
  response.render("index", {
    title: "Todo application",
    //csrfToken: request.csrfToken(),
  });
});

app.get("/signup", async (request, response) => {
  response.render("signup", {
    title: "signup",
    
  });
});

app.get("/admin_signup", async (request, response) => {
  response.render("admin_signup", {
    title: "admin_signup",
    
  });
});

app.get("/player_signup", async (request, response) => {
  response.render("player_signup", {
    title: "player_signup",
    
  });
});

app.get("/admin_page", isAuthenticated, async (request, response) => {
  const sports= await Sport.getsports();
 //const getuser = await User.getUser(request.user.id);
  //console.log(request.User.id);
  if (request.accepts("html")) {
    response.render("admin_page", {
      title: "admin_page", 
      sports,   
    });
  } else {
    response.json({
      title: "admin_page", 
      sports,
    })
  }
});

app.get("/player_page", async (request, response) => {
  response.render("player_page", {
    title: "player_page",
    
  });
});

app.get("/login", async (request, response) => {
  response.render("login", {
    title: "login",
    user: request.user,
  })
})

app.get("/create_sport", async (request, response) => {
  response.render("create_sport_page", {
    title: "create_sport",
  })
})

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function async (request, response) {
    console.log(request.user);
    console.log(request.user);
    if (request.user.isAdmin){
    response.redirect(200,"/admin_page");
    } else {
      response.redirect(200,"/player_page");
    }}
);


passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passportField: "password",
      },
      (username, password, done) => {
        User.findOne({ where: { email: username } })
          .then(async (user) => {
            const result = await bcrypt.compare(password, user.password);
            if (result) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          })
          .catch((error) => {
            return done(null, false);
          });
      }
    )
  );
  const saltRounds = 10;

  app.post("/user", async (request, response) => {
  // if (request.body.firstName.length == 0) {
  //   request.flash("error", "First Name cant be empty");
  //   return response.redirect("/signup");
  // } else if (request.body.email.length == 0) {
  //   request.flash("error", "Email cant be empty");
  //   return response.redirect("/signup");
  // } else if (request.body.password.length == 0) {
  //   request.flash("error", "password cannot be empty");
  //   return response.redirect("/signup");
  // }
  //console.log("FirstName",request.body.firstName0)
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
  console.log(hashedPwd);
  const type_user = request.body.isAdmin;
  try {
    const user = await User.create({
      name: request.body.firstName,
      email: request.body.email,
      password: hashedPwd,
      isAdmin: type_user,
    });
    
    request.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      if (type_user){
        console.log(user);
        response.redirect("/admin_page");
      } else{
        response.redirect("/player_page",);
      }
    });
  } catch (error) {
    console.log(error);
    // request.flash("error", "Error! Email Already in use");
    response.redirect("/signup");
    //return response.status(422).json(error);
  }
});

app.post("/sport", async (request, response) => {
  try {
    const sport = await Sport.create({
      sport: request.body.sport,
      creatorId: request.User.id,

    });
    request.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      if (type_user){
        response.redirect("/admin_page");
      } else{
        response.redirect("/player_page");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

function isAuthenticated(request, response, next) {
  if (request.isAuthenticated()) {
    return next();
  }
  response.redirect("/signup");
}


module.exports = app;
