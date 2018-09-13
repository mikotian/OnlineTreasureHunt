const passport = require('passport');
const config = require('./knexfile')['development'];
const knex = require('knex')(config);

module.exports = () => {

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        knex('users').where({ id }).first()
            .then((user) => { done(null, user); })
            .catch((err) => { done(err, null); });
    });

};
