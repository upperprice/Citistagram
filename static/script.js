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
function logout() {
    $.removeCookie('mytoken');
    alert('로그아웃!')
    window.location.href = '/login'
}

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
    $.ajax({
        type: "POST",
        url: "/logout",
        data: {},
        success: function (response) {
            if (response['result'] == 'success') {
                // $.cookie('mytoken', response['token'], {path: '/'});
                window.location.replace("/login");
                console.log(response['msg']);
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

                let temp_html = `<div>
                                    <a href="/" alt="계정" name="${post_id}">${user_id}</a>
                                    <span>${comment}</span>
                                </div>`
                comment_lists.append(temp_html);

                hide_show_comment(post_id)

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

<<<<<<< HEAD
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

<<<<<<< HEAD
<!--================4.5 게시글 더보기 생성====================-->
$(document).ready(function () {
    desc_hide_show();
});

let desc_text = $('#shown_desc').text();

function desc_hide_show() {
    $('#hidden_desc').hide();
=======
    hidden.hide();
>>>>>>> eom
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

<<<<<<< HEAD
function desc_read_more() {
    $('#shown_desc').text().substring(0, desc_text);
    $('#desc_read_more_button').hide();
    $('#hidden_desc').show();
    $('#shown_desc').hide();
}
=======
<!--================5.새 게시물 만들기====================-->
    let files //파일 계속 사용할거니까 전역변수 선언

    $('#nav_bar_add_box').click(function () { //+버튼 클릭시 1번모달창 나타나기
        $('#first_modal').css({
            display: 'flex'
        });
        $(document.body).css({   //+버튼 클릭시 전체화면 스크롤바 사라짐
            overflow: 'hidden'
        })
    });
    $('#modal_x_box').click(function () {   //x버튼 클릭시 1번모달창 사라짐
        $('.modal_overlay').css({
            display: 'none'
        });
        $(document.body).css({
            overflow: 'visible'
        })
    });
    $('#modal_x_box2').click(function () {   //x버튼 클릭시 2번모달창 사라짐
        $('.modal_overlay').css({
            display: 'none'
        });
        $(document.body).css({
            overflow: 'visible'
        })
    });


    $('.addition_modal_body')    //모달창에 드래그앤 드롭 기능 구현하겠다
        .on("dragover", dragOver)
        .on("dragleave", dragOver)
        .on("drop", uploadFiles);

    function dragOver(e) {     //드래그오버 함수
        e.stopPropagation();   //드래그오버시 모달창만 반응하고 뒤의 페이즈는 반응하지 않음
        e.preventDefault();

        if (e.type == "dragover") {  //드래그오버하면 outline이 가운데로 몰림
            $(e.target).css({
                "outline-offset": "-20px",
                "border-radius": "8px"
            });
        } else {
            $(e.target).css({
                "background-color": "black",
                "outline-offset": "-10px"
            });
        }
    }

    function uploadFiles(e) {  //업로드파일 함수
        e.stopPropagation();  //업로드파일시 모달창만 반응하고 뒤의 페이즈는 반응하지 않음
        e.preventDefault();

        e.dataTransfer = e.originalEvent.dataTransfer;
        files = e.dataTransfer.files;

        if (files.length > 1) {    //파일갯수가 여러개면 하나만 올려주세요 창이 뜸
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
                "background-size": "100% 100%"
            });
        } else {
            alert('이미지가 아닙니다.');
            return;
        }

    }
>>>>>>> origin/새게시물만들기
=======
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
            window.location.reload()
        }
    })
}

// 좋아요 개수 보기
function show_like() {
    $.ajax({
        type: "GET",
        url: "/like",
        data: {},
        success: function (response) {
            let rows = response['likes']
            for (let i = 0; i < rows.length; i++) {
                let post_id = rows[i]['post_id']
                let like = rows[i]['like']

                $('span[name='+ post_id +']').text(like)
            }
        }
    });
}

// // (임시)게시물 생성
// function create_content() {
//     $.ajax({
//         type: 'POST',
//         url: '/create_content',
//         data: {},
//         success: function (response) {
//             window.location.reload()
//         }
//     })
// }

