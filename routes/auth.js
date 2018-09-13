var express = require('express');
const bcrypt = require('bcrypt-nodejs');
var router = express.Router();
const authHelpers = require('../_helpers');
const passport = require('../local');
var users = require('../models/users');

router.get('/login', function (req, res, next) {
    if (req.user) {
        res.redirect('/game')
    }
    else{
        res.render('login', { message: { error: '', success: '' } });
    }

});


/*Verify Login*/
router.post('/login', authHelpers.loginRedirect, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { handleResponse(res, 500, 'error'); }
        if (!user) { handleResponse(res, 404, 'User not found'); }
        if (user) {
            req.logIn(user, function (err) {
                if (err) { handleResponse(res, 500, 'error'); }
                handleResponse(res, 200, 'success');
            });
        }
    })(req, res, next);
});

router.get('/logout', authHelpers.loginRequired, (req, res, next) => {
    req.logout();
    res.redirect('/auth/login');
    //handleResponse(res, 200, 'success');
});

router.get('/profile', authHelpers.loginRequired, (req, res, next) => {
    //console.log(req.app.locals.teamScore);

    res.render('profile', {
        'user': req.user,
        'userscore': req.user.score,
        'teamscore': req.session.teamScore,
        'userrank': req.session.userRank,
        'teamrank': req.session.teamRank,
        'firstName': req.user.firstName,
        message:{
        'error': '',
        'success': ''
        }
    });
    //handleResponse(res, 200, 'success');
});

router.post('/update', authHelpers.loginRequired, async (req, res, next) => {
    pwd = req.body.pwd;

    if (pwd && pwd.length > 3)
    {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(pwd, salt);
        upduser = await users.query().patchAndFetchById(req.user.id, { passw: hash });
        console.log(upduser);
        res.render('profile', {
            'user': upduser,
            'userscore': req.user.score,
            'teamscore': req.session.teamScore,
            'userrank': req.session.userRank,
            'teamrank': req.session.teamRank,
            'firstName': req.user.firstName,
            message:{
            'error': '',
            'success': 'Update Successful'
            }
        });
    } else {
        res.render('profile', {
            'user': req.user,
            'userscore': req.user.score,
            'teamscore': req.session.teamScore,
            'userrank': req.session.userRank,
            'teamrank': req.session.teamRank,
            'firstName': req.user.firstName,
            message: {
                'error': 'Password field was empty or less than 3 characters',
                'success': ''
            }
        });
    }
    //handleResponse(res, 200, 'success');
});

// *** helpers *** //
function handleLogin(req, user) {
    return new Promise((resolve, reject) => {
        req.login(user, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}

function handleResponse(res, code, statusMsg) {
    //res.status(code).json({ status: statusMsg });
    //console.log("Code Set");
    if (code == 200) {
        res.redirect('/game');
    } else {
        res.render('login', { message: { error: 'Login Failed', success: '' } });
    }
    
}
module.exports = router;
