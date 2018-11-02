/**
 * Created by long.jiang on 2017/1/10.
 */
var contractConfirmInfoId = "";
var hasPaper = false;
//
$(document).ready(function () {
    hasPaper = (getURLQuery("hasPaper") == "1" ? true : false);
    if (hasPaper) {
        $(".agreement").show();
    }
    contractConfirmInfoId = getCookie(constants.COOKIES.CONTRACTCONFIRMINFOID);
    postInvoke(constants.URLS.RENDERAGREEMENTHTMLTEMPLATE, {contractConfirmInfoId: contractConfirmInfoId}, function (res) {
        if (hasPaper) {
            $("#divAgreementDetail1").find(".mui-scroll").html(res.data[0].templateContent);
        }
        $("#divAgreementDetail2").find(".mui-scroll").html(res.data[1].templateContent);
    });
});