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

function uesr() {
    window.location.href = "user.html";
}

function list() {
    window.location.href = "list.html";
}