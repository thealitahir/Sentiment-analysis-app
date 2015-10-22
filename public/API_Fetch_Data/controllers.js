


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
        {type:'heatmap', x_coordinate:'Sentiments',y_coordinate:'Number of views',title:'Sentiment Analysis Tree Map'},
        {type:'pie', x_coordinate:'NAME',y_coordinate:[],title:'Sentiment Analysis Pie Graph'},
        {type:'map', x_coordinate:'NAME',y_coordinate:[],title:'Map'}
        //{type:'area', x_coordinate:'NAME',y_coordinate:'HIGHEST_TIDE',title:'Highest Tide Height Per Station'},
        //{type:'map', x_coordinate:'',y_coordinate:'',title:'Weather Stations'}
    ]
    $scope.showData= true;

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

        /*$scope.barChartConfig = {

            options: {
                chart: {
                    type: 'column',
                    zoomType: 'xy'
                }
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
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
        /!*  console.log("$scope.schema");
         console.log($scope.data);
         *!/
        var seriesData = _.countBy($scope.data, "PREDICTED_LABEL");
        seriesData['positive']=seriesData['positive'] ?seriesData['positive']:0;
        var graphData =[{showInLegend: false,data:[seriesData['positive'],seriesData['negative'],seriesData['neutral']]}] ;
        //var graphData =[{data:[0,22,4]}] ;
        // console.log(graphData)
        /!*  $scope.barChartConfig.xAxis = {
         title: {
         text: $scope.graphArray[1].x_coordinate
         },
         categories: graphData.categories
         };*!/
        $scope.barChartConfig.series = graphData;*/

        var colors = Highcharts.getOptions().colors;
        var groupByHastTags= _.groupBy($scope.data,"HASHTAGS");
        var seriesData=[
            { name: 'Positive',
              data: []
            },
            {
                name: 'Negative',
                data: []
            },
            {
                name: 'Neutral',
                data: []
            }
        ];
        var randId=0;
        var categories=[];
        for(var key in groupByHastTags) {
            categories.push(key);
        }
        for(var key in groupByHastTags){
            categories.push(key);

            var count=_.countBy(groupByHastTags[key], "PREDICTED_LABEL");
            count['positive']=count['positive'] ?count['positive']:0;
            count['negative']=count['negative'] ?count['negative']:0;
            count['neutral']=count['neutral'] ?count['neutral']:0;
            for(var i=0; i<seriesData.length;i++){
                if(seriesData[i].name=='Positive'){
                    seriesData[i].data.push(count['positive']);
                }
                if(seriesData[i].name=='Negative'){
                    seriesData[i].data.push(count['negative']);
                }
                if(seriesData[i].name=='Neutral'){
                    seriesData[i].data.push(count['neutral']);
                }
            }
            randId++;
        }
        console.log("series Data")
        console.log(seriesData)
        console.log(categories)
        $('#barChart').highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Historic World Population by Region'
            },
            subtitle: {
                text: 'Source: <a href="https://en.wikipedia.org/wiki/World_population">Wikipedia.org</a>'
            },
            xAxis: {
                categories:categories,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: '',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                valueSuffix: ''
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 80,
                floating: true,
                borderWidth: 1,
                backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: seriesData
        });


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
            var colors = Highcharts.getOptions().colors;
            var groupByHastTags= _.groupBy($scope.data,"HASHTAGS");
            console.log("groupByHastTags");
            console.log(groupByHastTags);
            var seriesArray=[];
            var randId=0;
            for(var key in groupByHastTags){
                var count=_.countBy(groupByHastTags[key], "PREDICTED_LABEL");
                seriesArray.push({name:key,color:colors[randId],id:randId.toString()});
                count['positive']=count['positive'] ?count['positive']:0;
                count['negative']=count['negative'] ?count['negative']:0;
                count['neutral']=count['neutral'] ?count['neutral']:0;
                console.log("count")
                console.log(count)
                seriesArray.push({name:"positive",value:count['positive'],parent:randId.toString()});
                seriesArray.push({name:"negative",value:count['negative'],parent:randId.toString()});
                seriesArray.push({name:"neutral",value:count['neutral'],parent:randId.toString()});
                randId++;
            }
            var heatMapConfig = {
                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                }
            };
          //  console.log(seriesArray);
            var treeGraphData =[{
                type: "treemap",
                layoutAlgorithm: 'squarified',
                alternateStartingDirection: true,
                levels: [{
                    level: 1,
                    layoutAlgorithm: 'sliceAndDice',
                    borderWidth: 3,
                    dataLabels: {
                        enabled: true,
                        align: 'left',
                        verticalAlign: 'top',
                        style: {
                            fontSize: '15px',
                            fontWeight: 'bold'
                        }
                    }
                }],
                data:seriesArray

            }];
            heatMapConfig.series = treeGraphData;
            console.log("!!!!!!!!!!")
            console.log(heatMapConfig)
            $('#heatMap').highcharts(heatMapConfig);

    };
    $scope.drawPieChart=function(){
        var colors = Highcharts.getOptions().colors;
        var groupByHastTags= _.groupBy($scope.data,"HASHTAGS");
        var data=[];
        var randId=0;
        var categories=[];
        for(var key in groupByHastTags){
            categories.push(key);
            var count=_.countBy(groupByHastTags[key], "PREDICTED_LABEL");
            count['positive']=count['positive'] ?count['positive']:0;
            count['negative']=count['negative'] ?count['negative']:0;
            count['neutral']=count['neutral'] ?count['neutral']:0;
            var sum=count['positive']+count['negative']+count['neutral'];
            data.push({y:sum,color:colors[randId],drilldown:{name:key+"_labels",categories: ['Positive','Negative','Neutral'],color:colors[randId],data:[count['positive'],count['negative'],count['neutral']]}});
            randId++;
        }

        var colors = Highcharts.getOptions().colors,
            categories = categories,
            browserData = [],
            versionsData = [],
            i,
            j,
            dataLen = data.length,
            drillDataLen,
            brightness;


        // Build the data arrays
        for (i = 0; i < dataLen; i += 1) {

            // add browser data
            browserData.push({
                name: categories[i],
                y: data[i].y,
                color: data[i].color
            });

            // add version data
            drillDataLen = data[i].drilldown.data.length;
            for (j = 0; j < drillDataLen; j += 1) {
                brightness = 0.2 - (j / drillDataLen) / 5;
                versionsData.push({
                    name: data[i].drilldown.categories[j],
                    y: data[i].drilldown.data[j],
                    color: Highcharts.Color(data[i].color).brighten(brightness).get()
                });
            }
        }

        // Create the chart
        $('#pieHighChart').highcharts({
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Sentiment Analysis'
            },
            //subtitle: {
            //    text: 'Source: <a href="http://netmarketshare.com/">netmarketshare.com</a>'
            //},
            yAxis: {
                title: {
                    text: ''
                }
            },
            plotOptions: {
                pie: {
                    shadow: false,
                    center: ['50%', '50%']
                }
            },
            credits: {
                enabled: false
            },
            tooltip: {
                formatter: function(){
                    var point = this.point;
                    console.log(point);
                    return '<b>' + point.name + ': ' + point.y + '';
                }
            },
            series: [{
                name: 'Hash Tags',
                data: browserData,
                size: '60%',
                dataLabels: {
                    formatter: function () {
                        return   this.y>10?this.point.name +":"+ this.y:null;
                    },
                    color: '#ffffff',
                    distance: -30
                }
            }, {
                name: 'Labels',
                data: versionsData,
                size: '80%',
                innerSize: '60%',
                dataLabels: {
                    formatter: function () {
                        // display only if larger than 1
                        return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%' : null;
                    }
                }
            }]
        });
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
    $scope.map=undefined;
    $scope.markerLayer=[];
    $scope.geojsonLayer=undefined;

    $scope.drawMap= function(){


if(!$scope.map){
    $scope.map = L.map('mapDiv', {
        center: [39.73, -104.99],
        zoom: 2,
        zoomControl: false
    });
    L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +
        'Imagery � <a href="http://mapbox.com">Mapbox</a>'

    }).addTo($scope.map);

    //L.control.layers(Tiles).addTo($scope.map);
    L.control.zoom({
        position: 'bottomright'
    }).addTo($scope.map);
    L.control.fullscreen({
        position: 'bottomright',
        title: 'Fullscreen !',
        forceSeparateButton: true,
        forcePseudoFullscreen: true
    }).addTo($scope.map);
}

        console.log("data")
