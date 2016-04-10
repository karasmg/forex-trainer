/**
 * Created by Макс on 02.04.2016.
 */


var chart= {

    sourceData: [],
    timeFrameData: [],
    Params: {
        maxPrice: 0,
        minPrice: Infinity,
        width:  '0px',
        height: '1000'
    },
    priceScale: [],
    timeFrames: [
        {'id':'1','option':'1мин'},
        {'id':'5','option':'5мин'},
        {'id':'15','option':'15мин'},
        {'id':'30','option':'30мин'},
        {'id':'60','option':'1час'},
        {'id':'240','option':'4часа'},
        {'id':'3600','option':'1день'},
        {'id':'25200','option':'1нед'},
    ],

    setTimeFrame: function(period) {//5мин 10мин 15 30 60 240
        this.timeFrameData = [];
        if(period == 1) {
            this.timeFrameData = this.sourceData;
        }
        var startData = this.sourceData[0]["Time (UTC)"];
        var minutes = startData.getMinutes();
        var year = startData.getFullYear();
        var month = startData.getMonth();
        var date = startData.getDate();
        var hours = startData.getHours();
        var firstRealMinute= Math.ceil(minutes/period)*period;
        var realStart = new Date(year, month, date, hours, firstRealMinute);
        var realEnd = new Date(year, month, date, hours, firstRealMinute+period);
        var candleOpen = 0;
        var candleHigh = 0;
        var candleLow = Infinity;
        var candleVolume = 0;
        var trigger = 0;
        for(i=0; i<this.sourceData.length; i++){
            if(this.sourceData[i]["Time (UTC)"]>=realStart && this.sourceData[i]["Time (UTC)"]<realEnd) {
                //console.log(candleVolume);
                candleVolume = Number(this.sourceData[i].Volume)+candleVolume;
                candleOpen = Number(this.sourceData[i].Open);
                trigger = 1;


                if(Number(this.sourceData[i].High)>candleHigh){
                    candleHigh = Number(this.sourceData[i].High);
                }
                if(Number(this.sourceData[i].Low)<candleLow){
                    candleLow = Number(this.sourceData[i].Low);
                }
            } else {
                if(candleOpen>0 && candleHigh && candleLow>0 && Number(this.sourceData[i].Close)>0) {
                    this.timeFrameData.push({
                        'Time (UTC)': realStart,
                        'Open': candleOpen,
                        'Close': Number(this.sourceData[i].Close),
                        'High': candleHigh,
                        'Low': candleLow,
                        'Volume': candleVolume
                    });
                }
                minutes = realStart.getMinutes();
                year = realStart.getFullYear();
                month = realStart.getMonth();
                date = realStart.getDate();
                hours = realStart.getHours();
                realStart = realEnd;
                realEnd = new Date(year, month, date, hours, minutes + period);
                candleHigh = 0;
                candleLow = Infinity;
                candleVolume = 0;
                candleOpen = 0;
                trigger = 0;
            }
        }
    },

    calculateRightRuler: function () {
        var scalePointHeight = 20;
        var countScalePoints = Math.floor(this.Params.height/scalePointHeight);
        var koef = (this.Params.maxPrice-this.Params.minPrice)/countScalePoints;
        console.log(koef);
        for(i=0; i<countScalePoints; i++) {
            this.priceScale[i] = (Number(this.Params.minPrice)+Number((i+1)*koef)).toFixed(4);
        }
    },

    addCandle:  function (time, open, close, high, low) {
        var chart_min = this.Params.minPrice;
        var chart_max = this.Params.maxPrice;
        var chart_diff = chart_max - chart_min;
        var chart_height = this.Params.height;
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
        for (var i = 0; i < this.sourceData.length; i++) {
            if (this.sourceData[i].High > maxPrice) {
                maxPrice = this.sourceData[i].High;
            }
            if (this.sourceData[i].Low < minPrice) {
                minPrice = this.sourceData[i].Low;
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
        this.calculateRightRuler();
    }
};

var forexTraining = angular
    .module("forexTraining", [])
    .controller("forexTrainingCtrl", forexTrainingCtrl);



function forexTrainingCtrl ($scope) {
    $(document).ready(function () {
        document.getElementById('files').addEventListener('change', handleFileSelect, false);

        $('#fileload').on('show.bs.modal', function (e) {
            $('.progress').addClass('hidden');
            $('#fileload .progress-bar').css('width', '1%');
            $('#fileload .progress-bar').text('1% Загружено');
            $('#files').val(null);
        })
        chart.init();
    });
    $( window ).resize(function() {
        $scope.message = $('.chart').width();
        $scope.$apply();
    });
    $scope.chartCSS = {'height':chart.Params.height+'px'};
    $scope.message = $('.chart').width();
    $scope.priceScale = chart.priceScale;
    $scope.timeFrames = chart.timeFrames;
    $scope.foo = function(ev){
        //console.log(ev);
        var timeFrameText = ev.currentTarget.firstChild.textContent;
        var timeFrame = Number(ev.currentTarget.firstElementChild.innerText);
        chart.setTimeFrame(timeFrame);
        $('#timeframe_btn').text(timeFrameText);
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
                    val = Number(currentline[j].replace(/,/, '.'));
                } else {
                    val = new Date(currentline[j].replace(/ /, 'T'));
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
                        $('#fileload').modal('hide');
                        chart.sourceData = loadToData(e.target.result);
                        chart.init();
                        $scope.$apply();
                        $('#timeframe_btn').removeClass('disabled');
                    });
                };
            })(file);

            // Read in the image file as a data URL.
            reader.readAsText(file);
        });
    }
}

