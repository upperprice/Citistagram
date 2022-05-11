<<<<<<< HEAD
=======
# from flask import Flask, render_template, request, jsonify
# app = Flask(__name__)

from pymongo import MongoClient
client = MongoClient('mongodb+srv://test:sparta@cluster0.3puso.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.dbsparta
# client = MongoClient('localhost', 27017)
# db = client.campProject



# @app.route('/')
# def home():
#    return render_template('index.html')

# @app.route('/profile_page')
# def profile():
#    return render_template('profile_page.html')

>>>>>>> 4ac2638d6c03af55b3348cd3ad7ce9b8ad85f426
import certifi  # mongodb 인증 라이브러리
import jwt
import datetime
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db = client.campProject

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"

SECRET_KEY = 'SPARTA'



######################################## 페이지 이동 ########################################

# 메인 페이지
@app.route('/')
def home():
    token_receive = request.cookies.get('mytoken') # 현재 토큰 정보(로그인한 유저의 토큰)
    contents = db.citista_contents.find() # 전체 컨텐츠 데이터
    users = db.citista_users.find() # 전체 유저 데이터

    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        my_info = db.citista_users.find_one({'token': token_receive}) # 로그인 유저 정보

        return render_template('index.html', contents=contents, users=users, my_info=my_info)
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))

# 개인 페이지
@app.route('/profile_page')
def profile_page():
    user_id = request.args.get('user_id')
    user_info = db.citista_users.find_one({'username': user_id}) # 지정 유저의 정보

    token_receive = request.cookies.get('mytoken') # 현재 토큰 정보(로그인한 유저의 토큰)
    user = db.citista_users.find_one({'token': token_receive})
    my_id = user['username'] # 로그인 유저 아이디

    contents = list(db.citista_contents.find({'user_id': user_id}, {'_id': False})) # 지정 유저의 컨텐츠 정보

    follower_count = len(list(db.citista_follows.find({'follower_id': user_id}, {'_id': False}))) #유저의 팔로워 개수
    following_count = len(list(db.citista_follows.find({'following_id': user_id}, {'_id': False}))) # 유저의 팔로잉 개수 
    contents_count = len(list(db.citista_contents.find({'user_id': user_id}, {'_id': False}))) # 유저의 게시물 개수
    doc={"follower_count":follower_count,"following_count":following_count, "contents_count":contents_count}

    return render_template('profile_page.html', user_info=user_info, my_id=my_id, contents=contents, doc=doc)


# 회원가입 페이지
@app.route('/sign_up_page')
def sign_up_page():
    return render_template('sign_up.html')


# 로그인 페이지
@app.route('/login_page')
def login_page():
    msg = request.args.get("msg")
    return render_template('login.html')

@app.route('/dm_page')
def dm_page():
   return render_template('dm.html')


# 로그인 페이지(로그인 세션 만료용)
@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('login.html', msg=msg)


# dm 페이지
@app.route('/dm_page')
def dm_page():
    return render_template('dm.html')


######################################## 회원가입 ########################################


# 아이디 중복 확인
@app.route('/sign_up/check_dup', methods=['POST'])
def check_dup():
    username_receive = request.form['username_give']
    exists_id = bool(db.citista_users.find_one({"username": username_receive}))
    return jsonify({'result': 'success', 'exists': exists_id})


# 닉네임 중복 확인
@app.route('/sign_up/check_nickname_dup', methods=['POST'])
def check_nickname_dup():
    nickname_receive = request.form['nickname_give']
    exists_nickname = bool(db.citista_users.find_one({"nickname": nickname_receive}))
    return jsonify({'result': 'success', 'exists': exists_nickname})


# 회원가입
@app.route('/sign_up/save', methods=['POST'])
def sign_up():
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']
    nickname_receive = request.form['nickname_give']
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    doc = {
        "username": username_receive,  # 아이디
        "password": password_hash,  # 비밀번호
        "nickname": nickname_receive,  # 프로필 이름 기본값은 아이디
        "profile_pic": "p_image.png",  # 프로필 사진 파일 이름
        "profile_pic_real": "profile_pics/profile_placeholder.png",  # 프로필 사진 기본 이미지
        "profile_info": "",  # 프로필 한 마디
        "token": 0  # 로그인 시 토큰 임시 저장
    }
    db.citista_users.insert_one(doc)
    return jsonify({'result': 'success'})


######################################## 로그인 / 로그아웃 ########################################


