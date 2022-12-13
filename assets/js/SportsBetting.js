var headerLocation = document.getElementsByClassName('sports-location')[0];
var activeButtons;

//sports betting api websites
var isTOA = false;  //There are 2 sites I am working on in hopes one will be successful in making calls, right now the TOA does not work because 
//it needs CORS which I can not do from the front end and so I would need to have a server to go through to make the calls

var toaAPIKey = `78ce139f51d27cb4da7a800234ae5516`;
var toaHost = `https://api.the-odds-api.com/v4`;
var toaApiPath = `odds?apiKey=${toaAPIKey}&regions=us`;

var sdIOApiKey = `247f38a9ab1043da9133115ee8eecda7`;
var sdIOHost = `https://api.sportsdata.io/v3`;
var competition = 21//FIFA World Cup
var sdIOPath = `odds/json/LiveGameOddsByDateByCompetition`;//need competition modifier

var gameOdds = [];
var totalOdds = 0;
var curSelTeams = [];


/* Get game odds from server for a specific sport. You can not get all odds for all sports */
/* Site uses CORS which means we need a way to get there without having a server of our own
    I have found a proxy application that I can run on a free heroku trial that will host the
    program I found and act as a proxy to handle CORS for the web app. 
    App Name: CORSAnywhere */
/* I was able to get the sportsdata.io api to work without a cors workaround but it does not give odds on 
    To get odds i have to do another call on a specific game but that has a 15 minute cooldown so I wont be
    able to add true odds but I can at least pull games for a given day*/
function GetGames(sport, timeStart, competition) {
    var fullPath = ``;
    //Clear any selected bets
    curSelTeams = [];

    if (isTOA) {
        fullPath = `${toaHost}/${sport}/${toaAPIPath}`;
    }
    else {
        //var timeStart = moment().add(2, 'day').format("YYYY-MM-DD");
        fullPath = `${sdIOHost}/${sport}/${sdIOPath}/${competition}/${timeStart}?key=${sdIOApiKey}`;
    }

    $.ajax(fullPath)
        .then(y => { ShowGames(y, sport, timeStart, competition) });
}

function ShowGames(fullResp, sport, timeStart, competition) {
    /*https://api.sportsdata.io/v3/soccer/odds/json/GameOddsLineMovement/50005?key=247f38a9ab1043da9133115ee8eecda7*/
    //Clear our the previous body
    headerLocation.innerHTML = ``;
    gameOdds = [];
    var listHolder = document.createElement('div');
    listHolder.setAttribute('class', 'row');


    fullResp.forEach(game => {
        listHolder.innerHTML +=
            `
    <div class='sports-list col s3'>
        <div class='row'>
            <div class='row'>
                <h4 class='center-align game-title'>${game.HomeTeamName} vs. ${game.AwayTeamName}</h4>
            </div>
            <div class='row'>
                <p class='col offset-s1'>
                    <label class='radio-label'>
                        <input type='radio' onclick='UpdateOdds("${game.HomeTeamName}")' id='h${game.GameId}' name='${game.GameId}'>
                        <span for='h${game.GameId}'><span class='radio-label'>${game.HomeTeamName}</span></span>
                    </lable>
                </p>
            </div>
            <br/>
            <div class='row'>
                <p class='col offset-s1'>
                    <label>
                        <input type='radio' onclick='UpdateOdds("${game.AwayTeamName}")' id='a${game.GameId}' name='${game.GameId}'>
                        <span class='radio-label' for='a${game.GameId}'><span class='radio-label'>${game.AwayTeamName}</span></span>
                    </label>
                </p>
            </div>    
            <br/>
            <div class='row'>
                <p class='col offset-s1'>
                    <label>
                        <input type='radio' onclick='UpdateOdds("${game.AwayTeamName}|${game.HomeTeamName}")' checked id='n${game.GameId}' name='${game.GameId}'>
                        <span for='n${game.GameId}'><span class='radio-label'>None</span></span>
                    </label>
                </p>
            </div>    
        </div>
    </div>
    `;
        var homeO = Math.floor(randomNumber() * 150) + 25;
        var awayO = Math.floor(randomNumber() * (homeO > 120) ? 75 : 150) + 20;
        gameOdds.push({
            id: game.GameID,
            homeTeam: game.HomeTeamName,
            homeOdds: homeO,
            awayTeam: game.AwayTeamName,
            awayOdds: awayO,
            date: timeStart,
            sport: sport,
            competition: competition
        })
    })
    headerLocation.appendChild(listHolder);
    var betTaker = document.createElement('div');
    headerLocation.appendChild(betTaker);

    betTaker.setAttribute('id', 'betting');
    betTaker.innerHTML += `
        <div class='row'>
            <label class='col s2 betting-label' for='betvalue'>Your Bet</label>
            <input class='col s2' type='text' id='betvalue'>
        </div>
        <div class='row'>
            <label class='col s2 betting-label' for='betodds'>Total Odds</label>
            <input class='col s2' type='text' id='betodds' disabled value='0'>
        </div> 
        <a class="waves-effect waves-light btn" onclick='SubmitBet()'>
            <span>Submit Bet</span>
        </button>
    `;

    PublishOdds();
}

