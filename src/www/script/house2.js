/**
 * Created by long.jiang on 2017/2/7.
 */

var waitTimer = null;
var waitCount = 5;
function sendWaitTimer() {
    if (waitCount > 0) {
        waitCount = waitCount - 1;
        $('#lbWaitCount').text(waitCount + 'S');
    } else {
        clearInterval(waitTimer);
        bill();
    }
}

function bill() {
    if (isWeixin()) {
        window.location.href = constants.URLS.WEIXIBILL;
    } else {
        window.location.href = constants.URLS.BILL;
    }
}

$(document).ready(function() {
    waitTimer = setInterval(function() {
        sendWaitTimer();
    }, 1000);
});

