/* 
* OCAD Internet Map for OpenLayers
* OCAD AG, Baar, Switzerland 2012
* Author: Markus Fuchs-Winkler
*/

function XMLLoad(dname)
{
	var xmlDoc;
	if (window.XMLHttpRequest) {
	  xmlDoc=new window.XMLHttpRequest();
	  xmlDoc.open("GET",dname,false);
	  xmlDoc.send("");
	  return xmlDoc.responseXML;
	}
	// IE 5 and IE 6
	else if (ActiveXObject("Microsoft.XMLDOM"))	{
	  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
	  xmlDoc.async=false;
	  xmlDoc.load(dname);
	  return xmlDoc;
	}
	alert('error loading XML Document');
	return null;
}

function UrlDecode(url)
{
    return unescape(url).replace("+", " ");
}

function XMLLoadPoiGroups(dname){			

		
	var xmlDocument = XMLLoad(dname);
	var xdoc = xmlDocument.getElementsByTagName("poigroup"); //Group of POIS combined together
	
	for(var i=0; i < xdoc.length; i++) {
		_mapPoi[i] = new Object();
		_mapPoi[i].id = xdoc[i].attributes.getNamedItem("id").value;
		_mapPoi[i].layerName = xdoc[i].getElementsByTagName("layerName")[0].childNodes[0].nodeValue;
		_mapPoi[i].geometry = xdoc[i].getElementsByTagName("geometry")[0].childNodes[0].nodeValue;
		try { _mapPoi[i].urltarget = xdoc[i].getElementsByTagName("urltarget")[0].childNodes[0].nodeValue;
			} catch (e) { _mapPoi[i].urltarget = "_blank";	}
	    if (_mapPoi[i].geometry == "Icon") {
			_mapPoi[i].iconurl = xdoc[i].getElementsByTagName("iconurl")[0].childNodes[0].nodeValue;
			_mapPoi[i].iconsize = new Object();
			_mapPoi[i].iconsize.x = xdoc[i].getElementsByTagName("iconsize")[0].getElementsByTagName("x")[0].childNodes[0].nodeValue;
			_mapPoi[i].iconsize.y = xdoc[i].getElementsByTagName("iconsize")[0].getElementsByTagName("y")[0].childNodes[0].nodeValue;
			_mapPoi[i].iconoffset = new Object();
			_mapPoi[i].iconoffset.x = xdoc[i].getElementsByTagName("iconoffset")[0].getElementsByTagName("x")[0].childNodes[0].nodeValue;
			_mapPoi[i].iconoffset.y = xdoc[i].getElementsByTagName("iconoffset")[0].getElementsByTagName("y")[0].childNodes[0].nodeValue;

		}
	}
}

function XMLLoadPoiLocations(dname) {
	
	var xmlDocument = XMLLoad(dname);
	var xdoc = xmlDocument.getElementsByTagName("poigroup");
	var tmp;
	
	for(var i=0; i < xdoc.length; i++) {
		
		_mapPoi[i].locs = new Array();
		tmp = xdoc[i].getElementsByTagName("loc");
		
		for(var j=0; j< tmp.length; j++) {
		
			_mapPoi[i].locs[j] = new Object();
			try { _mapPoi[i].locs[j].location = tmp[j].getElementsByTagName("location")[0].childNodes[0].nodeValue.replace(/^\s/, "");
			} catch (e) { _mapPoi[i].locs[j].location = "";	}
			try { _mapPoi[i].locs[j].x = tmp[j].getElementsByTagName("x")[0].childNodes[0].nodeValue;
			}	catch (e) { _mapPoi[i].locs[j].x = 0;	}
			try { _mapPoi[i].locs[j].y = tmp[j].getElementsByTagName("y")[0].childNodes[0].nodeValue;
			} catch (e) { _mapPoi[i].locs[j].y = 0;	}
			try { _mapPoi[i].locs[j].linkname = tmp[j].getElementsByTagName("linkname")[0].childNodes[0].nodeValue; 
			} catch (e) { _mapPoi[i].locs[j].linkname = ""; }
			try {	_mapPoi[i].locs[j].url = UrlDecode(tmp[j].getElementsByTagName("url")[0].childNodes[0].nodeValue);
			} catch (e) { _mapPoi[i].locs[j].url = ""; }
			try { _mapPoi[i].locs[j].description = tmp[j].getElementsByTagName("description")[0].childNodes[0].nodeValue;
			}	catch (e) {	 _mapPoi[i].locs[j].description = ""; }
		}
	}
	
}

