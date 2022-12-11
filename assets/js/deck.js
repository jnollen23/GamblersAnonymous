var playerGameHand = [];
var dealerGameHand = [];
var playerStay = false;
var bustbool = false;
var count = 0;
var hiddenCard = '';
var hiddenValue = 0;
var anteAmount = 0;
var dealerBJ = false;

//creates the deck taking in an int parameter for deciding the deck size
function createDeck(deckSize, game) {
    $.ajax({
        url: "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=" + deckSize,
        type: 'GET'
    })
    .then(function(response) {
        var deckId = $('.deckId');
        deckId.attr('value', response.deck_id);
        $('.betting').addClass('d-none');
        $('.dealGame').removeClass('d-none');
        
        //***************************only used in blackjack game***********************************//
        if(game === 'blackjack'){
            dealCards();
        }
        //***************************only used in blackjack game***********************************//
    }); 
}

//draws a card and places the the image in the class passed by 'hand' and sets value of card in global variables
function drawCard(hand, game) {
    count++;
    $.ajax({
        url: "https://www.deckofcardsapi.com/api/deck/" + $('.deckId').val() + "/draw/?count=1",
        type: 'GET'
    })
    .then(function(response){
            $(hand).append($('<img class="cardStyle">').attr('src', response.cards[0].image));
            if(hand ==='.playerHand'){
                playerGameHand.push(valueConvert(response.cards[0].value));
                $('.playerHandCount').text(playerHandValue());
             }
            else{
                dealerGameHand.push(valueConvert(response.cards[0].value));
            }
    //***************************only used in blackjack game***********************************//
    //checks for possible double down
    if(count > 0){
        $('#doubleBtn').addClass('d-none');
    }
  
    //checks if player has busted
    if (game === 'blackjack' && hand === '.playerHand'){
        bust();
        if (playerStay === true && bustBool === false){
            stay();
        }
    }
    
    //checks if player has stayed and continues to dealer play
    if (game === 'blackjack' && hand === '.dealerHand' && playerStay === true){
        stay();
    }
    //***************************only used in blackjack game***********************************//
    });
}

//deals the initial cards for the start of the game
function dealCards() {
    anteAmount = $('.betAmount');
    ChangeBalance(-1*anteAmount);
    $('.playerHand').append($('<h2 class="headerText">').text("Player Hand"));
    $('.dealerHand').append($('<h2 class="headerText">').text("Dealer Hand"));

    $.ajax({
        url: "https://www.deckofcardsapi.com/api/deck/" + $('.deckId').val() + "/draw/?count=4",
        type: 'GET'
    })
    .then(function(response){
        console.log(response);
        response.cards.forEach((cards, i) => {
            if(i < 2) {
                $('.playerHand').append($('<img class="cardStyle">').attr('src', cards.image));
                playerGameHand.push(valueConvert(cards.value));
                playerHandValue();
            }
            else if(i == 2) {
                hiddenCard = cards.image;
                console.log(hiddenCard);
                hiddenValue = cards.value;
                $('.dealerHand').append($('<img class="cardStyle faceDown">').attr('src', './assets/images/cardback.png'));
                dealerGameHand.push(valueConvert(cards.value));
            }
            else {
                $('.dealerHand').append($('<img class="cardStyle">').attr('src', cards.image));
                dealerGameHand.push(valueConvert(cards.value));
                console.log(cards.value);
                $('.dealerHandCount').text(valueConvert(cards.value));
            }
        })

    checkForBlackjack();
    });
}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<BLACKJACK GAME CODE START>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//checks for blackjack

function winAnte(){
    if(doubleDown===true){
        ChangeBalance(anteAmount*4);
    }
    else{
        ChangeBalance(anteAmount*2);
    }
}

//changes string values into int values
function valueConvert(value){
    if (value ==='ACE'){
        value = 11;
    }
    else if (value === 'KING' || value === 'QUEEN' || value === 'JACK'){
        value = 10;
    }
    else
        value = parseInt(value);
    return value;
}

function checkForBlackjack(){
    if(playerHandValue() == 21 && dealerHandValue() == 21){
        btnClean();
        ChangeBalance(anteAmount);
        $('.centerBoard').append($('<h2 class="headerText">').text("You tie!!!"));
    }
    else if(playerHandValue() == 21){
        btnClean();
        ChangeBalance(2.5*anteAmount);
        $('.centerBoard').append($('<h2 class="headerText">').text("You Got Blackjack!!!"));
    }
    else if(dealerHandValue() == 21){
        dealerBJ = true;
        btnClean();
        $('.faceDown').attr('src', hiddenCard);
        dealerHandValue()
        $('.centerBoard').append($('<h2 class="headerText">').text("Dealer Got Blackjack!!!"));
    }
    else{
        $('#playerDrawBtn').removeClass('d-none');
        $('#stayBtn').removeClass('d-none');
        $('#doubleBtn').removeClass('d-none');
    }
}

//double down draw function for player
function doubleDown() {
    playerStay = true;
    ChangeBalance(-1*anteAmount);
    drawCard('.playerHand', 'blackjack');
}
//draw function for player
function playerDraw() {
    drawCard('.playerHand', 'blackjack');
}

//draw function for dealer
function dealerDraw() {
    drawCard('.dealerHand', 'blackjack');
}

//logic for dealer
function stay(){
    playerStay = true;
    $('.faceDown').attr('src', hiddenCard);
    if(dealerHandValue() < 17){
        dealerDraw();
    }
    else{
        dealerBust();
    }
}

//checks if you bust
function bust(){
    if (playerHandValue() > 21){
        btnClean();
        bustBool = true;
        return $('.centerBoard').append($('<h2 class="headerText">').text("You Lose!!!"));
    }
}

