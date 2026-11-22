/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6428659614034276, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7188074800735745, 500, 1500, "GET ITEM"], "isController": false}, {"data": [0.6621778950636449, 500, 1500, "POST Checkout"], "isController": false}, {"data": [0.7146000617665226, 500, 1500, "GET cart"], "isController": false}, {"data": [0.6865300587614886, 500, 1500, "POST Login"], "isController": false}, {"data": [0.6683697166744078, 500, 1500, "POST Coupon"], "isController": false}, {"data": [0.7075155763239875, 500, 1500, "GET Profile"], "isController": false}, {"data": [0.7156930126002291, 500, 1500, "GET List"], "isController": false}, {"data": [0.1612739351309105, 500, 1500, "Transaction Controller"], "isController": true}, {"data": [0.7411895967990151, 500, 1500, "ADD Cart"], "isController": false}, {"data": [0.6446268073466198, 500, 1500, "GET My Orders"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 116802, 0, 0.0, 741.1359908220746, 0, 6284, 1574.0, 3653.9000000000015, 5226.0, 6148.0, 370.00947182685877, 55149.696466953144, 107.86294962964048], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET ITEM", 13048, 0, 0.0, 674.274984671983, 0, 6281, 415.0, 1532.2000000000007, 2140.5499999999993, 5306.0, 41.34556885013182, 17.48303839072957, 5.168196106266477], "isController": false}, {"data": ["POST Checkout", 12884, 0, 0.0, 835.8738745731159, 8, 6272, 524.0, 1917.0, 2593.0, 5240.0, 40.82848487153161, 11.448642103899683, 16.30747100825823], "isController": false}, {"data": ["GET cart", 12952, 0, 0.0, 700.5784434836314, 0, 6265, 410.0, 1694.0, 2216.699999999997, 5292.579999999991, 41.036689690133706, 19303.26417918502, 12.463291497687091], "isController": false}, {"data": ["POST Login", 13274, 0, 0.0, 783.9648937773078, 1, 6237, 441.0, 2111.0, 2784.0, 4728.75, 42.049842716988785, 24.92602981368378, 9.69117468868101], "isController": false}, {"data": ["POST Coupon", 12918, 0, 0.0, 746.7385818238137, 0, 6242, 516.0, 1753.0, 2159.0, 3720.619999999999, 40.92896521133008, 14.948665028356885, 16.18772549862176], "isController": false}, {"data": ["GET Profile", 12840, 0, 0.0, 694.9488317757015, 0, 6267, 449.0, 1595.8999999999996, 1990.0, 4990.0, 40.69433923992863, 16.849999841532945, 12.518278184157731], "isController": false}, {"data": ["GET List", 13095, 0, 0.0, 701.6720885834268, 0, 6265, 446.0, 1592.3999999999996, 2209.0, 5221.0, 41.493973154872805, 17.54579138287102, 5.835089974903989], "isController": false}, {"data": ["Transaction Controller", 12795, 0, 0.0, 6405.138257131684, 14, 24114, 4680.0, 16096.999999999998, 17838.399999999998, 19844.0, 40.58966843046938, 54760.82836334435, 106.70643302228862], "isController": true}, {"data": ["ADD Cart", 12996, 0, 0.0, 643.516004924593, 0, 6264, 385.0, 1456.0, 1936.299999999992, 5264.0, 41.181316940237025, 10.697490533303759, 16.93099065609354], "isController": false}, {"data": ["GET My Orders", 12795, 0, 0.0, 890.7810082063305, 0, 6284, 534.0, 2200.3999999999996, 3168.5999999999967, 5111.239999999994, 40.60692999549341, 35801.467041754804, 12.808631238812863], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 116802, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
