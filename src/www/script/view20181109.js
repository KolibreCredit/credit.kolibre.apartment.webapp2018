/**
 * Created by long.jiang on 2016/12/14.
 */
var isPictures = false;
var contractId = "";

//
function apply() {
    $(".msg-post").show();
    var data = {contractId: contractId};
    postInvoke(constants.URLS.CREATECONFIRMINFO, data, function (res) {
        if (res.succeeded) {
            setCookie(constants.COOKIES.CONTRACTCONFIRMINFOID, res.data.contractConfirmInfoId);
            if (res.data.nextStep == 5) {
                if (res.data.contractMedium == 'Paper') {
                    window.location.href = "apply5.html";
                } else {
                    window.location.href = "apply51.html";
                }
            } else {
                toApplys(res.data.nextStep);
            }
        } else {
            $(".msg-post").hide();
        }
    }, function (err) {
        $(".msg-post").hide();
        mui.toast(err.message);
    });
}

function signUrl(imgUrl) {
    if (isPictures) {
        window.location.href = "signImg.html?imgUrl=" + imgUrl;
    } else {
        window.location.href = " agreement.html?hasPaper=0&contractId=" + imgUrl;
    }
}

function filterOrderState(orderState) {
    var state = "";
    if (orderState == "Created") {
        state = "待支付";
    }
    else if (orderState == "ApproachingOverdue") {
        state = "快到期";
    }
    else if (orderState == "Overdue") {
        state = "已逾期";
    }
    else if (orderState == "Canceled") {
        state = "已退租";
    }
    else {
        state = "已完成";
    }
    return state;
}

function orders() {
    window.location.href = "viewOrders.html?contractId={0}".format(contractId);
}

function goods() {
    window.location.href = " goods.html?contractId=" + contractId;
}

function showMsgAlert() {
    $(".msg-alert").show();
}

function hideMsgAlert() {
    $(".msg-alert").hide();
}

