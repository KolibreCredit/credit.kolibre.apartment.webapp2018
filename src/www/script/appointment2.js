var waitTimer = null;
var waitCount = 5;
//
function sendWaitTimer() {
    if (waitCount > 0) {
        $('#lbWaitCount').text(waitCount + 'S');
        waitCount = waitCount - 1;
    } else {
        clearInterval(waitTimer);
        appClose();
    }
}

function appClose() {
    var isWxMini = window.__wxjs_environment === 'miniprogram';
    if (isWxMini) {
        wx.miniProgram.navigateBack({
            delta: 2
        });
    } else {
        WeixinJSBridge.call('closeWindow');
    }
}

$(document).ready(function () {
    waitTimer = setInterval(function () {
        sendWaitTimer();
    }, 1000);
});



