$(document).ready(function () {
    var deviceId = getURLQuery("deviceId");
    getInvoke(constants.URLS.GETCOOLKITDOOROPENRECORD.format(deviceId, 0, 200), function (res) {
        if (res.succeeded && res.data.data.length > 0) {
            var doorOpenRecords = res.data.data;
            var openRecords = [];
            var tplOpenRecord = $("#tplOpenRecord").html();
            for (var i = 0; i < doorOpenRecords.length; i++) {
                item = doorOpenRecords[i];
                openRecords.push(tplOpenRecord.format(item.sourceName,item.openTime,item.notes));
            }
            $("#divOpenRecord").html(openRecords.join(""));
            $("#imgSlice2").show();
        } else {
            $('.nodataDiv').css({"display": "flex"});
        }
    }, function (err) {
        mui.toast(err.message);
    });
    //
    language.init();
});