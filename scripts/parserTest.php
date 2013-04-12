<?php
/*
* OCAD Internet Map for OpenLayers Autosuggest Tools
* OCAD AG, Baar, Switzerland 2011
* Author: Markus Fuchs-Winkler
*/

	$aPOIS = array();
	$aPOISCount = 0;
	$aInfo = array();
	$aInfoCount = 0;
	
	include('parser_php5.php');
	
	$xml = file_get_contents('../pois/mappoisdata.xml');
	
	$parser = new XMLParser($xml);
	
	$parser->Parse();
	
	//Gather all XML location data
	foreach ($parser->document->poigroup as $poigroup){
		foreach ($poigroup->loc as $loc) {
				$aPOIS[$aPOISCount++] = $loc->location[0]->tagData;
				$aInfo[$aInfoCount++] = $loc->shortdescription[0]->tagData;
		}
	}
		
	echo "Vardump POIS <br />";
	var_dump($aPOIS);
	
	echo "<br />Vardump Info <br />";
	var_dump($aInfo);
	
?>