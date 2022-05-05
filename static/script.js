// <!--================1.onclick 하트 좋아요수 증가==================-->
// var counter1 = 0
// $('#like-heart1').click(function () {
//     counter1++;
//     $('#counter-click1').text(counter1);
// });
//
// var counter2 = 0
// $('#like-heart2').click(function () {
//     counter2++;
//     $('#counter-click2').text(counter2);
// });
//
// var counter3 = 0
// $('#like-heart3').click(function () {
//     counter3++;
//     $('#counter-click3').text(counter3);
// });


// <!--================2. onclick 북마크 색깔 바꾸기==================-->

// var bookmark1 = document.getElementById("bookmark1");
// bookmark1.addEventListener("click", function () {
//     this.children[0].style.color = "#88F3FFFF";
//     this.querySelector('.fas').style.fontSize = '3rem';
//     this.getElementsByTagName('I')[0].classList.toggle('fa-spin');
//     this.firstElementChild.style.transition = 'color 1.5s ease 1.25s, font-size 0.75s ease-out';
// }, false);
// var bookmark2 = document.getElementById("bookmark2");
// bookmark2.addEventListener("click", function () {
//     this.children[0].style.color = "#88F3FFFF";
//     this.querySelector('.fas').style.fontSize = '3rem';
//     this.getElementsByTagName('I')[0].classList.toggle('fa-spin');
//     this.firstElementChild.style.transition = 'color 1.5s ease 1.25s, font-size 0.75s ease-out';
// }, false);
// var bookmark3 = document.getElementById("bookmark3");
// bookmark3.addEventListener("click", function () {
//     this.children[0].style.color = "#88F3FFFF";
//     this.querySelector('.fas').style.fontSize = '3rem';
//     this.getElementsByTagName('I')[0].classList.toggle('fa-spin');
//     this.firstElementChild.style.transition = 'color 1.5s ease 1.25s, font-size 0.75s ease-out';
// }, false);

// <!--================3.댓글 보기 토글====================-->
//
//
// $(function () {
//     $('#comment_box2').click(function () {
//         $('#comment-lists2').slideToggle();
//     })
//
// });
//
// $(function () {
//     $('#comment_box3').click(function () {
//         $('#comment-lists3').slideToggle();
//     })
//
// });
// <!--================4.댓글 남기기====================-->


// function show_allcomment(rows) {
//
// }


// <!--================4.2 댓글기능 2번째 코멘트====================-->
// $(document).ready(function () {
//     show_comment2()
// });
//
// function show_comment2() {
//     $.ajax({
//         type: "GET",
//         url: "/insta_comment2",
//         data: {},
//         success: function (response) {
//             let rows = response['comments']
//
//             for (let i = 0; i < rows.length; i++) {
//                 let comment = rows[i]['comment']
//
//                 let temp_html = `<p>${comment}</p>`
//                 $('#comment-lists2').append(temp_html)
//                 $('#comment-number2').text(rows.length)
//
//
//             }
//         }
//     });
// }
//
// function save_comment2() {
//     let input_val = $('input[name=user]').val()
//     let comment = $('#uploading_comment2').val()
//     console.log(input_val)
//     $.ajax({
//         type: 'POST',
//         url: '/insta_comment2',
//         data: {comment_give: comment},
//         success: function (response) {
//             alert(response['msg'])
//             window.location.reload()
//         }
//     })
// }
//
// <!--================4.3 3번째 댓글 만들기====================-->
//
// $(document).ready(function () {
//     show_comment3()
// });
//
// function show_comment3() {
//     $.ajax({
//         type: "GET",
//         url: "/insta_comment3",
//         data: {},
//         success: function (response) {
//             let rows = response['comments']
//
//             for (let i = 0; i < rows.length; i++) {
//                 let comment = rows[i]['comment']
//
//                 let temp_html = `<p>${comment}</p>`
//                 $('#comment-lists3').append(temp_html)
//                 $('#comment-number3').text(rows.length)
//
//
//             }
//         }
//     });
// }
//
// function save_comment3() {
//     let comment = $('#uploading_comment3').val()
//     $.ajax({
//         type: 'POST',
//         url: '/insta_comment3',
//         data: {comment_give: comment},
//         success: function (response) {
//             alert(response['msg'])
//             window.location.reload()
//         }
//     })
// }
//
// <!--================4.4 4번째 댓글 만들기====================-->
// $(document).ready(function () {
//     show_comment4()
// });
//
// function show_comment4() {
//     $.ajax({
//         type: "GET",
//         url: "/insta_comment4",
//         data: {},
//         success: function (response) {
//             let rows = response['comments']
//             for (let i = 0; i < rows.length; i++) {
//                 let comment = rows[i]['comment']

//                 let temp_html = `<p>${comment}</p>`
//                 $('#sli').append(temp_html)
//             }
//
//         }
//     });
// }
//
// function save_comment4() {
//     let comment = $('#uploading_comment4').val()
//     $.ajax({
//         type: 'POST',
//         url: '/insta_comment4',
//         data: {comment_give: comment},
//         success: function (response) {
//             alert(response['msg'])
//             window.location.reload()
//         }
//     })
// }



