    <!--================1.onclick 하트 좋아요수 증가==================-->
var counter1=0
$('#like-heart1').click(function(){
    counter1++;
    $('#counter-click1').text(counter1);
});

var counter2=0
$('#like-heart2').click(function(){
    counter2++;
    $('#counter-click2').text(counter2);
});

var counter3=0
    $('#like-heart3').click(function(){
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
 $(function() {
    $('#comment_box1').click(function () {
        $('#comment-lists1').slideToggle();
    })

});
$(function() {
    $('#comment_box2').click(function () {
        $('#comment-lists2').slideToggle();
    })

});

$(function() {
    $('#comment_box3').click(function () {
        $('#comment-lists3').slideToggle();
    })

});
    <!--================4.댓글 남기기====================-->
 $(document).ready(function(){
    show_comment()
});

function show_comment() {
    $.ajax({
        type: "GET",
        url: "/insta_comment",
        data: {},
        success: function (response) {
            let rows = response['comments']

            for (let i = 0; i < rows.length; i++) {
                let comment = rows[i]['comment']

                let temp_html = `<p>${comment}</p>`
                $('#comment-lists1').append(temp_html)
                $('#comment-number1').text(rows.length)


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
 $(document).ready(function(){
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

$(document).ready(function(){
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
$(document).ready(function(){
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

<!--================5.새 게시물 만들기====================-->

$('#nav_bar_add_box').click(function (){
            $('#first_modal').css({
                display: 'flex'
            });
            $(document.body).css({
                overflow:'hidden'
            })
        });
        $('#modal_x_box').click(function (){
            $('.modal_overlay').css({
                display: 'none'
            });
            $(document.body).css({
                overflow:'visible'
            })
        });
        $('#modal_x_box2').click(function (){
            $('.modal_overlay').css({
                display: 'none'
            });
            $(document.body).css({
                overflow:'visible'
            })
        });


        $('.addition_modal_body')
            .on("dragover", dragOver)
            .on("dragleave", dragOver)
            .on("drop", uploadFiles);

        function dragOver(e){
            e.stopPropagation();
            e.preventDefault();

            if (e.type == "dragover") {
                $(e.target).css({
                    "outline-offset": "-20px",
                    "border-radius" : "8px"
                });
            } else {
                $(e.target).css({
                    "background-color": "black",
                    "outline-offset": "-10px"
                });
            }
        }
        function uploadFiles(e){
        e.stopPropagation();
        e.preventDefault();

        e.dataTransfer = e.originalEvent.dataTransfer;
        var files =  e.dataTransfer.files;

        if (files.length > 1) {
            alert('하나만 올려 주세요');
            return;
        }
        //파일이 인식되면 배경 이미지 바뀌게 만듬
        if (files[0].type.match(/image.*/)) {
            $('#first_modal').css({
                display: 'none'
            });
            $('#second_modal').css({
                display: 'flex'
            });
            $('.img_upload_space').css({
                "background-image": "url(" + window.URL.createObjectURL(files[0]) + ")",
                "outline": "none",
                "background-size": "100% 100%"});
        }else{
            alert('이미지가 아닙니다.');
            return;
        }

    }