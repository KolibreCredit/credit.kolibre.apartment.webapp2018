$(document).ready(function () {
    var divMap = document.getElementById("divMap");
divMap.style.width = document.documentElement.clientWidth + "px";
divMap.style.height = document.documentElement.clientHeight + "px";
var addr = getURLQuery("addr");
var map = new BMap.Map("divMap");
map.addControl(new BMap.NavigationControl());
map.enableScrollWheelZoom();
var myGeo = new BMap.Geocoder();
myGeo.getPoint(addr, function (point) {
    map.centerAndZoom(point, 16);
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
    marker.disableDragging();
    var infoWindow = new BMap.InfoWindow("<p style='font-size:14px;'>" + addr + "</p>");
    marker.addEventListener("click", function () {
        this.openInfoWindow(infoWindow);
    });
});
});