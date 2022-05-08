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
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])


        return render_template('index.html')
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))

@app.route('/profile_page')
def profile():
   return render_template('profile_page.html')

@app.route('/sign_up_page')
def sign_up_page():
   return render_template('sign_up.html')

@app.route('/login_page')
def login_page():
   return render_template('login.html')


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
        "profile_pic": "",  # 프로필 사진 파일 이름
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

    user_id = user['username']

    doc = {
        'user_id': user_id,
        'post_id': post_receive,
        'comment': comment_receive
     }
    db.citista_comments.insert_one(doc)
    return jsonify({'msg':'게시물 생성 완료'})

# 댓글 보기
@app.route("/comment", methods=["GET"])
def comment_get():
    comments = list(db.citista_comments.find({}, {'_id': False}))
    return jsonify({'comments':comments})


# 좋아요 올리기
@app.route("/like", methods=["POST"])
def like_up():
    post_receive = int(request.form['post_give'])
    likes = db.citista_likes.find_one({'post_id': post_receive})

    current_like = likes['like']
    new_like = current_like + 1
    db.citista_likes.update_one({'post_id': post_receive}, {'$set': {'like': new_like}})

    return jsonify({'msg':'좋아요 감사합니다.'})

# 좋아요 개수 보이기
@app.route("/like", methods=["GET"])
def show_like():
    likes = list(db.citista_likes.find({}, {'_id': False}))
    return jsonify({'likes':likes})


# 게시물 생성
@app.route("/create_content", methods=["POST"])
def create_content():

    image_receive = request.form['image_give']
    desc_receive = request.form['desc_give']

    token_receive = request.cookies.get('mytoken')
    # try:
    #     payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

    user = db.citista_users.find_one({'token': token_receive})

    user_id = user['username']

    content_num = db.citista_contents.find({}, {'_id': False}).collection.estimated_document_count()

    current_time = datetime.now()

    doc_cotents = {
        'user_id': user_id,
        'post_id': content_num + 1,
        'img':image_receive,
        'desc':desc_receive,
        'timestamp': current_time
    }
    db.citista_contents.insert_one(doc_cotents)

    doc_likes = {
        'post_id': content_num + 1,
        'like': 0
    }
    db.citista_likes.insert_one(doc_likes)

    return jsonify({'msg':'게시물 생성'})


# 게시물 보이기
@app.route("/create_content", methods=["GET"])
def show_content():
    contents = list(db.citista_contents.find({}, {'_id': False}))
    return jsonify({'contents': contents})


# # 게시물 생성
# @app.route("/writing_new", methods=["POST"])
# def new_writing():
#     token_receive = request.cookies.get('mytoken')
#     try:
#         payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
#         user_info = db.user.find_one({"user_id": payload['user_id']})

#         desc_receive = request.form['desc_give']
#         photo = request.files['photo_give']
#         if desc_receive == "":
#             desc_receive = ""
#         else:
#             desc_receive = desc_receive

#         extension = photo.filename.split('.')[-1]
#         today = datetime.datetime.now()
#         mytime = today.strftime('%Y-%m-%d-%H-%M-%S')
#         filename = f'{mytime}.{extension}'
#         save_to = f'/static/images/post-contents/{filename}'

#         test = os.path.abspath(__file__)
#         print(test)
#         parent_path = Path(test).parent
#         abs_path = str(parent_path) + save_to

#         photo.save(abs_path)

#         container_content = {
#             'desc': desc_receive,
#             'photo': filename,
#             'comment': [],
#             'like': 0,
#             'like_user': []
#         }

#         db.post_content.update_one({'user_id': user_info['user_id']}, {
#             '$addToSet': {'container': container_content}})

#         return jsonify({'msg': '등록완료'})
#     except jwt.ExpiredSignatureError:
#         return redirect(url_for("login_page", msg="로그인 시간이 만료되었습니다."))
#     except jwt.exceptions.DecodeError:
#         return redirect(url_for("login_page", msg="로그인 정보가 존재하지 않습니다."))



if __name__ == '__main__':
   app.run('0.0.0.0',port=5000,debug=True)



