var currentApartment = {
    productno: "221010510",
    source: "上海松江区铂客公寓"
};
var selectText = "";
//
$(document).ready(function () {
    mui('.list').on('tap', 'a', function () {
        currentApartment.productno = this.getAttribute("productno");
        currentApartment.source = this.text;
    });
    mui('.list').on('tap', 'span', function () {
        $(".list span").removeClass("active");
        $(this).addClass("active");
        selectText = $(this).text();
    });
    mui('.list').on('tap', '.mui-table-view-cell', function () {
        selectItem($(this).attr("data-key"));
    });

    getInvoke(constants.URLS.GETCURRENTHOUSEACCOUNT, function (res) {
        if (!res.isExistAccountInfo) {
            mui.alert(constants.msgInfo.verifyerr, '蜂鸟屋', function () {
                window.location.href = "verify.html?url=house.html";
            });
        }
    });
});

function selectItem(itemIndex) {
    if (itemIndex == "0") {
        $(".item1").toggle();
        $(".item2").hide();
        $("#img1").attr("src", "images/more2.png");
        $("#img2").attr("src", "images/more1.png");
    }
    else {
        $(".item1").hide();
        $(".item2").toggle();
        $("#img1").attr("src", "images/more1.png");
        $("#img2").attr("src", "images/more1.png");
    }
}

function houseInformation() {
    if (selectText == "") {
        mui.toast(constants.msgInfo.source1);
        return false;
    }
    window.location.href = "house1yuju.html?productno={0}&source={1}".format(currentApartment.productno, encodeURI(currentApartment.source + selectText));
}