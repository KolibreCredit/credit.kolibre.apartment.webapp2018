/**
 * Created by long.jiang on 2017/1/10.
 */
var contractConfirmInfoId = "";
var hasPaper = false;
//
$(document).ready(function () {
    hasPaper = (getURLQuery("hasPaper") == "1" ? true : false);
    contractConfirmInfoId = getCookie(constants.COOKIES.CONTRACTCONFIRMINFOID);
    postInvoke(constants.URLS.RENDERAGREEMENTHTMLTEMPLATE, {contractConfirmInfoId: contractConfirmInfoId}, function (res) {
        if (hasPaper) {
            $("#divAgreementDetail1").find(".mui-scroll").html(res.data[0].templateContent);
            $(".agreement").show();
        }
        $("#divAgreementDetail2").find(".mui-scroll").html(res.data[1].templateContent);
    });
});