const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const pool = require("./database");
const bcrypt = require("bcryptjs");


// ------------------------------------------------------------------- passport

// serializar
passport.serializeUser((user, done) => {
  // console.log('user => ', user);
  done(null, user.id);
});
 

// Desserializar
passport.deserializeUser( async (id, done) => {
  await pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
    } else {
      connection.query('SELECT * FROM usuarios WHERE id = ? ', [id], (err, result) => {
        if (err) {
          console.log(err);
        }
        else{
          done(err, result[0]);
        }    
      })    
    }
  })
})


// ------------------------------------------------------------------- estrategia inicio sesion
passport.use('inicio.sesion',new localStrategy({
  passReqToCallback: true // para envio de mensajes entre vistas
}, async (req, username, password, done)=>{
  // buscar y almacenar un usuario
  await pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
    } else {
      connection.query(
        "SELECT * FROM usuarios WHERE username = ?", [username], (error, results) => {
          if (error) {
            console.log(error);
          } else {
            if (results.length === 0) {
              connection.release();
              done(null, false,req.flash('info', '[!] Usuario no registrado'));
            } else {
              const userValid = results[0];
              if (!bcrypt.compareSync(password, userValid.password)) {
                connection.release();
                console.log("Las contraseñas no coinciden!");
                done(null, false, req.flash('info', '[!] Las contraseñas no coinciden'));
              } else {
                console.log("Acceso OK");
                connection.release();
                done(null, userValid);
              }
            }
          }
        }
      );
    }
  });
}));

// ------------------------------------------------------------------- estrategia registro
passport.use('register', new localStrategy({
  passReqToCallback: true // para envio de mensajes entre vistas
}, async (req, username, password, done)=>{
  // buscar y almacenar un usuario
  await pool.getConnection((err, connection) => {
    if (err) throw err;
    // not connected!
    else {
      connection.query(
        "SELECT * FROM usuarios WHERE username = ? ",[username], async (error, results) => {
          if (error) {
            console.log(error);
          }
          if (results.length !== 0) { // usuario registrado
            connection.release();
            done(null, false, req.flash('info', '[!] Usuario registrado anteriormente'));
            //done(null, false);
          } else {
            const newUser = {
              username, // lo mismo que username: username
              password
            };
            newUser.password = await bcrypt.hashSync( newUser.password, bcrypt.genSaltSync(10));
            pool.query("INSERT INTO usuarios SET ?", [newUser],(error, results) => {
                if (error) {
                  console.log(error);
                } else {
                  console.log("El usuario se almacena en la base");
                  connection.release();
                  newUser.id = results.insertId;
                  done(null, newUser);
                }
              }
            );
          }
        }
      );
    }
  });
}));


passport.isAuthenticated = (req, res, next) => {
  if( req.isAuthenticated()){
    return next();
  }
  req.flash('info','Debes iniciar sesion antes');
  res.redirect('/');
} 



module.exports = passport;