//This controls what symbols will appear in the slot machine
//May replace these with proper images
const symbols = [' ','🍒','🍋','🍇','🔔','🃏','♠️','♥️','♦️','♣️','💰', '7️⃣'];


//Used for controlling the lanes
const lanes = document.querySelectorAll(".lane");

//Adds functionality to the "Spin" button.
//When the "Spin" butten is clicked, it will call the play funciton
document.querySelector('#button-spin').addEventListener('click', reset);
document.querySelector('#button-spin').addEventListener('click', play);
//Adds functionality to the "Bet" button
//When the "Bet" button is clicked, it will call the bet function
document.querySelector('#button-bet').addEventListener('click', bet);

//Can now keep spinning slots without needs to reset
//Done in a really jank way, tied "reset" and "play" functions to one button, not preferrable, but it works

//Wanted to make it so the reels would not reset when spin button is clicked
//but I think with the way I have it all coded, it can't happen, or at least I can't make it work for some reason
  
async function play() {
    reset(false, 2, 2);
    for (const lane of lanes) {
      const windows = lane.querySelector(".windows");
      const duration = parseInt(windows.style.transitionDuration);
      windows.style.transform = "translateY(0)";
      //controls the time between each reel moving
      //EX: Longer values will increase time needed to pass before the second reel begins to move
      await new Promise((resolve) => setTimeout(resolve, duration * 150));
    }
  }

  //Function will 
  function reset(firststart = true, groups = 2, duration = 1) {
    for (const lane of lanes) {
      if (firststart) {
        lane.dataset.spinned = "0";
      } else if (lane.dataset.spinned === "1") {
        return;
      }

      const windows = lane.querySelector(".windows");
      const windowsClone = windows.cloneNode(false);
      // experimenting with how the reel symbols work on "spin click"
      // var pool = ["💎"];
      // //Default symbol on start
      // if (!firststart) {
      //     pool = ["💰"];
      // }

      const pool = ["💎"];

      if (!firststart) {
        const arr = [];
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          arr.push(...symbols);
        }
        pool.push(...shuffle(arr));
        //Controls the blurring effect for when the reels begin to spin
        //increasing "blur px" will cause the symbols to be more blurry
        //when the transition begins, a local function will be called to add the blur effect
        windowsClone.addEventListener(
          "transitionstart",
          function () {
            lane.dataset.spinned = "1";
            this.querySelectorAll(".window").forEach((window) => {
              window.style.filter = "blur(1px)";
            });
          },
        );

        //Controls the blurring effect for when the reels finish spinning  
        //local fucntion is called at the end of the transition to remove blur effect
        windowsClone.addEventListener(
          "transitionend",
          function () {
            this.querySelectorAll(".window").forEach((window, index) => {
              window.style.filter = "blur(0)";
              if (index > 0) this.removeChild(window);
            });
          },  
        );
      }
      

      for (let i = pool.length - 1; i >= 0; i--) {
        const window = document.createElement("div");
        window.classList.add("window");
        window.style.width = lane.clientWidth + "px";
        window.style.height = lane.clientHeight + "px";
        window.textContent = pool[i];
        windowsClone.appendChild(window);
      }
      windowsClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      windowsClone.style.transform = `translateY(-${
        lane.clientHeight * (pool.length - 1)
      }px)`;
      lane.replaceChild(windowsClone, windows);
      
    }
  }

  function bet () {
    //If there is time, betting functionality will be added
    //for now, game is set up as a preview only
  }

  //Function allows for random selection of symbols
  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

//reset() function called on startup
  reset();