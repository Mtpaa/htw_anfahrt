/* 
* OCAD Internet Map for OpenLayers
* OCAD AG, Baar, Switzerland 2012
* Author: Markus Fuchs-Winkler
*/

function overlay_getTileURL(bounds) {
var res = this.map.getResolution();
var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
var y = Math.round((bounds.bottom - this.maxExtent.bottom) / (res * this.tileSize.h));
var z = this.map.getZoom();
if (x >= 0 && y >= 0) {
 return this.url + "map_tiles/"+ z + "/" + x + "/" + y + "." + this.type;				
} else {
	return "none.png";
	}
}
	
function getWindowHeight() {
	if (self.innerHeight) return self.innerHeight;
	if (document.documentElement && document.documentElement.clientHeight)
	    return document.documentElement.clientHeight;
	if (document.body) return document.body.clientHeight;
	    return 0;
}

function getWindowWidth() {
    if (self.innerWidth) return self.innerWidth;
    if (document.documentElement && document.documentElement.clientWidth)
        return document.documentElement.clientWidth;
    if (document.body) return document.body.clientWidth;
        return 0;
}

function resize() {  
	var map = document.getElementById("map");  
	var header = document.getElementById("header");  
	var subheader = document.getElementById("subheader");  
	map.style.height = (getWindowHeight()*0.85) + "px";
	map.style.width = (getWindowWidth()*0.80) + "px";
	header.style.width = (getWindowWidth()-30) + "px";
	subheader.style.width = (getWindowWidth()-35) + "px";

	if (map.updateSize) { map.updateSize(); };
} 
