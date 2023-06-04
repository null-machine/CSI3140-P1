from flask import Flask, render_template, request
from nltk.sentiment import SentimentIntensityAnalyzer
import sqlite3
 
#  py -m flask run 
 
app = Flask(__name__)

@app.route('/', methods=['POST', 'GET'])
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
		
 
@app.route('/form')
def form():
	return render_template('form.html')
 
@app.route('/data/', methods = ['POST', 'GET'])
def data():
	if request.method == 'GET':
		create_db()
	if request.method == 'POST':
		sia = SentimentIntensityAnalyzer()
		form_data = request.form
		sentence = form_data['Sentence']
		analysis = sia.polarity_scores(form_data['Sentence'])
		return render_template('data.html', form_data=form_data, sentence=sentence, analysis=analysis)

def create_db():
	# autogenerated primary key is fine
	connection = sqlite3.connect('reviews.db')
	cursor = connection.cursor()
	cursor.execute('CREATE TABLE reviews(course, text, reviewer, stars, nltk_score)')
	cursor.execute('''
		INSERT INTO reviews VALUES
			('CEG3185', 'this course is complete garbage', 'anonymous', 1, ''),
			('CEG3185', 'this course is great', 'anonymous', 5, ''),
			('CSI3104', 'this course is complete garbage', 'anonymous', 1, ''),
			('CSI3104', 'this course is great', 'anonymous', 5, '')
	''')
	connection.commit()