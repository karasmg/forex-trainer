/**
 * Created by Макс on 02.04.2016.
 */



function drawCandle (id, color, left, candleHeight, bodyHeight, candleTop, bodyTop){
    $('.container').append('<div id="'+id+'" class="candle"></div>');
    $('#'+id).css('top', candleTop);
    $('#'+id).css('height', candleHeight);
    $('#'+id).css('left', left);
    $('#'+id).append('<div class="candle-body"></div>');
    $('#'+id+' '+'.candle-body').css('top', bodyTop);
    $('#'+id+' '+'.candle-body').css('height', bodyHeight);
    $('#'+id+' '+'.candle-body').css('background', color);
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                // Render thumbnail.
                var span = document.createElement('span');
                span.innerHTML = ['<img class="thumb" src="', e.target.result,
                    '" title="', escape(theFile.name), '"/>'].join('');
                document.getElementById('list').insertBefore(span, null);
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}
$( document ).ready(function() {
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
});

