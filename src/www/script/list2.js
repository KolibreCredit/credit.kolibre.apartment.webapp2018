/**
 * Created by long.jiang on 2016/12/14.
 */
var tabIndex = 0;
var currentRowIndex = -1;
var contractsData = null;

function selectItem(rowIndex) {
    if (currentRowIndex != rowIndex) {
        currentRowIndex = rowIndex;
        $(".ic_grey_arrow").attr("src", "images/fuwu/check.png").eq(rowIndex).attr("src", "images/fuwu/checks.png");
    }
}

function selectContract() {
    var contractId = contractsData[currentRowIndex].contractId;
    if (tabIndex == 0) {
        window.location.href = "baoji.html?contractId={0}".format(contractId);
    }
    else if (tabIndex == 1) {
        window.location.href = "baoxiu.html?contractId={0}".format(contractId);
    }
    else {
        window.location.href = "tousu.html?contractId={0}".format(contractId);
    }
}

function getCurrentcontracts() {
    getInvoke(constants.URLS.GETCURRENTCONTRACTS, function (res) {
        $(".msg-post").hide();
        if (res.succeeded && res.data.length > 0) {
            var leasesHtml = "";
            var tplLeases = $("#tplLeases").html();
            var item = null;
            contractsData = res.data;
            for (var i = 0; i < contractsData.length; i++) {
                item = contractsData[i];
                leasesHtml += tplLeases.format(item.apartmentName, item.roomNumber, i);
            }
            $("#divLeases").html(leasesHtml);
            $(".step0").show();
            setTimeout(function () {
                selectItem(0);
            }, 0)
        } else {
            $(".step0").hide();
            $("#divNoData").show();
        }
    }, function (err) {
        $(".msg-post").hide();
        mui.toast(err.message);
    });
}

$(document).ready(function () {
    tabIndex = getURLQuery("tabIndex");
    $(".msg-post").show();
    /*   getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
               if (res.succeeded) {
                   if (!res.data.hasInfo) {
                       window.location.href = "verify.html?url={0}".format("list.html");
                   }
                   else if (!res.data.confirmed) {
                       window.location.href = "confirmTenant.html?url={0}".format("list.html");
                   } else {
                       getCurrentcontracts();
                   }
               }
           }
       );*/
    getCurrentcontracts();
});
