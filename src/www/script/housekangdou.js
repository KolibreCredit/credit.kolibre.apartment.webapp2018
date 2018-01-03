var currentApartment = {
    productno: "221010210",
    source: "上海闵行康豆公寓（澄江店）"
};
//
$(document).ready(function () {
    mui('.list').on('tap', 'a', function () {
        currentApartment.productno = this.getAttribute("productno");
        currentApartment.source = this.text;
    });
    getInvoke(constants.URLS.GETCURRENTHOUSEACCOUNT, function (res) {
        if (!res.isExistAccountInfo) {
            mui.alert(constants.msgInfo.verifyerr, '蜂鸟屋', function () {
                window.location.href = "verify.html?url=house.html";
            });
        }
    });
});

function houseInformation() {
    window.location.href = "house1kangdou.html?productno={0}&source={1}".format(currentApartment.productno, encodeURI(currentApartment.source));
}