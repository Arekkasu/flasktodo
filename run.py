from flask import Flask
from app.routes.tarea_routes import tarea
import os

app = Flask(__name__, 
            template_folder=os.path.join('app', 'templates'),
            static_folder=os.path.join('app', 'static')
            )

app.register_blueprint(tarea)

app.run(debug=True)