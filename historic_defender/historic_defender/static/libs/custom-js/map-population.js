var markerCluster, totalCount, currentCount;

function getLocations(pageCounter) {
	$.getJSON('http://127.0.0.1:8000/locations/', 
		{ page : pageCounter }, 
		function(data) {
			createMarkers(data);
		}
	);
}

function updateLoadingMessages(){
	$("#total-loaded").html(currentCount);
	
	var pctLoaded = (currentCount / totalCount) * 100
	
	if(pctLoaded == 100){
		$("#loading-message").html("Done!");
		$("#loading-message").addClass("alert-success").removeClass("alert-warning");
	}

}

function createMarkers(locations) {
	for(var i = 0; i < locations.length; i++){
		var locData = locations[i].fields;
		
		var marker = L.marker([locData.latitude, locData.longitude]);
		
		marker.bindPopup(createPopupContent(locData)).openPopup();

		markerCluster.addLayer(marker);
	}
	
	currentCount += locations.length;
	updateLoadingMessages();	
}

function createPopupContent(locData) {
	return '<p> Address: ' + locData.address + ' <br/> Parcel: ' + locData.parcel + '</p>';
}

$(document).ready(function() {
	markerCluster = new L.MarkerClusterGroup();
	currentCount = 0;
	totalCount = 20000; //Hardcoded for now, should be set dynamically based on COUNT(*) of lat/long points
	
	//TO-DO: How does IE8 get 'out of order' on this loop? In general it really seems to 
	//choke on this operation
	for(var i = 0; i < 80; i++){
		getLocations(i);
	}

	map.addLayer(markerCluster);
});
