$(document).ready(function() {
    url =
        App.widgeturi + "/progress.json?monthlyonly=0&multiplier=6&date_end=2016-12-13&goal=65000&date_start=2016-11-17";

    $.getJSON(url, function(data) {
        //console.log( 'once' );
        updateResults(data, 'once');
    });

    var progress = setInterval(function() {
        /* query the completion percentage from the server */
        $.getJSON(url, function(data) {
            //console.log( 'update' );
            updateResults(data, 'update');
        });
    }, 5000);

    function updateResults(data, mode) {
        //console.log( 'updateResults' );
        var result = data.result;
        var left_days = result.left_days >= 1 ? result.left_days : 0;
        var left_hours = result.left_hours >= 1 ? result.left_hours : 0;
        var left_mins = result.left_mins >= 1 ? result.left_mins : 0;
        var monthlyraised = result.raised_monthly;
        //console.log( left_mins );
        //console.log( left_hours );
        //console.log( left_days );

        $(".goal").text(result.goal_formatted);
        $(".onetimetotal").text(FormatNumberBy3(result.raised_onetime));
        $(".percentage").text(result.percentage);
        $(".count").text(result.people);
        $(".remaining").text(result.remaining);
        $(".progress-bar").css('width', result.percentage + '%');
        $(".progress-bar").attr('aria-valuenow', result.percentage);
        $(".progress-bar").attr('aria-valuemin', 0);
        $(".progress-bar").attr('aria-valuemax', result.goal);
        if (left_days > 1) {
            $(".days").html(left_days);
            $("i.days-left").html("days left");
        } else if (left_days == 1) {
            $(".days").html(left_days);
            $("i.days-left").html("day left");
        }
        if (left_days === 0) {
            $(".hours").html('<span class="hour"">' + left_hours + '</span> hours, ');
            $(".minutes").html('<span class="minute">' + left_mins + '</span> minutes remaining.');
        }
        if (mode == 'once') {
            $({
                countNum: $('span.amount').text()
            }).animate({
                countNum: result.raised
            }, {
                duration: 4000,
                easing: 'linear',
                step: function() {
                    $('.amount').text(FormatNumberBy3(Math.floor(this.countNum), ".", ","));
                }
            });
            // Monthly contributors
            //$.each(result.contributors_monthly, function(index, c) {
            //$('ul.contributor-list').append('<li id="' + index + '">' + c.name + ', ' + c.city + ', ' + c.state + '</li>');
            //});
            $.each(result.contributors, function(index, c) {
                var city = c.city;
                var state = c.state;
                var locationStr = '';
                if (city && state) {
                    // Needed for new "In memory/honour" names
                    locationStr = ', ' + city + ', ' + state;
                }
                $('ul.contributor-list').append('<li id="' + index + '">' + c.name + locationStr + '</li>');
            });
            // News priority votes
            //$.each(result.votes, function(index, v) {
            //$('ul.priorities').append('<li id="' + index + '"><span class="badge">' + v.count + ' votes</span> ' + v.name + '</li>');
            //});
            if (result.left_days < 1 && result.left_hours < 1 && result.left_mins < 1) {
                $("#campaign-end").html('<p class="alert alert-warning">This campaign ended on May 30, 2016. But you are welcome to contribute still.</p>');
            } else if (result.left_days === 0) {
                $("#campaign-end").html('<p class="alert alert-warning">Campaign ends tonight at midnight!</p>');
            }
        } else if (mode === 'update') {
            $(".amount").text(FormatNumberBy3(result.raised, ".", ","));
            $('.contributor-list li:first').slideUp(function() {
                $(this).appendTo($('.contributor-list')).slideDown();
            });
            // News priorities
            //$('ul.priorities li').remove();
            //$.each(result.votes, function(index, v) {
            //$('ul.priorities').append('<li id="' + index + '"><span class="badge">' + v.count + ' votes</span> ' + v.name + '</li>');
            //});
            if (result.percentage > 99.99) {
                clearInterval(progress);
                $(".progress-bar").html('<span class="complete-msg">We did it!</span>');
                $('.remaining').text('$0');
            }
        }
    }

    $.getJSON(App.widgeturi + "/builderlist.json?monthlyonly=0&date_start=2016-11-17&cb=?", function(data) {
        var result = data.result;
        var builders = result.builderlist;
        var last = builders.pop();
        var count = result.count;
        $("#builder-count").text(FormatNumberBy3(count, ".", ","));
        $.each(builders, function(index, c) {
            $('#builder-list ul').append('<li id="' + index + '">' + c.first_name + ' ' + c.last_name + '</li>');
        });
        $("#builder-list ul").append('<li class="last"> and ' + last.first_name + ' ' + last.last_name + '</li>');
    });

});

function FormatNumberBy3(num, decpoint, sep) {
    // check for missing parameters and use defaults if so
    if (arguments.length == 2) {
        sep = ",";
    }
    if (arguments.length == 1) {
        sep = ",";
        decpoint = ".";
    }
    // need a string for operations
    num = num.toString();
    // separate the whole number and the fraction if possible
    a = num.split(decpoint);
    x = a[0]; // decimal
    y = a[1]; // fraction
    z = "";


    if (typeof(x) != "undefined") {
        // reverse the digits. regexp works from left to right.
        for (i = x.length - 1; i >= 0; i--)
            z += x.charAt(i);
        // add seperators. but undo the trailing one, if there
        z = z.replace(/(\d{3})/g, "$1" + sep);
        if (z.slice(-sep.length) == sep)
            z = z.slice(0, -sep.length);
        x = "";
        // reverse again to get back the number
        for (i = z.length - 1; i >= 0; i--)
            x += z.charAt(i);
        // add the fraction back in, if it was there
        if (typeof(y) != "undefined" && y.length > 0)
            x += decpoint + y;
    }
    return x;
}