# 로그인
@app.route('/sign_in', methods=['POST'])
def sign_in():
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']

    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()  # 패스워드 암호화
    result = db.citista_users.find_one({'username': username_receive, 'password': pw_hash})

    # 로그인 정보 일치
    if result is not None:
        payload = {
            'id': username_receive,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')  # 토큰 생성

        db.citista_users.update_one({'username': username_receive}, {'$set': {'token': token}}) # 유저 정보에 토큰 저장

        return jsonify({'result': 'success', 'token': token})

    # 로그인 정보 불일치
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


# 로그아웃
@app.route('/logout', methods=['POST'])
def log_out():
    
    token_receive = request.cookies.get('mytoken')
    user = db.citista_users.find_one({'token': token_receive})
    my_id = user['username']  # 현재 로그인 유저 아이디

    db.citista_users.update_one({'username': my_id}, {'$set': {'token': 0}}) # 유저 정보 토큰 리셋(= 0)

    return jsonify({'result': 'success', 'msg': '로그아웃 완료'})


######################################## 게시물 생성/구현 ########################################


# 게시물 생성
@app.route("/content", methods=["POST"])
def content_post():
    
    desc_receive = request.form['desc_give']    # 입력된 소개글
    file = request.files['file_give']   # 업로드한 이미지 파일
    image_receive = request.form['image_give']  # 업로드한 이미지명
    ext = image_receive.split('.')[-1]  # 확장자 추출

    current_time = datetime.now()
    filename = f"{current_time.strftime('%Y%m%d%H%M%S')}.{ext}"
    save_to = f'static/img/post_contents/{filename}'  # 경로지정
    file.save(save_to)  # 이미지 파일 저장

    token_receive = request.cookies.get('mytoken')
    user = db.citista_users.find_one({'token': token_receive})
    my_id = user['username']    # 현재 로그인 유저 아이디
    profile_pic = user['profile_pic']   # 현재 로그인 유저 프로필 이미지

    content_count = db.citista_contents.find({}, {'_id': False}).collection.estimated_document_count()    # 전체 게시물 개수

    doc= {
        'user_id': my_id,
        'post_id': content_count + 1,
        'img': image_receive,
        'f_name': filename,
        'desc': desc_receive,
        'timestamp': current_time,
        'profile_pic': profile_pic
    }
    db.citista_contents.insert_one(doc)

    return jsonify({'msg':'게시물 생성 완료'})


# DB 자료 응답 (화면 구현용)
@app.route("/get_data", methods=["GET"])
def get_data():
    contents = list(db.citista_contents.find({}, {'_id': False}))
    return jsonify({'contents':contents})


# 게시물 타임스탬프
@app.route("/timestamp", methods=["GET"])
def timestamp_get():
    contents = list(db.citista_contents.find({}, {'_id': False}))

    timestamps=[]
    for i in range(len(contents)):
        result = datetime.now() - (contents)[i]['timestamp']
        if 'day' in str(result):
            time = (str(result).split('d')[0]+'일 전')
        elif int(str(result).split(':')[0])>0:
            time = (str(result).split(':')[0]+'시간 전')
        else:
            time = (str(result).split(':')[1]+'분 전')
        timestamps.append({'post_id':i+1 ,'time':time})

    return jsonify({'timestamps':timestamps})


######################################## 댓글 생성/구현 ########################################


# 댓글 생성
@app.route("/comment", methods=["POST"])
def comment_post():

    post_receive = request.form['post_give']    # 해당 게시물 번호
    comment_receive = request.form['comment_give']  # 입력한 코멘트

    token_receive = request.cookies.get('mytoken')
    user = db.citista_users.find_one({'token': token_receive})
    my_id = user['username']    # 현재 로그인 유저 아이디

    doc = {
        'user_id': my_id,
        'post_id': post_receive,
        'comment': comment_receive
     }
    db.citista_comments.insert_one(doc)

    return jsonify({'msg':'댓글 작성 완료'})


# 댓글 구현
@app.route("/comment", methods=["GET"])
def comment_get():
    comments = list(db.citista_comments.find({}, {'_id': False}))
    return jsonify({'comments':comments})


######################################## 좋아요 처리/구현 ########################################


# 좋아요 하기
@app.route("/like", methods=["POST"])
def like_up():
    post_receive = int(request.form['post_give'])   # 해당 게시물 번호

    token_receive = request.cookies.get('mytoken')
    user = db.citista_users.find_one({'token': token_receive})
    my_id = user['username']    # 현재 로그인 유저 아이디

    doc = {
        'user_id': my_id,
        'post_id': post_receive,
    }
    db.citista_likes.insert_one(doc)
    return jsonify({'msg': '좋아요 감사합니다.'})


# 좋아요 취소
@app.route("/like_cancel", methods=["POST"])
def like_cancel():
    post_receive = int(request.form['post_give'])   # 해당 게시물 번호

    token_receive = request.cookies.get('mytoken')
    user = db.citista_users.find_one({'token': token_receive})
    my_id = user['username']    # 현재 로그인 유저 아이디

    db.citista_likes.delete_one({'user_id': my_id, 'post_id': post_receive})

    return jsonify({'msg': '좋아요 취소.'})


# 좋아요 개수/표시 구현
@app.route("/like", methods=["GET"])
<<<<<<< HEAD
def like_get():
    likes = list(db.citista_likes.find({}, {'_id': False})) # 전체 좋아요 정보(개수 확인용)
=======
def show_like():
    likes = list(db.citista_likes.find({}, {'_id': False}))
    return jsonify({'likes':likes})


# 게시물 생성
@app.route("/create_content", methods=["POST"])
def create_content():


    image_receive = request.form['image_give']
    desc_receive = request.form['desc_give']
>>>>>>> 4ac2638d6c03af55b3348cd3ad7ce9b8ad85f426

    token_receive = request.cookies.get('mytoken')
    user = db.citista_users.find_one({'token': token_receive})
    my_id = user['username']    # 현재 로그인 유저 아이디(표시 확인용)

    return jsonify({'likes':likes, 'user_login': my_id})


######################################## 팔로우 올리기/구현 ########################################


# 팔로우 하기
@app.route("/follow", methods=["POST"])
def follow():
    user_receive = request.form['user_give']    # 해당 페이지의 유저 아이디

    token_receive = request.cookies.get('mytoken')
    user = db.citista_users.find_one({'token': token_receive})
    my_id = user['username']    # 현재 로그인 유저 아이디

    doc = {
        'following_id': my_id,
        'follower_id': user_receive
    }

    db.citista_follows.insert_one(doc)
    return jsonify({'msg':'팔로우'})


# 팔로우 취소
@app.route("/follow_cancel", methods=["POST"])
def follow_cancel():
    user_receive = request.form['user_give']    # 해당 페이지의 유저 아이디

    token_receive = request.cookies.get('mytoken')
    user = db.citista_users.find_one({'token': token_receive})
    my_id = user['username']    # 현재 로그인 유저 아이디

    db.citista_follows.delete_one({'following_id': my_id, 'follower_id': user_receive})

    return jsonify({'msg':'팔로우'})


# 좋아요 개수/표시 구현
@app.route("/follow", methods=["GET"])
def follow_get():
    follows = list(db.citista_follows.find({}, {'_id': False})) # 전체 팔로우 정보

    token_receive = request.cookies.get('mytoken')
    user = db.citista_users.find_one({'token': token_receive})
    my_id = user['username']    # 현재 로그인 유저 아이디

    return jsonify({'follows':follows, 'user_login': my_id})


######################################## 프로필 편집 ########################################


# 프로필 편집 (이미지 저장)
@app.route("/uploader", methods=["POST"])
def uploader_file():
    token_receive = request.cookies.get('mytoken')
    user = db.citista_users.find_one({'token': token_receive})
    my_id = user['username']

    if request.method =='POST':
        f = request.files['file']
        ext =f.filename.split('.')[-1]
        save_to = f'static/img/profiles/{my_id}.{ext}'
        f.save(save_to)
        doc = {'profile_pic':f'{my_id}.{ext}', 'profile_pic_real': save_to}
        db.citista_users.update_one({'token': token_receive}, {'$set': doc})
    
    return redirect(url_for("profile_page"))


# 프로필 편집 (닉네임 or 소개글)
@app.route("/citista_users", methods=["POST"])
def citista_users():

    token_receive = request.cookies.get('mytoken')
    user = db.citista_users.find_one({'token': token_receive})

    nickname = request.form['nickname_give']
    profile_info = request.form['desc_give']

    if nickname == "":  # 닉네임칸에 쓰여있지 않으면 기존 닉네임 유지
        nickname = user['nickname']
    if profile_info == "":  # 내용칸에 쓰여있지 않으면 기존 내용 유지
        profile_info = user['profile_info']

<<<<<<< HEAD
    doc = {
        'nickname': nickname,
        'profile_info': profile_info,
=======
    current_time = datetime.now()

    doc_cotents = {
        'user_id': user_id,
        'post_id': content_num + 1,
        'img': image_receive,
        'desc': desc_receive,
        'timestamp': current_time
>>>>>>> 4ac2638d6c03af55b3348cd3ad7ce9b8ad85f426
    }

<<<<<<< HEAD
    db.citista_users.update_one({'token': token_receive}, {'$set': doc})
=======
    doc_likes = {
        'post_id': content_num + 1,
        'like': 0
    }
    db.citista_likes.insert_one(doc_likes)

    return jsonify({'msg':'게시물 생성'})

@app.route("/create_content1", methods=["POST"])
def create_content1():
    file = request.files['file']
    extension = file.filename.split('.')[-1] # 여기서 부터 파일 서버 컴퓨터에 저장
    today = datetime.now()
    print(today)
    mytime = today.strftime('%Y-%m-%d-%H-%M-%S')
    filename = f'{mytime}.{extension}'
    save_to = f'/static/images/post-contents/{filename}'
    print(filename)
    file.save(save_to)
    return jsonify({'msg': '게시물 저장'})

<<<<<<< HEAD
=======


>>>>>>> origin/게시글업로드
# 게시물 보이기
@app.route("/create_content", methods=["GET"])
def show_content():
    contents = list(db.citista_contents.find({}, {'_id': False}))
    return jsonify({'contents': contents})
    


>>>>>>> 4ac2638d6c03af55b3348cd3ad7ce9b8ad85f426

    return jsonify({'result': 'success'})


if __name__ == '__main__':
   app.run('0.0.0.0',port=5000,debug=True)



