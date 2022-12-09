var date = new Date();
//Call randomNumber() to get a random value between 0 and 1. Multiply this number by the range of values you want.
//number between 100 and 150 is:
//randomNumber()*50 + 100
var randomNumber = sfc32(Math.pow(date.getSeconds(), 4), Math.pow(date.getMilliseconds(),4), Math.pow(date.getFullYear(), 4), Math.pow(date.getUTCHours(),4));



/* 
    sfc32 is a random number generator created by Chris Doty-Humphrey and is in public domain
    returns a number between 0 and 1
*/
function sfc32(a, b, c, d) {
    return function () {
        a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
        var t = (a + b) | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        d = d + 1 | 0;
        t = t + d | 0;
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    }
}