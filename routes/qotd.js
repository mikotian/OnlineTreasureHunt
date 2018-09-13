var Qotd_ans = require('../models/qotd_ans');
var Qotd = require('../models/qotd');
var users = require('../models/users');
var Qotd_user_ans = require('../models/qotd_user_ans');
var express = require('express');
var router = express.Router();
const authHelpers = require('../_helpers');
const passport = require('../local');
const { transaction } = require('objection');

router.get('/', authHelpers.loginRequired, async (req, res, next) => {

    if (req.user) {
        //console.log(req.user);
        try {
            const hasuseranswered = await Qotd_user_ans.query().where('email', req.user.email);
            console.log(hasuseranswered[0]);
            if (!hasuseranswered[0])
            {
                const qotdques = await Qotd.query().where('locationid', req.user.locationid);
                console.log(qotdques);
                res.render('qotd', {
                    'question': qotdques[0].ques,
                    'image': qotdques[0].imgloc,
                    'id': qotdques[0].qid,
                    'firstName': req.user.firstName,
                    'attempts': req.app.locals.attempts,
                    'userattempts': req.session.attempts
                })
            }
            else {
                res.render('qsuccess', {
                    message: 'You have answered the question!!',
                    'firstName': req.user.firstName,
                    'attempts': req.app.locals.attempts,
                    'userattempts': req.session.attempts
                });
            }
        } catch (err)
        {
        
            console.log('in catch');
            console.log(err);
            
        }  
           
        
    }

});

router.post('/ans', authHelpers.loginRequired, async (req, res, next) => {

    console.log(req.body.answer);
    const ansforuser = await Qotd_ans.query().where('qid', req.body.quesid);

    if (req.app.locals.attempts) {
        req.app.locals.attempts++;
    }
    else {
        req.app.locals.attempts = 1;    
    }

    if (req.session.attempts) {
        req.session.attempts++;
    }
    else {
        req.session.attempts = 1;
    }


    console.log(ansforuser[0].qid, ansforuser[0].answer);

    if (req.body.answer.toLowerCase() == ansforuser[0].answer) {
        var atime = Date.now();
        var uname = req.user.firstName + " " + req.user.lastName;
        console.log('answer is correct');
        console.log(req.user);
        await Qotd_user_ans.query().insert({ qid: ansforuser[0].qid, answertime: atime, email: req.user.email, user: uname, id: uname + atime, locationid: req.user.locationid, teamid: req.user.teamid });
    }
    else {

        console.log('answer is incorrect');
    }

    res.redirect('/qotd');

});

router.get('/leaderboard', authHelpers.loginRequired, async (req, res, next) => {

    //console.log(req.body.answer);
    const leaderb = await Qotd_user_ans.query().where('locationid', req.user.locationid).orderBy('answertime');

    if (leaderb) {
        res.render('qleaderboard', {
            'leader': leaderb,
            'message': ''
        });
    }

});

/*Verify Login*/
router.post('/', authHelpers.loginRedirect, (req, res, next) => {
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
    handleResponse(res, 200, 'success');
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
        res.render('login', { message: { error: '', success: 'You are connected' } });
    } else {
        res.render('login', { message: { error: 'Login Failed', success: '' } });
    }

}
module.exports = router;
