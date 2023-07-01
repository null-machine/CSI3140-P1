from flask import Flask, render_template, request
from nltk.sentiment import SentimentIntensityAnalyzer
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from json import dumps
from flask_jsonpify import jsonify
import sqlite3
import json

#  py -m flask run
import nltk
nltk.downloader.download('vader_lexicon')
app = Flask(__name__)
api = Api(app)

CORS(app)

@app.route('/')
def endpoint():
	if request.method == 'GET':
		connection = sqlite3.connect('reviews.db')
		cursor = connection.cursor()
		cursor.execute(request.args['query'])
		rows = cursor.fetchall()
		# print('hello there')
		# print(request.args['query'])
		# print(rows)
		return rows
	elif request.method == 'POST':

		sia = SentimentIntensityAnalyzer()
		analysis = sia.polarity_scores(request.args['text'])

		print('test test')

		connection = sqlite3.connect('reviews.db')
		cursor = connection.cursor()
		cursor.execute(f'''
			INSERT INTO reviews VALUES (
			\"{request.args['course']}\",
			\"{request.args['text']}\",
			\"{request.args['reviewer']}\",
			\"{request.args['stars']}\",
			\"{analysis}\"
		)''')
		connection.commit()

		print('post req')
		# print('goodyntehoaus')
		# print(vars(request))
		# print(request.args)
		# create_db()
		return ''


# @app.route('/form')
# def form():
# 	return render_template('form.html')

# @app.route('/data/', methods = ['POST', 'GET'])
# def data():
# 	if request.method == 'GET':
# 		create_db()
# 	if request.method == 'POST':
# 		sia = SentimentIntensityAnalyzer()
# 		form_data = request.form
# 		sentence = form_data['Sentence']
# 		analysis = sia.polarity_scores(form_data['Sentence'])
# 		return render_template('data.html', form_data=form_data, sentence=sentence, analysis=analysis)

def create_db():
	# autogenerated primary key is fine
	connection = sqlite3.connect('reviews.db')
	cursor = connection.cursor()
	cursor.execute('CREATE TABLE reviews(course, text, reviewer, stars, nltk_score)')
	cursor.execute('''
		INSERT INTO reviews VALUES
			('CEG3185', 'AAAAAAAAAAAAAAA', 'anonymous', 1, ''),
			('CEG3185', 'this course is great', 'anonymous', 5, ''),
			('CSI3104', 'this course is complete garbage', 'anonymous', 1, ''),
			('CSI3104', 'this course is great', 'anonymous', 5, '')
	''')
	connection.commit()

#class Courses(Resource):
 #       def get(self):
  #              return {'courses':[{'id':1, 'name':'CSI3185'},{'id':2, 'name':'CSI3140'}]}



@app.route('/home')
def get():
	#if request.method == 'GET':

	connection = sqlite3.connect('reviews.db')
	cursor = connection.cursor()
	connection.commit()
	data = cursor.execute("SELECT * FROM reviews").fetchall()
		#print(data)

	connection.commit()
		
	return data

##########################################################################3

@app.route('/review')
def putReviewIntoDatabase():

	# Retrieves the values of the passed in parameters
    paramName = request.args.get('paramName')  
    review = request.args.get('review')
    reviewer = request.args.get('reviewer')
    stars = request.args.get('stars')
    analysis = ""

    connection = sqlite3.connect('reviews.db')
    cursor = connection.cursor()
    
    # Puts all the passed in parameters into the database
    cursor.execute('''
        INSERT INTO reviews (course, text, reviewer, stars, nltk_score)
        VALUES (?, ?, ?, ?, ?)
    ''', (paramName, review, reviewer, stars, analysis))

    connection.commit()

    # Retrieves the reviews for the specified course
    data = cursor.execute("SELECT * FROM reviews WHERE course = ?", (paramName,)).fetchall()
    connection.commit()

    return json.dumps(data)



@app.route('/overview')
def sentimentAnalysis():
	# Retrieves the value of the parameter
    paramName = request.args.get('paramName')  
    connection = sqlite3.connect('reviews.db')
    cursor = connection.cursor()
    connection.commit()

    # Gets the reviews from the data
    # Comma is important! It is a tuple
    data = cursor.execute("SELECT text FROM reviews WHERE course = ?", (paramName,)).fetchall()
    reviewAndUser = cursor.execute("SELECT text, reviewer FROM reviews WHERE course = ?", (paramName,)).fetchall()
    oneStar = cursor.execute("SELECT stars FROM reviews WHERE stars = 1 AND course = ?", (paramName,)).fetchall()
    twoStars = cursor.execute("SELECT stars FROM reviews WHERE stars = 2 AND course = ?", (paramName,)).fetchall()
    threeStars = cursor.execute("SELECT stars FROM reviews WHERE stars = 3 AND course = ?", (paramName,)).fetchall()
    fourStars = cursor.execute("SELECT stars FROM reviews WHERE stars = 4 AND course = ?", (paramName,)).fetchall()
    fiveStars = cursor.execute("SELECT stars FROM reviews WHERE stars = 5 AND course = ?", (paramName,)).fetchall()
    stars = [len(oneStar), len(twoStars), len(threeStars), len(fourStars), len(fiveStars)]
    print(data)
    connection.commit()

    # Initialize sentiment analyzer
    sia = SentimentIntensityAnalyzer()

    # Puts all reviews into a string to be analyzed by the sentiment anlayser
    reviews = ''
    reviewArray = {
    	'userName': [],
    	'review': []
    }
    print(reviewAndUser)
    for text in data:
        reviews += text[0] + " "

    print(reviews)
    analysis = sia.polarity_scores(reviews)
    result = {
        'analysis': analysis,
        'stars': stars,
        'reviews' : reviewAndUser
    }

    return json.dumps(result)


#api.add_resource(Courses,'/courses') #Route 1

if __name__ =='__main__':
        app.run(port = 5002)
