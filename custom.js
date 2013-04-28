var pageCounter = 0;

function getLocations(){
	$.getJSON('http://127.0.0.1:8000/locations/',
		  { page: pageCounter },
		  function(data){
			alert(data);
		  }
	);
}

$(document).ready( function() {
	getLocations();
});
