from flask import Flask, render_template, request
from nltk.sentiment import SentimentIntensityAnalyzer
 
app = Flask(__name__)
 
@app.route('/form')
def form():
	return render_template('form.html')
 
@app.route('/data/', methods = ['POST', 'GET'])
def data():
	if request.method == 'GET':
		return f"The URL /data is accessed directly. Try going to '/form' to submit form"
	if request.method == 'POST':
		sia = SentimentIntensityAnalyzer()
		form_data = request.form
		sentence = form_data["Sentence"]
		analysis = sia.polarity_scores(form_data["Sentence"])
		return render_template('data.html', form_data=form_data, sentence=sentence, analysis=analysis)