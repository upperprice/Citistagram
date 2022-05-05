from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

from pymongo import MongoClient
# client = MongoClient('mongodb+srv://test:sparta@cluster0.3puso.mongodb.net/Cluster0?retryWrites=true&w=majority')
# db = client.dbsparta
client = MongoClient('localhost', 27017)
db = client.campProject



@app.route('/')
def home():
   return render_template('index.html')

@app.route('/profile_page')
def profile():
   return render_template('profile_page.html')



# 코멘트 작성
@app.route("/comment", methods=["POST"])
def comment_post():
    user_receive = request.form['user_give']
    comment_receive = request.form['comment_give']

    doc = {
        'user_id': user_receive,
        'comment': comment_receive
     }
    db.citista_comments.insert_one(doc)
    return jsonify({'msg':'게시물 생성 완료'})

# 코멘트 보기
@app.route("/comment", methods=["GET"])
def comment_get():
    comments = list(db.citista_comments.find({}, {'_id': False}))
    return jsonify({'comments':comments})


# 좋아요 올리기
@app.route("/like", methods=["POST"])
def like_up():
    user_receive = int(request.form['user_give'])
    likes = db.citista_likes.find_one({'user_id': user_receive})

    current_like = likes['like']
    new_like = current_like + 1
    db.citista_likes.update_one({'user_id': user_receive}, {'$set': {'like': new_like}})

    return jsonify({'msg':'좋아요 감사합니다.'})

# 좋아요 개수 보이기
@app.route("/like", methods=["GET"])
def show_like():
    likes = list(db.citista_likes.find({}, {'_id': False}))
    return jsonify({'likes':likes})


# (임시) 게시물 생성
@app.route("/create_content", methods=["POST"])
def create_content():

    content_num = db.citista_contents.find({}, {'_id': False}).collection.estimated_document_count()

    doc_cotents = {
        'user_id': content_num + 1,
        'img':'0',
        'desc':'동해물과 백두산이 마르고 닳도록 하느님이 도우하사 우리 나라 만세 무궁화 삼천리 화려강산 대한 사람 대한으로 길이 보전하세.',
        'timestamp': 0,
    }
    db.citista_contents.insert_one(doc_cotents)

    doc_likes = {
        'user_id': content_num + 1,
        'like': 0
    }
    db.citista_likes.insert_one(doc_likes)

    return jsonify({'msg':'게시물 생성'})


# (임시) 게시물 보이기
@app.route("/create_content", methods=["GET"])
def show_content():
    contents = list(db.citista_contents.find({}, {'_id': False}))
    return jsonify({'contents': contents})

if __name__ == '__main__':
   app.run('0.0.0.0',port=5000,debug=True)

