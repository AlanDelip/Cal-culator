import $ from 'jquery';

$(() => {
    $('#start-btn').click(e => {
        let name = $('.name-input').val();
        $.ajax({
            type: "POST",
            url: "https://kao7g8cibi.execute-api.us-east-1.amazonaws.com/alpha/user-info",
            data: JSON.stringify({
                username: name
            }),
            contentType: 'application/json'
        }).done(res => {
            localStorage.setItem("username", name);
            location.href = "/recognition/index.html";
        });
    });
});