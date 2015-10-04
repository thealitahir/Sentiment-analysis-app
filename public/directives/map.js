
angular.module('directives').directive('mapDirective',function() {
    return {
        restrict: 'EA',
        scope: {
            result : '=',
            mapTab: '='
        },
        link: function ($scope, elem, attrs) {

            $scope.map='';
            $scope.markerLayer=[];
            $scope.geojsonLayer=undefined;
            $scope.isMapInitialized=false;

            function renderTiles(){
                $scope.map = L.map('map', {
                    center: [39.73, -104.99],
                    zoom: 2,
                    zoomControl: false
                });
                L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +
                        'Imagery � <a href="http://mapbox.com">Mapbox</a>'

                }).addTo($scope.map);
                L.control.layers(Tiles).addTo($scope.map);
                L.control.zoom({
                    position: 'bottomright'
                }).addTo($scope.map);
                L.control.fullscreen({
                    position: 'bottomright',
                    title: 'Fullscreen !',
                    forceSeparateButton: true,
                    forcePseudoFullscreen: true
                }).addTo($scope.map);
            };
            renderTiles();
            function drawMap(obj) {
                $scope.data=obj.data;
                $scope.schema=obj.schema;

                if($scope.markerLayer.length>0){
                    for(var i in $scope.markerLayer){
                        $scope.map.removeLayer($scope.markerLayer[i]);
                    }
                }
                if($scope.geojsonLayer){
                    $scope.map.removeLayer($scope.geojsonLayer);
                }
                /*$scope.schema=[
                 {
                 field: "COMMUNITY_AREA",
                 alias: "COMMUNITY_AREA",
                 position: 0,
                 type: "string"
                 },
                 {
                 field: "CRIMETYPE",
                 alias: "CRIMETYPE",
                 position: 1,
                 type: "string"
                 },
                 {
                 field: "CRIMES",
                 alias: "CRIMES",
                 position: 2,
                 type: "long"
                 },
                 {
                 field: "ARRESTED",
                 alias: "ARRESTED",
                 position: 3,
                 type: "long"
                 }
                 ];
                 $scope.data=[
                 {
                 COMMUNITY_AREA: "MONTCLARE",
                 CRIMETYPE: "HOMICIDE",
                 CRIMES: "386",
                 ARRESTED: "238"
                 },
                 {
                 COMMUNITY_AREA: "ALBANY PARK",
                 CRIMETYPE: "HOMICIDE",
                 CRIMES: "2",
                 ARRESTED: "1"
                 },
                 {
                 COMMUNITY_AREA: "NEAR WEST SIDE",
                 CRIMETYPE: "ASSAULT",
                 CRIMES: "9008",
                 ARRESTED: "3186"
                 },
                 {
                 COMMUNITY_AREA: "ROGERS PARK",
                 CRIMETYPE: "BATTERY",
                 CRIMES: "17154",
                 ARRESTED: "3600"
                 }
                 ];*/
                /*       $scope.schema=[
                 {
                 field: "stationID",
                 alias: "stationID",
                 position: 0,
                 type: "string"
                 },
                 {
                 field: "name",
                 alias: "name",
                 position: 1,
                 type: "string"
                 },
                 {
                 field: "LATITUDE",
                 alias: "latitude",
                 position: 2,
                 type: "latitude"
                 },
                 {
                 field: "LONGITUDE",
                 alias: "longitude",
                 position: 3,
                 type: "longitude"
                 }
                 ];
                 $scope.data= [
                 {
                 stationID: "9414750",
                 name: "Alameda CA",
                 LATITUDE: "37.7675",
                 LONGITUDE: "122.2858"
                 },
                 {
                 stationID: "9416841",
                 name: "Arena Cove CA",
                 LATITUDE: "38.9025",
                 LONGITUDE: "123.7019"
                 },
                 {
                 stationID: "9414958",
                 name: "Bolinas Bolinas Lagoon CA",
                 LATITUDE: "37.90139",
                 LONGITUDE: "122.6686"
                 },
                 {
                 stationID: "9414575",
                 name: "Coyote Creek CA",
                 LATITUDE: "37.4525",
                 LONGITUDE: "122.0178"
                 },
                 {
                 stationID: "9419750",
                 name: "Crescent City CA",
                 LATITUDE: "41.73528",
                 LONGITUDE: "124.1836"
                 },
                 {
                 stationID: "9410689",
                 name: "Gerald Desmond Bridge Air Gap CA",
                 LATITUDE: "33.7525",
                 LONGITUDE: "118.2172"
                 },
                 {
                 stationID: "9410230",
                 name: "La Jolla CA",
                 LATITUDE: "32.86667",
                 LONGITUDE: "117.2511"
                 },
                 {
                 stationID: "9410660",
                 name: "Los Angeles CA",
                 LATITUDE: "33.71722",
                 LONGITUDE: "118.2678"
                 },
                 {
                 stationID: "9415102",
                 name: "Martinez Amorco Pier CA",
                 LATITUDE: "38.03361",
                 LONGITUDE: "122.1181"
                 },
                 {
                 stationID: "9413450",
                 name: "Monterey CA",
                 LATITUDE: "36.60083",
                 LONGITUDE: "121.8842"
                 }
                 ];*/

                $scope.communityAreas=function(){
                    function highlightFeature(e) {
                        var layer = e.target;
                        layer.setStyle({
                            weight: 5,
                            color: '#a9cf58',

                            fillColor:'#a9cf58',
                            dashArray: '',
                            fillOpacity: 0.7
                        });
                        if (!L.Browser.ie && !L.Browser.opera) {
                            layer.bringToFront();
                        }
                    };

                    function resetHighlight(e) {

                        var layer = e.target;
                        layer.setStyle({
                            weight: 5,
                            color: 'blue',
                            fillColor:'grey',
                            dashArray: '',
                            fillOpacity: 0.7
                        });

                    }
                    function style(feature) {
                        return {
                            weight: 5,
                            color: 'blue',
                            fillColor:'grey',
                            dashArray: '',
                            fillOpacity: 0.7
                        };
                    }
                    if($scope.schema){
                        $scope.schemakeys = _.pluck($scope.schema, 'field');

                        var crimeTypes=_.uniq(_.pluck($scope.data, 'CRIMETYPE'));

                        $scope.popupData=function(comm){


                            for(var i in $scope.data){

                                if($scope.data[i].COMMUNITY_AREA.toLowerCase()==comm){


                                    return i;
                                }
                            }

                            return -1;
                        };
                        function onEachFeature(feature, layer) {

                            var index=$scope.popupData(feature.properties.COMMUNITY.toLowerCase());

                            if(index>-1){

                                var filterCrimes=_.where($scope.data, {COMMUNITY_AREA: $scope.data[index].COMMUNITY_AREA});
                                var popup = '';


                                popup=popup+'<b>COMMUNITY</b>: ';
                                popup=popup+'<b>'+$scope.data[index].COMMUNITY_AREA+'</b>';
                                popup = popup + "<br>"

                                popup = popup + " <table>";
                                popup = popup + " <tr>";
                                popup = popup + " <td>";
                                popup = popup + "<b>CRIME TYPE</b>";
                                popup = popup + " </td>"
                                popup = popup + " <td>";
                                popup = popup + "<b>TOTAL CRIMES</b>";
                                popup = popup + " </td>"
                                popup = popup + " <td>";
                                popup = popup + "<b>ARRESTED</b>";
                                popup = popup + " </td>"
                                popup = popup + " </tr>";

                                for(var j in filterCrimes){
                                    popup = popup + " <tr>";
                                    popup = popup + " <td>";
                                    popup = popup + filterCrimes[j].CRIMETYPE;
                                    popup = popup + " </td>"
                                    popup = popup + " <td>";
                                    popup = popup + filterCrimes[j].CRIMES;
                                    popup = popup + " </td>"
                                    popup = popup + " <td>";
                                    popup = popup + filterCrimes[j].ARRESTED;
                                    popup = popup + " </td>"
                                    popup = popup + " </tr>";
                                }


                                popup = popup + " <table>";

                                layer.bindPopup(popup);
                                layer.on({
                                    mouseover: highlightFeature,
                                    mouseout: resetHighlight

                                });
                            }



                        }
                        $scope.mapKeys=Object.keys(commArea.features[0].properties);
                        $scope.geojsonLayer=L.geoJson(commArea,
                            {    filter: function(feature, layer) {
                                var index=$scope.popupData(feature.properties.COMMUNITY.toLowerCase());
                                if(index>-1)
                                    return true;
                                else
                                    return false;
                            },
                                onEachFeature: onEachFeature,
                                style:style
                            }).addTo($scope.map);
                        window.setTimeout(function () {

                            $scope.map.fitBounds($scope.geojsonLayer);

                        }.bind(this), 1000);
                    }
                };

                var checkSchema=_.pluck($scope.schema, 'field');
                if(checkSchema.indexOf("COMMUNITY_AREA")>-1 && checkSchema.indexOf("CRIMETYPE")>-1){
                    $scope.communityAreas();
                }

                if($scope.schema) {
                    $scope.schemakeys = _.pluck($scope.schema, 'field');
                    var latVar = "";
                    var lngVar = "";

                    for(var i in $scope.schemakeys){
                        if($scope.schemakeys[i].toLowerCase()=="longitude"){
                            lngVar=$scope.schemakeys[i];
                        }
                        else if($scope.schemakeys[i].toLowerCase()=="latitude"){
                            latVar=$scope.schemakeys[i];
                        }
                    }


                    if (latVar != "" && lngVar != "") {

                        for (var i in $scope.data) {

                            $scope.markerLayer[i] = L.marker(L.latLng($scope.data[i][latVar], $scope.data[i][lngVar]));
                            var popup = '';
                            popup=popup+'<table>';

                            for (var j in $scope.schema) {
                                popup=popup+'<tr>';
                                popup=popup+'<td>';
                                popup = popup +'<b>'+ $scope.schema[j].field+'</b>';
                                popup=popup+'</td>';
                                popup=popup+'<td>';
                                if(_.contains($scope.data[i][$scope.schema[j].field],'.')){
                                    var num=parseFloat($scope.data[i][$scope.schema[j].field])

                                    if(!isNaN(num)){
                                        popup = popup + num.toPrecision(5);
                                    }
                                }

                                else {
                                    popup = popup + $scope.data[i][$scope.schema[j].field];
                                }
                                popup=popup+'</td>';
                                popup=popup+'<tr>';

                            }
                            popup=popup+'<table>';
                            $scope.markerLayer[i].bindPopup(popup);

                        }
                        $scope.markersGroup = L.featureGroup($scope.markerLayer)
                            .addTo($scope.map);
                        $scope.map.fitBounds($scope.markersGroup.getBounds());

                    }
                }
            }
            $scope.$watchCollection(function(){return $scope.result;}, function(obj) {if(typeof obj != 'undefined'){drawMap(obj)}});
            $scope.$watchCollection(function(){return $scope.mapTab;}, function(obj) {
                if(obj.title == 'Map' && obj.active == true){
                    $scope.map.invalidateSize();
                    $scope.map._onResize();
                }
            });
        },
        template: '<div id="map"></div>'

    };
});