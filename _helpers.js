const bcrypt = require('bcrypt-nodejs');
const config = require('./knexfile')['development'];
const knex = require('knex')(config);

function comparePass(userPassword, databasePassword) {
    console.log("in comparepass");
    try {
        console.log(userPassword);
        console.log(databasePassword);
        var comp = bcrypt.compareSync(userPassword, databasePassword);

        return comp;
    } catch (err)
    {
        console.log("error while comparing:::\n" + err);
        return false;
    }
}

function updateUser(req, res) {
    return handleErrors(req)
        .then(() => {
            pwd = req.body.pwd;
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(pwd, salt);
            uuser=knex('users')
                .where('email', req.user.email)
                .update({
                    passw: hash
                });
            console.log(uuser);
        })
        .catch((err) => {
            console.log(err);
            res.render('profile', {
                'user': req.user,
                'userscore': req.user.score,
                'teamscore': req.app.locals.teamScore,
                'userrank': req.app.locals.userRank,
                'teamrank': req.app.locals.teamRank,
                'firstName': req.user.firstName,
                message:{
                'error': err.message,
                'success': ''
                }
            });
        });
}

function loginRequired(req, res, next) {
    if (!req.user)//return res.status(401).json({ status: 'Please log in' });
    {
        res.redirect('/auth/login');
    }
    return next();
}

function adminRequired(req, res, next) {
    if (!req.user) {
        res.status(401).json({ status: 'Please log in' });
    }
    return knex('users').where({ username: req.user.username }).first()
        .then((user) => {
            if (!user.admin) res.status(401).json({ status: 'You are not authorized' });
            return next();
        })
        .catch((err) => {
            res.status(500).json({ status: 'Something bad happened' });
        });
}

function loginRedirect(req, res, next) {
    if (req.user) return res.status(401).json(
        { status: 'You are already logged in' });
    return next();
}

async function handleErrors(req) {
    return new Promise((resolve, reject) => {
        if (req.body.pwd.length < 3) {
            reject({
                message: 'Password must be longer than 3 characters'
            });
        }else {
            resolve();
        }
    });
}

module.exports = {
    comparePass,
    loginRequired,
    adminRequired,
    loginRedirect,
    updateUser
};