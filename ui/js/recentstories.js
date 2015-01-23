$(function() {
    var tyeeAPI = "http://api.thetyee.ca/v1/latest/4",
        recentStoryHead = '<h3 class="recent-stories">Recent Stories by The Tyee</h3>',
        tyeeStories = [recentStoryHead];

    $.ajax({
        type: "GET",
        url: tyeeAPI,
        async: true,
        dataType: "jsonp",
        success: function(data) {
            addStories(data.hits.hits); 
        }
    });


    function addStories(data) {
        $.each(data, function(index, story) {
            var article = story._source,
                url = '<a href="' + article.uri + '">',
                title = '<h5 class="story-title">' + article.title + '</h5>',
                list;

            list = url + title + '</a>';
            tyeeStories.push(list);


        });

        $('.recent-stories').html(tyeeStories.join(''));

    }
});