// 댓글 작성 =============================================

function save_comment(user_id) {

    let user = parseInt(user_id)
    let input_val = $('#comment_input' + user).val();
    $.ajax({
        type: 'POST',
        url: '/comment',
        data: {user_give: user, comment_give: input_val},
        success: function (response) {
            window.location.reload()
        }
    })
}

function show_comment() {
    $.ajax({
        type: "GET",
        url: "/comment",
        data: {},
        success: function (response) {
            let rows = response.comments;
            for (let i = 0; i < rows.length; i++) {
                let user_id = rows[i]['user_id']
                let comment = rows[i]['comment']

                let comment_lists = $('#comment_lists'+ user_id)
                let comment_box = $('#comment_box'+ user_id)

                let temp_html = `<div>
                                    <a href="/" alt="계정">${user_id}</a>
                                    <span>${comment}</span>
                                </div>`
                comment_lists.append(temp_html);

                hide_show_comment(user_id)

            }
        }
    });
}

// 댓글 자동 숨김 =============================================

function hide_show_comment(user_id) {
    let comment_lists = $('#comment_lists'+ user_id);
    let comment_box = $('#comment_box'+ user_id);

    let comment_count = comment_lists.children('div').length;
    comment_box.text('댓글 ' + comment_count + '개 모두 보기');

    if (comment_count > 3) {
        comment_lists.hide();
        comment_box.show();
    }
}


// 게시글 더보기 자동 숨김 =============================================

function hide_show_desc(user_id) {
    let user = parseInt(user_id)
    let hidden = $('#hidden_desc' + user);
    let shown = $('#shown_desc' + user);
    let read_more = $('#desc_read_more_button' + user);

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

// 게시글 더보기 =============================================

function desc_read_more(user_id) {
    let user = parseInt(user_id)
    let hidden = $('#hidden_desc' + user);
    let shown = $('#shown_desc' + user);
    let read_more = $('#desc_read_more_button' + user);

    hidden.show();
    shown.hide();
    read_more.hide();
}

// 좋아요 수 올리기 =============================================

function like_up(user_id) {
    $.ajax({
        type: 'POST',
        url: '/like',
        data: {user_give: user_id},
        success: function (response) {
            window.location.reload()
        }
    })
}

// 좋아요 개수 보기 =============================================

function show_like() {
    $.ajax({
        type: "GET",
        url: "/like",
        data: {},
        success: function (response) {
            let rows = response['likes']
            for (let i = 0; i < rows.length; i++) {
                let user_id = rows[i]['user_id']
                let like = rows[i]['like']

                $('span[name='+ user_id +']').text(like)
            }
        }
    });
}

// 게시물 생성 =============================================

function create_content() {
    $.ajax({
        type: 'POST',
        url: '/create_content',
        data: {},
        success: function (response) {
            window.location.reload()
        }
    })
}

function show_content() {
    $.ajax({
        type: "GET",
        url: "/create_content",
        data: {},
        success: function (response) {
            let rows = response['contents']
            for (let i = 0; i < rows.length; i++) {
                let content_id = rows[i]['_id']
                let user_id = rows[i]['user_id']
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
                                                <img class="d-block w-100" src="${img}"
                                                     alt="First slide">
                                            </div>
                                            <div class="carousel-item">
                                                <img class="d-block w-100" src="${img}" alt="Second slide">
                                            </div>
                                            <div class="carousel-item">
                                                <img class="d-block w-100" src="${img}" alt="Third slide">
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
                                                    <button onclick="like_up(${user_id})"><i class="fa fa-heart"></i></button>
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
                                            <p id="counter-text1">좋아요 <span id="counter-click1" class="counter-click" name="${user_id}">0</span>개</p>
                                            <div id="shown_desc${user_id}" class="card_comment" >${desc}</div>
                                            <button id="desc_read_more_button${user_id}" class="" onclick="desc_read_more(${user_id})" >더 보기</button>
                                            <div id="hidden_desc${user_id}" class="card_comment">${desc}</div>
                                            <div style="height:20px"></div>
                                            <button id="comment_box${user_id}" class="comment_box" data-toggle="modal" data-target="#modal_card">댓글 00개 모두
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
                                            <div id="comment_lists${user_id}" class="comment-list">
                                            </div>
                                            <p class="time_passed">${timestamp}시간 전</p>
                                        </div>
                                        <div class="card_bottom">
                                            <input class="form-control" placeholder="댓글 달기..." style="background-color: black; border: 3px solid black"
                                                      id="comment_input${user_id}">
                                            <button class="comment_upload_button" onclick="save_comment(${user_id})">게시</button>
                                        </div>
                                    </div>
                                </div>`

                $('#card_box').append(temp_html);

                show_like(user_id);
                hide_show_desc(user_id);
            }
        }
    });
}
