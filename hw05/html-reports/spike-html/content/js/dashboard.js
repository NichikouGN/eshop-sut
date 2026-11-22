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

    var data = {"OkPercent": 99.08915476649942, "KoPercent": 0.9108452335005789};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7036881693370243, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7134558227506079, 500, 1500, "GET ITEM"], "isController": false}, {"data": [0.7126625696727169, 500, 1500, "POST Checkout"], "isController": false}, {"data": [0.7837724801338353, 500, 1500, "GET cart"], "isController": false}, {"data": [0.704981092710914, 500, 1500, "POST Login"], "isController": false}, {"data": [0.7809234679469077, 500, 1500, "POST Coupon"], "isController": false}, {"data": [0.7087696335078534, 500, 1500, "GET Profile"], "isController": false}, {"data": [0.7181408301286302, 500, 1500, "GET List"], "isController": false}, {"data": [0.46289438601688637, 500, 1500, "Transaction Controller"], "isController": true}, {"data": [0.7173256452498628, 500, 1500, "ADD Cart"], "isController": false}, {"data": [0.7208561694563769, 500, 1500, "GET My Orders"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 64775, 590, 0.9108452335005789, 755.5469239675773, 0, 19151, 125.0, 2312.9000000000015, 3360.9500000000007, 5905.56000000007, 540.2418682235196, 42046.485547852375, 155.42398613427855], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET ITEM", 7402, 53, 0.716022696568495, 826.5510672791127, 2, 17339, 117.0, 2313.3999999999996, 3464.399999999998, 5807.850000000001, 61.787342025743335, 27.01781071052939, 7.668116329154076], "isController": false}, {"data": ["POST Checkout", 6997, 94, 1.343432899814206, 865.2303844504776, 8, 19144, 189.0, 2325.2, 3470.199999999999, 5579.0199999999995, 58.45886491047781, 17.269069089885623, 23.14228180533624], "isController": false}, {"data": ["GET cart", 7173, 53, 0.7388819183047539, 478.0128258748064, 0, 15331, 95.0, 1158.0, 1235.0, 3224.0, 59.93632861786308, 15501.161092396094, 18.13708395827937], "isController": false}, {"data": ["POST Login", 7669, 53, 0.6910940148650411, 820.1017081757741, 3, 18123, 166.0, 2304.0, 3318.0, 5379.3, 63.9744402549301, 38.73592556057926, 14.642213620741432], "isController": false}, {"data": ["POST Coupon", 7082, 4, 0.05648121999435188, 523.110138378987, 3, 16035, 140.0, 1220.0, 1311.0, 3263.8500000000004, 59.148765576454075, 21.673395779219423, 23.330685927738617], "isController": false}, {"data": ["GET Profile", 6876, 101, 1.4688772542175683, 865.4870564281541, 1, 19151, 129.0, 2361.3, 3538.5999999999985, 6018.479999999967, 57.465692747421734, 24.708025327193408, 17.483132681001052], "isController": false}, {"data": ["GET List", 7541, 63, 0.8354329664500729, 818.9905848030734, 3, 19100, 140.0, 2309.8, 3437.699999999999, 5618.079999999998, 62.945001377261, 27.675479485071325, 8.777691293206347], "isController": false}, {"data": ["Transaction Controller", 6751, 285, 4.221596800474003, 6124.441564212717, 86, 45372, 656.0, 18024.2, 20715.6, 27331.879999999965, 56.26114639065287, 40605.17030571581, 146.94898970208928], "isController": true}, {"data": ["ADD Cart", 7284, 91, 1.2493135639758375, 790.1805326743554, 1, 17340, 64.0, 2275.0, 3346.0, 5750.499999999996, 60.84450570103997, 16.552275521551184, 24.820121290669505], "isController": false}, {"data": ["GET My Orders", 6751, 78, 1.1553843874981484, 809.1867871426447, 4, 17101, 145.0, 2315.0, 3382.199999999999, 5378.5199999999895, 56.50223464622287, 26493.07382924311, 17.68178699249678], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to 127.0.0.1:3000 [/127.0.0.1] failed: Connect timed out", 324, 54.91525423728814, 0.5001929756850637], "isController": false}, {"data": ["400/Bad Request", 3, 0.5084745762711864, 0.004631416441528367], "isController": false}, {"data": ["401/Unauthorized", 226, 38.30508474576271, 0.348900038595137], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 37, 6.271186440677966, 0.057120802778849865], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 64775, 590, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to 127.0.0.1:3000 [/127.0.0.1] failed: Connect timed out", 324, "401/Unauthorized", 226, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 37, "400/Bad Request", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["GET ITEM", 7402, 53, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to 127.0.0.1:3000 [/127.0.0.1] failed: Connect timed out", 48, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 5, "", "", "", "", "", ""], "isController": false}, {"data": ["POST Checkout", 6997, 94, "401/Unauthorized", 43, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to 127.0.0.1:3000 [/127.0.0.1] failed: Connect timed out", 41, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 7, "400/Bad Request", 3, "", ""], "isController": false}, {"data": ["GET cart", 7173, 53, "401/Unauthorized", 47, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to 127.0.0.1:3000 [/127.0.0.1] failed: Connect timed out", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["POST Login", 7669, 53, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to 127.0.0.1:3000 [/127.0.0.1] failed: Connect timed out", 49, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["POST Coupon", 7082, 4, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to 127.0.0.1:3000 [/127.0.0.1] failed: Connect timed out", 3, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["GET Profile", 6876, 101, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to 127.0.0.1:3000 [/127.0.0.1] failed: Connect timed out", 49, "401/Unauthorized", 44, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 8, "", "", "", ""], "isController": false}, {"data": ["GET List", 7541, 63, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to 127.0.0.1:3000 [/127.0.0.1] failed: Connect timed out", 57, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 6, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["ADD Cart", 7284, 91, "401/Unauthorized", 50, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to 127.0.0.1:3000 [/127.0.0.1] failed: Connect timed out", 38, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 3, "", "", "", ""], "isController": false}, {"data": ["GET My Orders", 6751, 78, "401/Unauthorized", 42, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to 127.0.0.1:3000 [/127.0.0.1] failed: Connect timed out", 33, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 3, "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
