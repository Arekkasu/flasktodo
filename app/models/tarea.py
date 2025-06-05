# LA CONEXION DE LA BASE DATOS CON PYTHON
import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__)) # CARPETA SCRIPT (./app/model/tarea.py)
DB_PATH = os.path.join(BASE_DIR, "..", "..", "todo.db")
# GUARDADA RUTA DE LA UBICACION DE LA BASE DE DATOS
DB_PATH = os.path.abspath(DB_PATH)

def obtener_conexion():
    return sqlite3.connect(DB_PATH)

def crear_tarea(descripcion):
    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO tareas (descripcion, completada) VALUES (?,?)", (descripcion, False)
    )
    conn.commit()
    conn.close()

def listar_tareas():
    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute("SELECT id,descripcion,completada FROM tareas")
    tareas = cursor.fetchall()
    print(tareas)
    conn.close()
    return tareas

def marcar_completada(id_tarea):
    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE tareas SET completada = ? WHERE id = ?", (True, id_tarea)
    )
    conn.commit()
    conn.close()


def eliminar_tarea(id_tarea):
    print(id_tarea)
    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM tareas WHERE id = ?", (id_tarea,)
    )
    conn.commit()
    conn.close()

def actualizar_completada(id_tarea, estado):
    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute(                         # TRUE FALSE == 1 o 0
        "UPDATE tareas SET completada = ? WHERE id = ?", (int(estado), id_tarea)
    )
    conn.commit()
    conn.close()
