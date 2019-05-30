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
    tag: ["态度不友好", "未及时处理", "处理不专业"]
}, {
    score: 2,
    tip: "不满意，比较差",
    tag: ["态度不友好", "未及时处理", "处理不专业"]
}, {
    score: 3,
    tip: "一般，需要改进",
    tag: ["态度不友好", "未及时处理", "处理不专业"]
}, {
    score: 4,
    tip: "比较满意，仍可改进",
    tag: ["服务态度好", "及时处理", "会电话沟通解决", "处理专业"]
}, {
    score: 5,
    tip: "非常满意，各方面都很好",
    tag: ["服务态度好", "及时处理", "会电话沟通解决", "处理专业"]
}];

var tplTag = "<div onclick=\"selectTag(this)\">{0}</div>";
var infoTag = "<div>{0}</div>";
//
var complaintSuggestionId = "";
var pictureUrls = [];
var tplPicture = "<li><div style=\"width:120px\"><img src=\"{0}\" style=\"width:100%;height:80px;border-radius:4px\"/></div></li>";

//
function cancelComplaintSuggestion() {
    $(".msg-post").show();
    var data = {id: complaintSuggestionId};
    postInvoke(constants.URLS.CANCELCOMPLAINTSUGGESTION, data, function (res) {
        $(".msg-post").hide();
        if (res.succeeded) {
            mui.toast(constants.msgInfo.cancelCleaning);
            setTimeout(function () {
                window.location.replace("fuwu.html?tabIndex=2");
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

function hideAlert() {
    window.location.replace(window.location.href);
}

var isEvaluations = true;

function updateComplainSuggestionEvaluations() {
    if (!isEvaluations) {
        return false;
    }
    if (selectScore == 0) {
        mui.toast("请评价本次服务");
        return false;
    }
    isEvaluations = false;
    var data = {
        serviceId: complaintSuggestionId,
        level: selectScore,
        levelDescription: selectTip,
        lable: selectItemTags.join(","),
        description: $("#txtDescription").val()
    };
    postInvoke(constants.URLS.UPDATECOMPLAINSUGGESTIONEVALUATIONS, data, function (res) {
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

$(document).ready(function () {
    $('#star').raty({
        score: 0,
        path: 'images/star5',
        size: 20,
        click: function (score) {
            tagList(score);
        }
    }).css({"width": "auto"});
    complaintSuggestionId = getURLQuery("complaintSuggestionId");
    getInvoke(constants.URLS.GETTENANTCOMPLAINTSUGGESTION.format(complaintSuggestionId), function (res) {
        if (res.succeeded && res.data != null) {
            var item = res.data;
            pictureUrls = item.pictures.split(",");
            var itemPictures = [];
            for (var i = 0; i < pictureUrls.length; i++) {
                itemPictures.push(tplPicture.format(pictureUrls[i]));
            }
            var tplView = $("#tplView").html();
            var htmlLeaseInfo = tplView.format(item.complaintSuggestionState
                , getCleaningState(item.complaintSuggestionState)
                , item.apartmentName
                , item.floor
                , item.roomNumber
                , item.createTime.substring(0, 16)
                , item.updateTime.substring(0, 16)
                , item.complaintSuggestionContent
                , itemPictures.join(""));
            $("#divLeaseInfo").html(htmlLeaseInfo);
            setTimeout(function () {
                $("#scroller").css("width", "{0}px".format((pictureUrls.length + 1) * 130 + 40));
                new IScroll('#wrapper', {
                    scrollX: true,
                    scrollY: false,
                    eventPassthrough: true
                });
            }, 100);
            if (item.complaintSuggestionState == "Succeed") {
                // 处理
                var isProcess = false;
                if (item.processDescription != null) {
                    isProcess = true;
                    $(".processDescription").show().find("span").html(item.processDescription);
                }
                if (item.processDescriptionPictures != null) {
                    var descriptionPictures = item.processDescriptionPictures.split(",");
                    var itemDescriptionPictures = [];
                    for (var i = 0; i < descriptionPictures.length; i++) {
                        itemDescriptionPictures.push(tplPicture.format(descriptionPictures[i]));
                    }
                    $("#scroller1 ul").html(itemDescriptionPictures.join(""));
                    setTimeout(function () {
                        $("#scroller1").css("width", "{0}px".format((itemDescriptionPictures.length + 1) * 130 + 40));
                        new IScroll('#wrapper1', {
                            scrollX: true,
                            scrollY: false,
                            eventPassthrough: true
                        });
                    }, 100);
                } else {
                    $("#lbProcessDescriptionPictures").html((isProcess ? "无" : ""));
                }
                if (isProcess) {
                    $(".process").show();
                }
                // 评价
                if (item.evaluations != null) {
                    $('#divStar').raty({
                        score: item.evaluations.level,
                        path: 'images/star4',
                        readOnly: true,
                        size: 20
                    }).css({"width": "auto"});
                    $("#divTipInfo").html(item.evaluations.levelDescription);
                    if (item.evaluations.lable != "") {
                        var infoTags = [];
                        var evaluationsTags = item.evaluations.lable.split(",");
                        for (var i = 0; i < evaluationsTags.length; i++) {
                            infoTags.push(infoTag.format(evaluationsTags[i]));
                        }
                        $("#divTagInfo").html(infoTags.join(""));
                    }
                    $("#divTagDescription").html(item.evaluations.description);
                    $(".evaluations").show();
                } else {
                    $(".evaluationsTip").show();
                    $(".btnEvaluations").show();
                }
            } else {
                if (item.complaintSuggestionState != "Canceled") {
                    $(".btnNext").show();
                }
            }
        }
    }, function (err) {
        mui.toast(err.message);
    });
});