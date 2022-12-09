var headerLocation = document.getElementsByClassName('body-location')[0];
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
    listHolder.setAttribute('class', 'horizontal-list');

    fullResp.forEach(game => {
        listHolder.innerHTML +=
            `
    <div class='sports-list'>
        <div class='mdc-layout-grid'>
            <div class='mdc-layout-grid__inner'>
                <span class='mdc-layout-grid__cell mdc-layout-grid__cell--span-12 game-title'>${game.HomeTeamName} vs. ${game.AwayTeamName}</span>
            </div>
            <div class='mdc-layout-grid__inner'>
                <div class='mdc-radio mdc-radio-touch mdc-layout-grid-cell--span-1'>
                    <input type='radio' onclick='UpdateOdds("${game.HomeTeamName}")' class='mdc-radio__native-control' id='h${game.GameId}' name='${game.GameId}'>
                    <div class='mdc-radio__background'>
                        <div class='mdc-radio__outer-circle'></div>
                        <div class='mdc-radio__inner-circle'></div>
                    </div>
                </div>
                <label class='mdc-layout-grid__cell--span-11 radio-label' for='h${game.GameId}'>${game.HomeTeamName}</label>
            </div>
            <br/>
            <div class='mdc-layout-grid__inner'>
                <div class='mdc-radio mdc-radio-touch mdc-layout-grid__cell--span-1'>
                    <input type='radio' onclick='UpdateOdds("${game.AwayTeamName}")'class='mdc-radio__native-control' id='a${game.GameId}' name='${game.GameId}'>
                    <div class='mdc-radio__background'>
                        <div class='mdc-radio__outer-circle'></div>
                        <div class='mdc-radio__inner-circle'></div>
                    </div>
                </div>
                <label class='mdc-layout-grid__cell--span-11 radio-label' for='a${game.GameId}'>${game.AwayTeamName}</label>
            </div>    
            <br/>
            <div class='mdc-layout-grid__inner'>
                <div class='mdc-radio mdc-radio-touch mdc-layout-grid__cell--span-1'>
                    <input type='radio' onclick='UpdateOdds("${game.AwayTeamName}|${game.HomeTeamName}")' checked class='mdc-radio__native-control' id='n${game.GameId}' name='${game.GameId}'>
                    <div class='mdc-radio__background'>
                        <div class='mdc-radio__outer-circle'></div>
                        <div class='mdc-radio__inner-circle'></div>
                    </div>
                </div>
                <label class='mdc-layout-grid__cell--span-11 radio-label' for='n${game.GameId}'>None</label>
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
            date:timeStart,
            sport:sport,
            competition:competition
        })
    })
    headerLocation.appendChild(listHolder);
    var betTaker = document.createElement('div');
    headerLocation.appendChild(betTaker);

    betTaker.setAttribute('id', 'betting');
    betTaker.innerHTML += `
        <div>
            <label for='betvalue'>Your Bet</label>
            <input type='text' id='betvalue'>
        </div>
        <div>
            <label for='betodds'>Total Odds</label>
            <input type='text' id='betodds' disabled value='0'>
        </div> 
        <button class="mdc-button mdc-button--raised" onclick='SubmitBet()'>
            <span class="mdc-button__touch"></span>
            <span class="mdc-button__label">Submit Bet</span>
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
    else if(BetAlreadySelected(team)) return;
    else {
        for (var x = 0; x < gameOdds.length; x++) {
            if (gameOdds[x].awayTeam === team) {
                curSelTeams.push({
                    name: gameOdds[x].awayTeam,
                    odds: gameOdds[x].awayOdds,
                    match: gameOdds[x].AwayTeamName + "|" + gameOdds[x].HomeTeamName,
                    date:gameOdds[x].date,
                    competition:gameOdds[x].competition,
                    sport:gameOdds[x].sport
                });
                RemoveOtherTeam(gameOdds[x].homeTeam);
                break;
            }
            else if (gameOdds[x].homeTeam === team) {
                curSelTeams.push({ 
                    name: gameOdds[x].homeTeam, 
                    odds: gameOdds[x].homeOdds, 
                    match: gameOdds[x].AwayTeamName + "|" + gameOdds[x].HomeTeamName,
                    date:gameOdds[x].timeStart
                });
                RemoveOtherTeam(gameOdds[x].awayTeam);
                break;
            }
        }
    }
    PublishOdds();

}

function BetAlreadySelected(team){
    for(var x = 0; x < curSelTeams.length; x++){
        if(curSelTeams[x].name === team) return true;
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
    if (curSelTeams.length === 0) {
        totalOdds = 0;
    }
    else {
        curSelTeams.sort((a, b) => b.odds - a.odds);
        for (var x = 0; x < curSelTeams.length; x++) {
            if (x === 0) totalOdds = curSelTeams[x].odds;
            else totalOdds += Math.floor(curSelTeams[x].odds / 2);
        }
    }
    document.getElementById('betodds').setAttribute('value', totalOdds);
    //console.log(totalOdds);
}

function ShowSportsBetting() {

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

            localStorage.setItem(`bet${count.length}`, JSON.stringify({
                user: getUser(),
                odds: totalOdds,
                bet: userBet,
                games: gameList,
                date:curSelTeams[0].timeStart
            }));
            ChangeBalance(-userBet);
            curSelTeams = [];
            PublishOdds();
            document.getElementById('betting').innerHTML += "<span class='success-text'>&#x2713Your bet was placed successfully</span>"
        }
        else {
            document.getElementById('betting').innerHTML += "<span class='error-text'>&#9888Your balance is too low</span>"
            //Show alert that you dont have that balance
        }
    }
}

