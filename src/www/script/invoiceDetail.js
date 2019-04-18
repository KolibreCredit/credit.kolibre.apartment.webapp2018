var item = null;
var invoiceInfoId = "";

function billList() {
    window.location.href = "bill.html?index=1";
}

function modify() {
    var data1 = {
        invoiceInfoId: invoiceInfoId,
        orderIds: [],
        contents: item.contents
    };
    var data2 = {
        titleName: item.titleName,
        titleCategory: item.titleCategory,
        taxpayerNo: (item.titleCategory == "Enterprise" ? item.taxpayerNo : "")
    };
    var data3 = {
        invoiceNote: item.invoiceNote,
        address: item.address,
        phoneNumber: item.phoneNumber,
        bankName: item.bankName,
        bankAccount: item.bankAccount
    };
    var data4 = {
        invoiceMedium: item.invoiceMedium,
        email: item.email,
        needMail: item.needMail,
        receiverName: item.receiverName,
        receiverPhone: item.receiverPhone,
        mailDistrict: item.mailDistrict,
        mailAddress: item.mailAddress
    };
    setCookie(constants.COOKIES.INVOICE, "modify");
    setCookie(constants.COOKIES.INVOICE1, JSON.stringify(data1));
    setCookie(constants.COOKIES.INVOICE2, JSON.stringify(data2));
    setCookie(constants.COOKIES.INVOICE3, JSON.stringify(data3));
    setCookie(constants.COOKIES.INVOICE4, JSON.stringify(data4));
    window.location.href = "invoice2.html";
}

function showModifyRecords() {
    $(".more").attr("src", "images/more3s.png");
    $(".flowChart").css({"display": "flex"});
    $(".retracting").show();
}

function hideModifyRecords() {
    $(".more").attr("src", "images/more3.png");
    $(".flowChart").css({"display": "none"});
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
                , (item.invoiceState == "Applying" ? "" : item.taxpayerNo)
                , (item.invoiceState == "Applying" ? "" : item.invoiceTime.substring(0, 16))
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
            sleep(100);
            if (item.titleCategory == "Enterprise") {
                $(".taxpayerNo").show();
            }
            if (item.invoiceState != "Applying") {
                $(".invoiceNo").show();
            }
            if (item.invoiceState != "Applying" && item.invoicePictures != null) {
                $(".invoicePictures").show();
                var pictureUrls = item.invoicePictures.split(",");
                var tplPicture = $("#tplPicture").html(), itemInvoicePictures = [];
                for (var i = 0; i < pictureUrls.length; i++) {
                    itemInvoicePictures.push(tplPicture.format(pictureUrls[i]));
                }
                $("#scroller").css("width", "{0}px".format((pictureUrls.length + 1) * 130 + 40)).find("ul").html(itemInvoicePictures.join(""));
                sleep(100);
                myScroll = new IScroll('#wrapper', {
                    preventDefault: false,
                    scrollX: true,
                    scrollY: false,
                    mouseWheel: false
                });
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
                        itemModifys.push(tplItemModify.format("发票类型修改前：" + (itemModify.invoiceMedium == "Digital" ? "电子发票" : "纸质发票")));
                    }
                    if (itemModify.titleCategory != null) {
                        itemModifys.push(tplItemModify.format("抬头类型修改前：" + (itemModify.titleCategory == "Enterprise" ? "公司抬头" : "个人/非公司抬头")));
                    }
                    if (itemModify.titleName != null) {
                        itemModifys.push(tplItemModify.format("发票抬头修改前：" + itemModify.titleName));
                    }
                    if (itemModify.taxpayerNo != null) {
                        itemModifys.push(tplItemModify.format("发票税号修改前：" + itemModify.taxpayerNo));
                    }
                    if (itemModify.invoiceNote != null) {
                        itemModifys.push(tplItemModify.format("备注信息修改前：" + itemModify.invoiceNote));
                    }
                    if (itemModify.address != null) {
                        itemModifys.push(tplItemModify.format("地址修改前：" + itemModify.address));
                    }
                    if (itemModify.phoneNumber != null) {
                        itemModifys.push(tplItemModify.format("电话修改前：" + itemModify.phoneNumber));
                    }
                    if (itemModify.bankName != null) {
                        itemModifys.push(tplItemModify.format("开户行修改前：" + itemModify.bankName));
                    }
                    if (itemModify.bankAccount != null) {
                        itemModifys.push(tplItemModify.format("帐号修改前：" + itemModify.bankAccount));
                    }
                    if (itemModify.email != null) {
                        itemModifys.push(tplItemModify.format("电子邮箱修改前：" + itemModify.email));
                    }
                    if (itemModify.needMail != null) {
                        itemModifys.push(tplItemModify.format("是否需要邮寄修改前：" + (itemModify.needMail ? "是" : "否")));
                    }
                    if (itemModify.receiverName != null) {
                        itemModifys.push(tplItemModify.format("收件人修改前：" + itemModify.receiverName));
                    }
                    if (itemModify.receiverPhone != null) {
                        itemModifys.push(tplItemModify.format("联系电话修改前：" + itemModify.receiverPhone));
                    }
                    if (itemModify.mailDistrict != null) {
                        itemModifys.push(tplItemModify.format("所在地区修改前：" + itemModify.mailDistrict));
                    }
                    if (itemModify.mailAddress != null) {
                        itemModifys.push(tplItemModify.format("详细地址修改前：" + itemModify.mailAddress));
                    }
                    itemModifyRecords.push(tplModifyRecord.format(itemModifys.join("")));
                }
                $("#divModifyRecords").show().find(".flowChart-right").html(itemModifyRecords.join(""));
            }
        }
    }, function (err) {
        mui.toast(err.message);
    });
});

function closeApply() {
    $(".msg-alert").hide();
}