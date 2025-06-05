document.addEventListener('DOMContentLoaded', () => {
  // Manejador de acciones para los botones
  document.querySelectorAll('.btn-action').forEach(button => {
    button.addEventListener('click', handleAction);
  });
});

// Función para manejar las acciones de los botones
async function handleAction(event) {
  event.preventDefault();
  const button = event.currentTarget;
  const action = button.dataset.action;
  const id = button.dataset.id;
  const li = document.querySelector(`li[data-id="${id}"]`);

  // Deshabilitar el botón mientras se procesa la acción
  button.disabled = true;
  try {
    let response;
    let url;
    let method;

    switch (action) {
      case 'completar':
        url = `/tareas/completar/${id}`;
        method = 'PUT';
        break;
      case 'desmarcar':
        url = `/tareas/desmarcar/${id}`;
        method = 'PUT';
        break;
      case 'eliminar':
        if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
          button.disabled = false;
          return;
        }
        url = `/tareas/eliminar/${id}`;
        method = 'DELETE';
        break;
      default:
        throw new Error('Acción no válida');
    }

    response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en el servidor');
    }

    const data = await response.json();

    // Manejar la respuesta según la acción
    switch (action) {
      case 'completar':
        li.classList.add('completada');
        updateTaskUI(li, true);
        showToast('success', data.mensaje);
        break;
      case 'desmarcar':
        li.classList.remove('completada');
        updateTaskUI(li, false);
        showToast('success', data.mensaje);
        break;
      case 'eliminar':
        li.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
          li.remove();
          checkEmptyList();
          showToast('success', data.mensaje);
        }, 300);
        break;
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('error', error.message || 'Error al procesar la acción');
    // Si hay un error, revertir cualquier cambio visual
    if (action === 'completar') {
      li.classList.remove('completada');
    } else if (action === 'desmarcar') {
      li.classList.add('completada');
    }
  } finally {
    // Re-habilitar el botón
    button.disabled = false;
  }
}

// Función para actualizar la UI de la tarea
function updateTaskUI(li, completada) {
  const contenido = li.querySelector('.tarea-contenido');
  const textoActual = contenido.querySelector('.tarea-texto').textContent.trim();
  
  // Eliminar los iconos del texto si existen
  const textoLimpio = textoActual.replace(/^\s*[^\w\s].*?\s/, '').trim();

  const html = `
    <span class="tarea-texto">
      <i class="fas ${completada ? 'fa-check-circle' : 'fa-circle'}"></i>
      ${textoLimpio}
    </span>
    <div class="tarea-acciones">
      ${completada ? 
        `<button class="btn-desmarcar btn-action" data-action="desmarcar" data-id="${li.dataset.id}">
          <i class="fas fa-undo"></i> Desmarcar
        </button>` :
        `<button class="btn-completar btn-action" data-action="completar" data-id="${li.dataset.id}">
          <i class="fas fa-check"></i> Completar
        </button>`
      }
      <button class="btn-eliminar btn-action" data-action="eliminar" data-id="${li.dataset.id}">
        <i class="fas fa-trash"></i> Eliminar
      </button>
    </div>
  `;
  contenido.innerHTML = html;
  
  // Volver a agregar los event listeners a los nuevos botones
  contenido.querySelectorAll('.btn-action').forEach(button => {
    button.addEventListener('click', handleAction);
  });
}

// Función para mostrar notificaciones toast
function showToast(type, message) {
  const toast = document.getElementById('toast');
  const icon = toast.querySelector('.toast-icon');
  const messageEl = toast.querySelector('.toast-message');

  // Limpiar cualquier timeout existente
  if (toast.timeoutId) {
    clearTimeout(toast.timeoutId);
  }

  // Configurar el icono según el tipo
  icon.className = 'toast-icon fas ' + (type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle');
  
  // Establecer el mensaje
  messageEl.textContent = message;

  // Establecer la clase de estilo
  toast.className = `toast ${type} show`;

  // Ocultar después de 3 segundos
  toast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Función para verificar si la lista está vacía
function checkEmptyList() {
  const lista = document.querySelector('.tareas-lista');
  if (!lista.children.length) {
    lista.innerHTML = `
      <li class="no-tareas">
        <i class="fas fa-inbox"></i>
        <p>No hay tareas pendientes.</p>
        <a href="/tareas/nueva" class="btn-add">
          Crear primera tarea
        </a>
      </li>
    `;
  }
}

// Agregar animación de fadeOut al CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(-10px);
    }
  }
`;
document.head.appendChild(style);
