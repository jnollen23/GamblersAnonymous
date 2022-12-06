import {MDCTabBar} from '@material/tab-bar';

const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));

//This is the base version for MVP for currency with a login
//I am trying to keep everything related to Currency in the Currency JS so dont mess with
//the currency global variables, use the method GetBalance and SetUser
function UserLogin(){
    SetUser('user');
    var userBalance = GetBalance();
}
