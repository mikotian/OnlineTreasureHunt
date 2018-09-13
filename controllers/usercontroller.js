const updateUserLevelScore = async (userid,quesid) => {
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

const getUserRank = async (users, myuser) => {

    var temp = users.sort((a, b) => parseFloat(a.score) < parseFloat(b.score));
    
    for (i = 0; i < temp.length; i++)
    {
        console.log(temp[i].score);
        if (temp[i].email == myuser)
        {
            return i + 1;
        }
    }
    return 0;
}

const getTeamScore = async (users, myteam) => {

    var totalScore = 0;

    for (i = 0; i < users.length; i++) {
        if (users[i].teamid == myteam) {
            totalScore += users[i].score;
        }
    }
    return totalScore;
}


function TeamScore(team, score)
{
    this.teamName = team;
    this.teamScore = score;
}


const getTeamRank = async(users, team, teamsbylocation)=>{

    var tscores = new Array();
    console.log(teamsbylocation);
    for (var tm in teamsbylocation) {
        console.log(teamsbylocation[tm].id);
        tscores[teamsbylocation[tm].id] = 0;
    }

    for (i = 0; i < users.length; i++) {
        //console.log(users[i].email + "::::" + users[i].teamid);
        //console.log(typeof users[i].score);
        console.log(tscores[users[i].teamid]);
        tscores[users[i].teamid] = parseFloat(tscores[users[i].teamid])+parseFloat(users[i].score);
    }
    console.log(tscores);
    temp = Object.keys(tscores).sort(function (a, b) { return tscores[b] - tscores[a] })
    console.log(temp);
    for (i = 0; i < temp.length; i++) {
        if (temp[i].includes(team))
        { return i + 1;}
    }
    return 0;
}

module.exports = {
    getUserRank,
    updateUserLevelScore,
    getTeamScore,
    getTeamRank
};