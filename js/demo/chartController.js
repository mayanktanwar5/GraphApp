myApp.controller('chartController',['$scope','$http',function($scope,$http){

console.log("Hello from chart Controller");

console.log(d3);
var settings={},
	allChart =[],
 cpuUsage=[], 
 cpuUsageLine=[], 
 memoryUsage =[],
 memoryUsageLine=[],
 memoryAvailable =[],
 memoryAvailableLine =[],
 networkThroughput =[],
 networkPacket =[]
 errors =[];
 
 // Chart1 variables

     $scope.chart1Color ="#C61C6F";
 	 $scope.chart1xLabel = "Time";
 	 $scope.chart1yLabel = "Memory Used";
 	 $scope.chart1Title  = "Memory Usage";
 	 $scope.chartType    ="Bar";

 	 var chart1 ={};
 	 chart1.Color=$scope.chart1Color;
 	 chart1.Id="chart1";
 	 chart1.xLabel=$scope.chart1xLabel;	
 	 chart1.yLabel=$scope.chart1yLabel;
 	 chart1.Title=$scope.chart1Title;
 	 chart1.chartType =$scope.chartType;
 	 chart1.data=memoryUsage;
 	 chart1.dataLine=memoryUsageLine;
 	 console.log("CHART 1",chart1);

 	 allChart.push(chart1);

// Chart2 variables 	 

     $scope.chart2Color ="#61a7c4";
 	 $scope.chart2xLabel = "Time";
 	 $scope.chart2yLabel = "Memory Used";
 	 $scope.chart2Title  = "Memory Available";
 	 $scope.chartType    ="Bar";

 	 var chart2 ={};
 	 chart2.Color=$scope.chart2Color;
 	 chart2.Id="chart2";
 	 chart2.xLabel=$scope.chart2xLabel;	
 	 chart2.yLabel=$scope.chart2yLabel;
 	 chart2.Title=$scope.chart2Title;
 	 chart2.chartType =$scope.chartType;
 	 chart2.data=memoryAvailable;
 	 chart2.dataLine=memoryAvailableLine;
 	 

 	 allChart.push(chart2);

// Chart3 variables 	 

     $scope.chart3Color ="#a4b761";
 	 $scope.chart3xLabel = "Time";
 	 $scope.chart3yLabel = "Cpu Used";
 	 $scope.chart3Title  = "Cpu Stats";
 	 $scope.chartType    ="Bar";

 	 var chart3 ={};
 	 chart3.Color=$scope.chart3Color;
 	 chart3.Id="chart3";
 	 chart3.xLabel=$scope.chart3xLabel;	
 	 chart3.yLabel=$scope.chart3yLabel;
 	 chart3.Title=$scope.chart3Title;
 	 chart3.chartType =$scope.chartType;
 	 chart3.data=cpuUsage;
 	 chart3.dataLine=cpuUsageLine;
 	 

 	 allChart.push(chart3);


 	 $scope.allCharts=allChart;
 	 console.log("allCharts===>",$scope.allCharts);

var graphData=[],
        counter = 0,
        limit = 10;


function DataFetcher(serverID, delay) {
        var self = this;

        self.delay = delay;
        self.serverID = serverID;
        self.timer = null;
        self.requestObj = null;

        function getNext() {
            var startTime = new Date(),
                endTime = new Date(startTime.getTime() + 1000),
                queryParam = ["from=", startTime.getTime(), "&to=", endTime.getTime()].join("");

            self.requestObj = $.ajax({
                    url: ["/server_stat/", self.serverID, "?" + queryParam].join("")
                }).done(function(response) {
                    $(document).trigger("stateFetchingSuccess", {
                        from: startTime,
                        to: endTime,
                        result: response
                    });
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    $(document).trigger("stateFetchingFailure", {
                        from: startTime,
                        to: endTime,
                        error: textStatus
                    });
                }).always(function() {
                    self.timer = setTimeout(getNext, self.delay);
                });
        }

        self.start = function() {
            getNext();
            // settings= setup();
            //lineChart();
            for( c in allChart)
            {
            	console.log("All the items in the chart");
            	console.log(allChart);	
            	console.log(c);
            	console.log(allChart[c]);
            	createGraph(allChart[c]);

            }

            // createGraph("chart1");
            // createGraph("chart2");
        };

        self.setDelay = function(newDelay) {
            this.delay = newDelay;
        };

        self.setServerID = function(newServerID) {
            this.serverID = newServerID;
        };
    }

function addNewEntry(contentHTML) {
        //var newEntry = $("<li/>").text(JSON.stringify(contentHTML));

        graphData.push({});
        console.log(contentHTML.memory_usage);
        console.log(Number(contentHTML.memory_usage));
        var time =new Date(contentHTML.timestamp);
        console.log(time.getHours());
        cpuUsage.push(Number(contentHTML.cpu_usage));
        cpuUsageLine.push({"time":time.getSeconds(),"value":Number(contentHTML.cpu_usage)});
        memoryUsage.push(Number(contentHTML.memory_usage));
        memoryUsageLine.push({"time":time.getSeconds(),"value":Number(contentHTML.memory_usage)});
        memoryAvailable.push(Number(contentHTML.memory_available));
        memoryAvailableLine.push({"time":time.getSeconds(),"value":Number(contentHTML.memory_available)});
        //lineChart();
        if (++counter > limit) {
           // $responseList.find("li").first().remove();
            memoryUsage.shift();
            memoryUsageLine.shift();
            memoryAvailable.shift();
            memoryAvailableLine.shift();
            cpuUsage.shift();
            cpuUsageLine.shift();
        }
        console.log(memoryUsage);
        console.log(memoryUsageLine);

        for(c in allChart)
        {
        	createGraph(allChart[c]);
        }
        // createGraph("chart1");
        // createGraph("chart2");
        //$responseList.append(newEntry);
    }    



    $(document).on({
        "stateFetchingSuccess": function(event, data) {
            
            data.result.data.forEach(function(dataEntry) {
                console.log("Prinitng the data =======>>>>>>>",dataEntry.cpu_usage);
                addNewEntry(dataEntry);
            });
        },
        "stateFetchingFailure": function(event, data) {
            console.log("Prinitng the ERROR    data =======>>>>>>>",data);
            //addNewEntry(JSON.stringify(data.error));
        }
    });

    // $scope.$on('start', function(ngRepeatFinishedEvent) {
    //     console.log($("p"));
    //     console.log("done");
    //     var df = new DataFetcher("server1", 1000);
    // df.start();
    // });
    



function createGraph( chart)
    {   
        if(chart.chartType=="Bar")
        {
        	barChart(chart);
        }
        else if(chart.chartType=="Line")
        {
        	lineChart(chart);
        }	
    }

function barChart(chart)
{

	    console.log(chart.Id);
        var targetId ="#"+chart.Id;
         var widthAv = document.getElementById(chart.Id).clientWidth;
        //var widthAv = 525;
        console.log(widthAv);
        var margin = {top: 20, right: 20, bottom: 50, left: 60},
        width = widthAv - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

        var yScale = d3.scaleLinear()
                    .domain([0,d3.max(chart.data)])
                    .range([height,0]);
        var xScale = d3.scaleBand()
                    .domain(chart.data.map(function(d){return d}))
                    .range([0,width])
                    .padding(0.1);   
        
       d3.select(targetId).selectAll("svg").remove();
       var svg = d3.select(targetId).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

        svg.selectAll('rect').data(chart.data)
        .enter()
        .append('rect')
        .style('fill',chart.Color)
        //.attr('width',20)
        .attr('width',xScale.bandwidth())
        .attr('height',function(d){return yScale(d);})
        .attr('x',function(d,i){
             return xScale(d); })
            //return i*(25); })
        .attr('y',function(d){
            return height-yScale(d);
        })

      // add the x Axis
      svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    // add the y Axis
       svg.append("g")
      .call(d3.axisLeft(yScale));

      // text label for the x axis
     svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text(chart.xLabel)


      // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(chart.yLabel);
}



$scope.configChart = function(chart){
console.log("changing the chart");
console.log(chart);
$scope.chart1Title=chart.Title;
$scope.chart1Color=chart.color;
if(chart.Id=="chart1")
{
	chart1=chart;
}
if(chart.Id=="chart2")
{
	chart2=chart;
}

}

function lineChart(chart)
{


var newData =chart.dataLine;

// for(d in chart.data)
// {
// 	newData.push({"time":Math.ceil(chart.data[d]/100),"value":chart.data[d]});
	
// }
	console.log("New Data",newData);
	// set the dimensions and margins of the graph
   // var margin = {top: 20, right: 20, bottom: 30, left: 50},
   //  width = 960 - margin.left - margin.right,
   //  height = 500 - margin.top - margin.bottom;

     console.log(chart.Id);
        var targetId ="#"+chart.Id;
         var widthAv = document.getElementById(chart.Id).clientWidth;
        //var widthAv = 525;
        console.log(widthAv);
        var margin = {top: 20, right: 20, bottom: 50, left: 60},
        width = widthAv - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;


// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.value); });


d3.select(targetId).selectAll("svg").remove();
var svg = d3.select(targetId).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data
  x.domain(d3.extent(newData, function(d) { return d.time; }));
  y.domain([0, d3.max(newData, function(d) { return d.value; })]);

  // Add the valueline path.
  var path = svg.append("path")
      .data([newData])
      .style("stroke",chart.Color)
      .attr("class", "line")
      .attr("d", valueline);

  // Add the X Axis
  var axis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));


// text label for the x axis
     svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text(chart.xLabel)


      // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(chart.yLabel)

	//setInterval(function(){tick()},1000)	
		 
    function tick() 
	{ 
        // push a new data point onto the back
        // data.push(next());

        // update domain
        x.domain(d3.extent(cpuUsage, function(d) { return d.time; }));
	
        // redraw path, shift path left
        path
            .attr("d", valueline)
            .attr("transform", null)
            .transition()
            .duration(500)
            .ease("linear")
            .attr("transform", "translate(" +  x(- 1) + ")")
	
        // shift axis left
        axis
            .transition()
            .duration(500)
            .ease("linear")
            .call(d3.axisBottom(x));
	 
        // pop the old data point off the front
        // data.shift();	 
    } 
}

$scope.toggleView = function(chart)
{
	console.log( "IN the Toggle View ",chart);

	if(chart.chartType=="Bar"){

		if(chart.Id=="chart1")
		{
			chart1.chartType="Line";
		} else if(chart.Id=="chart2")
		{
			chart2.chartType="Line";
		}
		else if(chart.Id=="chart3")
		{
			chart3.chartType="Line";
		}
	}
	else if(chart.chartType=="Line"){

		if(chart.Id=="chart1")
		{
			chart1.chartType="Bar";
		} else if(chart.Id=="chart2")
		{
			chart2.chartType="Bar";
		}
		else if(chart.Id=="chart3")
		{
			chart3.chartType="Bar";
		}
	}
}


$scope.getServer = function(serverId)
{
	$scope.serverSet= true;
	$scope.currentServer=serverId;
	var df = new DataFetcher(serverId, 1000);
	df.start();
	$scope.$on('start', function(ngRepeatFinishedEvent) {
        console.log($("p"));
        console.log("done");         

    });

}

$scope.submit = function(user)
{
	console.log("submitted");
	console.log(user);
	$http.post('/server_stat',user).success(function(res){

		console.log(res);

	}).error(function(err){

	})

}


}]);