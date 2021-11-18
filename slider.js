$(function () {
    $("#start").val(1600);
    $("#end").val(1800);    
    $("#slider-range").slider({
        range: true,
        min: 1600,
        max: 1800,
        values: [1600, 1800],
        slide: function (event, ui) {
            var value1 = ui.values[0];
            var value2 = ui.values[1];
            $("#start").val(value1);
            $("#end").val(value2);
            custom_search()    
        }
    });
});