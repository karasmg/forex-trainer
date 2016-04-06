/**
 * Created by Макс on 02.04.2016.
 */



function addCandle(time, open, close, high, low) {
    var chart_min = 1.5;
    var chart_max = 1.9;
    var chart_diff = chart_max - chart_min;
    var chart_height = 1000;
    var color='red';
    var candleHeight,bodyHeight,candleTop, bodyTop;
    candleHeight = (high-low)*chart_height/chart_diff;
    bodyHeight = (Math.abs(open-close))*chart_height/chart_diff;
    candleTop = (high-chart_min)*chart_height/chart_diff ;
    bodyTop = (open-chart_min)*chart_height/chart_diff;
    if(open<close){
        bodyTop = (close-chart_min)*chart_height/chart_diff;
        color = 'green';
    }
    var start = 0;
    left = start+(time*10);
    drawCandle ('m'+time, color, left+'px', candleHeight+'px', bodyHeight+'px', candleTop+'px', bodyTop+'px');
}


function drawCandle (id, color, left, candleHeight, bodyHeight, candleTop, bodyTop){
    $('.chart').append('<div id="'+id+'" class="candle"></div>');
    $('#'+id).css('top', candleTop);
    $('#'+id).css('height', candleHeight);
    $('#'+id).css('left', left);
    $('#'+id).append('<div class="candle-body"></div>');
    $('#'+id+' '+'.candle-body').css('top', bodyTop);
    $('#'+id+' '+'.candle-body').css('height', bodyHeight);
    $('#'+id+' '+'.candle-body').css('background', color);
}

data = [];

function loadToData(csv){
    var lines=csv.split("\r\n");

    var result = [];
    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++){

        var obj = {};
        var currentline=lines[i].split(";");

        for(var j=0;j<currentline.length;j++){
            var val = currentline[j];
            if(headers[j].indexOf('Time') < 0){
                //console.log('j = '+j+' headers = '+headers[j]+'currentline = '+currentline[j].replace(/,/ , '.'));
                val = currentline[j].replace(/,/ , '.');
            }
            obj[headers[j]] = val;
        }

        result.push(obj);
    }

    return result; //JavaScript object
    //return JSON.stringify(result); //JSON
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    var file = files[0];

    var reader = new FileReader();
    $('#read-history-data').removeClass('disabled');
    $('#read-history-data').addClass('btn-primary');
    $('#read-history-data').click(function(){
        reader.onloadstart =  function(){
            $('.progress').removeClass('hidden');
        };
        reader.onprogress = function(event) {
            if (event.lengthComputable) {
                var prcnt = ((event.loaded/event.total)*100).toFixed(0)+'%';
                $('#fileload .progress-bar').css('width', prcnt);
                $('#fileload .progress-bar').text(prcnt+' Загружено');
            }
        };

        reader.onloadend = function(event) {
            var error = event.target.error;
            if (error != null) {
                console.error("File could not be read! Code " + error.code);
            } else {
                $('#fileload .progress-bar').css('width', '100%' );
                $('#fileload .progress-bar').text('100% Загружено');
                $('#fileload .ok-btn').removeClass('disabled');
                $('#fileload .ok-btn').addClass('btn-primary');
                $('#read-history-data').removeClass('btn-primary');
                $('#read-history-data').addClass('btn-default');
                $('#read-history-data').addClass('disabled');
            }
        };
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                $('#fileload .ok-btn').click(function(){
                    data = loadToData(e.target.result);
                    $('#fileload').modal('toggle');
                });
            };
        })(file);

        // Read in the image file as a data URL.
        reader.readAsText(file);
    });


}
$( document ).ready(function() {
    document.getElementById('files').addEventListener('change', handleFileSelect, false);

    $('#fileload').on('show.bs.modal', function (e) {
        $('.progress').addClass('hidden');
        $('#fileload .progress-bar').css('width', '1%' );
        $('#fileload .progress-bar').text('1% Загружено');
        $('#files').val(null);
    })

});

