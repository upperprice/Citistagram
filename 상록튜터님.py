@app.route("/writing_new", methods=["POST"])
def new_writing():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.user.find_one({"user_id": payload['user_id']})

        desc_receive = request.form['desc_give']
        photo = request.files['photo_give']
        if desc_receive == "":
            desc_receive = ""
        else:
            desc_receive = desc_receive

        extension = photo.filename.split('.')[-1]#확장자
        today = datetime.datetime.now() #현재시간
        mytime = today.strftime('%Y-%m-%d-%H-%M-%S')
        filename = f'{mytime}.{extension}'#파일이름을 현재시간.확장자로 한다
        save_to = f'/static/images/post-contents/{filename}'#그 파일 이름을 static/images 폴더에 저장

        test = os.path.abspath(__file__)
        print(test)
        parent_path = Path(test).parent
        abs_path = str(parent_path) + save_to

        photo.save(abs_path)

        container_content = {
            'desc': desc_receive,
            'photo': filename,
            'comment': [],
            'like': 0,
            'like_user': []
        }

        db.post_content.update_one({'user_id': user_info['user_id']}, {
            '$addToSet': {'container': container_content}})

        return jsonify({'msg': '등록완료'})
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login_page", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login_page", msg="로그인 정보가 존재하지 않습니다."))