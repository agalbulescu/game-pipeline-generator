from flask import Blueprint, render_template, session

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    if 'username' not in session:
        return render_template('login.html')
    return render_template('index.html')