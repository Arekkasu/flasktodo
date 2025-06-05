from flask import Blueprint, render_template, request, redirect, url_for, jsonify
from app.controllers import tarea_controller

# DEFINIR RUTA DE UNA SECCION
tarea = Blueprint('tarea', __name__)

# METODO GET HTTP
@tarea.route('/')
@tarea.route('/tareas')
def tareas_index():
    tareas = tarea_controller.listar_tareas()
    return render_template('tareas/index.html', algo=tareas)

# METODO GET HTTP
@tarea.route('/tareas/nueva')
def tareas_nueva():
    return render_template('tareas/nueva.html')

# METODO POST
@tarea.route('/tareas/crear', methods=['POST'])
def tareas_crear():
    descripcion = request.form.get('descripcion')
    if descripcion:
        tarea_controller.crear_tarea(descripcion)
    return redirect(url_for('tarea.tareas_index'))

@tarea.route('/tareas/completar/<int:id>', methods=["PUT"])
def tareas_completar(id):
    try:
        tarea_controller.marcar_completada(id)
        return jsonify({
            "mensaje": "Tarea Completada"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@tarea.route('/tareas/desmarcar/<int:id>', methods=["PUT"])
def tareas_desmarcar(id):
    try:
        tarea_controller.marcar_completada_estado(id, False)
        return jsonify({
            "mensaje": "Tarea Desmarcarda"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@tarea.route('/tareas/eliminar/<int:id>', methods=["DELETE"])
def tareas_eliminar(id):
    try:
        tarea_controller.eliminar_tarea(id)
        return jsonify({
            "mensaje": "Tarea Eliminada"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


