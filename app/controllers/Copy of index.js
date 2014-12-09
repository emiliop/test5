//Create a Window
var win = Ti.UI.createWindow({
    backgroundColor : '#00f'
});
 
// Create  annotationin array.
 
var annotations = [Ti.Map.createAnnotation({
    latitude : 37.389569,
    longitude : -122.050212,
    title : 'Appcelerator HQ',
    subtitle : 'Mountain View, CA',
    animate : true,
    pincolor : Ti.Map.ANNOTATION_GREEN,
}), Ti.Map.createAnnotation({
    latitude : 37.422502,
    longitude : -122.0855498,
    title : 'Google HQ',
    subtitle : 'Mountain View, CA',
    animate : true,
})];
 
//Create a mapview 
 
var mapview = Titanium.Map.createView({
    mapType : Titanium.Map.STANDARD_TYPE,
    animate : true,
    regionFit : true,
    userLocation : true,
    region : {
        latitude : 37.389569,
        longitude : -122.050212,
        latitudeDelta : 0.1,
        longitudeDelta : 0.1
    },
    annotations : annotations// Assign the annotations to the map view for pin point
});
 
var longitude;
var latitude;
 
// Get the current location of the user.
 
Titanium.Geolocation.getCurrentPosition(function(e) {
    if (e.error) {
        alert('HFL cannot get your current location');
        return;
    }
        else {
                 longitude = e.coords.longitude;
                  latitude = e.coords.latitude;
// Assign the destination Latitude and Longitude.
destinationLongitude = -122.050212;
 
// The bellow URL is used to Get the route of current location to assigned  destination  Location. 
 
//var url = "http://maps.googleapis.com/maps/api/directions/json?origin=" + latitude+','+longitude + "&destination=" + destinationLatitude +','+ destinationLongitude +"&sensor=true";
 
// The Bellow URL use the static current location to destination  Location. 
var url = "http://maps.googleapis.com/maps/api/directions/json?origin=37.422502,-122.0855498&destination=37.389569,-122.050212&sensor=true";
 
var xhr = Titanium.Network.createHTTPClient();
xhr.open('GET', url);
Ti.API.info('URL: ' + url);
 
xhr.onload = function() {
    Ti.API.info('inside the xhr-->' + this.responseText);
    var xml = this.responseText;
    var points = [];
 
    // Bellow Variable have the step of the current location to destination  Location. Using the Steps we going to create a route.
 
       var position = JSON.parse(this.responseText).routes[0].legs[0].steps;
    if (position[0] != null) {
 
        points.push({
            latitude : position[0].start_location.lat,
            longitude : position[0].start_location.lng,
        });
 
         // Here we use the for loop to collect all the steps and push it to the array and use this array to form the route in android.
 
        for (var i = 0; i < position.length; i++) {
 
        points.push({
            latitude : position[i].end_location.lat,
            longitude : position[i].end_location.lng,
        });
    }
    } else {
        alert('no route');
    }
 
    var route = {
        name : "india",
        points : points,
        color : "red",
        width : 5
    };
 
    mapview.addRoute(route);
};
 
// Send the request to server
 
xhr.send();
} 
}); 
 
// Add map View to the window. 
win.add(mapview); 
 
//Open Window 
win.open();