// 게시물 보이기
function show_content() {
    $.ajax({
        type: "GET",
        url: "/create_content",
        data: {},
        success: function (response) {
            let rows = response['contents']
            console.log(rows)
            for (let i = 0; i < rows.length; i++) {
                let user_id = rows[i]['user_id'] 
                let post_id = rows[i]['post_id']
                let img = rows[i]['img']
                let desc = rows[i]['desc']
                let timestamp = rows[i]['timestamp']

                let temp_html = `<div class="card">
                                    <!--카드 탑-->
                                    <div class="card_top">
                                        <div class="profile">
                                            <img class="profile_pic"
                                                 src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FefeXMf%2FbtrALvQXSLl%2Fn6fd0dsFfXNbUmOX7EYGBK%2Fimg.png"
                                                 alt="프로필 사진">
                                            <p style="padding-left:38px;"><a href="/profile_page">${user_id}</a></p>
                                        </div>
                                        <div>
                                            <button class="modal_button" data-toggle="modal" data-target="#modal_box1"><i
                                                    class="fa fa-dots-three-horizontal" style="color: antiquewhite"></i></button>
                                        </div>
                                    </div>
                                    <!--모달-->
                                    <div class="modal" tabindex="-1" id="modal_box1">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <p class="modal-title" style="color:#C7B0FFFF"><a href="">신고</a></p>
                                                </div>
                                                <div class="modal-header">
                                                    <p class="modal-title" style="color:#C7B0FFFF"><a href="">팔로우 취소</a></p>
                                                </div>
                                                <div class="modal-header">
                                                    <p class="modal-title"><a href="">게시물로 이동</a></p>
                                                </div>
                                                <div class="modal-header">
                                                    <p class="modal-title"><a href="">공유 대상...</a></p>
                                                </div>
                                                <div class="modal-header">
                                                    <p class="modal-title"><a href="">링크 복사</a></p>
                                                </div>
                                                <div class="modal-header">
                                                    <p class="modal-title"><a href="">퍼가기</a></p>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="modal_dismiss_button" data-dismiss="modal">취소</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!--캐러셀-->
                                    <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                                        <div class="carousel-inner">
                                            <div class="carousel-item active">
                                                <img class="d-block w-100" src="/static/img/${img}"
                                                     alt="First slide">
                                            </div>
                                            <div class="carousel-item">
                                                <img class="d-block w-100" src="/static/img/${img}" alt="Second slide">
                                            </div>
                                            <div class="carousel-item">
                                                <img class="d-block w-100" src="/static/img/${img}" alt="Third slide">
                                            </div>
                                        </div>
                                        <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span class="sr-only">Previous</span>
                                        </a>
                                        <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span class="sr-only">Next</span>
                                        </a>
                                    </div>
                                    <!--카드 바디-->
                                    <div class="card_body">
                                        <div class="icon_bar">
                                            <div class="icon_bar_left">
                                                <div id="like-heart1">
                                                    <button onclick="like_up('${user_id}', ${post_id})"><i class="fa fa-heart"></i></button>
                                                </div>
                                                <div>
                                                    <button><i class="fa fa-chat-bubble"></i></button>
                                                </div>
                                                <div>
                                                    <button><i class="fa fa-paper-plane"></i></button>
                                                </div>
                                            </div>
                                            <button id="bookmark1" class="bookmark"><i class="fa fa-bookmark"></i></button>
                                        </div>
                                        <div class="card-text">
                                            <p id="counter-text1">좋아요 <span id="counter-click1" class="counter-click" name="${post_id}">0</span>개</p>
                                            <a href="/" alt="계정" name="${post_id}">${user_id}</a>
                                            <span id="shown_desc${post_id}" class="card_comment" >${desc}</span>
                                            <button id="desc_read_more_button${post_id}" class="" onclick="desc_read_more(${post_id})" >더 보기</button>
                                            <span id="hidden_desc${post_id}" class="card_comment">${desc}</span>
                                            <div style="height:20px"></div>
                                            <button id="comment_box${post_id}" class="comment_box" data-toggle="modal" data-target="#modal_card">댓글 00개 모두
                                                보기
                                            </button>
                                            <!--댓글 상세 모달-->
                                            <div class="modal" tabindex="-1" id="modal_card" style="padding-right: 16px; display: none;">
                                                <div class="modal-dialog1">
                                                    <div class="modal-content1">
                                                        <div id="carouselExampleControls2" class="carousel slide" data-ride="carousel">
                                                            <div class="carousel-inner">
                                                                <div class="carousel-item">
                                                                    <img class="d-block w-100" src="../static/img/모달1.jpg" alt="First slide">
                                                                </div>
                                                                <div class="carousel-item">
                                                                    <img class="d-block w-100" src="../static/img/모달2.png" alt="Second slide">
                                                                </div>
                                                                <div class="carousel-item active">
                                                                    <img class="d-block w-100" src="../static/img/모달3.jpg" alt="Third slide">
                                                                </div>
                                                            </div>
                                                            <a class="carousel-control-prev" href="#carouselExampleControls2" role="button"
                                                               data-slide="prev">
                                                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                                                <span class="sr-only">Previous</span>
                                                            </a>
                                                            <a class="carousel-control-next" href="#carouselExampleControls2" role="button"
                                                               data-slide="next">
                                                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                                                <span class="sr-only">Next</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div class="modal-content2">
                                                        <div class="modal-top-line">
                                                            <div class="profile">
                                                                <img class="profile_pic" src="../static/img/프로필5.png" alt="프로필 사진">
                                                                <p style="padding-left:38px;  ">Tasha Han</p>

                                                            </div>

                                                        </div>
                                                        <div class="modal-body">
                                                            <div id="comment-lists4">
                                                                <p>벌써 5월 2일이라니 시간이 무섭다.</p>
                                                                <p>날씨 좋다</p>

                                                            </div>
                                                        </div>
                                                        <div class="modal-comment">

                                                            <textarea class="form-control" placeholder="" id="uploading_comment4"
                                                                      rows="1">댓글 달기</textarea>
                                                            <button class="comment_upload_button" onclick="save_comment()">게시</button>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <div id="comment_lists${post_id}" class="comment-list">
                                            </div>
                                            <p class="time_passed">${timestamp}시간 전</p>
                                        </div>
                                        <div class="card_bottom">
                                            <input class="form-control" placeholder="댓글 달기..." style="background-color: black; border: 3px solid black"
                                                      id="comment_input${post_id}">
                                            <button class="comment_upload_button" onclick="save_comment(${post_id})">게시</button>
                                        </div>
                                    </div>
                                </div>`

                $('#card_box').append(temp_html);

                show_like(post_id);
                hide_show_desc(post_id);
            }
        }
    });
}


