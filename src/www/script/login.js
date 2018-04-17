/**
 * Created by long.jiang on 2016/12/12.
 */
var url = "";
function loginByCaptcha() {
    var cellphone = $("#txtPhone").val().trimPhone();
    if (cellphone == '') {
        mui.toast(constants.msgInfo.phone);
        return false;
    }
    if (!constants.REGEX.CELLPHONE.test(cellphone)) {
        mui.toast(constants.msgInfo.phoneerr);
        return false;
    }
    window.location.href = "login2.html?cellphone={0}&url={1}".format(cellphone, url);
}

function loginByPassword() {
    window.location.href = "login3.html?url={0}".format(url);
}
$(document).ready(function () {
    url = getURLQuery("url");
});