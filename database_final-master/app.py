from flask import render_template, Flask, session, redirect, url_for, escape, request, flash, jsonify, json, make_response
from flask_cors import CORS, cross_origin
from config import app
from sqlalchemy.sql import exists
from db import sessionDB
from models import *
import modelController as mc

app = app
CORS(app, support_credentials=True)


# MAIN PAGE
@app.route('/', methods=['GET', 'POST'])
@cross_origin(origin='*')
def main_page():
    session['user'] = ''
    session['status'] = ''
    loginout = "login"
    error = None
    flashMsg = ''

    if request.method == 'POST':
        whichPost = request.form.get('post')

        # login
        if whichPost == 'logInOut':
            # get email and password from html
            userEmail = request.form.get('userEmail')
            userPwd = request.form.get('userPwd')

            emailExist=sessionDB.query(exists().where(Customer.email == userEmail)).scalar()
            if emailExist:
                records = sessionDB.query(Customer).filter(Customer.email == userEmail)
                session['pwd'] = ''
                r = None
                for record in records:
                    r = record
                if r.passwords == userPwd:
                    session['pwd'] = r.passwords
                    session['user'] = r.email
                    session['status'] = 'login succeed'
                    session['cID'] = r.cID

                    # get user's name
                    homeRecord = sessionDB.query(HomeCu).filter(HomeCu.cID == session['cID'])
                    first_name = ''
                    last_name = ''
                    for hr in homeRecord:
                        first_name = hr.fname
                        last_name = hr.lname
                    session['fullname'] = first_name + ' ' + last_name
                    return redirect(url_for('isLogin', name=first_name, cID=session['cID']), 302)

                else:
                    pass
                    # wrong password
            else:
                pass
                # email not exists


        else:
            app.logger.debug('please login')
            # return redirect(url_for('index'), 302)
            return render_template('shop-homepage.html', loginout='Login')

    # display by kind
    if request.method == 'GET':
        return render_template('shop-homepage.html', loginout=loginout)


# REGISTER PAGE
@app.route('/register', methods=['GET', 'POST'])
def register():
    return render_template('register.html')


# PAGE LOADED AFTER LOGIN
@app.route('/<name>_<cID>/', methods=['GET', 'POST'])
def isLogin(name, cID):
    hello = "Hello, "

    if request.method == 'POST':
        whichPost = request.form.get('post')

        # log out
        if whichPost == 'logInOut':
            '''doing log out.'''
            flash('you have logged out.')

        # place order
        elif whichPost == "checkout":
            pID = request.form.getlist('pID')
            amount = request.form.getlist('amount')
            price = request.form.getlist('price')
            quantity = request.form.getlist('quantity')
            pName = request.form.getlist('pName')
            print(pID, amount, price, quantity, pName)
            cID = session['cID']
            mc.placeOrder(pName, pID, amount, quantity, price, cID)
            return 'ok'

        # unknown request
        else:
            return 'Unknown Error'

    # display by kind
    if request.method == 'GET':
        whichCategory = request.args.get('kind', '')
        app.logger.debug(whichCategory)
        if whichCategory:
            # get the result
            data = mc.searchKind(whichCategory)
            if data:
                return data

        # search, select sql
        search = request.args.get('search', '')
        app.logger.debug(search)
        if search:
            data = mc.search(search)
            app.logger.debug(data)
            if data:
                return data

        return render_template('shop-homepage.html', hello=hello, name=name, loginout='log out', cID=cID)


if __name__ == '__main__':
    app.debug = True
    app.run()
