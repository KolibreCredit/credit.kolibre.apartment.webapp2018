var url = getURLQuery("url");
$(document).ready(function () {
    url = getURLQuery("url");
    waitTimer = setInterval(function () {
        sendWaitTimer();
    }, 1000);
});

function list() {
    window.location.href = "list.html";
}

function home() {
    window.location.href = "index.html";
}

var waitTimer = null;
var waitCount = 5;

//
function sendWaitTimer() {
    if (waitCount > 0) {
        waitCount = waitCount - 1;
        $('#lbWaitCount').text(waitCount + '秒');
    } else {
        clearInterval(waitTimer);
        if (url != "") {
            window.location.href = decodeURIComponent(url);
        } else {
            window.location.href = "index.html";
        }
    }
}