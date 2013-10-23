$(document).ready(function(){
    $.getJSON("http://preview.widgets.thetyee.ca/progress.json?cb=?&campaign=national&date_end=2013-11-21&goal=50000&date_start=2013-10-28", function(data){
        var result = data.result;
        $(".goal").text( result.goal_formatted );
        $(".percentage").text( result.percentage );
        $(".count").text( result.people );
        $(".remaining").text( result.remaining );
        $(".progress-bar").css('width',result.percentage+'%');
        $(".progress-bar").attr('aria-valuenow',result.percentage);
        $(".progress-bar").attr('aria-valuemin', 0);
        $(".progress-bar").attr('aria-valuemax',result.goal);
        $(".days").html( result.left_days);
        $(".hours").html( result.left_hours);
        $(".minutes").html( result.left_mins);
        $.each( result.contributors, function(index, c) {
            $('ul.contributor-list').append('<li id="' + index + '">' + c.name + ', ' + c.city + ', ' + c.state + '</li>'); 
        });
        $.each( result.votes, function(index, v) {
            $('ul.priorities').append('<li id="' + index + '"><span class="badge">' + v.count + ' votes</span> ' + v.name + '</li>'); 
        });
        $({countNum: $('span.amount').text()}).animate({countNum: result.raised }, {
            duration: 4000,
            easing:'linear',
            step: function() {
                $('.amount').text(Math.floor(this.countNum));
            }
        });

    });
    var progress = setInterval(function(){
        /* query the completion percentage from the server */
        $.getJSON("http://preview.widgets.thetyee.ca/progress.json?cb=?&campaign=national&date_end=2013-11-21&goal=50000&date_start=2013-10-28", function(data){
            var result = data.result;
            $(".percentage").html( result.percentage );
            $(".count").html( result.people );
            $(".amount").text( result.raised );
            $(".remaining").text( result.remaining );
            $(".progress-bar").css('width',result.percentage+'%');
            $(".progress-bar").attr('aria-valuenow',result.percentage);
            $(".progress-bar").attr('aria-valuemin', 0);
            $(".progress-bar").attr('aria-valuemax',result.goal);
            $(".days").html( result.left_days);
            $(".hours").html( result.left_hours);
            $(".minutes").html( result.left_mins);
            $.each( result.contributors, function(index, c) {
                console.log ( index, c );
                $('ul.contributor-list li#' + index ).replaceWith('<li id="' + index + '">' + c.name + ', ' + c.city + ', ' + c.state + '</li>'); 
            });
            $('.contributor-list li:first').slideUp( function () { $(this).appendTo($('.contributor-list')).slideDown(); });
            $('ul.priorities li').remove();
            $.each( result.votes, function(index, v) {
                console.log( index, v );
                $('ul.priorities').append('<li id="' + index + '"><span class="badge">' + v.count + ' votes</span> ' + v.name + '</li>'); 
            });
            if(result.percentage > 99.99) {
                clearInterval(progress);
                $(".progress-bar").html('<span class="complete-msg">We did it!</span>');
                $('.remaining').text('$0');
            }

        })
    }, 5000);
    });
