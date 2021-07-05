const express = require("express");
const router = express.Router();
const passport = require("../passport");
const { isAuthenticated } = require("../passport");


// ------------------------------------------------------------------- login
// login - get => formulario de login
router.get("/", (req, res) => {
  res.render("login", { message: req.flash("info") });
});

// login - post => procesar datos e iniciar sesion o register o login
router.post("/login", passport.authenticate('inicio.sesion',{
  successRedirect: '/home',
  failureRedirect: '/',
  failureFlash: true  //no se para que es esto
}));

// ------------------------------------------------------------------- register
// register - get => formulario de registro
router.get("/register", (req, res) => {
  res.render("register", { message: req.flash("info") });
});

// register - post => analizo credeciales y almaceno en DB o mando a login
router.post("/register", passport.authenticate('register',{
  successRedirect: '/',
  failureRedirect: '/register'
}));



// ------------------------------------------------------------------- cerrar sesion
router.get('/salir', (req, res) => {
  req.logOut();
  res.redirect('/');
})




// ------------------------------------------------------------------- home
// home - get => pagina de inicio (lgueado)
router.get("/home", isAuthenticated , (req, res, next) => {
  res.render("home", { 
    message: req.flash("info"),
    user: req.user || null
  });
});


// ------------------------------------------------------------------- productos
// 
router.get("/productos", isAuthenticated, (req, res) => {
  res.render("productos", {
    user: req.user || null
  } );
});








module.exports = router;
