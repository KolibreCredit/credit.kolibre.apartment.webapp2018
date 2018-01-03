/**
 * Created by long.jiang on 2016/12/23.
 */
$(document).ready(function() {
    getInvoke(constants.URLS.GETCURRENTHOUSEACCOUNTINFO, function(res) {
        if (res != null) {
            if (res.credentialType === "IDCard") {
                $("#lbTitle1").html("身份证正面");
                $("#lbTitle2").html("身份证背面");
            } else {
                $("#lbTitle1").html("护照个人信息页");
                $("#lbTitle2").html("护照签证信息页");
            }
            $("#lbRealName").html(replaceStr(res.realName, 1));
            $("#lbCredentialNo").html(replaceStr(res.credentialNo, 3));
            $("#imgCredentialFacePhotoUrl").attr("src", res.credentialFacePhotoUrl);
            $("#imgCredentialBackPhotoUrl").attr("src", res.credentialBackPhotoUrl);
        }
    });
});