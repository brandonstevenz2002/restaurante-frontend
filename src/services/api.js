const API = 'http://localhost:3000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

export const login = async (credenciales) => {
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credenciales)
    });
    if (!res.ok) throw new Error('Error al iniciar sesión');
    return res.json();
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const getProductos = async () => {
  try {
    const res = await fetch(`${API}/productos`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Error al obtener productos');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const crearPedido = async (data) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Construir payload de forma segura (acepta tanto productoId como producto)
    const payload = {
      mesa: data.mesa,
      productos: (data.productos || []).map(p => ({
        productoId: p.productoId || p.producto,
        cantidad: p.cantidad
      })),
      // incluir total si el frontend lo envía
      ...(data.total !== undefined ? { total: data.total } : {})
    };

    console.debug('crearPedido - payload:', payload);

    const res = await fetch(`${API}/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      // Intentar leer JSON; si falla, leer texto
      let errText = `Status ${res.status} ${res.statusText}`;
      try {
        const errorData = await res.json();
        errText = errorData.mensaje || JSON.stringify(errorData);
      } catch (parseError) {
        try {
          const text = await res.text();
          if (text) errText = text;
        } catch (_) {}
      }
      throw new Error(`Error al crear pedido: ${errText}`);
    }

    const responseData = await res.json();
    // Algunos backends pueden devolver sólo { mensaje: 'Pedido creado' }
    // o devolver el pedido directamente. No hacer la validación estricta aquí;
    // devolver lo que el servidor respondió y dejar que el componente lo procese.
    if (!responseData) {
      console.warn('crearPedido: respuesta vacía del servidor');
    }
    return responseData;
  } catch (error) {
    console.error('Error al crear pedido:', error);
    throw error;
  }
};

export const actualizarEstadoPedido = async (id, estado) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No hay token de autenticación');

    const payload = { estado };
    console.debug(`actualizarEstadoPedido - id: ${id}, payload:`, payload);

    const res = await fetch(`${API}/pedidos/${id}/estado`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      let errText = `Status ${res.status} ${res.statusText}`;
      try {
        const errJson = await res.json();
        errText = errJson.mensaje || JSON.stringify(errJson);
      } catch (e) {
        try {
          const txt = await res.text();
          if (txt) errText = txt;
        } catch (_) {}
      }
      throw new Error(`Error al actualizar estado: ${errText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('actualizarEstadoPedido error:', error);
    throw error;
  }
};

export const getUsuarios = async () => {
  try {
    const res = await fetch(`${API}/usuarios`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Error al obtener usuarios');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getResumenVentas = async () => {
  try {
    const res = await fetch(`${API}/ventas/resumen`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Error al obtener resumen de ventas');
    return res.json();
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const getPedidos = async () => {
  try {
    const res = await fetch(`${API}/pedidos`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Error al obtener pedidos');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const editarUsuario = async (id, data) => {
  try {
    const res = await fetch(`${API}/usuarios/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al editar usuario');
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const eliminarUsuario = async (id) => {
  try {
    const res = await fetch(`${API}/usuarios/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Error al eliminar usuario');
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const editarProducto = async (id, data) => {
  try {
    const res = await fetch(`${API}/productos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al editar producto');
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const eliminarProducto = async (id) => {
  try {
    const res = await fetch(`${API}/productos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Error al eliminar producto');
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};
