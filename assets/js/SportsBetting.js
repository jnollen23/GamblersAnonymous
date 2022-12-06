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
var sdIOPath = `odds/json/LiveGameOddsByDateByCompetition/${competition}`;//need competition modifier

function GetLatestMatches(){

}

function CreateTeamSelect(){

}

function PlaceBet(groupName){
    var buttons = document.querySelectorAll(`button[class='${groupName}']`);
    var betOn;
    buttons.forEach(x=>{
        if(x.dataset.group)
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
function GetGames(sport){
    var fullPath = ``;
    
    if(isTOA){
        fullPath = `${toaHost}/${sport}/${toaAPIPath}`;
    }
    else{
        var timeStart = moment().add(1,'day').format("YYYY-MM-DD");
        fullPath = `${sdIOHost}/${sport}/${sdIOPath}/${timeStart}?key=${sdIOApiKey}`;
    }
    
    $.ajax(fullPath)
    .then(y=>{ShowGames(y)});
}

function ShowGames(fullResp){
    /*https://api.sportsdata.io/v3/soccer/odds/json/GameOddsLineMovement/50005?key=247f38a9ab1043da9133115ee8eecda7*/
    //Clear our the previous body
    headerLocation.innerHTML = ``;

    fullResp.forEach(game =>{
        headerLocation.innerHTML += 
        `<div class='mdc-form-field'>
            <span class='game-title'>${game.HomeTeamName} vs. ${game.AwayTeamName}</span>
            <div class='mdc-touch-target-wrapper'>
                <div class='mdc-radio'>
                    <input type='radio' class='mdc-radio__native-control' name='${game.GameID}>'
                    <div class='mdc-radio__background'>
                        <div class='mdc-radio__outer-circle'></div>
                        <div class='mdc-radio__inner-circle'></div>
                    </div>
                </div>
                <label class='radio-label'>${game.HomeTeamName}</label>
                <div class='mdc-radio'>
                    <input type='radio' class='mdc-radio__native-control' name='${game.GameID}>'
                    <div class='mdc-radio__background'>
                        <div class='mdc-radio__outer-circle'></div>
                        <div class='mdc-radio__inner-circle'></div>
                    </div>
                <label class='radio-label'>${game.AwayTeamName}</label>
            </div>
        </div>
        `
    })

}

var tempGames = [
    {
        "AwayTeamName": "Croatia",
        "HomeTeamName": "Japan",
        "GameID": 50005
    },{
        "AwayTeamName": "Poland",
        "HomeTeamName": "France",
        "GameID": 50003
    },{
        "AwayTeamName": "Senegal",
        "HomeTeamName": "England",
        "GameID": 50004
    }
]

ShowGames(tempGames);