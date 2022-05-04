<!--===============로그인 팝업 창===================-->

function toggle_sign_up() {
    $("#sign-up-box").toggleClass("is-hidden")
    $("#div-sign-in-or-up").toggleClass("is-hidden")
    $("#btn-check-dup").toggleClass("is-hidden")
    $("#btn-check-nickname-dup").toggleClass("is-hidden")
    $("#help-id").toggleClass("is-hidden")
    $("#help-password").toggleClass("is-hidden")
    $("#help-password2").toggleClass("is-hidden")
}

<!--===============회원가입 아이디 비밀번호 규칙==================-->

function is_nickname(asValue) {
    var regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
    return regExp.test(asValue);
}

function is_password(asValue) {
    var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(asValue);
}


<!--==============아이디 중복 확인====================-->

function check_dup() {
    let username = $("#input-username").val()
    console.log(username)
    if (username == "") {
        $("#help-id").text("아이디를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-username").focus()
        return;
    }
    if (!is_nickname(username)) {
        $("#help-id").text("아이디의 형식을 확인해주세요. 영문과 숫자, 일부 특수문자(._-) 사용 가능. 2-10자 길이").removeClass("is-safe").addClass("is-danger")
        $("#input-username").focus()
        return;
    }
    $("#help-id").addClass("is-loading")
    $.ajax({
        type: "POST",
        url: "/sign_up/check_dup",
        data: {
            username_give: username
        },
        success: function (response) {

            if (response["exists_id"]) {
                $("#help-id").text("이미 존재하는 아이디입니다.").removeClass("is-safe").addClass("is-danger")
                $("#input-username").focus()
            } else {
                $("#help-id").text("사용할 수 있는 아이디입니다.").removeClass("is-danger").addClass("is-success")
            }
            $("#help-id").removeClass("is-loading")

        }
    });
}


<!--==============닉네임 중복 확인====================-->

function check_nickname_dup() {
    let nickname = $("#input-nickname").val()
    console.log(nickname)
    if (nickname == "") {
        $("#help-id").text("닉네임을 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-nickname").focus()
        return;
    }
    if (!is_nickname(nickname)) {
        $("#help-id").text("닉네임의 형식을 확인해주세요. 영문과 숫자, 일부 특수문자(._-) 사용 가능. 2-10자 길이").removeClass("is-safe").addClass("is-danger")
        $("#input-username").focus()
        return;
    }
    $("#help-id").addClass("is-loading")
    $.ajax({
        type: "POST",
        url: "/sign_up/check_nickname_dup",
        data: {
            nickname_give: nickname
        },
        success: function (response) {

            if (response["exists_nickname"]) {
                $("#help-id").text("이미 존재하는 닉네임입니다.").removeClass("is-safe").addClass("is-danger")
                $("#input-nickname").focus()
            } else {
                $("#help-id").text("사용할 수 있는 닉네임입니다.").removeClass("is-danger").addClass("is-success")
            }
            $("#help-id").removeClass("is-loading")

        }
    });
}


<!--================회원가입==================-->

function sign_up() {
    let username = $("#input-username").val()
    let password = $("#input-password").val()
    let nickname = $("#input-password").val()
    let password2 = $("#input-password2").val()
    console.log(username, nickname, password, password2)


    if ($("#help-id").hasClass("is-danger")) {
        alert("아이디를 다시 확인해주세요.")
        return;
    } else if (!$("#help-id").hasClass("is-success")) {
        alert("아이디 중복확인을 해주세요.")
        return;
    }

    if (password == "") {
        $("#help-password").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-password").focus()
        return;
    } else if (!is_password(password)) {
        $("#help-password").text("비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자").removeClass("is-safe").addClass("is-danger")
        $("#input-password").focus()
        return
    } else {
        $("#help-password").text("사용할 수 있는 비밀번호입니다.").removeClass("is-danger").addClass("is-success")
    }
    if (password2 == "") {
        $("#help-password2").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-password2").focus()
        return;
    } else if (password2 != password) {
        $("#help-password2").text("비밀번호가 일치하지 않습니다.").removeClass("is-safe").addClass("is-danger")
        $("#input-password2").focus()
        return;
    } else {
        $("#help-password2").text("비밀번호가 일치합니다.").removeClass("is-danger").addClass("is-success")
    }
    $.ajax({
        type: "POST",
        url: "/sign_up/save",
        data: {
            username_give: username,
            password_give: password,
            nickname_give: nickname
        },
        success: function (response) {
            alert("회원가입을 축하드립니다!")
            window.location.replace("/login")
        }
    });

}
function logout() {
    $.removeCookie('mytoken');
    alert('로그아웃!')
    window.location.href = '/login'
}

<!--================로그인==================-->

function sign_in() {
    let username = $("#input-username").val()
    let password = $("#input-password").val()

    if (username == "") {
        $("#help-id-login").text("아이디를 입력해주세요.")
        $("#input-username").focus()
        return;
    } else {
        $("#help-id-login").text("")
    }

    if (password == "") {
        $("#help-password-login").text("비밀번호를 입력해주세요.")
        $("#input-password").focus()
        return;
    } else {
        $("#help-password-login").text("")
    }
    $.ajax({
        type: "POST",
        url: "/sign_in",
        data: {
            username_give: username,
            password_give: password
        },
        success: function (response) {
            if (response['result'] == 'success') {
                $.cookie('mytoken', response['token'], {path: '/'});
                window.location.replace("/")
            } else {
                alert(response['msg'])
            }
        }
    });
}














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