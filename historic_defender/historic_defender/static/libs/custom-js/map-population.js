var iCurrentCount = 0,
	iCurrentPage = 0,
	iTotalCount = 0;

function getLocations() {
	$.when(createLocationRequest())
		.done(function() {
			if(iCurrentCount < iTotalCount){
				getLocations();
			}
			
			updateLoadingMessages(iCurrentCount / iTotalCount);

			if(iCurrentCount == iTotalCount){
				bMapLoading = false;
				$('#button-show-table').removeClass("disabled");				
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
			{ page : iCurrentPage++ }, 
			function(data) {
				if(iTotalCount == 0){
					iTotalCount = data.meta.total;
				}
					
				//Weirdness, located in table-population.js
				createTableRows(data.results);
				createMarkers(data.results);
			}
	);
}

function updateLoadingMessages(pctLoaded){
	$("#total-loaded").html(iCurrentCount);
	
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

		oMarkerCluster.addLayer(marker);
	}
	
	iCurrentCount += locations.length;
}

function createPopupContent(locData) {
	return '<p> Address: ' + locData.address + ' <br/><br/> <button class="btn btn-small btn-info" onclick="getParcel(' + locData.id + ');">View Parcels</button></p>';
}
