var currentApartment = {
    productno: "221010410",
    source: "上海寓居青年之家"
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
    window.location.href = "house1yuju.html?productno={0}&source={1}".format(currentApartment.productno, encodeURI(currentApartment.source));
}