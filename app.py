from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/rules')
def rules():
    return render_template('rules.html')

@app.route('/architecture')
def architecture():
    return render_template('architecture.html')
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)