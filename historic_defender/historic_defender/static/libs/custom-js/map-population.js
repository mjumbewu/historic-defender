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
			alert("Something bad happened while loading locations...");
		});
}

function getParcel(locid){
	$.when(createParcelRequest(locid))
		.done(function() {
			$("#parcelModal").modal('show');
		})
		.fail(function() {
			alert("Something bad happened while loading parcel...");
		});		
}

function createParcelRequest(locid) {
	return $.getJSON('http://127.0.0.1:8000/parcels/', 
			{ locid : locid }, 
			function(data) {
				var modalHtml = createModalHtml(data);
				$("#parcelModalBody").html(modalHtml);
			}
	);
}

function createModalHtml(data){
	var modalHtml = '<p><ul>';
	
	for(var i = 0; i < data.length; i++){
		var parcelData = data[i];
		
		modalHtml += '<li>' + parcelData.number + '</li>';
	}
	
	modalHtml += '</ul></p>';
	
	return modalHtml;
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
	
	if(pctLoaded == 1){
		$("#loading-message").html("Done!");
		$("#loading-message").addClass("alert-success").removeClass("alert-info");
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
	return '<p> Address: ' + locData.address + ' <br/><br/> <button class="btn btn-small btn-info" onclick="getParcel(' + locData.id + ');">View Parcels</button></p>';
}

$(document).ready(function() {
	markerCluster = new L.MarkerClusterGroup();

	getLocations();	

	map.addLayer(markerCluster);
});