function imgShow(outerdiv, innerdiv, bigimg, _this) {
    var src = _this.attr("src");//获取当前点击的pimg元素中的src属性
    $(bigimg).attr("src", src);//设置#bigimg元素的src属性
    /*获取当前点击图片的真实大小，并显示弹出层及大图*/
    var img = new Image();
    img.src = src;
    img.onload = function () {
        var windowW = $(window).width();//获取当前窗口宽度
        var windowH = $(window).height();//获取当前窗口高度
        var realWidth = this.width;//获取图片真实宽度
        var realHeight = this.height;//获取图片真实高度
        var imgWidth, imgHeight;
        var scale = 0.8;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放
        if (realHeight > windowH * scale) {//判断图片高度
            imgHeight = windowH * scale;//如大于窗口高度，图片高度进行缩放
            imgWidth = imgHeight / realHeight * realWidth;//等比例缩放宽度
            if (imgWidth > windowW * scale) {//如宽度扔大于窗口宽度
                imgWidth = windowW * scale;//再对宽度进行缩放
            }
        } else if (realWidth > windowW * scale) {//如图片高度合适，判断图片宽度
            imgWidth = windowW * scale;//如大于窗口宽度，图片宽度进行缩放
            imgHeight = imgWidth / realWidth * realHeight;//等比例缩放高度
        } else {//如果图片真实高度和宽度都符合要求，高宽不变
            imgWidth = realWidth;
            imgHeight = realHeight;
        }
        $(bigimg).css("width", imgWidth);//以最终的宽度对图片缩放
        var w = (windowW - imgWidth) / 2;//计算图片与窗口左边距
        var h = (windowH - imgHeight) / 2;//计算图片与窗口上边距
        $(innerdiv).css({"top": h, "left": w});//设置#innerdiv的top和left属性
        $(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.pimg
    };
    $(outerdiv).click(function () {//再次点击淡出消失弹出层
        $(this).fadeOut("fast");
    });
}

$(document).ready(function () {
    contractId = getURLQuery("contractId");
    getInvoke(constants.URLS.GETCONTRACTDETAILS.format(contractId), function (res) {
        if (res.succeeded && res.data != null) {
            var item = res.data;
            var roomDetails = res.data.roomDetails;
            var orders = res.data.orders;
            //
            $("#divApartmentName").html(roomDetails.apartmentName);
            $("#divRoomNumber").html(roomDetails.roomNumber + "室");
            //
            if (orders.length > 3) {
                $("#divAllOrderInfo").show();
                $("#divOrderInfo").css({"padding-top": "10px"});
            }
            var htmlOrderInfos = [];
            var tplOrderInfo = $("#tplOrderInfo").html();
            var order = null;
            var monthUrl = "";
            for (var i = 0; i < orders.length; i++) {
                if (i < 3) {
                    order = orders[i];
                    monthUrl = "images/months/{0}".format(moment(order.paymentTime).format('MM') + "s.png");
                    htmlOrderInfos.push(tplOrderInfo.format(monthUrl, (order.orderType == "CustomDeposit" ? order.orderTypeName : getOrderType(order.orderType)),
                        (order.totalAmount / 100).toFixed(2),
                        order.orderState.toLowerCase(),
                        filterOrderState(order.orderState),
                        order.orderStartTime.substring(0, 10),
                        order.orderEndTime.substring(0, 10),
                        order.paymentTime.substring(0, 10)
                    ));
                }
            }
            $("#divOrderInfo").html(htmlOrderInfos.join(""));
            //
            $(".msg-alert").html($("#tplMsgAlert").html().format(item.managerContact));
            var templateName = "";
            var imageStorageLocation = "";
            if (item.contractPictures) {
                templateName = "查看";
                imageStorageLocation = item.contractPictures;
                isPictures = true;
            } else {
                templateName = "查看";
                imageStorageLocation = item.contractId;
                isPictures = false;
            }
            var isStagesMonthRents = false;
            var arrStagesMonthRents = [];
            if (item.stagesMonthRents != null && item.stagesMonthRents.length > 0) {
                isStagesMonthRents = true;
                var tplStagesMonthRents = $("#tplStagesMonthRents").html();
                item.stagesMonthRents.forEach(function (model) {
                    arrStagesMonthRents.push(tplStagesMonthRents.format((model.amount / 100).toFixed(2), model.stagesStartTime + "～" + model.stagesEndTime));
                });
            } else {
                isStagesMonthRents = false;
            }
            var tplLeaseInfo = $("#tplLeaseInfo").html();
            var htmlLeaseInfo = tplLeaseInfo.format(
                "", "", (isStagesMonthRents ? arrStagesMonthRents.join("") : (item.monthlyAmount / 100).toFixed(2)),
                (item.propertyManagementAmount / 100).toFixed(2),
                (item.depositAmount / 100).toFixed(2),
                (item.accessCardDepositAmount / 100).toFixed(2),
                item.term,
                item.rentStartTime.substring(0, 10),
                item.rentEndTime.substring(0, 10),
                getPayPeriod(item.payPeriod),
                (item.contractPictures ? "纸质合同" : "电子合同"),
                imageStorageLocation,
                templateName, item.contractNotes);
            $("#divLeaseInfo").html(htmlLeaseInfo);
            setTimeout(function () {
                if (item.customDeposits != null && item.customDeposits.length > 0) {
                    var customDeposit = null;
                    var htmlCustomDeposit = [];
                    var tplCustomDeposit = $("#tplCustomDeposit").html();
                    for (var i = 0; i < item.customDeposits.length; i++) {
                        customDeposit = item.customDeposits[i];
                        htmlCustomDeposit.push(tplCustomDeposit.format(customDeposit.name, (customDeposit.amount / 100).toFixed(2)));
                    }
                    $(".customDeposits").html(htmlCustomDeposit.join("")).show();
                }
                if (item.confirmed) {
                    $(".btnNext").eq(1).show();
                } else {
                    $(".btnNext").eq(0).show()
                }
                if (item.accessCardDepositAmount > 0) {
                    $(".accessCardDepositAmount").show();
                }
                if (isStagesMonthRents) {
                    $(".stagesMonthRents").show();
                } else {
                    $(".monthlyAmount").show();
                }
                if (item.contractNotes) {
                    $(".contractNotes").show();
                }
            }, 10);
            if (item.propertyDeliveies != null && (item.propertyDeliveies.fileUrl.length > 0 || item.propertyDeliveies.goods.length > 0)) {
                $(".step2").show();
                if (item.propertyDeliveies.fileUrl.length > 0) {
                    $(".step2").find(".fileUrl").show();
                    var arrPropertyDeliveies = [];
                    var tplPropertyDeliveie = $("#tplPropertyDeliveie").html();
                    item.propertyDeliveies.fileUrl.forEach(function (model) {
                        arrPropertyDeliveies.push(tplPropertyDeliveie.format(model));
                    });
                    $("#wrapper").find("#scroller").css({"width": (item.propertyDeliveies.fileUrl.length * 150) + "px"});
                    $("#wrapper").find("ul").html(arrPropertyDeliveies.join(""));
                    setTimeout(function () {
                        new IScroll('#wrapper', {
                            preventDefault: false,
                            scrollX: true,
                            scrollY: false,
                            mouseWheel: false
                        });
                        //
                        $("#wrapper").find("img").click(function () {
                            var _this = $(this);//将当前的pimg元素作为_this传入函数
                            imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);
                        });
                    }, 10);
                }
                if (item.propertyDeliveies.goods.length > 0) {
                    $(".step2").find(".goods").show();
                }
            }
            //
            if (item.checkoutInfo != null && item.checkoutInfo.checkoutConfirmation != null) {
                $(".step3").show();
                var arrCheckoutConfirmations = [];
                var tplPropertyDeliveie = $("#tplPropertyDeliveie").html();
                var checkoutConfirmations = item.checkoutInfo.checkoutConfirmation.split(',');
                checkoutConfirmations.forEach(function (model) {
                    arrCheckoutConfirmations.push(tplPropertyDeliveie.format(model));
                });
                $("#wrapper2").find("#scroller2").css({"width": (checkoutConfirmations.length * 150) + "px"});
                $("#wrapper2").find("ul").html(arrCheckoutConfirmations.join(""));
                setTimeout(function () {
                    new IScroll('#wrapper2', {
                        preventDefault: false,
                        scrollX: true,
                        scrollY: false,
                        mouseWheel: false
                    });
                    //
                    $("#wrapper2").find("img").click(function () {
                        var _this = $(this);//将当前的pimg元素作为_this传入函数
                        imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);
                    });
                }, 10);
            }
        }
    }, function (err) {
        mui.toast(err.message);
    });
});