/**
 * Created by long.jiang on 2016/12/14.
 */
var evaluations = [{
    score: 0,
    tip: "您的评价会帮助我们做的更好",
    tag: []
}, {
    score: 1,
    tip: "非常不满意，各方面都很差",
    tag: ["态度不友好", "未按时上门服务", "服务拖延时间", "收取现金", "上门前未电话联系", "技术不娴熟"]
}, {
    score: 2,
    tip: "不满意，比较差",
    tag: ["态度不友好", "未按时上门服务", "服务拖延时间", "收取现金", "上门前未电话联系", "技术不娴熟"]
}, {
    score: 3,
    tip: "一般，需要改进",
    tag: ["态度不友好", "未按时上门服务", "服务拖延时间", "收取现金", "上门前未电话联系", "技术不娴熟"]
}, {
    score: 4,
    tip: "比较满意，仍可改进",
    tag: ["服务态度好", "准时上门服务", "上门前电话联系", "技术娴熟"]
}, {
    score: 5,
    tip: "非常满意，各方面都很好",
    tag: ["服务态度好", "准时上门服务", "上门前电话联系", "技术娴熟"]
}];

var repairId = "";
var pictureUrls = [];
var tplPicture = "<li><div style=\"width:120px\"><img src=\"{0}\" style=\"width:100%;height:80px;border-radius:4px\"/></div></li>";
var tplTag = "<div onclick=\"selectTag(this)\">{0}</div>";
var infoTag = "<div>{0}</div>";
var orderId = "";

