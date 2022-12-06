function createDeck() {
    $.ajax({
        url: "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=" + $('.deckSize').val(),
        type: 'GET'
    })
    .then(function(response) {
        var deckId = $('.deckId');
        deckId.attr('value', response.deck_id);
        $('.createDeck').hide();
        $('.dealGame').show();
    });
}

function drawCard(hand) {
    $.ajax({
        url: "https://www.deckofcardsapi.com/api/deck/" + $('.deckId').val() + "/draw/?count=1",
        type: 'GET'
    })
    .then(function(response){
            $(hand).append($('<img>').attr('src', response.cards[0].image));
    });
}

function dealCards() {
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

    for(var i=0; i < 4; i++){
        if(i < 2) {
            playerDraw();
        }
        else {
            dealerDraw();
        }
    }
    $('#drawBtn').hide();
    $('#playerDrawBtn').show();
    $('#dealerDrawBtn').show();
}

function playerDraw() {
    drawCard('.playerHand');
}

function dealerDraw() {
    drawCard('.dealerHand');
}