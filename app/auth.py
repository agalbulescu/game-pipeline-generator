from flask import Blueprint, redirect, url_for, session, request
from .utils import login_required

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    if username in current_app.config['ALLOWED_USERS']:
        session['username'] = username
        return redirect(url_for('main.index'))
    return redirect(url_for('main.login'))

@bp.route('/logout')
@login_required
def logout():
    session.pop('username', None)
    return redirect(url_for('main.index'))