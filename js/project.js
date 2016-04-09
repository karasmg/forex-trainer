/**
 * Created by Макс on 02.04.2016.
 */

var chart= {

    Data: [],
    Params: {
        maxPrice: 0,
        minPrice: Infinity,
        width:  '0px',
        height: '1000',
    },

    addCandle:  function (time, open, close, high, low) {
        var chart_min = this.Params.minPrice;
        var chart_max = this.Params.maxPrice;
        var chart_diff = chart_max - chart_min;
        var chart_height = 5000;
        var color = 'red';
        var candleHeight, bodyHeight, candleTop, bodyTop;
        candleHeight = (high - low) * chart_height / chart_diff;
        bodyHeight = (Math.abs(open - close)) * chart_height / chart_diff;
        candleTop = (high - chart_min) * chart_height / chart_diff;
        bodyTop = (high - open) * chart_height / chart_diff;
        if (open < close) {
            bodyTop = (high - close) * chart_height / chart_diff;
            color = 'green';
        }
        var start = 0;
        left = start + (time * 10);
        this.drawCandle('m' + time, color, left + 'px', candleHeight + 'px', bodyHeight + 'px', candleTop + 'px', bodyTop + 'px');
    },

    drawCandle: function (id, color, left, candleHeight, bodyHeight, candleTop, bodyTop) {
        $('.chart').append('<div id="' + id + '" class="candle"></div>');
        $('#' + id).css('top', candleTop).css('height', candleHeight).css('left', left);
        $('#' + id).append('<div class="candle-body"></div>');
        $('#' + id + ' ' + '.candle-body').css('top', bodyTop).css('height', bodyHeight).css('background', color);
    },



    setParams: function () {
        var maxPrice = 0, minPrice = Infinity;
        for (var i = 0; i < this.Data.length; i++) {
            if (this.Data[i].High > maxPrice) {
                maxPrice = this.Data[i].High;
            }
            if (this.Data[i].Low < minPrice) {
                minPrice = this.Data[i].Low;
            }
        }
        this.Params.maxPrice = maxPrice;
        this.Params.minPrice = minPrice;
        this.Params.width = function() {
            $('.chart').width();
        }
    },

    init: function(){
        this.setParams();
    }
};

var forexTraining = angular
    .module("forexTraining", [])
    .controller("forexTrainingCtrl", forexTrainingCtrl);

var priceScale = [];

var chartHeight = chart.Params.height;
for(i=0; i<(chartHeight/21).toFixed(0); i++) {
    priceScale[i] = {item:i};
}

function forexTrainingCtrl ($scope) {
    $( window ).resize(function() {
        $scope.message = $('.chart').width();
        $scope.$apply();
    });
    //$scope.topRulerWidth = {'width':($('.chart').width()-45)+'px'};
    $scope.chartCSS = {'height':chart.Params.height+'px'};
    $scope.message = $('.chart').width();
    $scope.priceScale = priceScale;
}


function loadToData(csv) {
    var lines = csv.split("\r\n");

    var result = [];
    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {

        var obj = {};
        var currentline = lines[i].split(";");

        for (var j = 0; j < currentline.length; j++) {
            var val = currentline[j];
            if (headers[j].indexOf('Time') < 0) {
                //console.log('j = '+j+' headers = '+headers[j]+'currentline = '+currentline[j].replace(/,/ , '.'));
                val = currentline[j].replace(/,/, '.');
            } else {
                val = currentline[j].replace(/ /, 'T');
            }
            obj[headers[j]] = val;
        }

        result.push(obj);
    }

    return result; //JavaScript object
    //return JSON.stringify(result); //JSON
}


function handleFileSelect (evt) {
    var files = evt.target.files; // FileList object

    var file = files[0];

    var reader = new FileReader();
    $('#read-history-data').removeClass('disabled');
    $('#read-history-data').addClass('btn-primary');
    $('#read-history-data').click(function () {
        reader.onloadstart = function () {
            $('.progress').removeClass('hidden');
        };
        reader.onprogress = function (event) {
            if (event.lengthComputable) {
                var prcnt = ((event.loaded / event.total) * 100).toFixed(0) + '%';
                $('#fileload .progress-bar').css('width', prcnt);
                $('#fileload .progress-bar').text(prcnt + ' Загружено');
            }
        };

        reader.onloadend = function (event) {
            var error = event.target.error;
            if (error != null) {
                console.error("File could not be read! Code " + error.code);
            } else {
                $('#fileload .progress-bar').css('width', '100%');
                $('#fileload .progress-bar').text('100% Загружено');
                $('#fileload .ok-btn').removeClass('disabled');
                $('#fileload .ok-btn').addClass('btn-primary');
                $('#read-history-data').removeClass('btn-primary');
                $('#read-history-data').addClass('btn-default');
                $('#read-history-data').addClass('disabled');
            }
        };
        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                $('#fileload .ok-btn').click(function () {
                    chart.Data = loadToData(e.target.result);
                    $('#fileload').modal('toggle');
                });
            };
        })(file);

        // Read in the image file as a data URL.
        reader.readAsText(file);
    });
}

$(document).ready(function () {
    document.getElementById('files').addEventListener('change', handleFileSelect, false);

    $('#fileload').on('show.bs.modal', function (e) {
        $('.progress').addClass('hidden');
        $('#fileload .progress-bar').css('width', '1%');
        $('#fileload .progress-bar').text('1% Загружено');
        $('#files').val(null);
    })

});

