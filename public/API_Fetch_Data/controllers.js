


var APIFetchController = angular.module('APIFetchController', []);

APIFetchController.controller('DemoController', ['$scope', 'CRUDService', '$timeout','$interval','$timeout', function ($scope, CRUDService, $timeout,$interval,$timeout) {

    $scope.options = {
        animate:{
            duration:10,
            enabled:true
        },
        barColor:'#6ca8e3',
        lineWidth:15,
        scaleColor: '#757575',
        size: "200"
    };
    $scope.negativeObj={
        value:30,
        total:100,
        unit:20
    };
    $scope.positiveObj={
        value:30,
        total:100,
        unit:20
    };
    $scope.neutralObj={
        value:30,
        total:100,
        unit:20
    };
    $scope.url = "";
    $scope.graphArray=[
        //{type:'line', x_coordinate:'NAME',y_coordinate:[],title:'Highest and Average Tide Height'},

        {type:'column', x_coordinate:'Sentiments',y_coordinate:'Number of views',title:'Sentiment Analysis Bar Chart'},
        {type:'heatmap', x_coordinate:'Sentiments',y_coordinate:'Number of views',title:'Sentiment Analysis Heat Map'},
        {type:'pie', x_coordinate:'NAME',y_coordinate:[],title:'Sentiment Analysis Pie Graph'}
        //{type:'area', x_coordinate:'NAME',y_coordinate:'HIGHEST_TIDE',title:'Highest Tide Height Per Station'},
        //{type:'map', x_coordinate:'',y_coordinate:'',title:'Weather Stations'}
    ]
    $scope.showData= true

    $scope.tabs = [

        { title:"Graphs", active:true },
        { title:"Data", active:false }

    ];



    // $scope.fetch = function(){

    $scope.schema = [];
    $scope.data = [];
    $scope.array = [];
    $scope.selected_items = [];
    $scope.custom_settings = { externalIdProp: '', enableSearch: true};
    $scope.customTexts = { buttonDefaultText: 'Select Field(s)'};
    $scope.events = {
        onItemSelect: function(item) {
            $scope.graphArray[0].y_coordinate =_.pluck($scope.selected_items, 'label');
        },
        onItemDeselect: function(item){
            $scope.graphArray[0].y_coordinate =_.pluck($scope.selected_items, 'label');
        },
        onDeselectAll : function(){},
        onSelectAll: function(){}
    };
    //  console.log($scope.url);


    //}

    $scope.getX = function(x_coordinate, index){

        $scope.graphArray[index].x_coordinate = x_coordinate;
        if($scope.graphArray[index].type=='line'){
            $scope.drawLineGraph();
        }
        if($scope.graphArray[index].type=='column'){
            $scope.drawBarGraph();
        }
        if($scope.graphArray[index].type=='area'){
            $scope.drawAreaGraph();
        }


    };

    $scope.getY = function(y_coordinate, index){

        $scope.graphArray[index].y_coordinate = y_coordinate;

        if($scope.graphArray[index].type=='column'){
            $scope.drawBarGraph();
        }
        if($scope.graphArray[index].type=='area'){
            $scope.drawAreaGraph();
        }
    };

    $scope.drawLineGraph = function(){

        var chartConfig = {
            chart: {
                type: 'line',
                zoomType: 'xy'
            },
            title: {
                text: ''
            },
            yAxis : [
                {
                    title: {
                        text: $scope.graphArray[0].y_coordinate
                    }
                }
            ],
            credits: {
                enabled: false
            }
        };


        var graphData = getSeriesAndCategoriesForLine($scope.data,$scope.graphArray[0].x_coordinate,$scope.graphArray[0].y_coordinate, 'NAME');
        // console.log(graphData);

        chartConfig.xAxis = {
            title: {
                text: $scope.graphArray[0].x_coordinate
            },
            categories: graphData.categories
        };
        chartConfig.series = graphData.series;
        // }

        //  console.log(chartConfig)
        $('#lineHighChart').highcharts(chartConfig);
    }
    $scope.drawBarGraph = function(){

        $scope.barChartConfig = {

            options: {
                chart: {
                    type: 'column',
                    zoomType: 'xy'
                }
            },
            title: {
                text: ''
            },
            xAxis:{
                categories: [
                    'Positive',
                    'Negative',
                    'Neutral'
                ]
            },
            yAxis : [
                {
                    title: {
                        text: $scope.graphArray[1].y_coordinate
                    }
                }
            ],
            credits: {
                enabled: false
            }
        };
        /*  console.log("$scope.schema");
         console.log($scope.data);
         */
        var seriesData = _.countBy($scope.data, "PREDICTED_LABEL");
        seriesData['positive']=seriesData['positive'] ?seriesData['positive']:0;
        var graphData =[{data:[seriesData['positive'],seriesData['negative'],seriesData['neutral']]}] ;
        //var graphData =[{data:[0,22,4]}] ;
        // console.log(graphData)
        /*  $scope.barChartConfig.xAxis = {
         title: {
         text: $scope.graphArray[1].x_coordinate
         },
         categories: graphData.categories
         };*/
        $scope.barChartConfig.series = graphData;


    };
    $scope.drawAreaGraph = function(){

        $scope.areaChartConfig = {

            options: {
                chart: {
                    type: 'area',
                    zoomType: 'xy'
                }
            },
            title: {
                text: ''
            },
            yAxis : [
                {
                    title: {
                        text: $scope.graphArray[2].y_coordinate
                    }
                }
            ],
            credits: {
                enabled: false
            }
        };

        var graphData = getSeriesAndCategories($scope.data,$scope.graphArray[2].x_coordinate,$scope.graphArray[2].y_coordinate, 'NAME');

        $scope.areaChartConfig.xAxis = {
            title: {
                text: $scope.graphArray[2].x_coordinate
            },
            categories: graphData.categories
        };
        $scope.areaChartConfig.series = graphData.series;

    };
    $scope.drawHeatMap=function(){
        var heatMapConfig = {
            colorAxis: {
                minColor: '#FFFFFF',
                maxColor: Highcharts.getOptions().colors[0]
            },
            title: {
                text: ''
            }
        };
        var seriesData = _.countBy($scope.data, "PREDICTED_LABEL");
        seriesData['positive']=seriesData['positive'] ?seriesData['positive']:0;
        var graphData =[{
            type: "treemap",
            layoutAlgorithm: 'squarified',
            data:[
                {name:'Positive',value:seriesData['positive'],colorValue: 1},
                {name:'Negative',value:seriesData['negative'],colorValue: 3},
                {name:'Neutral',value:seriesData['neutral'],colorValue: 5}
            ]
        }];
        heatMapConfig.series = graphData;
        //  console.log(chartConfig)
        $('#heatMap').highcharts(heatMapConfig);

    };
    $scope.drawPieChart=function(){
        var pieChartConfig = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            }
        };
        var seriesData = _.countBy($scope.data, "PREDICTED_LABEL");
        seriesData['positive']=seriesData['positive'] ?seriesData['positive']:0;
        var graphData =[{
            data:[{name:'Positive',y:seriesData['positive']},{name:'Negative',y:seriesData['negative']},{name:'Neutral',y:seriesData['neutral']}]
        }];
        pieChartConfig.series = graphData;
        //  console.log(chartConfig)
        $('#pieHighChart').highcharts(pieChartConfig);
        $timeout(function(){
            $(window).resize();
        },100);
    };
    function getSeriesAndCategoriesForLine(data,x_axis,y_axis,label){

        var series = [];
        var categories = [];

        //  console.log(y_axis);
        for(var i=0;i<y_axis.length;i++){
            series.push({name : y_axis[i], data :[]})
        }


        for(var i=0 ; i< data.length; i++) {

            var keys = Object.keys(data[i]);

            for (var j = 0; j < keys.length; j++) {

                if(keys[j] == x_axis){
                    categories.push(data[i][keys[j]]);
                }

                for(var k=0;k<y_axis.length;k++){

                    if(keys[j] == y_axis[k]){

                        var value = data[i][keys[j]];
                        if(typeof data[i][keys[j]] == 'string'){

                            value = parseFloat(data[i][keys[j]]);
                        }
                        if(label!= ''){
                            series[k].data.push({y: value , name : label +" : "+ data[i][label]});
                        }
                        else{
                            series[k].data.push({y: value, name : ''});
                        }
                    }
                }
            }
        }

        var obj = {
            categories : categories,
            series : series
        };
        return obj;
    }
    function getSeriesAndCategories(data,x_axis,y_axis,label){

        var series = [];
        var categories = [];

        series.push({name : y_axis, data :[]})

        for(var i=0 ; i< data.length; i++) {

            var keys = Object.keys(data[i]);

            for (var j = 0; j < keys.length; j++) {

                if(keys[j] == x_axis){
                    categories.push(data[i][keys[j]]);
                }

                // for(var k=0;k<y_axis.length;k++){

                if(keys[j] == y_axis){

                    var value = data[i][keys[j]];
                    if(typeof data[i][keys[j]] == 'string'){

                        value = parseFloat(data[i][keys[j]]);
                    }
                    if(label!= ''){
                        series[0].data.push({y: value , name : label +" : "+ data[i][label]});
                    }
                    else{
                        series[0].data.push({y: value, name : ''});
                    }
                }
                ///   }
            }
        }

        var obj = {
            categories : categories,
            series : series
        };
        return obj;
    }

    $scope.drawMap= function(){
        $scope.map='';
        $scope.markerLayer=[];
        $scope.geojsonLayer=undefined;

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
                window.setTimeout(function () {

                    $scope.map.fitBounds($scope.markersGroup.getBounds());

                }.bind(this), 2000);


            }
        }
    };


    $scope.fetchData = function(){
      //  console.log("fetch data called")
        CRUDService.fetchData().success(function (res) {
            if(res.status == true){
               // console.log("res")
                $scope.mapData = res.data.data;
                $scope.schema = res.data.data.schema;
                $scope.data = res.data.data.data
                var schema = $scope.schema;
                for(var i=0;i<schema.length;i++){
                    $scope.array.push({
                        id: schema[i].position,
                        label: schema[i].field
                    });
                }

                var seriesData = _.countBy($scope.data, "PREDICTED_LABEL");
                seriesData['positive']=seriesData['positive'] ?seriesData['positive']:0;
                seriesData['negative']=seriesData['negative'] ?seriesData['negative']:0;
                seriesData['neutral']=seriesData['neutral'] ?seriesData['neutral']:0;
                var totalTweets=seriesData['neutral']+seriesData['negative']+seriesData['positive'];
                $scope.negativeObj.value=seriesData['negative'];
                $scope.negativeObj.total=totalTweets;
                $scope.positiveObj.value=seriesData['positive'];
                $scope.positiveObj.total=totalTweets;
                $scope.neutralObj.value=seriesData['neutral'];
                $scope.neutralObj.total=totalTweets;
                $scope.selected_items.push($scope.array[6])
                $scope.selected_items.push($scope.array[7])

                //    $scope.graphArray[0].y_coordinate = [$scope.array[6].label,$scope.array[7].label];
            }
        });
    };
    $scope.fetchData();
    $interval(function(){
        $scope.fetchData();
    }, 40000);
    $scope.$watchCollection(function(){
        return $scope.data
    }, function(obj) {

        // $scope.drawAreaGraph();
        $scope.drawBarGraph();
        $scope.drawPieChart();
        $scope.drawHeatMap();
        /* $scope.drawMap();
         $scope.map._onResize();*/
    });
    $scope.$watchCollection(function(){return $scope.graphArray[0].y_coordinate;}, function(obj) {$scope.drawLineGraph();});



}]);