//
function cancelRepair() {
    $(".msg-post").show();
    var data = {id: repairId};
    postInvoke(constants.URLS.CANCELREPAIR, data, function (res) {
        $(".msg-post").hide();
        if (res.succeeded) {
            mui.toast(constants.msgInfo.cancelCleaning);
            setTimeout(function () {
                window.location.replace("fuwu.html?tabIndex=1");
            }, 1000);
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        $(".msg-post").hide();
        mui.toast(err.message);
    });
}

function hideEvaluations() {
    $("#divEvaluations").hide();
}

function showEvaluations() {
    $("#divEvaluations").show();
}

function payOrder() {
    window.location.href = "billView.html?orderId={0}&goto=bill".format(orderId);
}

function tagList(score) {
    selectItemTags = [];
    selectScore = score;
    var item = null;
    var tags = [];
    for (var i = 0; i < evaluations.length; i++) {
        item = evaluations[i];
        if (item.score == score) {
            selectTip = item.tip;
            tags = item.tag;
            break;
        }
    }
    var itemsTag = [];
    for (var i = 0; i < tags.length; i++) {
        itemsTag.push(tplTag.format(tags[i]));
    }
    $("#divTip").html(selectTip);
    $("#divTag").html(itemsTag.join(""));
}

function uniq(item) {
    for (var i = 0; i < selectItemTags.length; i++) {
        if (item == selectItemTags[i]) {
            return true;
        }
    }
    return false;
}

function selectTag(curTag) {
    var tag = $(curTag).html();
    if (!uniq(tag)) {
        $(curTag).addClass("active");
        selectItemTags.push(tag);
    } else {
        var index = selectItemTags.indexOf(tag);
        if (index > -1) {
            $(curTag).removeClass("active");
            selectItemTags.splice(index, 1);
        }
    }
}

var isEvaluations = true;
var selectScore = 0;
var selectTip = "";
var selectItemTags = [];

function updateCleaningEvaluations() {
    if (!isEvaluations) {
        return false;
    }
    if (selectScore == 0) {
        mui.toast("请评价本次服务");
        return false;
    }
    isEvaluations = false;
    var data = {
        serviceId: repairId,
        level: selectScore,
        levelDescription: selectTip,
        lable: selectItemTags.join(","),
        description: $("#txtDescription").val()
    };
    postInvoke(constants.URLS.UPDATEREPAIREVALUATIONS, data, function (res) {
        isEvaluations = true;
        if (res.succeeded) {
            $(".msg-alert").show();

        } else {
            mui.toast(res.message);
        }
    }, function (res) {
        isEvaluations = true;
        mui.toast(res.message);
    });
}

function hideAlert() {
    window.location.replace(window.location.href);
}

$(document).ready(function () {
    $('#star').raty({
        score: 0,
        path: 'images/star4',
        size: 20,
        click: function (score) {
            tagList(score);
        }
    }).css({"width": "auto"});

    //
    repairId = getURLQuery("repairId");
    getInvoke(constants.URLS.GETTENANTREPAIR.format(repairId), function (res) {
        if (res.succeeded && res.data != null) {
            var tplView = $("#tplView").html();
            var item = res.data;
            pictureUrls = item.pictures.split(",");
            var itemPictures = [];
            for (var i = 0; i < pictureUrls.length; i++) {
                itemPictures.push(tplPicture.format(pictureUrls[i]));
            }
            var htmlLeaseInfo = tplView.format(item.repairState
                , getCleaningState(item.repairState)
                , item.apartmentName
                , item.floor
                , item.roomNumber
                , item.createTime.substring(0, 16)
                , item.repairStartTime.substring(0, 16)
                , item.repairEndTime.substring(11, 16)
                , getRepairType(item.repairType)
                , item.performer
                , item.performerCellphone
                , item.updateTime.substring(0, 16)
                , item.description
                , itemPictures.join(""));
            $("#divLeaseInfo").html(htmlLeaseInfo);
            setTimeout(function () {
                if (item.repairState == "Processed" || item.repairState == "Suspended") {
                    $(".performer").show();
                    $(".performerCellphone").show();
                }
                $("#scroller").css("width", "{0}px".format((pictureUrls.length + 1) * 130 + 40));
                new IScroll('#wrapper', {
                    preventDefault: false,
                    scrollX: true,
                    scrollY: false,
                    mouseWheel: false
                });
            }, 100);
            // 费用信息
            if (item.configContents != null) {
                if (item.configContents.isCollectFees) {
                    var unitPrice = (item.configContents.unitPrice * 0.01).toFixed(0);
                    $("#lbCollectFees").text(item.configContents.chargingMode == "TimeFree" ? unitPrice + "元/小时" : unitPrice + "元/次");
                    if (item.repairState == "Canceled") {
                        $("#lbOrderAmount").css({"color": "#F55452"}).text("已取消申请服务，未生成服务账单");
                    }
                    else if (item.repairState == "Succeed") {
                        $("#lbOrderAmount").text((item.orderAmount * 0.01).toFixed(0) + "元");
                    }
                    else {
                        $("#lbOrderAmount").css({"color": "#FD8B14"}).text("服务完成后生成服务账单");
                    }
                    $("#imgQuestion").show();
                } else {
                    $("#lbCollectFees").text("免费");
                    $("#lbOrderAmount").text("不生成账单");
                }
                $(".service").show();
            }
            if (item.repairState == "Succeed") {
                // 处理进度
                if (item.processDescription != null) {
                    $(".processDescription").show().find("span").text(item.processDescription);
                }
                if (item.configContents != null && item.configContents.chargingMode == "TimeFree") {
                    $(".useTime").show().find("span").text((item.useTime * 0.01).toFixed(2) + "小时");
                }
                if (item.processDescriptionPictures != null) {
                    var processDescriptionPictures = item.processDescriptionPictures.split(",");
                    var itemProcessPictures = [];
                    for (var i = 0; i < processDescriptionPictures.length; i++) {
                        itemProcessPictures.push(tplPicture.format(processDescriptionPictures[i]));
                    }
                    $("#scroller1 ul").html(itemProcessPictures.join(""));
                    setTimeout(function () {
                        $("#scroller1").css("width", "{0}px".format((itemProcessPictures.length + 1) * 130 + 40));
                        new IScroll('#wrapper1', {
                            preventDefault: false,
                            scrollX: true,
                            scrollY: false,
                            mouseWheel: false
                        });
                    }, 100);
                } else {
                    $("#lbProcessDescriptionPictures").html("无");
                }
                $(".process").show();
                // 评价
                var count = 0;
                if (item.evaluations != null) {
                    $('#divStar').raty({
                        score: item.evaluations.level,
                        path: 'images/star4',
                        readOnly: true,
                        size: 20
                    }).css({"width": "auto"});
                    var infoTags = [];
                    var evaluationsTags = item.evaluations.lable.split(",");
                    for (var i = 0; i < evaluationsTags.length; i++) {
                        infoTags.push(infoTag.format(evaluationsTags[i]));
                    }
                    $("#divTipInfo").html(item.evaluations.levelDescription);
                    $("#divTagInfo").html(infoTags.join(""));
                    $("#divTagDescription").html(item.evaluations.description);
                    $(".evaluations").show();
                } else {
                    count = 1;
                    $(".evaluationsTip").show();
                    $(".btnEvaluations").show();
                }
                //
                if (item.canPay) {
                    orderId = item.orderId;
                    count = count + 1;
                    $(".serviceTip").show();
                    $(".btnPay").show();
                }
                if (count == 2) {
                    $(".btnEvaluations").addClass("evaluationsLeft");
                    $(".btnPay").addClass("payRight");
                }
            } else {
                if (item.repairState != "Canceled") {
                    $(".btnNext").show();
                }
            }
        }
    }, function (err) {
        mui.toast(err.message);
    });
    $('#imgQuestion').click(function () {
        var self = this;
        $.pt({
            target: self,
            position: "t",
            align: "r",
            width: "100%",
            autoClose: true,
            time: 2000,
            content: '服务人员完成服务后根据服务费用和工时生成服务账单，支持在线支付。'
        });
        var left = $(this).offset().left;
        $(".pt").css({"left": "20px", "right": "10px"});
        $(".out").css({"left": (left - 18) + "px"});
        $(".in").css({"left": (left - 18) + "px"});
    });
});