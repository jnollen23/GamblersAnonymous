let playerPad = document.querySelector('#player-paddle')
let compPad = document.querySelector('#computer-paddle')
let ball = document.querySelector('ball')

playerPad.style.marginLeft = '30px'
playerPad.style.marginTop = '0px'
compPad.style.marginLeft = '1048px'
compPad.style.marginTop = '0px'
ball.style.marginLeft = '534px'
ball.style.marginTop = '262px'

let W_Pressed = false;
let S_Pressed = false;

let Vx = -1
let Vy = -1
let V = Math.sqrt(Math.sqrt(Math.pow(Vx,2)+Math.pow(Vy,2)))

document.addEventListener('keydown',(e) => {
    if (e.keycode=='87'){
        W_Pressed = true;
    }
    else if (e.keycode=='83'){
        S_Pressed = true;
    }
})

document.addEventListener('keyup',(e) => {
    if (e.keycode=='87'){
        W_Pressed = false;
    }
    else if (e.keycode=='83'){
        S_Pressed = false;
    }
})

gameLoop()

function gameLoop(){
    setTimeout(()=>{
        setInterval(()=>{
            if (marginTop(ball)<0){
                document.querySelector('#computer-score').innerHTML = Number(document.querySelector('#computer-score').innerHTML)+1
            }
            ball.style.marginLeft = `${marginLeft(ball)+Vx}px`
            ball.style.marginTop = `${marginTop(ball)+Vy}px`

            if(W_Pressed && marginTop(playerPad)>0){
                playerPad.style.marginTop =`${marginTop(playerPad)-2}px`
            }
            else if(S_Pressed && marginTop(playerPad)<472){
                playerPad.style.marginTop =`${marginTop(playerPad)+2}px`
            }
        },5)
    },500)
}

function marginTop(elem){
    return Number(elem.style.marginTop.split('p')[0])
}

function marginLeft(elem){
    return Number(elem.style.marginLeft.split('p')[0])
}