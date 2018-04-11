var waitTimer = null;
var waitCount = 5;
//
function sendWaitTimer() {
    if (waitCount > 0) {
        waitCount = waitCount - 1;
        $('#lbWaitCount').text(waitCount + '秒');
    } else {
        clearInterval(waitTimer);
        bill();
    }
}

$(document).ready(function () {
    var succeeded = getURLQuery("succeeded");
    if (succeeded == "1") {
        $(".success").show();
    } else {
        $(".fail").show();
    }
    waitTimer = setInterval(function () {
        sendWaitTimer();
    }, 1000);
});