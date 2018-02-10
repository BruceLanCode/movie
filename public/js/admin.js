$(function() {
    $('#douban').blur(function() {
        var douban = $(this);
        var val = douban.val();

        if (val) {
            $.ajax({
                url: 'https://api.douban.com/v2/movie/search?q=' + val,
                cache: true,
                crossDomain: true,
                dataType: 'jsonp',
                type: 'get',
                success: function(data) {
                    var subject = data.subjects[0];
                    if (subject.id) {
                        $.ajax({
                            url: 'https://api.douban.com/v2/movie/subject/' + subject.id,
                            cache: true,
                            crossDomain: true,
                            dataType: 'jsonp',
                            type: 'get',
                            success: function(info) {
                                $('#inputTitle').val(info.title);
                                $('#inputDirector').val(info.directors[0].name);
                                $('#inputCountry').val(info.countries[0]);
                                $('#inputPoster').val(info.images.large);
                                $('#inputYear').val(info.year);
                                $('#inputSummary').val(info.summary);
                            }
                        })
                    }
                }
            });
        }
    })
})