function UpdateOdds(team) {
    if (team.indexOf("|") > 0) {
        var teams = team.split('|');
        RemoveOtherTeam(teams[0]);
        RemoveOtherTeam(teams[1]);
    }
    else if (BetAlreadySelected(team)) return;
    else {
        for (var x = 0; x < gameOdds.length; x++) {
            if (gameOdds[x].awayTeam === team) {
                curSelTeams.push({
                    name: gameOdds[x].awayTeam,
                    odds: gameOdds[x].awayOdds,
                    match: gameOdds[x].awayTeam + "|" + gameOdds[x].homeTeam,
                    date: gameOdds[x].date,
                    competition: gameOdds[x].competition,
                    sport: gameOdds[x].sport
                });
                RemoveOtherTeam(gameOdds[x].homeTeam);
                break;
            }
            else if (gameOdds[x].homeTeam === team) {
                curSelTeams.push({
                    name: gameOdds[x].homeTeam,
                    odds: gameOdds[x].homeOdds,
                    match: gameOdds[x].awayTeam + "|" + gameOdds[x].homeTeam,
                    date: gameOdds[x].date
                });
                RemoveOtherTeam(gameOdds[x].awayTeam);
                break;
            }
        }
    }
    PublishOdds();

}

function BetAlreadySelected(team) {
    for (var x = 0; x < curSelTeams.length; x++) {
        if (curSelTeams[x].name === team) return true;
    }

    return false;
}

function RemoveOtherTeam(team) {
    for (var x = 0; x < curSelTeams.length; x++) {
        if (curSelTeams[x].name === team) {
            curSelTeams.splice(x, 1);
            return;
        }
    }
}

function PublishOdds() {
    totalOdds = 0;

    curSelTeams.sort((a, b) => b.odds - a.odds);
    for (var x = 0; x < curSelTeams.length; x++) {
        totalOdds += curSelTeams[x].odds;
    }
    document.getElementById('betodds').setAttribute('value', totalOdds);
}

function ShowSportsBetting() {
    $('#theBlackjackGame').remove();
    $('#slot-machine').remove();
    $("#snakegamebody").hide();
    var hrefCompare = "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css";
    if ($('#bootstrap').prop('href') === hrefCompare){
      $('#bootstrap').attr('href', "");
    }
    var navBar = document.getElementsByClassName('nav-content')[0];
    navBar.style.backgroundColor = "rgb(76,163,245)";
    var timeStart = moment().add(3, 'day').format("YYYY-MM-DD");
    GetGames('soccer', timeStart, 21);
}

function SubmitBet() {
    var userBet = document.getElementById('betvalue').value;

    if (totalOdds > 0 && userBet > 0) {
        if (userBet <= GetBalance()) {
            var count = Object.keys(localStorage);
            var gameList = [];

            curSelTeams.forEach(game => {
                gameList.push({
                    match: game.match,
                    picked: game.name
                });
            })

            localStorage.setItem(`bet-${getUser()}-${count.length}`, JSON.stringify({
                user: getUser(),
                odds: totalOdds,
                bet: userBet,
                games: gameList,
                date: curSelTeams[0].date
            }));
            ChangeBalance(-userBet);
            curSelTeams = [];
            PublishOdds();
            document.getElementById('betting').innerHTML += "<span class='success-text' id='betMessage'>&#x2713Your bet was placed successfully</span>"
            StartBetClearTimerTime();
        }
        else {
            document.getElementById('betting').innerHTML += "<span class='error-text' id='betMessage'>&#9888Your balance is too low</span>"
            StartBetClearTimerTime();
            //Show alert that you dont have that balance
        }
    }
}

function StartBetClearTimerTime() {
    setTimeout(ClearBetResponse, 3000);
}

function ClearBetResponse() {
    var doc = document.getElementById("betMessage");
    var betDoc = document.getElementById('betting');
    if (doc !== undefined || doc !== null) {
        betDoc.removeChild(doc);
    }
}

function PayBets() {
    var keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.indexOf(`bet-${getUser()}`) > -1) {
            var bet = JSON.parse(localStorage.getItem(key));
            //var date = new Date();
            //if(date.getDate >= GetCorrectUTCDate(bet.date)){
            if (Math.floor(randomNumber() * 100) > 50) {
                var total = bet.odds * bet.bet;
                total = total / 100;
                var winnings = Math.floor(total) + parseInt(bet.bet);
                ChangeBalance(winnings);
                highScoreChecker(winnings, "sportsBetting");
            }
            localStorage.removeItem(key);
            //}
        }
    })
}

function GetCorrectUTCDate(date) {
    var currentDate = new Date(date);
    var userOffSet = currentDate.getTimezoneOffset() * 60000;
    if (userOffSet >= 0) {
        return new Date(currentDate.getTime() + userOffSet);
    }
    return new Date(currentDate.getTime() - userOffSet);
}



