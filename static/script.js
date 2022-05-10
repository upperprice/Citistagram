// <!--===============로그인 팝업 창===================-->

function toggle_sign_up() {
    $("#sign-up-box").toggleClass("is-hidden")
    $("#div-sign-in-or-up").toggleClass("is-hidden")
    $("#btn-check-dup").toggleClass("is-hidden")
    $("#btn-check-nickname-dup").toggleClass("is-hidden")
    $("#help-id").toggleClass("is-hidden")
    $("#help-password").toggleClass("is-hidden")
    $("#help-password2").toggleClass("is-hidden")
}

// <!--===============회원가입 아이디 비밀번호 규칙==================-->

function is_nickname(asValue) {
    var regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
    return regExp.test(asValue);
}

function is_password(asValue) {
    var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(asValue);
}


// <!--==============아이디 중복 확인====================-->

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


// <!--==============닉네임 중복 확인====================-->

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


// <!--================회원가입==================-->

function sign_up() {
    let username = $("#input-username").val()
    let password = $("#input-password").val()
    let nickname = $("#input-nickname").val()
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
// function logout() {
//     $.removeCookie('mytoken');
//     alert('로그아웃!')
//     window.location.href = '/login'
// }

function sign_up_page() {
    alert('회원가입페이지 이동!')
    window.location.href = '/sign_up_page'
}

function login_page() {
    alert('로그인페이지 이동!')
    window.location.href = '/login'
}

// <!--================로그인==================-->

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

// <!--================로그아웃==================-->

function logout(){
    // $.removeCookie('mytoken', { path: '/' });
    $.ajax({
        type: "POST",
        url: "/logout",
        data: {},
        success: function (response) {
            if (response['result'] == 'success') {
                window.location.href = '/login';
            }
        }
    });
}





// 댓글 작성
function save_comment(post_id) {

    let post = parseInt(post_id)
    let input_val = $('#comment_input' + post).val();
    $.ajax({
        type: 'POST',
        url: '/comment',
        data: {post_give: post, comment_give: input_val},
        success: function (response) {
            window.location.reload()
        }
    })
}

// 모달 댓글 작성
function save_modal_comment(post_id) {

    let post = parseInt(post_id)
    let input_val = $('#modal_comment_input' + post).val();
    $.ajax({
        type: 'POST',
        url: '/comment',
        data: {post_give: post, comment_give: input_val},
        success: function (response) {
            window.location.reload()
        }
    })
}


// 댓글 보이기
function show_comment() {
    $.ajax({
        type: "GET",
        url: "/comment",
        data: {},
        success: function (response) {
            let rows = response.comments;
            for (let i = 0; i < rows.length; i++) {
                let user_id = rows[i]['user_id']
                let post_id = rows[i]['post_id']
                let comment = rows[i]['comment']

                let comment_lists = $('#comment_lists'+ post_id)
                let modal_comment_lists = $('#modal_comment_lists'+ post_id)

                let temp_html = `<div>
                                    <a href="/" alt="계정" name="${post_id}">${user_id}</a>
                                    <span>${comment}</span>
                                </div>`
                comment_lists.append(temp_html);
                modal_comment_lists.append(temp_html);

                hide_show_comment(post_id)
                hide_show_desc(post_id)
                show_like(post_id);

            }
        }
    });
}

// 댓글 자동 숨김
function hide_show_comment(post_id) {
    let comment_lists = $('#comment_lists'+ post_id);
    let comment_box = $('#comment_box'+ post_id);

    let comment_count = comment_lists.children('div').length;
    comment_box.text('댓글 ' + comment_count + '개 모두 보기');

    if (comment_count > 3) {
        comment_lists.hide();
        comment_box.show();
    }
}


// 게시글 더보기 자동 숨김
function hide_show_desc(post_id) {
    let post = parseInt(post_id)
    let hidden = $('#hidden_desc' + post);
    let shown = $('#shown_desc' + post);
    let read_more = $('#desc_read_more_button' + post);

    hidden.hide();
    let limit_length = 10
    let text_legnth = shown.text().length;
    if (text_legnth > limit_length) {
        let cut_text = shown.text().substring(0, limit_length);
        shown.text(cut_text + '...');

        read_more.show();
    } else {
        read_more.hide();
    }
};

// 게시글 더보기 버튼
function desc_read_more(post_id) {
    let post = parseInt(post_id)
    let hidden = $('#hidden_desc' + post);
    let shown = $('#shown_desc' + post);
    let read_more = $('#desc_read_more_button' + post);

    hidden.show();
    shown.hide();
    read_more.hide();
}

// 좋아요 수 올리기
function like_up(user_id, post_id) {
    $.ajax({
        type: 'POST',
        url: '/like',
        data: {user_give: user_id, post_give: post_id},
        success: function (response) {
            alert(response.msg)
            window.location.reload()
        }
    })
}


// 좋아요 개수 보기
function show_like(post_id) {
    $.ajax({
        type: "GET",
        url: "/like",
        data: {},
        success: function (response) {
            let rows = response['likes']
            let like = rows.filter(function(element) {
                return element.post_id == post_id;
            }).length;

            $('span[name='+ post_id +']').text(like)
        }
    });
}
