var jawaab = require('../models/jawaab');
var koschan = require('../models/koschan');
//var locations = require('../models/locations');
var teams = require('../models/teams');
var users = require('../models/users');
var trail = require('../models/trail');


const updateKoschanTime = async (userid, quesid, ans, lvl, scr) => {
    const kosc = await koschan.query().where('id', quesid);
    console.log(kosc[0].lastans);
    console.log(!kosc[0].lastans)
    if (!kosc[0].lastans)
    {
        console.log("in if of updateKoschanTime")
        try {
            var answertime = Date.now();
            await koschan.query().patch({ lastans: answertime }).where('id', quesid);
            await users.query().patch({ score: scr + kosc[0].points, level: lvl + 1, lastans: answertime }).where('email', userid);
            await trail.query().insert({ user: userid, quesid: quesid, answer: ans, anstime: answertime, points: kosc[0].points });
        } catch (err)
        {
            console.log(err);
        }
    }
    else
    {
        var anstime = Date.now();
        var firstans = kosc[0].lastans;

        try {
            var computedScore = kosc[0].points - ((anstime - firstans) / 1000);
            if (computedScore < 100) {
                computedScore = 100;
            }
            await users.query().patch({ score: scr + computedScore, level: lvl + 1, lastans: anstime }).where('email', userid);
            await trail.query().insert({ user: userid, quesid: quesid, answer: ans, anstime: anstime, points: computedScore });
        } catch (err) {
            console.log(err);
        }
    }
}

const calculateScore = async (oldtime) => {
    const data = await getJSON()
    if (data.needsAnotherRequest) {
        const moreData = await makeAnotherRequest(data);
        console.log(moreData)
        return moreData
    } else {
        console.log(data)
        return data
    }
}

module.exports = {
    updateKoschanTime,
    calculateScore
};