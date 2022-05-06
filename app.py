from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

from pymongo import MongoClient
client = MongoClient('mongodb+srv://test:sparta@cluster0.3puso.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.dbsparta



@app.route('/')
def home():
    return render_template('index.html')

@app.route('/profile_page')
def profile():
    return render_template('profile_page.html')



####################첫번째 코멘트창########################################
@app.route("/insta_comment", methods=["POST"])
def insta_comment_post():

    comment_receive = request.form['comment_give']

    doc = {'comment': comment_receive}
    db.insta_comment.insert_one(doc)
    return jsonify({'msg': '소중한 댓글 감사합니다'})


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

    doc = {'comment': comment_receive}
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

    doc = {'comment': comment_receive}
    db.insta_comment4.insert_one(doc)
    return jsonify({'msg':'소중한 댓글 감사합니다'})


@app.route("/insta_comment4", methods=["GET"])
def insta_comment_get4():
    all_comment = list(db.insta_comment4.find({}, {'_id': False}))
    return jsonify({'comments':all_comment})

# 인스타 업로드 여기서부터

@app.route("/insta_feed1", methods=["POST"])
def feed_post():
    file = request.files['file']
    image = request.form['image']
    content = request.form['content']
    user_id = request.form['user_id']

    doc = {'file': file, 'image': image, 'content': content, 'user_id': user_id}
    db.insta_feed1.insert_one(doc)
    return jsonify({'msg': '사진이 업로드 되었습니다.'})




if __name__ == '__main__':
   app.run('0.0.0.0',port=5000,debug=True)

