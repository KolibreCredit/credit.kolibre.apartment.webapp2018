$(document).ready(function () {
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.succeeded) {
            if (res.data.hasInfo) {
                $("#needPhoto").show();
            } else {
                $("#needVerify").show();
            }
        }
    });
});

function loginOut() {
    clearToken();
    window.location.href = 'index.html';
}