$scope.gisData=[];

        for(var i in $scope.data){
            if($scope.data[i].LOCATION!="null"){
                $scope.gisData.push($scope.data[i]);
            }
        }
        for(var i in $scope.gisData ){
            console.log( $scope.gisData)
            var splited=$scope.gisData[i].LOCATION.split(',');

      var lat=   splited[0].substring((splited[0].indexOf('=')+1))

            var abc=splited[1].substring((splited[1].indexOf('=')+1))
         var lng=abc.split("}")[0]
            var popup='<table>';
            popup=popup+"<tr>"
            if($scope.gisData[i].PREDICTED_LABEL=="positive"){
                popup=popup+"<td>TWEET SENTIMENT:</td><td><font color='green'> "+$scope.gisData[i].PREDICTED_LABEL+'</font></td></tr>';

            }
            else if($scope.gisData[i].PREDICTED_LABEL=="negative"){
                popup=popup+"<td>TWEET SENTIMENT:</td><td><font color='red'> "+$scope.gisData[i].PREDICTED_LABEL+'</font></td></tr>';

            }
            else{
                popup=popup+"<td>TWEET SENTIMENT:</td><td><font color='#1e90ff'> "+$scope.gisData[i].PREDICTED_LABEL+'</font></td></tr>';

            }

            popup=popup+"<tr><td> STATUS:</td><td> "+$scope.gisData[i].STATUS+'</td></tr>';


            var marker=   L.marker(L.latLng(lat,lng)).bindPopup(popup)
             marker.addTo($scope.map)

        }

    /*    if($scope.schema) {

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
        }*/
    };

    $scope.fetchData = function(){

        //  console.log("fetch data called")
        CRUDService.fetchData().success(function (res) {
            if(res.status == true){
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
                $scope.drawHeatMap();
                $scope.drawBarGraph();
                $scope.drawPieChart();
                $scope.drawMap();

                //    $scope.graphArray[0].y_coordinate = [$scope.array[6].label,$scope.array[7].label];
            }
        });
    };
    $scope.fetchData();
    $scope.drawHeatMap();
    $interval(function(){
        $scope.fetchData();
    }, 9000);

   /* $scope.$watchCollection(function(){
        return $scope.data
    }, function(obj) {

        // $scope.drawAreaGraph();
        $scope.drawBarGraph();
        $scope.drawPieChart();
        $scope.drawHeatMap();
        /!* $scope.drawMap();
         $scope.map._onResize();*!/
    });
    $scope.$watchCollection(function(){return $scope.graphArray[0].y_coordinate;}, function(obj) {$scope.drawLineGraph();});

*/

}]);