//<!--================5.새 게시물 만들기====================-->

// let files = '' //파일 계속 사용할거니까 전역변수 선언
$('#nav_bar_add_box').click(function () { //+버튼 클릭시 1번모달창 나타나기
    $('#first_modal').css({
        display: 'flex'
    });
    $(document.body).css({   //+버튼 클릭시 전체화면 스크롤바 사라짐
        overflow: 'hidden'
    })
});
$('#modal_x_box').click(function () {   //x버튼 클릭시 1번모달창 사라짐
    $('.modal_overlay').css({
        display: 'none'
    });
    $(document.body).css({
        overflow: 'visible'
    })
});
$('#modal_x_box2').click(function () {   //x버튼 클릭시 2번모달창 사라짐
    $('.modal_overlay').css({
        display: 'none'
    });
    $(document.body).css({
        overflow: 'visible'
    })
});
$('.addition_modal_body')    //모달창에 드래그앤 드롭 기능 구현하겠다
    .on("dragover", dragOver)
    .on("dragleave", dragOver)
    .on("drop", uploadFiles);
function dragOver(e) {     //드래그오버 함수
    e.stopPropagation();   //드래그오버시 모달창만 반응하고 뒤의 페이즈는 반응하지 않음
    e.preventDefault();
    if (e.type=="dragover") {  //드래그오버하면 outline이 가운데로 몰림
        $(e.target).css({
            "outline-offset": "-20px",
            "border-radius": "8px"
        });
    } else {
        $(e.target).css({
            "background-color": "black",
            "outline-offset": "-10px"
        });
    }
}
function uploadFiles(e) {  //업로드파일 함수
    e.stopPropagation();  //업로드파일시 모달창만 반응하고 뒤의 페이즈는 반응하지 않음
    e.preventDefault();
    e.dataTransfer = e.originalEvent.dataTransfer;
    files = e.dataTransfer.files;
    if (files.length > 1) {    //파일갯수가 여러개면 하나만 올려주세요 창이 뜸
        alert('하나만 올려 주세요');
        return;
    }
    //파일이 이미지로 인식되면 배경 이미지 바뀌게 만듬
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
            "background-size": "100% 100%"
        });
    } else {
        alert('이미지가 아닙니다.');
    }
}
//파일 업로드 여기서부터 시작
function uploading_files(){
    let file = files; //실제 파일
    let image = files[0].name; //파일명
    let content = $('#input_feed_content').val(); //이미지 밑에 쓴 글
    console.log(content)
    $.ajax({
        type: 'POST',
        url: '/create_content',
        data: {image_give:image, desc_give:content},
        success: function (response){
            // alert(response['msg'])
            window.location.reload()
        }
    });
}
>>>>>>> eom
