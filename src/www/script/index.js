/**
 * Created by long.jiang on 2017/3/16.
 */
function bill() {
    if (isWeixin()) {
        window.location.href = constants.URLS.WEIXIBILL;
    } else {
        window.location.href = constants.URLS.BILL;
    }
}

$(document).ready(function () {
    setCookie(constants.COOKIES.TAG, "");
});