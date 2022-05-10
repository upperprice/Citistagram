# from flask import Flask, render_template, request, jsonify
# app = Flask(__name__)

from pymongo import MongoClient
# # client = MongoClient('mongodb+srv://test:sparta@cluster0.3puso.mongodb.net/Cluster0?retryWrites=true&w=majority')
# # db = client.dbsparta
client = MongoClient('localhost', 27017)
db = client.campProject



# @app.route('/')
# def home():
#    return render_template('index.html')

# @app.route('/profile_page')
# def profile():
#    return render_template('profile_page.html')

import certifi  # mongodb 인증 라이브러리
# from pymongo import MongoClient
import jwt
import datetime
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta

# client = MongoClient('mongodb+srv://test:sparta@cluster0.vpnjl.mongodb.net/Cluster0?retryWrites=true&w=majority',
#                      tlsCAFile=certifi.where())  # 인증을 위한 코드 추가
# db = client.dbsparta_plus_week4

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"

SECRET_KEY = 'SPARTA'


@app.route('/')
def home():
    token_receive = request.cookies.get('mytoken')
    contents = db.citista_contents.find()
    users = db.citista_users.find()

    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        token_receive = request.cookies.get('mytoken')
        my_info = db.citista_users.find_one({'token': token_receive})

        return render_template('index.html', contents=contents, users=users, my_info=my_info)
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))

# @app.route('/profile_page')
# def profile():
#    return render_template('profile_page.html')

@app.route('/profile_page')
def profile_page():
    user_id = request.args.get('user_id')
    user_info = db.citista_users.find_one({'username': user_id})

    token_receive = request.cookies.get('mytoken')
    user = db.citista_users.find_one({'token': token_receive})
    my_info = user['username']

    contents = list(db.citista_contents.find({'user_id': user_id}, {'_id': False}))

    follower_count = len(list(db.citista_follows.find({'follower_id': user_id}, {'_id': False})))
    following_count = len(list(db.citista_follows.find({'following_id': user_id}, {'_id': False})))
    contents_count = len(list(db.citista_contents.find({'user_id': user_id}, {'_id': False})))

    doc={"follower_count":follower_count,"following_count":following_count, "contents_count":contents_count}
    return render_template('profile_page.html', user_info=user_info, my_info=my_info, contents=contents, doc=doc)

    # return render_template('profile_page.html', user_info=user_info, my_info=my_info, contents=contents)

@app.route('/sign_up_page')
def sign_up_page():
   return render_template('sign_up.html')

@app.route('/login_page')
def login_page():
   return render_template('login.html')

@app.route('/dm_page')
def dm_page():
   return render_template('dm.html')


####################로그인 창############################################

@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('login.html', msg=msg)


# 아이디 중복 확인 서버
@app.route('/sign_up/check_dup', methods=['POST'])
def check_dup():
    username_receive = request.form['username_give']
    exists_id = bool(db.citista_users.find_one({"username": username_receive}))
    return jsonify({'result': 'success', 'exists': exists_id})



# 닉네임 중복 확인 서버
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
        "token": 0
    }
    db.citista_users.insert_one(doc)
    return jsonify({'result': 'success'})


