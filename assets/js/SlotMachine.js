//This controls what symbols will appear in the slot machine
//May replace these with proper images
const symobls = [' ','🍒','🍋','🍇','🔔','🃏','♠️','♥️','♦️','♣️','💰', '7️⃣'];

const windows = document.querySelectorAll('.window');

//Adds functionality to the "Spin" button.
//When the "Spin" butten is clicked, it will call the play funciton
document.querySelector('#button-spin').addEventListener('click', play);
//Adds functionality to the "Bet" button
//When the "Bet" button is clicked, it will call the bet function
document.querySelector('#button-bet').addEventListener('click', bet);

//NOTE: NEED TO WORK ON - Multiple guides have utilized a Spin button for spinning and a Reset button to allow for another spin
//Need to find a way to make the process automatic, as in, you only need to hit the spin button and then after some time (1-2 sec / When the animation finishes)
//the Slot machine will be ready for another spin

