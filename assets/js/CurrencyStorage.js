var playerBalance;
var user;

function GetBalance(){
    return playerBalance;
}

function SetUser(name){
    user = name;
    if(Object.keys(localStorage).indexOf(user) > -1){
        playerBalance = parseInt(localStorage.getItem(user));
    }
    else{
        localStorage.setItem(user, 5000);
        playerBalance = 5000;
    }
}

function ChangeBalance(value){
    playerBalance += value;
    localStorage.setItem(user, playerBalance);
}

function getUser() {
    return user;
}