# 로그인서버
@app.route('/sign_in', methods=['POST'])
def sign_in():
    # 로그인
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']

    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    result = db.citista_users.find_one({'username': username_receive, 'password': pw_hash})

    if result is not None:
        payload = {
            'id': username_receive,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        db.citista_users.update_one({'username': username_receive}, {'$set': {'token': token}}) # 유저 정보에 토큰 저장

        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


@app.route('/logout', methods=['POST'])
def log_out():
    
    # 로그아웃
    token_receive = request.cookies.get('mytoken')
    # try:
    #     payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

    user = db.citista_users.find_one({'token': token_receive})

    user_id = user['username']

    db.citista_users.update_one({'username': user_id}, {'$set': {'token': 0}}) # 유저 정보 토큰 리셋(0)

    return jsonify({'result': 'success', 'msg': '로그아웃 완료'})


# 댓글 작성
@app.route("/comment", methods=["POST"])
def comment_post():

    post_receive = request.form['post_give']
    comment_receive = request.form['comment_give']

    token_receive = request.cookies.get('mytoken')
    # try:
    #     payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

    user = db.citista_users.find_one({'token': token_receive})

    user_receive = user['username']

    doc = {
        'user_id': user_receive,
        'post_id': post_receive,
        'comment': comment_receive
     }
    db.citista_comments.insert_one(doc)
    return jsonify({'msg':'댓글 작성 완료'})


# 댓글 보기
@app.route("/comment", methods=["GET"])
def comment_get():
    comments = list(db.citista_comments.find({}, {'_id': False}))
    return jsonify({'comments':comments})


# 좋아요 올리기
@app.route("/like", methods=["POST"])
def like_up():
    post_receive = int(request.form['post_give'])

    token_receive = request.cookies.get('mytoken')
    user = db.citista_users.find_one({'token': token_receive})
    user_receive = user['username']

    liked = list(db.citista_likes.find({'user_id': user_receive}, {'post_id': post_receive}))

    doc = {
        'user_id': user_receive,
        'post_id': post_receive,
    }
    db.citista_likes.insert_one(doc)
    return jsonify({'msg': '좋아요 감사합니다.'})


# 좋아요 개수 보이기
@app.route("/like", methods=["GET"])
def show_like():
    likes = list(db.citista_likes.find({}, {'_id': False}))

    token_receive = request.cookies.get('mytoken')
    user = db.citista_users.find_one({'token': token_receive})
    user_receive = user['username']


    return jsonify({'likes':likes, 'user_login': user_receive})


# 게시물 생성
@app.route("/create_content", methods=["POST"])
def create_content():
    current_time = datetime.now()
    image_receive = request.form['image_give']
    desc_receive = request.form['desc_give']
    file = request.files['file_give']
    ext = image_receive.split('.')[-1] #확장자 추출
    filename = f"{current_time.strftime('%Y%m%d%H%M%S')}.{ext}"
    save_to = f'static/img/post_contents/{filename}'  # 경로지정
    file.save(save_to)

    token_receive = request.cookies.get('mytoken')
    user = db.citista_users.find_one({'token': token_receive})
    user_id = user['username']
    profile_pic = user['profile_pic']

    content_num = db.citista_contents.find({}, {'_id': False}).collection.estimated_document_count()
    doc= {
        'user_id': user_id,
        'post_id': content_num + 1,
        'img': image_receive,
        'f_name': filename,
        'desc': desc_receive,
        'timestamp': current_time,
        'profile_pic': profile_pic
    }
    db.citista_contents.insert_one(doc)

    return jsonify({'msg':'게시물 생성'})


# 팔로우하기
@app.route("/follow", methods=["POST"])
def follow():
    follower_receive = request.form['user_give']

    token_receive = request.cookies.get('mytoken')
    user = db.citista_users.find_one({'token': token_receive})
    following_receive = user['username']

    doc = {
        'following_id': following_receive,
        'follower_id': follower_receive
    }

    db.citista_follows.insert_one(doc)
    return jsonify({'msg':'팔로우'})


#프로필 이미지 서버 저장
@app.route("/uploader", methods=["POST"])
def uploader_file():
    token_receive = request.cookies.get('mytoken')
    user = db.citista_users.find_one({'token': token_receive})
    user_id = user['username']

    if request.method =='POST':
        f = request.files['file']
        ext =f.filename.split('.')[-1]
        save_to = f'static/img/profiles/{user_id}.{ext}'
        f.save(save_to)
        doc = {'profile_pic':f'{user_id}.{ext}', 'profile_pic_real': save_to}
        db.citista_users.update_one({'token': token_receive}, {'$set': doc})
    
    return redirect(url_for("profile_page"))

#새 닉네임, 내용 저장
@app.route("/citista_users", methods=["POST"])
def citista_users():

    token_receive = request.cookies.get('mytoken')
    user = db.citista_users.find_one({'token': token_receive})


    nickname = request.form['nickname_give']
    profile_info = request.form['desc_give']

    if nickname == "": #닉네임칸에 쓰여있지 않으면 기존 닉네임 유지
        nickname = user['nickname']
    if profile_info == "":  #내용칸에 쓰여있지 않으면 기존 내용 유지
        profile_info = user['profile_info']

    doc = {
        'nickname': nickname,
        'profile_info': profile_info,
    }

    db.citista_users.update_one({'token': token_receive}, {'$set': doc})
    return jsonify({'result': 'success'})


# DB 자료 응답
@app.route("/get_data", methods=["GET"])
def get_data():
    contents = list(db.citista_contents.find({}, {'_id': False}))
    return jsonify({'contents':contents})

if __name__ == '__main__':
   app.run('0.0.0.0',port=5000,debug=True)



