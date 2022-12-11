document.addEventListener("DOMContentLoaded", function(){
  const myTabs = document.querySelector('.tabs')
  M.Tabs.init(myTabs,{});
})



//This is the base version for MVP for currency with a login
//I am trying to keep everything related to Currency in the Currency JS so dont mess with
//the currency global variables, use the method GetBalance and SetUser
function UserLogin(){
    SetUser('user');
    var userBalance = GetBalance();
    //When user logs in will pay all their sports bets
    PayBets();
    var signIn = $('#signin');
    signIn.addClass('disabled');
    signIn.text("Logged In");
}

function NavBarColor(color){
  var navBar = document.getElementsByClassName('nav-content')[0];
  navBar.style.backgroundColor = color;
  $('#theBlackjackGame').remove();
  $('#slot-machine').remove();
  $("#snakegamebody").hide();
  var hrefCompare = "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css";
  if ($('#bootstrap').prop('href') === hrefCompare){
    $('#bootstrap').attr('href', "");
  }
}
