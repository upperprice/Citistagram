import certifi  # mongodb 인증 라이브러리
from pymongo import MongoClient
import jwt
import datetime
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta

client = MongoClient('mongodb+srv://test:sparta@cluster0.vpnjl.mongodb.net/Cluster0?retryWrites=true&w=majority',
                     tlsCAFile=certifi.where())  # 인증을 위한 코드 추가
db = client.dbsparta_plus_week4


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



####################로그인 창############################################

@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('login.html', msg=msg)


# 아이디 중복 확인 서버
@app.route('/sign_up/check_dup', methods=['POST'])
def check_dup():
    username_receive = request.form['username_give']
    exists_id = bool(db.users.find_one({"username": username_receive}))
    return jsonify({'result': 'success', 'exists': exists_id})



# 닉네임 중복 확인 서버
@app.route('/sign_up/check_nickname_dup', methods=['POST'])
def check_nickname_dup():
    nickname_receive = request.form['nickname_give']
    exists_nickname = bool(db.users.find_one({"nickname": nickname_receive}))
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
        "profile_info": ""  # 프로필 한 마디
    }
    db.users.insert_one(doc)
    return jsonify({'result': 'success'})


# 로그인서버
@app.route('/sign_in', methods=['POST'])
def sign_in():
    # 로그인
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']

    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    result = db.users.find_one({'username': username_receive, 'password': pw_hash})

    if result is not None:
        payload = {
            'id': username_receive,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})

####################첫번째 코멘트창########################################
@app.route("/insta_comment", methods=["POST"])
def insta_comment_post():

    comment_receive = request.form['comment_give']

    doc = {'comment':comment_receive}
    db.insta_comment.insert_one(doc)
    return jsonify({'msg':'소중한 댓글 감사합니다'})


@app.route("/insta_comment", methods=["GET"])
def insta_comment_get():
    all_comment = list(db.insta_comment.find({}, {'_id': False}))
    return jsonify({'comments':all_comment})

####################두번째 코멘트창########################################
@app.route("/insta_comment2", methods=["POST"])
def insta_comment_post2():

    comment_receive = request.form['comment_give']

    doc = {'comment':comment_receive}
    db.insta_comment2.insert_one(doc)
    return jsonify({'msg':'소중한 댓글 감사합니다'})


@app.route("/insta_comment2", methods=["GET"])
def insta_comment_get2():
    all_comment = list(db.insta_comment2.find({}, {'_id': False}))
    return jsonify({'comments':all_comment})

####################세번째 코멘트창########################################
@app.route("/insta_comment3", methods=["POST"])
def insta_comment_post3():

    comment_receive = request.form['comment_give']

    doc = {'comment':comment_receive}
    db.insta_comment3.insert_one(doc)
    return jsonify({'msg':'소중한 댓글 감사합니다'})


@app.route("/insta_comment3", methods=["GET"])
def insta_comment_get3():
    all_comment = list(db.insta_comment3.find({}, {'_id': False}))
    return jsonify({'comments':all_comment})

####################네번째 코멘트창########################################
@app.route("/insta_comment4", methods=["POST"])
def insta_comment_post4():

    comment_receive = request.form['comment_give']

    doc = {'comment':comment_receive}
    db.insta_comment4.insert_one(doc)
    return jsonify({'msg':'소중한 댓글 감사합니다'})


@app.route("/insta_comment4", methods=["GET"])
def insta_comment_get4():
    all_comment = list(db.insta_comment4.find({}, {'_id': False}))
    return jsonify({'comments':all_comment})

###################좋아요 갯수 카트########################################
@app.route("/like_number1", methods=["POST"])
def post_like_number():
    like_receive = request.form['like_give1']
    doc = {'likes1':like_receive}
    db.like_number1.insert_one(doc)
    return jsonify({'msg':'좋아요 감사합니다.'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)


