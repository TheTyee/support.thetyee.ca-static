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
    for (i=x.length-1;i>=0;i--)
      z += x.charAt(i);
    // add seperators. but undo the trailing one, if there
    z = z.replace(/(\d{3})/g, "$1" + sep);
    if (z.slice(-sep.length) == sep)
      z = z.slice(0, -sep.length);
    x = "";
    // reverse again to get back the number
    for (i=z.length-1;i>=0;i--)
      x += z.charAt(i);
    // add the fraction back in, if it was there
    if (typeof(y) != "undefined" && y.length > 0)
      x += decpoint + y;
  }
  return x;
}

$(document).ready(function(){
    $.getJSON("https://widgets.thetyee.ca/progress.json?cb=?&campaign=national&date_end=2013-11-19&goal=100000&date_start=2013-10-25", function(data){
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
                $('.amount').text(FormatNumberBy3(Math.floor(this.countNum), ".", ","));
            }
        });

    });
    var progress = setInterval(function(){
        /* query the completion percentage from the server */
        $.getJSON("https://widgets.thetyee.ca/progress.json?cb=?&campaign=national&date_end=2013-11-19&goal=100000&date_start=2013-10-25", function(data){
            var result = data.result;
            $(".percentage").html( result.percentage );
            $(".count").html( result.people );
            $(".amount").text( FormatNumberBy3(result.raised, ".", ","));
            $(".remaining").text( result.remaining );
            $(".progress-bar").css('width',result.percentage+'%');
            $(".progress-bar").attr('aria-valuenow',result.percentage);
            $(".progress-bar").attr('aria-valuemin', 0);
            $(".progress-bar").attr('aria-valuemax',result.goal);
            $(".days").html( result.left_days);
            $(".hours").html( result.left_hours);
            $(".minutes").html( result.left_mins);
            $.each( result.contributors, function(index, c) {
                $('ul.contributor-list li#' + index ).replaceWith('<li id="' + index + '">' + c.name + ', ' + c.city + ', ' + c.state + '</li>'); 
            });
            $('.contributor-list li:first').slideUp( function () { $(this).appendTo($('.contributor-list')).slideDown(); });
            $('ul.priorities li').remove();
            $.each( result.votes, function(index, v) {
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
