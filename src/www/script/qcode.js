/**
 * Created by long.jiang on 2017/3/16.
 */

$(document).ready(function () {
    var qrCodeModelType = getURLQuery("qrCodeModelType");
    var qrCode = getURLQuery("qrCode") || "images/qc.png";
    if (qrCodeModelType == "Default") {
        var bigBackground = getURLQuery("bigBackground") || "images/20180103/bg1.jpg";
        var bigLogo = getURLQuery("bigLogo") || "images/20180103/logo.png";
        var title = getURLQuery("title") || "蜂鸟屋";
        $("body").css("background-image", "url(" + bigBackground + ")");
        $("#bigLogo").attr("src", bigLogo);
        $("#qcode").attr("src", qrCode);
        $("#lbTitle").html(title);
        $(".mui-content").show();
    } else {
        $("#imgQcode").attr("src", qrCode).show();
    }
});
