/**
 * Created by long.jiang on 2016/12/14.
 */
var contractId = "";
var currentTabIndex = -1;
var currentRowIndex = -1;
var currentConfig = null;
var repairTypes = [["Qiangmian", "Diban", "Chuanghu", "Tianhuaban"]
    , ["Xiyiji", "Kongtiao", "Bingxiang", "Dianshiji", "Weibolu", "Ranqilu", "Chuang", "Yigui", "Canzhuo", "Luyouqi", "Youyanji"]
    , ["PutongMensuo", "DianziMensuo", "FangdaoMensuo"]
    , ["Deng", "Chazuo", "Xianlu", "Weiyudeng", "Dianzha", "Dianbiao"]
    , ["Shuilongtou", "Matong", "Caichi", "Linyu", "Dilou", "Famen", "Shutong"]];

function tabItem(tabIndex) {
    if (currentTabIndex != tabIndex) {
        currentTabIndex = tabIndex;
        $(".baoxiu .item").removeClass("active").eq(tabIndex).addClass("active");
        selectItem(0);
    }
}

function selectItem(rowIndex) {
    currentRowIndex = rowIndex;
    $(".baoxiuList").hide()
    $(".baoxiuList").eq(currentTabIndex).show().find(".item").each(function (index) {
        if (rowIndex == index) {
            $(this).addClass("active").find("img").eq(0).hide();
            $(this).find("img").eq(1).show();
            currentConfig = filterResConfig(repairTypes[currentTabIndex][rowIndex]);
            if (currentConfig != null) {
                if (currentConfig.isCollectFees) {
                    $("#imgQuestion").show();
                } else {
                    $("#imgQuestion").hide();
                }
                $("#txtCollectFees").val($(this).find(".sortation").text());
                $("#divCollectFees").show();
            } else {
                $("#divCollectFees").hide();
            }
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

function filterResConfig(item) {
    if (domesticConfig.length > 0) {
        for (var i = 0; i < domesticConfig.length; i++) {
            if (item == domesticConfig[i].configType) {
                return domesticConfig[i];
            }
        }
    }
    return null;
}

var initRepairConfig = function () {
    var item = null;
    var itemRepairTypes = null;
    var unitPrice = "";
    var configs = null;
    for (var i = 0; i < repairTypes.length; i++) {
        itemRepairTypes = repairTypes[i];
        configs = $(".baoxiuList").eq(i).find(".sortation");
        for (var j = 0; j < itemRepairTypes.length; j++) {
            item = filterResConfig(itemRepairTypes[j]);
            if (item != null) {
                if (item.isCollectFees) {
                    unitPrice = (item.unitPrice * 0.01).toFixed(0);
                    configs.eq(j).text(item.chargingMode == "TimeFree" ? unitPrice + "元/小时" : unitPrice + "元/次").show();
                } else {
                    configs.eq(j).text("免费").show();
                }
            } else {
                configs.eq(j).hide();
            }
        }
    }
};
var domesticConfig = [];

function getTenantDomesticConfigRepair() {
    getInvoke(constants.URLS.GETTENANTDOMESTICCONFIGREPAIRBYCONTRACTID.format(contractId), function (res) {
        domesticConfig = res.data;
        initRepairConfig();
        tabItem(0);
    }, function () {
        domesticConfig = [];
        initRepairConfig();
        tabItem(0);
    });
}

$(document).ready(function () {
    contractId = getURLQuery("contractId");
    getTenantDomesticConfigRepair();
    $('#imgQuestion').click(function () {
        var self = this;
        $.pt({
            target: self,
            position: "b",
            align: "l",
            width: "100%",
            autoClose: true,
            time: 2000,
            content: '服务人员完成服务后根据服务费用和工时生成服务账单，支持在线支付。'
        });
        $(".pt").css({"left": "20px", "right": "20px"});
        $(".out").css({"left": "67px"});
        $(".in").css({"left": "67px"});
    });
});
