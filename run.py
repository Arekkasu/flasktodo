from flask import Flask
from app.routes.tarea_routes import tarea
import os

app = Flask(__name__, 
            template_folder=os.path.join('app', 'templates'),
            static_folder=os.path.join('app', 'static')
            )

app.register_blueprint(tarea)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Render proporciona la variable PORT
    app.run(host="0.0.0.0", port=port, debug=True)  # Escucha en todas las interfaces
