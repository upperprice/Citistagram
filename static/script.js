<!--================1.onclick 하트 좋아요수 증가==================-->
var counter1 = 0
$('#like-heart1').click(function () {
    counter1++;
    $('#counter-click1').text(counter1);
});

var counter2 = 0
$('#like-heart2').click(function () {
    counter2++;
    $('#counter-click2').text(counter2);
});

var counter3 = 0
$('#like-heart3').click(function () {
    counter3++;
    $('#counter-click3').text(counter3);
});


<!--================2. onclick 북마크 색깔 바꾸기==================-->

var bookmark1 = document.getElementById("bookmark1");
bookmark1.addEventListener("click", function () {
    this.children[0].style.color = "#88F3FFFF";
    this.querySelector('.fas').style.fontSize = '3rem';
    this.getElementsByTagName('I')[0].classList.toggle('fa-spin');
    this.firstElementChild.style.transition = 'color 1.5s ease 1.25s, font-size 0.75s ease-out';
}, false);
var bookmark2 = document.getElementById("bookmark2");
bookmark2.addEventListener("click", function () {
    this.children[0].style.color = "#88F3FFFF";
    this.querySelector('.fas').style.fontSize = '3rem';
    this.getElementsByTagName('I')[0].classList.toggle('fa-spin');
    this.firstElementChild.style.transition = 'color 1.5s ease 1.25s, font-size 0.75s ease-out';
}, false);
var bookmark3 = document.getElementById("bookmark3");
bookmark3.addEventListener("click", function () {
    this.children[0].style.color = "#88F3FFFF";
    this.querySelector('.fas').style.fontSize = '3rem';
    this.getElementsByTagName('I')[0].classList.toggle('fa-spin');
    this.firstElementChild.style.transition = 'color 1.5s ease 1.25s, font-size 0.75s ease-out';
}, false);

<!--================3.댓글 보기 토글====================-->


$(function () {
    $('#comment_box2').click(function () {
        $('#comment-lists2').slideToggle();
    })

});

$(function () {
    $('#comment_box3').click(function () {
        $('#comment-lists3').slideToggle();
    })

});
<!--================4.댓글 남기기====================-->
$(document).ready(function () {
    show_comment()
});

function show_comment() {
    $.ajax({
        type: "GET",
        url: "/insta_comment",
        data: {},
        success: function (response) {

            let rows = response.comments;

            for (let i = 0; i < rows.length; i++) {
                let comment = rows[i]['comment']
                let temp_html = `<p>${comment}</p>`
                $('#comment-lists').append(temp_html);
            }
            let rows_length = rows.length;
             $("#comment_box").text('댓글 ' + rows_length + '개 모두 보기');

            if (rows_length > 3) {
                $('#comment-lists').hide();
                $('#comment_box').show();
            }
        }
    });
}

function save_comment() {
    let comment = $('#uploading_comment1').val()
    $.ajax({
        type: 'POST',
        url: '/insta_comment',
        data: {comment_give: comment},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    })
}

<!--================4.2 댓글기능 2번째 코멘트====================-->
$(document).ready(function () {
    show_comment2()
});

function show_comment2() {
    $.ajax({
        type: "GET",
        url: "/insta_comment2",
        data: {},
        success: function (response) {
            let rows = response['comments']

            for (let i = 0; i < rows.length; i++) {
                let comment = rows[i]['comment']

                let temp_html = `<p>${comment}</p>`
                $('#comment-lists2').append(temp_html)
                $('#comment-number2').text(rows.length)


            }
        }
    });
}

function save_comment2() {
    let comment = $('#uploading_comment2').val()
    $.ajax({
        type: 'POST',
        url: '/insta_comment2',
        data: {comment_give: comment},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    })
}

<!--================4.3 3번째 댓글 만들기====================-->

$(document).ready(function () {
    show_comment3()
});

function show_comment3() {
    $.ajax({
        type: "GET",
        url: "/insta_comment3",
        data: {},
        success: function (response) {
            let rows = response['comments']

            for (let i = 0; i < rows.length; i++) {
                let comment = rows[i]['comment']

                let temp_html = `<p>${comment}</p>`
                $('#comment-lists3').append(temp_html)
                $('#comment-number3').text(rows.length)


            }
        }
    });
}

function save_comment3() {
    let comment = $('#uploading_comment3').val()
    $.ajax({
        type: 'POST',
        url: '/insta_comment3',
        data: {comment_give: comment},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    })
}

<!--================4.4 4번째 댓글 만들기====================-->
$(document).ready(function () {
    show_comment4()
});

function show_comment4() {
    $.ajax({
        type: "GET",
        url: "/insta_comment4",
        data: {},
        success: function (response) {
            console.log(response)
            let rows = response['comments']
            for (let i = 0; i < rows.length; i++) {
                let comment = rows[i]['comment']
                console.log(comment)
                let temp_html = `<p>${comment}</p>`
                $('#sli').append(temp_html)
            }

        }
    });
}

function save_comment4() {
    let comment = $('#uploading_comment4').val()
    $.ajax({
        type: 'POST',
        url: '/insta_comment4',
        data: {comment_give: comment},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    })
}

<!--================4.5 게시글 더보기 생성====================-->
 $(document).ready(function () {
            desc_hide_show();
        });


        function count_text_length() {
            let text_legnth = $('#shown_desc').text().length;
            return text_legnth
        }

        let desc_text = $('#shown_desc').text();

        function desc_hide_show() {
            $('#hidden_desc').hide();
            let limit_length = 10
            let text_legnth = $('#shown_desc').text().length;
            if (text_legnth > limit_length) {
                let cut_text = $('#shown_desc').text().substring(0, limit_length);
                $('#shown_desc').text(cut_text + '...');

                $('#desc_read_more_button').show();
            } else {
                $('#desc_read_more_button').hide();
            }
        };

        function desc_read_more() {
            $('#shown_desc').text().substring(0, desc_text);
            $('#desc_read_more_button').hide();
            $('#hidden_desc').show();
            $('#shown_desc').hide();
        }