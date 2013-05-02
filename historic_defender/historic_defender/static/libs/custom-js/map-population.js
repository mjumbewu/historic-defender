var currentCount = 0,
	currentPage = 0,
	markerCluster, 
	totalCount = 0;

function getLocations() {
	$.when(createLocationRequest())
		.done(function() {
			updateLoadingMessages(currentCount / totalCount);
			
			if(currentCount < totalCount){
				getLocations();
			}
		})
		.fail(function() {
			alert("Something bad happened...");
		});
}


function createLocationRequest() {
	return $.getJSON('http://127.0.0.1:8000/locations/', 
			{ page : currentPage++ }, 
			function(data) {
				if(totalCount == 0){
					totalCount = data.meta.total;
				}
					
				createMarkers(data.results);
			}
	);
}

function updateLoadingMessages(pctLoaded){
	$("#total-loaded").html(currentCount);
	
	if(pctLoaded == 100){
		$("#loading-message").html("Done!");
		$("#loading-message").addClass("alert-success").removeClass("alert-warning");
	}

}

function createMarkers(locations) {
	for(var i = 0; i < locations.length; i++){
		var locData = locations[i];
		
		var marker = L.marker([locData.latitude, locData.longitude]);
		
		marker.bindPopup(createPopupContent(locData)).openPopup();

		markerCluster.addLayer(marker);
	}
	
	currentCount += locations.length;
}

function createPopupContent(locData) {
	return '<p> Address: ' + locData.address + ' <br/> Parcel: ' + locData.parcel + '</p>';
}

$(document).ready(function() {
	markerCluster = new L.MarkerClusterGroup();

	getLocations();	

	map.addLayer(markerCluster);
});
