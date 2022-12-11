var playerBalance;
var user;

function GetBalance(){
    return playerBalance;
}

function SetUser(name){
    user = name;
    if(Object.keys(localStorage).indexOf(user) > -1){
        playerBalance = parseFloat(localStorage.getItem(user));
    }
    else{
        localStorage.setItem(user, 5000);
        playerBalance = 5000;
    }
}

function ChangeBalance(value){
    var newValue = value;
    if(typeof(value) === "string")
        newValue = parseInt(value)
    playerBalance += newValue;
    localStorage.setItem(user, playerBalance);
}

function getUser() {
    return user;
}
