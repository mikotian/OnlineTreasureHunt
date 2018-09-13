const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authHelpers = require('./_helpers');
const init = require('./passport');
const config = require('./knexfile')['development'];
const knex = require('knex')(config);

const options = { usernameField: 'email', passwordField: 'password' };

init();

passport.use(new LocalStrategy(options, (emailid, password, done) => {
    console.log(emailid);
    // check to see if the username exists
    knex('users').where({ email: emailid }).first()
        .then((user) => {
            console.log("User:::"+user.firstName);
            if (!user) { console.log("I AM in !user"); return done(null, false); }
            if (!authHelpers.comparePass(password, user.passw)) {
                console.log("Failure!!");
                return done(null, false);
            } else {
                console.log("Success!!!")
                return done(null, user);
            }
        })
        .catch((err) => { console.log("Error!!"); return done(null, false); });
}));

module.exports = passport;