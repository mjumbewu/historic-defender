//Global References
var bMapLoading		= true,
	bTableReady 	= false,
	bTableLoading 	= false,
	gdrAddressList,	
	gdrContentSpan,
	gdrGuiSpan,
	gdrMap,
	oDataTable,
	oMarkerCluster;

function showMap(){
	gdrAddressList.remove();
	gdrContentSpan.append(gdrMap);	
	return false;
}

function showTable(){
	if(bMapLoading)
		return false;
	
	if(bTableReady){
		gdrMap.remove();		
		gdrContentSpan.append(gdrAddressList);		
		oDataTable.fnDraw();	
	}else if(!bTableLoading){
		initDataTable();		
	}
	
	return false;	
}

$(document).ready(function() {
	gdrContentSpan 	 = $("#content-span");
	gdrMap		  	 = $("#map");	
	gdrAddressList   = $("#address-list");
	gdrGuiSpan		 = $("#gui-span");
	
	//Ready GUI
	$('#button-show-map').on('click', showMap);
	$('#button-show-table').on('click', showTable);	
	oMarkerCluster = new L.MarkerClusterGroup();
	map.addLayer(oMarkerCluster);	
	gdrAddressList.remove();
	
	//Recursive stuff
	getLocations();
});	
