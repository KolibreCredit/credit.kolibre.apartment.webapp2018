$(document).ready(function () {
    getInvoke(constants.URLS.GETCURRENTHOUSEACCOUNT, function (res) {
        if (res != null) {
            $('p.userName').html(res.accountName);
            $('#accountNo').html(res.accountNo);
            if (res.isExistAccountInfo) {
                $("#needPhoto").show();
            } else {
                $("#needVerify").show();
            }
            $('#star').raty({
                score: parseFloat(res.creditLevel) / 2,
                path: 'images/star',
                readOnly: true,
                size: 15
            });
        }
    });
});

function loginOut() {
    clearToken();
    if (getCookie(constants.COOKIES.TAG) == 'yuju') {
        window.location.href = 'yuju.html';
    } else {
        window.location.href = 'index.html';
    }
}