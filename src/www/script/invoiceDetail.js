var item = null;
var invoiceInfoId = "";

function billList() {
    window.location.replace("bill.html?index=1");
}

function modify() {
    var data1 = {
        requestId: constants.COOKIES.INVOICE1,
        cacheData: {
            invoiceInfoId: invoiceInfoId,
            orderIds: [],
            contents: item.contents
        }
    };
    var data2 = {
        requestId: constants.COOKIES.INVOICE2,
        cacheData: {
            titleCategory: item.titleCategory,
            titleName: item.titleName,
            taxpayerNo: (item.titleCategory == "Enterprise" ? item.taxpayerNo : "")
        }
    };
    var data3 = {
        requestId: constants.COOKIES.INVOICE3,
        cacheData: {
            invoiceNote: item.invoiceNote,
            address: item.address,
            phoneNumber: item.phoneNumber,
            bankName: item.bankName,
            bankAccount: item.bankAccount
        }
    };
    var data4 = {
        requestId: constants.COOKIES.INVOICE4,
        cacheData: {
            email: item.email,
            needMail: item.needMail,
            receiverName: item.receiverName,
            receiverPhone: item.receiverPhone,
            mailDistrict: item.mailDistrict,
            mailAddress: item.mailAddress
        }
    };
    var isSave = true;
    setCookie(constants.COOKIES.INVOICE, "modify");
    setCookie(constants.COOKIES.INVOICE0, (item.invoiceMedium == "Digital" ? 0 : 1));
    postInvoke(constants.URLS.SAVEREQUESTDATA, data1, function (res) {
        if (!res.succeeded) {
            isSave = false;
            mui.toast(res.message);
        }
    }, function (err) {
        isSave = false;
        mui.toast(err.message);
    });
    if (!isSave) return false;
    postInvoke(constants.URLS.SAVEREQUESTDATA, data2, function (res) {
        if (!res.succeeded) {
            isSave = false;
            mui.toast(res.message);
        }
    }, function (err) {
        isSave = false;
        mui.toast(err.message);
    });
    if (!isSave) return false;
    postInvoke(constants.URLS.SAVEREQUESTDATA, data3, function (res) {
        if (!res.succeeded) {
            isSave = false;
            mui.toast(res.message);
        }
    }, function (err) {
        isSave = false;
        mui.toast(err.message);
    });
    if (!isSave) return false;
    postInvoke(constants.URLS.SAVEREQUESTDATA, data4, function (res) {
        if (res.succeeded) {
            window.location.href = "invoice2.html";
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

function showModifyRecords() {
    $(".more").attr("src", "images/more3s.png");
    $(".flowChart .oneNode").show();
    $(".retractingMore").hide();
    $(".retracting").show();
}

function hideModifyRecords() {
    $(".more").attr("src", "images/more3.png");
    $(".flowChart .oneNode").hide().eq(0).show();
    $(".retractingMore").show();
    $(".retracting").hide();
}

//
$(document).ready(function () {
    invoiceInfoId = getURLQuery("invoiceInfoId");
    getInvoke(constants.URLS.GETINVOICEINFO.format(invoiceInfoId), function (res) {
        if (res.succeeded && res.data != null) {
            item = res.data;
            if (item.invoiceMedium == "Digital" && item.invoiceState == "Invoiced") {
                $(".invoiceStateTip").show();
            }
            if (item.invoiceState == "Rejected") {
                $("#rejectedMsg").html("温馨提示：" + item.rejectComment);
                $(".rejectedTip").show();
            }
            $("#imgInvoiceState").attr("src", "images/invoce/{0}.png".format(item.invoiceState)).show();
            $("#lbInvoiceState").html(getInvoiceState(item.invoiceState));
            var tplItem = $("#tplItem").html();
            var itemContents = [];
            var itemContent = null;
            for (var i = 0; i < item.contents.length; i++) {
                itemContent = item.contents[i];
                itemContents.push(tplItem.format(itemContent.content, (itemContent.amount * 0.01).toFixed(2)));
            }
            var tplTotal = $("#tplTotal").html();
            if (item.contents.length > 1) {
                itemContents.push(tplTotal.format((item.invoiceTotalAmount * 0.01).toFixed(2)));
            }
            var tplInvoceInfo = $("#tplInvoceInfo").html();
            $("#divInvoceInfo").html(tplInvoceInfo.format(item.titleName
                , (item.titleCategory == "Enterprise" ? item.taxpayerNo : "")
                , itemContents.join(""), item.createTime.substring(0, 16)
                , (item.hasInvoiced ? item.invoiceNo : "")
                , (item.hasInvoiced ? item.invoiceTime.substring(0, 16) : "")
            ));
            //
            if (item.invoiceMedium == "Digital") {
                var tplDigital = $("#tplDigital").html();
                $("#divInvoceInfo2").html(tplDigital.format(item.email));
            } else {
                if (item.needMail) {
                    var tplPaper = $("#tplPaper").html();
                    $("#divInvoceInfo2").html(tplPaper.format(item.receiverName
                        , item.receiverPhone
                        , item.mailDistrict
                        , item.mailAddress
                        , (item.hasMailed ? "是" : "否")
                        , (item.hasMailed ? item.expressCompany : "")
                        , (item.hasMailed ? item.trackingNo : "")
                    ));
                } else {
                    var tplPaper1 = $("#tplPaper1").html();
                    $("#divInvoceInfo2").html(tplPaper1);
                }
            }
            //
            if (item.titleCategory == "Enterprise") {
                $(".taxpayerNo").show();
            }
            if (item.invoiceState != "Applying") {
                $(".invoiceNo").show();
            }
            if (item.hasInvoiced && item.invoicePictures != null) {
                $(".invoicePictures").show();
                var pictureUrls = item.invoicePictures.split(",");
                var tplPicture = $("#tplPicture").html(), itemInvoicePictures = [];
                for (var i = 0; i < pictureUrls.length; i++) {
                    itemInvoicePictures.push(tplPicture.format(pictureUrls[i]));
                }
                $("#scroller").css("width", "{0}px".format((pictureUrls.length + 1) * 130 + 40)).find("ul").html(itemInvoicePictures.join(""));
                setTimeout(function () {
                    myScroll = new IScroll('#wrapper', {
                        scrollX: true,
                        scrollY: false,
                        eventPassthrough: true
                    });
                }, 100);
            }
            if (item.hasMailed) {
                $(".hasMailed").show();
            }
            if (item.modifyRecords != null) {
                var itemModify = null, itemModifys = null;
                var itemModifyRecords = [], tplModifyRecord = $("#tplModifyRecord").html();
                var tplItemModify = "<div>{0}</div>";
                for (var i = 0; i < item.modifyRecords.length; i++) {
                    itemModifys = [];
                    itemModify = item.modifyRecords[i];
                    itemModifys.push(tplItemModify.format(itemModify.modifyTime));
                    if (itemModify.invoiceMedium != null) {
                        itemModifys.push(tplItemModify.format("发票类型：修改前 " + (itemModify.invoiceMedium == "Digital" ? "电子发票" : "纸质发票")));
                    }
                    if (itemModify.titleCategory != null) {
                        itemModifys.push(tplItemModify.format("抬头类型：修改前 " + (itemModify.titleCategory == "Enterprise" ? "公司抬头" : "个人/非公司抬头")));
                    }
                    if (itemModify.titleName != null) {
                        itemModifys.push(tplItemModify.format("发票抬头：修改前 " + itemModify.titleName));
                    }
                    if (itemModify.taxpayerNo != null) {
                        itemModifys.push(tplItemModify.format("发票税号：修改前 " + itemModify.taxpayerNo));
                    }
                    if (itemModify.invoiceNote != null) {
                        itemModifys.push(tplItemModify.format("备注信息：修改前 " + itemModify.invoiceNote));
                    }
                    if (itemModify.address != null) {
                        itemModifys.push(tplItemModify.format("地址：修改前 " + itemModify.address));
                    }
                    if (itemModify.phoneNumber != null) {
                        itemModifys.push(tplItemModify.format("电话：修改前 " + itemModify.phoneNumber));
                    }
                    if (itemModify.bankName != null) {
                        itemModifys.push(tplItemModify.format("开户行：修改前 " + itemModify.bankName));
                    }
                    if (itemModify.bankAccount != null) {
                        itemModifys.push(tplItemModify.format("帐号：修改前 " + itemModify.bankAccount));
                    }
                    if (itemModify.email != null) {
                        itemModifys.push(tplItemModify.format("电子邮箱：修改前 " + itemModify.email));
                    }
                    if (itemModify.needMail != null) {
                        itemModifys.push(tplItemModify.format("是否需要邮寄：修改前 " + (itemModify.needMail ? "是" : "否")));
                    }
                    if (itemModify.receiverName != null) {
                        itemModifys.push(tplItemModify.format("收件人：修改前 " + itemModify.receiverName));
                    }
                    if (itemModify.receiverPhone != null) {
                        itemModifys.push(tplItemModify.format("联系电话：修改前 " + itemModify.receiverPhone));
                    }
                    if (itemModify.mailDistrict != null) {
                        itemModifys.push(tplItemModify.format("所在地区：修改前 " + itemModify.mailDistrict));
                    }
                    if (itemModify.mailAddress != null) {
                        itemModifys.push(tplItemModify.format("详细地址：修改前 " + itemModify.mailAddress));
                    }
                    itemModifyRecords.push(tplModifyRecord.format(itemModifys.join("")));
                }
                $("#divModifyRecords").show().find(".flowChart-right").html(itemModifyRecords.join(""));
                if (item.modifyRecords.length > 1) {
                    $(".more").show();
                    $(".retractingMore").show();
                }
                setTimeout(function () {
                    $(".flowChart .oneNode").eq(0).show();
                }, 100);
            }
        }
    }, function (err) {
        mui.toast(err.message);
    });
});

function closeApply() {
    $(".msg-alert").hide();
}