function GeneratePois() {
		
	for(var i = 0; i < _mapPoi.length; i++) {
		if(_mapPoi[i].geometry == "Point") {
			//Generate the Layers from the previous imported data
			_poiLayers[i] = new OpenLayers.Layer.Vector(_mapPoi[i].layerName);	
		
			
			for (var j = 0; j < _mapPoi[i].locs.length; j++) {
				
				var feature_point = null;
		
				feature_point = new OpenLayers.Feature.Vector(
						new OpenLayers.Geometry.Point(parseInt(_mapPoi[i].locs[j].x), parseInt(_mapPoi[i].locs[j].y)), 
						{
							'id': _mapPoi[i].locs[j].id,
							'location': _mapPoi[i].locs[j].location,
							'description':  _mapPoi[i].locs[j].description,
							'linkname' : _mapPoi[i].locs[j].linkname,
							'url':  _mapPoi[i].locs[j].url,
							'urltarget': _mapPoi[i].urltarget
						}
				);
				
				_poiLayers[i].addFeatures([feature_point]);
				
			}
		
	
				POI_SelectFeature(_poiLayers[i]);
		}
		else {
			
			var point, popupClass, popupContentHTML;
			_poiLayers[i] = new OpenLayers.Layer.Markers(_mapPoi[i].layerName);
			for (var j = 0; j < _mapPoi[i].locs.length; j++) {
			
				point = new OpenLayers.LonLat(parseInt(_mapPoi[i].locs[j].x), parseInt(_mapPoi[i].locs[j].y));
				popupClass = AutoSizeFramedCloud;
				popupContentHTML = '<strong>' + _mapPoi[i].locs[j].location + '</strong><br />' + _mapPoi[i].locs[j].description
				+ '<br /><br /><a target = "' + _mapPoi[i].urltarget + '" href="' + _mapPoi[i].locs[j].url + '">' + _mapPoi[i].locs[j].linkname + '</a>' ;
				addMarker(_poiLayers[i] ,point, popupClass, popupContentHTML, true, true,_mapPoi[i].iconurl, _mapPoi[i].iconsize, _mapPoi[i].iconoffset );
			}
		}
	}
	map.addLayers(_poiLayers);

}

function POI_SelectFeature(poi_layer) {
	//Create and add selectFeature control
	var select_feature_control = new OpenLayers.Control.SelectFeature(
		poi_layer, 
		{
			multiple: false,
			toggle: true,
			hover: false,
			toggleKey: 'ctrlKey',
			multipleKey: 'shiftKey'	
		}
	);
	map.addControl(select_feature_control);	
	
	//Activate the control
	select_feature_control.activate();

	//Finally, let's add some events so we can do stuff when the user 
	//	interacts with the features
	function selected_feature(event){
	    //clear out the log's contents
	    document.getElementById('mapdata').innerHTML = '';
	    
	    //Show the current selected feature (passed in from the event object)
	    var display_text = '<strong>' + event.feature.attributes.location + '</strong><hr />'
	        + event.feature.attributes.description + '<br />'
	        + '<a  target="'+event.feature.attributes.urltarget +'" href="'+event.feature.attributes.url +'">' + event.feature.attributes.linkname + '</a>';
		document.getElementById('mapdata').innerHTML = display_text;
		
	}
	function unselected_feature(event){
		document.getElementById('mapdata').innerHTML = "Select a POI from the Map";

	}
	
	//Register the event
	poi_layer.events.register('featureselected', this, selected_feature);
	poi_layer.events.register('featureunselected', this, unselected_feature);


}

function XMLInitPois(generalInfoXML, LocationInfoXML) {
	XMLLoadPoiGroups(generalInfoXML);
	XMLLoadPoiLocations(LocationInfoXML);	
	GeneratePois();
	
}


function addMarker(layer,point, popupClass, popupContentHTML, closeBox, overflow, iconurl, iconsize, iconoffset) {
	var feature = new OpenLayers.Feature(layer, point); 
	feature.closeBox = closeBox;
	feature.popupClass = popupClass;
	feature.data.popupContentHTML = popupContentHTML;
	feature.data.overflow = (overflow) ? "auto" : "hidden";
	feature.data.panMapIfOutOfView = true;
			
	var size = new OpenLayers.Size(iconsize.x, iconsize.y);
	var offset = new OpenLayers.Pixel(iconoffset.x , iconoffset.y);
	var icon = new OpenLayers.Icon(iconurl, size, offset);		
	
	feature.data.icon = icon;
	
	var marker = feature.createMarker();
	
	var markerClick = function (evt) {
		if (this.popup == null) {
			this.popup = this.createPopup(this.closeBox);
			map.addPopup(this.popup);
			this.popup.show();
		} else {
			this.popup.toggle();
		}
		currentPopup = this.popup;
		OpenLayers.Event.stop(evt);
	};
	marker.events.register("mousedown", feature, markerClick);

	layer.addMarker(marker);
}


