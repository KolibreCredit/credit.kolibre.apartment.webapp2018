/**
 * Created by long.jiang on 2017/1/10.
 */
var tenancyId = "";
var tabIndex = 0;
//
function choose(index) {
    if (tabIndex != index) {
        tabIndex = index;
        $(".item").removeClass("active").eq(tabIndex).addClass("active");
    }
}

function view() {
    if (tenancyId == "") {
        mui.toast("请选择公寓");
        return false;
    }
    getInvoke(constants.URLS.GETSHORTLINKADDRESSBYTENANCYID.format(tenancyId), function (res) {
        if (res.succeeded) {
            if (res.data != null && res.data.shortLinkAddress != "") {
                setTimeout(function () {
                    if (tabIndex == 0) {
                        window.location.href = res.data.shortLinkAddress;
                    } else {
                        if (res.data.qrCodeModelType == "Manual") {
                            window.location.href = "qcode.html?qrCodeModelType=Manual&qrCode={0}".format(res.data.qrCode);
                        } else {
                            window.location.href = "qcode.html?qrCodeModelType=Default&qrCode={0}&bigBackground={1}&bigLogo={2}&title={3}".format(res.data.qrCode, res.data.bigBackground, res.data.bigLogo, res.data.title);
                        }
                    }
                }, 1000);
            } else {
                mui.toast("公寓信息未配置!");
            }
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

function config() {
    if (tenancyId == "") {
        mui.toast("请选择公寓");
        return false;
    }
    setTimeout(function () {
        if (tabIndex == 0) {
            window.location.href = "config1.html?tenancyId={0}&title={1}".format(tenancyId,title);
        } else {
            window.location.href = "config2.html?tenancyId={0}".format(tenancyId);
        }
    }, 1000);
}

$(document).ready(function () {
    $("#txtRelation").val("");
    var allTenancies = [], itemTenancies = null;
    var tplTenancies = "<li class='mui-table-view-cell'><a data-key='{0}'>{1}</a></li>"
    getInvoke(constants.URLS.GETALLTENANCIES, function (res) {
        if (res.succeeded) {
            for (var i = 0; i < res.data.length; i++) {
                itemTenancies = res.data[i];
                allTenancies.push(tplTenancies.format(itemTenancies.tenancyId, itemTenancies.tenancyName));
            }
            $("#divRelation").find("ul").html(allTenancies.join(""));
        }
    });
});