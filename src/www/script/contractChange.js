var url = "";
function retlogin() {
    setTimeout(function () {
        if (url != '') {
            if (url.indexOf("user.html") > -1) {
                window.location.href = "user.html";
            } else {
                window.location.href = decodeURIComponent(url);
            }
        } else {
            window.location.href = "index.html";
        }
    }, 1000);
}

function confirmContractChange() {
    postInvoke(constants.URLS.CONFIRMCONTRACTCHANGE, null, function (res) {
        console.log(res);
        retlogin();

    }, function (err) {
        console.log(err);
        retlogin();
    });
}

$(document).ready(function () {
    url = getURLQuery("url");
});