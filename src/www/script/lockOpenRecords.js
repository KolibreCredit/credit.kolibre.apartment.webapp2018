$(document).ready(function () {
    var deviceId = getURLQuery("deviceId");
    var coolkit = getCookie(constants.COOKIES.COOLKIT);
    var apiUrl = (coolkit == "coolkit" ? constants.URLS.GETCOOLKITDOOROPENRECORD : constants.URLS.GETLOCKOPENRECORDS);
    getInvoke(apiUrl.format(deviceId, 0, 200), function (res) {
        if (res.succeeded && res.data.data.length > 0) {
            var doorOpenRecords = res.data.data;
            var openRecords = [];
            var tplOpenRecord = $("#tplOpenRecord").html();
            for (var i = 0; i < doorOpenRecords.length; i++) {
                item = doorOpenRecords[i];
                openRecords.push(tplOpenRecord.format((i == doorOpenRecords.length - 1 ? "images/20181224/slice2.png" : "images/20181224/slice1.png"), item.sourceName, item.openTime));
            }
            $("#divOpenRecord").html(openRecords.join(""));
        } else {
            $('.nodataDiv').css({"display": "flex"});
        }
    }, function (err) {
        mui.toast(err.message);
    });
});