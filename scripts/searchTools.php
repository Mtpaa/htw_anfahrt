<?php
/*
* OCAD Internet Map for OpenLayers Autosuggest Tools
* OCAD AG, Baar, Switzerland 2011
* Author: Markus Fuchs-Winkler
*/

	$filename_POIs = "../aSuggestPois.serialized";
	$filename_Info = "../aSuggestInfo.serialized";
	
	$aPOIS = array();
	$aPOISCount = 0;
	$aInfo = array();
	$aInfoCount = 0;
	
	//retrieve from file set up with setupAutosuggest.php
	$aPOIS = unserialize(file_get_contents($filename_POIs));
	$aInfo = unserialize(file_get_contents($filename_Info));
	
	$input = utf8_decode(urldecode(strtolower( $_GET['input'] )));
	$len = strlen($input);
	$limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 0;
	
	
	$aResults = array();
	$count = 0;
	
	if ($len)
	{
		for ($i=0;$i<count($aPOIS);$i++)
		{
			if (strtolower(substr($aPOIS[$i],0,$len)) == $input)
			{
				$count++;
				$aResults[] = array( "id"=>($i+1) ,"value"=>htmlspecialchars($aPOIS[$i]), "info"=>htmlspecialchars($aInfo[$i]) );
			}
			
			if ($limit && $count==$limit)
				break;
		}
	}
	
	header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); // Date in the past
	header ("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT"); // always modified
	header ("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
	header ("Pragma: no-cache"); // HTTP/1.0
	header("Content-type: text/xml");
	

	$dom = new DOMDocument('1.0', 'utf-8');
	$dom->formatOutput = true;

	$content = $dom->appendChild($dom->createElement('results'));
	
	for ($i=0; $i<count($aResults);$i++) {
		
		$rs = $content->appendChild($dom->createElement('rs', utf8_encode($aResults[$i]['value'])));
		$rs->setAttribute('id', $i);
		$rs->setAttribute('info', $aResults[$i]['info']);
	}

	echo $dom->saveXML();
?>