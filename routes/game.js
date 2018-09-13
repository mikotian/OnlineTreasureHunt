var jawaab = require('../models/jawaab');
var Koschan = require('../models/koschan');
var users = require('../models/users');
var teams = require('../models/teams');
var trail = require('../models/trail');
var usercon = require('../controllers/usercontroller')
var express = require('express');
var router = express.Router();
const authHelpers = require('../_helpers');
const passport = require('../local');
const { transaction } = require('objection');
var koschancontroller = require('../controllers/koschancontroller');

const lastlevel = 10;

router.get('/', authHelpers.loginRequired, async (req, res, next) => {

    if(req.user){
    var usersdeets = await users.query().where('locationid', req.user.locationid).andWhere('score', '>', 0);
    var teamsbyloc = await teams.query().where('locationid', req.user.locationid);
    var user_rank = await usercon.getUserRank(usersdeets, req.user.email);
    var teamScore = await usercon.getTeamScore(usersdeets, req.user.teamid);
    var teamRank = await usercon.getTeamRank(usersdeets, req.user.teamid, teamsbyloc);
    req.session.teamScore = teamScore;
    req.session.userRank = user_rank;
    req.session.teamRank = teamRank;

    if (req.user.level<lastlevel) {
    console.log(req.user);
    const koschanforuser = await Koschan.query().where('locationid', req.user.locationid).andWhere('level', req.user.level);

        //console.log(user_rank);
        //const teamscorerank = await Koschan.query().where('locationid', req.user.locationid).andWhere('level', req.user.level);

        //console.log(koschanforuser[0].ques, koschanforuser[0].imgloc);

        res.render('game', {
            'question': koschanforuser[0].ques,
            'image': koschanforuser[0].imgloc,
            'id': koschanforuser[0].id,
            'userscore': req.user.score,
            'teamscore': teamScore,
            'userrank': user_rank,
            'teamrank': teamRank,
            'firstName': req.user.firstName
        });
    } else
    {
        res.render('success', {
            message: 'You have completed the hunt!!',
            'userscore': req.user.score,
            'teamscore': teamScore,
            'userrank': user_rank,
            'teamrank': teamRank,
            'firstName': req.user.firstName
        });
    }
}

});

router.post('/ans', authHelpers.loginRequired, async (req, res, next) => {

    console.log(req.body.answer);
    const ansforuser = await jawaab.query().where('id', req.body.quesid);

    console.log(ansforuser[0].id, ansforuser[0].ans);

    if (req.body.answer.toLowerCase() == ansforuser[0].ans) {

        console.log('answer is correct');
        await koschancontroller.updateKoschanTime(req.user.email, req.body.quesid, req.body.answer, req.user.level, req.user.score);
    }
    else {

        console.log('answer is incorrect');
    }

    res.redirect('/game');

});

router.get('/leaderboard', authHelpers.loginRequired, async (req, res, next) => {

    //console.log(req.body.answer);
    const leaderb = await users.query().where('locationid', req.user.locationid).orderBy('score', 'desc');

    if (leaderb) {
        res.render('leaderboard', {
            'leader': leaderb,
            'userscore': req.user.score,
            'teamscore': req.session.teamScore,
            'userrank': req.session.userRank,
            'teamrank': req.session.teamRank,
            'firstName': req.user.firstName });
    }

});

router.get('/trail', authHelpers.loginRequired, async (req, res, next) => {

    //console.log(req.body.answer);
    const hist = await trail.query().where('user', req.user.email).orderBy('anstime');

    if (hist) {
        res.render('history', {
            'history': hist,
            'userscore': req.user.score,
            'teamscore': req.session.teamScore,
            'userrank': req.session.userRank,
            'teamrank': req.session.teamRank,
            'firstName': req.user.firstName
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
