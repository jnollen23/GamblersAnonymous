var playerGameHand = [];
var dealerGameHand = [];
var playerStay = false;
var bustbool = false;
var count = 0;
var hiddenCard = '';
var anteAmount = 0;

//creates the deck taking in an int parameter for deciding the deck size
function createDeck(deckSize) {
    $.ajax({
        url: "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=" + deckSize,
        type: 'GET'
    })
    .then(function(response) {
        var deckId = $('.deckId');
        deckId.attr('value', response.deck_id);
        $('.betting').hide();
        $('#drawBtn').show();
    });
}

//draws a card and places the the image in a class while storing the value of the card in global varibal playerGameHand and dealerGameHand
function drawCard(hand, game) {
    $.ajax({
        url: "https://www.deckofcardsapi.com/api/deck/" + $('.deckId').val() + "/draw/?count=1",
        type: 'GET'
    })
    .then(function(response){
            if(game == 'blackjack' && hand == '.dealerHand' && count == 1){
                hiddenCard = response.cards[0].image;              
                $(hand).append($('<img>').attr('src', './assets/cardback.png').addClass('faceDown'));
            }
            else{
                $(hand).append($('<img>').attr('src', response.cards[0].image));
            }
            var cardValue = 0;
            cardValue = valueConvert(response.cards[0].value);
             if(hand ==='.playerHand'){
                playerGameHand.push(cardValue);
                $('.playerHandHeader').html('player hand is: ' + playerHandValue());
             }
            else{
                dealerGameHand.push(cardValue);
                $('.dealerHandHeader').html('dealer hand is: ' + dealerHandValue());
            }
    count++;
    //***************************only used in blackjack game***********************************//
    //checks for blackjack
    if(game === 'blackjack' && count === 4){
        checkForBlackjack();
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
    $('.playerHand').append($('<h2>').text("Player Hand"));
    $('.dealerHand').append($('<h2>').text("Dealer Hand"));

    $.ajax({
        url: "https://www.deckofcardsapi.com/api/deck/" + $('.deckId').val() + "/draw/?count=4",
        type: 'GET'
    })
    .then(function(response){
        response.cards[0].forEach((i, cards) => {
            if(i < 2) {
                $('.playerHand').append($('<img>').attr('src', cards.image));
            }
            else {
                $('.dealerHand').append($('<img>').attr('src', cards.image));
            }
        })
    });

    for(var i=0; i < 2; i++){
            playerDraw();
            dealerDraw();
    }
}

//checks for blackjack
function checkForBlackjack(){
    btnClean();
    if(playerHandValue() == 21 && dealerHandValue() == 21){
        ChangeBalance(anteAmount);
        $('.centerBoard').append($('<h2>').text("You tie!!!"));
    }
    else if(playerHandValue() == 21){
        ChangeBalance(4*anteAmount);
        $('.centerBoard').append($('<h2>').text("You Got Blackjack!!!"));
    }
    else if(dealerHandValue() == 21){
        $('.centerBoard').append($('<h2>').text("Dealer Got Blackjack!!!"));
    }
    else{
        $('#drawBtn').hide();
        $('#playerDrawBtn').show();
        $('#stayBtn').show();
        $('#doubleBtn').show();
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

//adds all the values of the player's hand together
function playerHandValue(){     
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
    }
    return sum;
}

//adds all the values of the dealers's hand together
function dealerHandValue(){    
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
    }
    return sum;
}

//checks if you bust
function bust(){
        if (playerHandValue() > 21){
            btnClean();
            bustBool = true;
            return $('.centerBoard').append($('<h2>').text("You Lose!!!"));
        }
}

//hides buttons and reveals the reset button
function btnClean(){
    $('#drawBtn').hide();
    $('#playerDrawBtn').hide();
    $('#stayBtn').hide();
    $('#doubleBtn').hide();
    $('#reset').show();
    console.log(GetBalance());
}

//restarts the game
function restart(){
    $('.playerHand').empty();
    $('.centerBoard').empty();
    $('.dealerHand').empty();
    playerGameHand = [];
    dealerGameHand = [];
    $('.betting').show();
    $('#reset').hide();
    playerStay = false;
    count = 0;
    bustBool = false;
    hiddenCard = "";
    $('.playerHandHeader').empty();
    $('.dealerHandHeader').empty();
}

//logic for dealer
function stay(){
    playerStay = true;
    if(dealerHandValue() < 17){
        dealerDraw();
    }
    else{
        dealerBust();
    }
}

//conditions for dealers hand
function dealerBust(){
    $('.faceDown').attr('src', hiddenCard);
    btnClean();
    if (dealerHandValue() > 21){
        winAnte();
        return $('.centerBoard').append($('<h2>').text("You Win!!!"));
    }
    else if (dealerHandValue() == playerHandValue() ){
        ChangeBalance(anteAmount);
        return $('.centerBoard').append($('<h2>').text("You Tie!!!"));
    }
    else if (dealerHandValue() > playerHandValue() ){
        return $('.centerBoard').append($('<h2>').text("You Lose!!!!"));
    }
    else{
        winAnte();
        return $('.centerBoard').append($('<h2>').text("You Win!!!!"));;    
    }
}