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


###################인스타 피드 업로드 ########################################
@app.route("/insta_feed_test", methods=["POST"])
def feed_post():

    content1_receive = request.form['content1_give']
    user_id_receive = request.form['user_id_give']
    image_receive = request.form['image_give']
    print(content1_receive)
    print(user_id_receive)
    print(image_receive)

    doc = {
        'content':content1_receive,
        'user_id':user_id_receive,
        'image':image_receive,
    }
    db.insta_feed_test.insert_one(doc)
    return jsonify({'msg':'피드 작성 감사합니다 :)'})


if __name__ == '__main__':
   app.run('0.0.0.0',port=5000,debug=True)

