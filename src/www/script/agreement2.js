/**
 * Created by long.jiang on 2017/1/10.
 */
var index = "";
var contractConfirmInfoId = "";
//
$(document).ready(function () {
    index = getURLQuery("index");
    if (index == "0") {
        $(".step0").show();
    }
    else if (index == "1") {
        $(".step1").show();
    }
    else if (index == "2") {
        contractConfirmInfoId = getCookie(constants.COOKIES.CONTRACTCONFIRMINFOID);
        var query = {
            contractConfirmInfoId: contractConfirmInfoId
        };
        postInvoke(constants.URLS.RENDERAGREEMENTHTMLTEMPLATE, query, function (res) {
            $(".step2").html(res.data[0].templateContent).show();
        });
    }
    else if (index == "3") {
        contractConfirmInfoId = getCookie(constants.COOKIES.CONTRACTCONFIRMINFOID);
        var query = {
            contractConfirmInfoId: contractConfirmInfoId
        };
        postInvoke(constants.URLS.RENDERAGREEMENTHTMLTEMPLATE, query, function (res) {
            $(".step3").html(res.data[1].templateContent).show();
        });
    } else {
        $(".step4").show();
    }
});