function  MapPoiGoToLocation() {
	var sPoiToGo =  document.getElementById("searchVal").value;

	if (sPoiToGo == "" ) {
		return;
	}
	
	for(var i = 0; i < _mapPoi.length; i++) {
		for(var j=0; j < _mapPoi[i].locs.length; j++) {
			if(_mapPoi[i].locs[j].location == sPoiToGo) {
	    		map.zoomTo(map.numZoomLevels-1);
	    		map.panTo(new OpenLayers.LonLat(_mapPoi[i].locs[j].x,_mapPoi[i].locs[j].y));
    		}
		}
	}
}

function CreateSelect() {
	var SelectorList = new Array();
	var SelectorField = document.getElementById("mapselect");

	SelectorList.push('<select id = "poigroupSelector" onchange = "CreatePoiList(this.value, \'\');" style="margin-top: 4px; margin-left: 2px; width: 99%;">');
	for(var i = 0; i < _mapPoi.length; i++) {
		SelectorList.push('<option value="'+ _mapPoi[i].id + '">' + _mapPoi[i].layerName + '</option>');
	}
	SelectorList.push('</select>');
	SelectorList.push('<input onkeyup="CreatePoiList(document.getElementById(\'poigroupSelector\').value, this.value);" style="width: 96%; margin-top: 7px; margin-left: 2px;" type="text" id="searchValPoi" />');
	SelectorList.push('<div id="POISelect"></div>');
	SelectorField.innerHTML = SelectorList.join(' ');
	
	CreatePoiList(0, '');
}


if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

if (typeof String.prototype.unescapeHtml != 'function') {
	String.prototype.unescapeHtml = function () {
	    var temp = document.createElement("div");
	    temp.innerHTML = this;
	    var result = temp.childNodes[0].nodeValue;
	    temp.removeChild(temp.firstChild);
	    return result;
	};
}


function dynamicSort(property) {
    return function (a,b) {
        return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    };
}


function CreatePoiList(PoiGroupId, limit) {
	var iPoiGroup =  parseInt(PoiGroupId);
	var aPoiList = new Array();
	var dPOISelect = document.getElementById("POISelect");
	var aToSortPoiList = new Array();
	var aToSortCount = 0;
	limit = limit.replace(/^\s/, "");
	
	
	if (limit == '') document.getElementById("searchValPoi").value = ''; 

	for (var i = 0; i < _mapPoi[iPoiGroup].locs.length; i++) {
		if (limit != "") {
			if (_mapPoi[iPoiGroup].locs[i].location.toLowerCase().unescapeHtml().startsWith(limit.toLowerCase()) == true) {
				aToSortPoiList[aToSortCount] = new Object();
				aToSortPoiList[aToSortCount].id = i;
				aToSortPoiList[aToSortCount++].location = new String(_mapPoi[iPoiGroup].locs[i].location).replace(/^\s/, "");
			}
		}
		else
		{
			aToSortPoiList[i] = new Object();
			aToSortPoiList[i].id = i;
			aToSortPoiList[i].location = new String(_mapPoi[iPoiGroup].locs[i].location).replace(/^\s/, "");
		}
	}

	aToSortPoiList.sort(dynamicSort("location"));

		
	aPoiList.push('<select onchange = "MapPoiGoToPoi(this.value, document.getElementById(\'poigroupSelector\').value);" size="6" style="width: 99%; margin-top: 4px; margin-left: 2px;">');
	for(var i = 0; i < aToSortPoiList.length; i++ ) {
		aPoiList.push('<option value="'+ aToSortPoiList[i].id+ '">'+aToSortPoiList[i].location + '</option>');
	}
	aPoiList.push('</select>');
	
	dPOISelect.innerHTML = aPoiList.join('');
}

function MapPoiGoToPoi(PoiLocationId, PoiGroupId) {
	var iPoiGroupId = parseInt(PoiGroupId);
	var iPoiLocationId = parseInt(PoiLocationId);
	map.zoomTo(map.numZoomLevels-1);
	map.panTo(new OpenLayers.LonLat(_mapPoi[iPoiGroupId].locs[iPoiLocationId].x,_mapPoi[iPoiGroupId].locs[iPoiLocationId].y));
	
}
