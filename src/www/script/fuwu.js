var currentTabIndex = -1;
//
var dataList = null;
var dataHtmls = [];
var item = null;

function selectTabToggle(index) {
    if (currentTabIndex != index) {
        currentTabIndex = index;
        $('.selectTable td').removeClass('active');
        $('.selectTable td:eq(' + currentTabIndex + ')').addClass('active');
        if (currentTabIndex == 0) {
            getTenantCleanings();
        }
        else if (currentTabIndex == 1) {
            getTenantRepairs();
        }
        else {
            getTenantComplaintSuggestions();
        }
    }
}

function list2(tabIndex) {
    window.location.href = "list2.html?tabIndex={0}".format(tabIndex);
}

function getTenantCleanings() {
    getInvoke(constants.URLS.GETTENANTCLEANINGS, function (res) {
        if (res.succeeded) {
            if (res.data.length == 0) {
                $('#divlist').html("");
                $(".nodataDiv").show();
            } else {
                dataHtmls = [];
                var tpl0 = $("#tpl0").html();
                dataList = res.data;
                for (var i = 0; i < dataList.length; i++) {
                    item = dataList[i];
                    dataHtmls.push(tpl0.format(item.createTime.substring(0, 16)
                        , getCleaningState(item.cleaningState)
                        , item.cleaningState
                        , item.apartmentName
                        , item.roomNumber
                        , getCleaningTypes(item.cleaningType)
                        , item.cleaningStartTime.substring(0, 16),
                        item.cleaningEndTime.substring(11, 16)
                        , item.cleaningId));
                }
                $(".nodataDiv").hide();
                $('#divlist').html(dataHtmls.join(""));
            }
        }
    }, function (err) {
        console.log(err.message);
    });
}

function viewCleanings(cleaningId) {
    window.location.href = "viewbaoji.html?cleaningId={0}".format(cleaningId);
}

function getTenantRepairs() {
    getInvoke(constants.URLS.GETTENANTREPAIRS, function (res) {
        if (res.succeeded) {
            if (res.data.length == 0) {
                $('#divlist').html("");
                $(".nodataDiv").show();
            } else {
                dataHtmls = [];
                var tpl1 = $("#tpl1").html();
                dataList = res.data;
                for (var i = 0; i < dataList.length; i++) {
                    item = dataList[i];
                    dataHtmls.push(tpl1.format(item.createTime.substring(0, 16)
                        , getCleaningState(item.repairState)
                        , item.repairState
                        , item.apartmentName
                        , item.roomNumber
                        , getRepairType(item.repairType)
                        , item.repairStartTime.substring(0, 16)
                        , item.repairEndTime.substring(11, 16)
                        , item.repairId));
                }
                $(".nodataDiv").hide();
                $('#divlist').html(dataHtmls.join(""));
            }
        }
    }, function (err) {
        console.log(err.message);
    });
}

function viewRepair(repairId) {
    window.location.href = "viewbaoxiu.html?repairId={0}".format(repairId);
}

function getTenantComplaintSuggestions() {
    getInvoke(constants.URLS.GETTENANTCOMPLAINTSUGGESTIONS, function (res) {
        if (res.succeeded) {
            if (res.data.length == 0) {
                $('#divlist').html("");
                $(".nodataDiv").show();
            } else {
                dataHtmls = [];
                var tpl2 = $("#tpl2").html();
                dataList = res.data;
                item = 0;
                for (var i = 0; i < dataList.length; i++) {
                    item = dataList[i];
                    dataHtmls.push(tpl2.format(item.createTime.substring(0, 16)
                        , getCleaningState(item.complaintSuggestionState)
                        , item.complaintSuggestionState
                        , item.apartmentName
                        , item.roomNumber
                        , item.complaintSuggestionContent
                        , item.complaintSuggestionId));
                }
                $(".nodataDiv").hide();
                $('#divlist').html(dataHtmls.join(""));
            }
        }
    }, function (err) {
        console.log(err.message);
    });
}

function viewTousu(complaintSuggestionId) {
    window.location.href = "viewtousu.html?complaintSuggestionId={0}".format(complaintSuggestionId);
}

$(document).ready(function () {
    var tabIndex = getURLQuery("tabIndex") || 0;
    selectTabToggle(tabIndex);
});
