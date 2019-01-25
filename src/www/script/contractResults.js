var contractId = "";
var waitTimer = null;
var waitCount = 60;
//
function sendWaitTimer() {
    if (waitCount > 0) {
        waitCount = waitCount - 1;
        $('#lbWaitCount').text(waitCount + '秒');
    } else {
        clearInterval(waitTimer);
        var isWxMini = window.__wxjs_environment === 'miniprogram';
        if (isWxMini) {
            wx.miniProgram.reLaunch({url: '/pages/bill/bill'});
        } else {
            bill();
        }
    }
}

function promptly(){
    var isWxMini = window.__wxjs_environment === 'miniprogram';
    if (isWxMini) {
        wx.miniProgram.reLaunch({url: '/pages/bill/bill'});
    } else {
       bill();
    }
}

function index() {
    var isWxMini = window.__wxjs_environment === 'miniprogram';
    if (isWxMini) {
        wx.miniProgram.reLaunch({
            url: '/pages/index/index'
        });
    } else {
        window.location.href = "index.html";
    }
}

function staged() {
    window.location.replace("recognitionface.html?contractId={0}".format(contractId));
}

$(document).ready(function () {
    contractId = getURLQuery("contractId");
    waitTimer = setInterval(function () {
        sendWaitTimer();
    }, 1000);
});