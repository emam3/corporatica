from extensions import db
from flask import Flask
from models import *
from flask_static_digest import FlaskStaticDigest
from flask_cors import CORS


app = Flask(__name__, static_folder='uploads', static_url_path='/uploads')

CORS(app)
cors = CORS(app, resource={
    r"/*":{
        "origins":"http://localhost:5173/"
    }
})

static_digest = FlaskStaticDigest()

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['STATIC_DIGEST_COLLECT'] = True
db.init_app(app)

from views import *

# Create the database tables
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print('Database tables created successfully.')
    app.run(host="0.0.0.0", port=8080,debug=True)
