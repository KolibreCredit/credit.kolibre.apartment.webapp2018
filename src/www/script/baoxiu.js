/**
 * Created by long.jiang on 2016/12/14.
 */
var contractId = "";
var currentTabIndex = -1;
var currentRowIndex = -1;
var repairTypes = [["Qiangmian", "Diban", "Chuanghu", "Tianhuaban"]
    , ["Xiyiji", "Kongtiao", "Bingxiang", "Dianshiji", "Weibolu", "Ranqilu", "Chuang", "Yigui", "Canzhuo", "Luyouqi", "Youyanji"]
    , ["PutongMensuo", "DianziMensuo", "FangdaoMensuo"]
    , ["Deng", "Chazuo", "Xianlu", "Weiyudeng", "Dianzha", "Dianbiao"]
    , ["Shuilongtou", "Matong", "Caichi", "Linyu", "Dilou", "Famen", "Shutong"]];

function tabItem(tabIndex) {
    if (currentTabIndex != tabIndex) {
        currentTabIndex = tabIndex;
        $(".baoxiu .item").removeClass("active").eq(tabIndex).addClass("active");
        selectItem(-1);
    }
}

function selectItem(rowIndex) {
    currentRowIndex = rowIndex;
    $(".baoxiuList").hide()
    $(".baoxiuList").eq(currentTabIndex).show().find(".item").each(function (index) {
        if (rowIndex == index) {
            $(this).addClass("active").find("img").eq(0).hide();
            $(this).find("img").eq(1).show();
        } else {
            $(this).removeClass("active").find("img").eq(0).show();
            $(this).find("img").eq(1).hide();
        }
    });
}

function selectRepairType() {
    if (currentRowIndex == -1) {
        mui.toast(constants.msgInfo.repairType);
        return false;
    }
    var currentRepairType = repairTypes[currentTabIndex][currentRowIndex];
    window.location.href = "baoxiu2.html?contractId={0}&repairType={1}".format(contractId, currentRepairType);
}

$(document).ready(function () {
    tabItem(0);
    contractId = getURLQuery("contractId");
});