//conditions for dealers hand
function dealerBust(){
    btnClean();
    if (dealerHandValue() > 21){
        winAnte();
        return $('.centerBoard').append($('<h2 class="headerText">').text("You Win!!!"));
    }
    else if (dealerHandValue() == playerHandValue() ){
        ChangeBalance(anteAmount);
        return $('.centerBoard').append($('<h2 class="headerText">').text("You Tie!!!"));
    }
    else if (dealerHandValue() > playerHandValue() ){
        return $('.centerBoard').append($('<h2 class="headerText">').text("You Lose!!!!"));
    }
    else{
        winAnte();
        return $('.centerBoard').append($('<h2 class="headerText">').text("You Win!!!!"));    
    }
}

//adds all the values of the player's hand together
function playerHandValue(){  
    if (playerGameHand.length < 3 && playerGameHand[0] == 11 && playerGameHand[1] == 11){
        playerGameHand[0] = 1;
    }   
    var sum = playerGameHand.reduce(function(a, b) {
        return a+b;
    }, 0);

    //checks and changes ACE value if hand is over 21
    if (sum > 21){
        for (i = 0; i < playerGameHand.length; i++){
            if (playerGameHand[i] === 11){
                playerGameHand[i] = 1; 
            }
        }
        var sum = playerGameHand.reduce(function(a, b) {
            return a+b;
        }, 0);
    }
    $('.playerHandCount').text(sum);
    return sum;
}

//adds all the values of the dealers's hand together
function dealerHandValue(){    
    if (dealerGameHand.length < 3 && dealerGameHand[0] == 11 && dealerGameHand[1] == 11){
        dealerGameHand[0] = 1;
    }   
    var sum = dealerGameHand.reduce(function(a, b) {
        return a+b;
    }, 0);

    //checks and changes ACE value if hand is over 21
    if (sum > 21){
        for (i = 0; i < dealerGameHand.length; i++){
            if (dealerGameHand[i] === 11){
                dealerGameHand[i] = 1; 
            }
        }
        var sum = dealerGameHand.reduce(function(a, b) {
            return a+b;
        }, 0);
    }
    if(playerStay===true){
        $('.dealerHandCount').text(sum);
    }
    else if(dealerBJ===true){
        $('.dealerHandCount').text(sum);
    }
    return sum;
}

//hides buttons and reveals the reset button
function btnClean(){
    $('#playerDrawBtn').addClass('d-none');
    $('#stayBtn').addClass('d-none');
    $('#doubleBtn').addClass('d-none');
    $('#reset').removeClass('d-none');
    console.log("this is the balance: " + GetBalance());
}

//restarts the game
function restart(){
    $('.playerHand').empty();
    $('.centerBoard').empty();
    $('.dealerHand').empty();
    playerGameHand = [];
    dealerGameHand = [];
    $('.betting').removeClass('d-none');
    $('#reset').addClass('d-none');
    $('.playerHandCount').empty();
    $('.dealerHandCount').empty();
    playerStay = false;
    count = 0;
    bustBool = false;
    dealerBJ = false;
    hiddenCard = "";
}

function createBlackjack(){
    $('#bootstrap').attr('href', "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css");
    console.log($('#bootstrap'))
    var innerHT = ''+
        `
        <div id="theBlackjackGame">
        <input class="deckId d-none"></input>

        <div class ="container text-center">
            <!-- top row -->
            <div class="row align-items-center">
                <container class="col-2 max-width">
                    <h2 class="dealerHandCount bjTextColor"></h2>
                </container>
                <container class="col-8 max-width col align-self-center">
                    <div class="dealerHand"></div>
                </container>
                <container class="col-2 max-width align-self-start">
                <button id="bjExit" type="button" onclick="blackjackBackout()" class="btn btnColor row btnStyle"><strong>EXIT</strong></button>
                </container>
            </div>
            <!-- middle row -->
            <div class="row">
                <container class="col-2 max-width"></container>
                <container class="col-8 max-width col align-self-center">
                    <!-- div for getting bet amount and creating deck -->
                    <div class="betting ">
                        <h2 class="headerText">How much would you like to bet?</h2>
                        <input class="betAmount inputSize form-control text-center align-content-center"></input>
                        <button id="startGameBtn" type="button" class="btn btnColor btnStyle" onclick="createDeck(6, 'blackjack')"><strong>DEAL</strong></button>
                    </div>
                    <div class="centerBoard" ></div>
                </container>
                <container class="bjGame col-2 max-width">
                </container>
            </div>
            <!-- bottom row -->
            <div class="row align-items-center">
                <container class="col-2 max-width">
                    <h2 class="playerHandCount bjTextColor"></h2>
                </container>
                <container class="col-8 max-width col align-self-center">
                    <div class="playerHand"></div>
                </container>
                <container class="col-2 max-width">
                    <button id="playerDrawBtn" type="button" onclick="playerDraw()" class="btn btnColor row d-none btnStyle col"><strong>HIT</strong></button>
                    <button id="stayBtn" type="button" onclick="stay()" class="btn btnColor row d-none btnStyle col"><strong>STAY</strong></button>
                    <button id="doubleBtn" type="button" onclick="doubleDown()" class="btn btnColor row d-none btnStyle col"><strong>DOUBLE DOWN</strong></button>
                    <button id="reset" type="button" onclick="restart()" class="btn btnColor row d-none btnStyle col"><strong>NEW GAME</strong></button>
                </container>
            </div>
         </div>
         </div>
        `;
        $('#Casino-Game').append(innerHT);
        $('#Casino').hide();
}

function blackjackBackout() {
    restart();
    $('#theBlackjackGame').remove();
    $('#Casino').show();
    $('#bootstrap').attr('href', "");
}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<BLACKJACK GAME CODE END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>