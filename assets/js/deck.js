var playerGameHand = [];
var dealerGameHand = [];
var playerStay = false;
var bustbool = false;
var count = 0;
var hiddenCard = '';
var anteAmount = 0;

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
    $.ajax({
        url: "https://www.deckofcardsapi.com/api/deck/" + $('.deckId').val() + "/draw/?count=1",
        type: 'GET'
    })
    .then(function(response){
            if(game == 'blackjack' && hand == '.dealerHand' && count == 1){
                hiddenCard = response.cards[0].image;              
                $(hand).append($('<img class="cardStyle">').attr('src', './assets/cardback.png').addClass('faceDown'));
            }
            else{
                $(hand).append($('<img class="cardStyle">').attr('src', response.cards[0].image));
            }
            var cardValue = 0;
            cardValue = valueConvert(response.cards[0].value);
             if(hand ==='.playerHand'){
                playerGameHand.push(cardValue);
             }
            else{
                dealerGameHand.push(cardValue);
            }
    count++;
    //***************************only used in blackjack game***********************************//
    //checks for blackjack
    if(count > 4){
        $('#doubleBtn').removeClass('d-none');
    }
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
    $('.playerHand').append($('<h2 class="headerText">').text("Player Hand"));
    $('.dealerHand').append($('<h2 class="headerText">').text("Dealer Hand"));

    $.ajax({
        url: "https://www.deckofcardsapi.com/api/deck/" + $('.deckId').val() + "/draw/?count=4",
        type: 'GET'
    })
    .then(function(response){
        response.cards[0].forEach((i, cards) => {
            if(i < 2) {
                $('.playerHand').append($('<img class="cardStyle">').attr('src', cards.image));
            }
            else {
                if(playerStay===true){
                    setInterval($('.dealerHand').append($('<img class="cardStyle">').attr('src', cards.image)), 5000);
                }
                else{
                    $('.dealerHand').append($('<img class="cardStyle">').attr('src', cards.image));
                }
            }
        })
    });

    for(var i=0; i < 2; i++){
            playerDraw();
            dealerDraw();
    }
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
        ChangeBalance(4*anteAmount);
        //playerModal();
        $('.centerBoard').append($('<h2 class="headerText">').text("You Got Blackjack!!!"));
    }
    else if(dealerHandValue() == 21){
        btnClean();
        $('.faceDown').attr('src', hiddenCard);
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
    }
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
    }
    return sum;
}

//hides buttons and reveals the reset button
function btnClean(){
    $('#playerDrawBtn').addClass('d-none');
    $('#stayBtn').addClass('d-none');
    $('#doubleBtn').addClass('d-none');
    $('#reset').removeClass('d-none');
    console.log(GetBalance());
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
    playerStay = false;
    count = 0;
    bustBool = false;
    hiddenCard = "";
}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<BLACKJACK GAME CODE END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>