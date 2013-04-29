function getLocations(pageCounter) {
	$.getJSON('http://127.0.0.1:8000/locations/', 
		{ page : pageCounter }, 
		function(data) {
			createLeafletMarkers(data);
		}
	);
}

function createLeafletMarkers(locations) {
	for(var i = 0; i < locations.length; i++){
		var locData = locations[i].fields;
		
		var marker = L.marker([locData.latitude, locData.longitude]);
		
		marker.bindPopup(createPopupContent(locData)).openPopup();
		
		marker.addTo(map)
	}
}

function createPopupContent(locData) {
	return '<p> Address: ' + locData.address + ' <br/> Parcel: ' + locData.parcel + '</p>';
}

$(document).ready(function() {
	//Temporary, until we have a proper mechanism to tell us when to stop.
	//The number of markers on the map at the same time kill performance.
	for(var i = 0; i < 5; i++){
		getLocations(i);
	}
});
