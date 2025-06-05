from app.models import tarea

def listar_tareas():
    return tarea.listar_tareas()

def crear_tarea(descripcion):
    tarea.crear_tarea(descripcion)

def marcar_completada(id_tarea):
    tarea.marcar_completada(id_tarea)

def eliminar_tarea(id_tarea):
    tarea.eliminar_tarea(id_tarea)

def marcar_completada_estado(id_tarea, estado):
    tarea.actualizar_completada(id_tarea,estado)