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

function GetLatestMatches() {

}

function CreateTeamSelect() {

}

function PlaceBet(groupName) {
    var buttons = document.querySelectorAll(`button[class='${groupName}']`);
    var betOn;
    buttons.forEach(x => {
        if (x.dataset.group)
            betOn = x.innerHTML;
    });

}

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

    if (isTOA) {
        fullPath = `${toaHost}/${sport}/${toaAPIPath}`;
    }
    else {
        //var timeStart = moment().add(2, 'day').format("YYYY-MM-DD");
        fullPath = `${sdIOHost}/${sport}/${sdIOPath}/${competition}/${timeStart}?key=${sdIOApiKey}`;
    }

    $.ajax(fullPath)
        .then(y => { ShowGames(y) });
}

function ShowGames(fullResp) {
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
                    <input type='radio' onclick='UpdateOdds("${game.HomeTeamName}")' class='mdc-radio__native-control' id='h${game.GameID}' name='${game.GameId}'>
                    <div class='mdc-radio__background'>
                        <div class='mdc-radio__outer-circle'></div>
                        <div class='mdc-radio__inner-circle'></div>
                    </div>
                </div>
                <label class='mdc-layout-grid__cell--span-11 radio-label' for='h${game.GameID}'>${game.HomeTeamName}</label>
            </div>
            <br/>
            <div class='mdc-layout-grid__inner'>
                <div class='mdc-radio mdc-radio-touch mdc-layout-grid__cell--span-1'>
                    <input type='radio' onclick='UpdateOdds("${game.AwayTeamName}")' class='mdc-radio__native-control' id='a${game.GameID}' name='${game.GameId}'>
                    <div class='mdc-radio__background'>
                        <div class='mdc-radio__outer-circle'></div>
                        <div class='mdc-radio__inner-circle'></div>
                    </div>
                </div>
                <label class='mdc-layout-grid__cell--span-11 radio-label' for='a${game.GameID}'>${game.AwayTeamName}</label>
            </div>    
            <br/>
            <div class='mdc-layout-grid__inner'>
                <div class='mdc-radio mdc-radio-touch mdc-layout-grid__cell--span-1'>
                    <input type='radio' onclick='UpdateOdds("none")' class='mdc-radio__native-control' id='n${game.GameID}' name='${game.GameId}'>
                    <div class='mdc-radio__background'>
                        <div class='mdc-radio__outer-circle'></div>
                        <div class='mdc-radio__inner-circle'></div>
                    </div>
                </div>
                <label class='mdc-layout-grid__cell--span-11 radio-label' for='n${game.GameID}'>None</label>
            </div>    
        </div>
    </div>
    `;
        var homeO = Math.floor(randomNumber() * 150) + 25;
        var awayO = Math.floor(randomNumber() * (homeO > 120) ? 75 : 150) + 25;
        gameOdds.push({
            id: game.GameID,
            homeTeam: game.HomeTeamName,
            homeOdds: homeO,
            awayTeam: game.AwayTeamName,
            awayOdds: awayO
        })
    })
    headerLocation.appendChild(listHolder);
    var betTaker = document.createElement('div');
    
}

function UpdateOdds(team) {
    for (var x = 0; x < gameOdds.length; x++) {
        if (gameOdds[x].awayTeam === team) {
            curSelTeams.push({name:gameOdds[x].awayTeam, odds:gameOdds[x].awayOdds});
            RemoveOtherTeam(gameOdds[x].homeTeam);
            break;
        }
        else if (gameOdds[x].homeTeam === team) {
            curSelTeams.push({name:gameOdds[x].homeTeam, odds:gameOdds[x].homeOdds});
            RemoveOtherTeam(gameOdds[x].awayTeam);
            break;
        }
    }
    PublishOdds();

}

function RemoveOtherTeam(team){
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
        curSelTeams.sort((a,b)=>b.odds - a.odds);
        for (var x = 0; x < curSelTeams.length; x++) {
            if(x === 0) totalOdds = curSelTeams[x].odds;
            else totalOdds += Math.floor(curSelTeams[x].odds / 2);
        }
    }
    console.log(totalOdds);
}

function ShowSportsBetting() {

}

