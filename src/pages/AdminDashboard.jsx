import { useEffect, useState } from "react";
import {
    getUsuarios,
    getProductos,
    getResumenVentas,
    getPedidos,
    editarUsuario,
    eliminarUsuario,
    editarProducto,
    eliminarProducto
} from '../services/api';

export default function AdminDashboard() {
    const [usuarios, setUsuarios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [resumen, setResumen] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Función reutilizable para cargar todos los datos del panel
    async function cargar() {
        setLoading(true);
        try {
            const [u, p, r, ped] = await Promise.all([
                getUsuarios(),
                getProductos(),
                getResumenVentas(),
                getPedidos()
            ]);
            setUsuarios(u || []);
            setProductos(p || []);
            setResumen(r || []);
            setPedidos(ped || []);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        cargar();
    }, []);

    // Calcular estadísticas (asegurarse de manejar valores faltantes o nombres distintos devueltos por el backend)
    const totalVentas = resumen.reduce((acc, r) => {
        const v = Number(r.totalRecaudado);
        return acc + (Number.isFinite(v) ? v : 0);
    }, 0);

    const totalProductosVendidos = resumen.reduce((acc, r) => {
        // el backend podría devolver 'cantidadVendidad' (typo) o 'cantidadVendida'
        const c = Number(r.cantidadVendidad ?? r.cantidadVendida ?? r.cantidad ?? 0);
        return acc + (Number.isFinite(c) ? c : 0);
    }, 0);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="container py-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-1 fw-bold" style={{ color: '#667eea' }}>
                                Panel del Administrador
                            </h2>
                            <p className="text-muted mb-0">Gestión y monitoreo del restaurante</p>
                        </div>
                        <button 
                            className="btn btn-outline-danger"
                            onClick={() => {
                                localStorage.clear();
                                window.location.href = '/';
                            }}
                        >
                            <svg width="18" height="18" fill="currentColor" className="me-2" viewBox="0 0 16 16" style={{ marginBottom: '2px' }}>
                                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                            </svg>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>

                    {/* Sección Pedidos (lista) */}
                    <div className="row g-4 mt-3">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-white border-0 pt-4 pb-3">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle p-2 me-3" style={{ background: 'rgba(0, 123, 255, 0.08)' }}>
                                            <svg width="20" height="20" fill="#0d6efd" viewBox="0 0 16 16">
                                                <path d="M8 0a2 2 0 0 0-2 2v1H4a2 2 0 0 0-2 2v1h12V6a2 2 0 0 0-2-2h-2V2a2 2 0 0 0-2-2z"/>
                                            </svg>
                                        </div>
                                        <h5 className="mb-0 fw-bold">Pedidos</h5>
                                    </div>
                                </div>
                                <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {pedidos.length === 0 ? (
                                        <p className="text-muted text-center py-4">No hay pedidos registrados</p>
                                    ) : (
                                        <div className="list-group list-group-flush">
                                            {pedidos.map(pd => (
                                                <div key={pd._id} className="list-group-item border-0 px-0 py-3">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <div className="fw-semibold">Mesa: {pd.mesa} • Estado: <span className="text-capitalize">{pd.estado}</span></div>
                                                            <small className="text-muted">Productos: {Array.isArray(pd.productos) ? pd.productos.length : 0}</small>
                                                        </div>
                                                        <div>
                                                            <small className="text-muted">ID: {pd._id.slice(-6)}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

            <div className="container py-4">
                {/* Tarjetas de estadísticas */}
                <div className="row g-4 mb-4">
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="rounded-circle p-3" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                                            <svg width="24" height="24" fill="#667eea" viewBox="0 0 16 16">
                                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="text-muted mb-1">Usuarios</h6>
                                        <h3 className="mb-0 fw-bold">{usuarios.length}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="rounded-circle p-3" style={{ background: 'rgba(118, 75, 162, 0.1)' }}>
                                            <svg width="24" height="24" fill="#764ba2" viewBox="0 0 16 16">
                                                <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A2.968 2.968 0 0 1 3 2.506V2.5zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43a.522.522 0 0 0 .023.07zM9 3h2.932a.56.56 0 0 0 .023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0V3zM1 4v2h6V4H1zm8 0v2h6V4H9zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5V7zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5H7z"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="text-muted mb-1">Productos</h6>
                                        <h3 className="mb-0 fw-bold">{productos.length}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="rounded-circle p-3" style={{ background: 'rgba(40, 167, 69, 0.1)' }}>
                                            <svg width="24" height="24" fill="#28a745" viewBox="0 0 16 16">
                                                <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="text-muted mb-1">Total Ventas</h6>
                                        <h3 className="mb-0 fw-bold">${totalVentas.toFixed(2)}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="rounded-circle p-3" style={{ background: 'rgba(255, 193, 7, 0.1)' }}>
                                            <svg width="24" height="24" fill="#ffc107" viewBox="0 0 16 16">
                                                <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="text-muted mb-1">Productos Vendidos</h6>
                                        <h3 className="mb-0 fw-bold">{totalProductosVendidos}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Sección Usuarios */}
                    <div className="col-lg-6">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-0 pt-4 pb-3">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle p-2 me-3" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                                        <svg width="20" height="20" fill="#667eea" viewBox="0 0 16 16">
                                            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                            <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
                                            <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                                        </svg>
                                    </div>
                                    <h5 className="mb-0 fw-bold">Usuarios del Sistema</h5>
                                </div>
                            </div>
                            <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {usuarios.length === 0 ? (
                                    <p className="text-muted text-center py-4">No hay usuarios registrados</p>
                                ) : (
                                    <div className="list-group list-group-flush">
                                        {usuarios.map(u => (
                                            <div key={u._id} className="list-group-item border-0 px-0 py-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="rounded-circle bg-light p-2 me-3">
                                                        <svg width="20" height="20" fill="#667eea" viewBox="0 0 16 16">
                                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                                        </svg>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-0 fw-semibold">{u.nombre}</h6>
                                                        <small className="text-muted">
                                                            {u.rol === 'administrador' && '👔 Administrador'}
                                                            {u.rol === 'mesero' && '🍽️ Mesero'}
                                                            {u.rol === 'cocina' && '👨‍🍳 Cocina'}
                                                        </small>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <span className={`badge ${
                                                            u.rol === 'administrador' ? 'bg-primary' :
                                                            u.rol === 'mesero' ? 'bg-success' : 'bg-warning'
                                                        }`}>
                                                            {u.rol}
                                                        </span>
                                                        <div className="ms-3">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                onClick={async () => {
                                                                    const nuevoRol = window.prompt('Nuevo rol (administrador, mesero, cocina):', u.rol);
                                                                    if (!nuevoRol) return;
                                                                    const nuevaClave = window.prompt('Nueva clave (dejar vacío para no cambiar):', '');
                                                                    const payload = { rol: nuevoRol };
                                                                    if (nuevaClave) payload.clave = nuevaClave;
                                                                    const res = await editarUsuario(u._id, payload);
                                                                    if (res) cargar();
                                                                }}
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={async () => {
                                                                    if (!window.confirm('¿Eliminar usuario? Esta acción no se puede deshacer.')) return;
                                                                    const res = await eliminarUsuario(u._id);
                                                                    if (res) cargar();
                                                                }}
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sección Productos */}
                    <div className="col-lg-6">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-0 pt-4 pb-3">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle p-2 me-3" style={{ background: 'rgba(118, 75, 162, 0.1)' }}>
                                        <svg width="20" height="20" fill="#764ba2" viewBox="0 0 16 16">
                                            <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A2.968 2.968 0 0 1 3 2.506V2.5zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43a.522.522 0 0 0 .023.07zM9 3h2.932a.56.56 0 0 0 .023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0V3zM1 4v2h6V4H1zm8 0v2h6V4H9zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5V7zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5H7z"/>
                                        </svg>
                                    </div>
                                    <h5 className="mb-0 fw-bold">Catálogo de Productos</h5>
                                </div>
                            </div>
                            <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {productos.length === 0 ? (
                                    <p className="text-muted text-center py-4">No hay productos registrados</p>
                                ) : (
                                    <div className="list-group list-group-flush">
                                        {productos.map(p => (
                                            <div key={p._id} className="list-group-item border-0 px-0 py-3">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="d-flex align-items-center">
                                                        <div className="rounded bg-light p-2 me-3">
                                                            🍽️
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-0 fw-semibold">{p.nombre}</h6>
                                                            <small className="text-muted">Código: {p._id.slice(-6)}</small>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <div className="text-end me-3">
                                                            <h6 className="mb-0 fw-bold text-success">${p.precio}</h6>
                                                        </div>
                                                        <div>
                                                            <button
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                onClick={async () => {
                                                                    const nuevoNombre = window.prompt('Nuevo nombre del producto:', p.nombre);
                                                                    if (!nuevoNombre) return;
                                                                    const nuevoPrecioStr = window.prompt('Nuevo precio:', String(p.precio));
                                                                    if (nuevoPrecioStr == null) return;
                                                                    const nuevoPrecio = Number(nuevoPrecioStr);
                                                                    if (Number.isNaN(nuevoPrecio)) {
                                                                        alert('Precio inválido');
                                                                        return;
                                                                    }
                                                                    const res = await editarProducto(p._id, { nombre: nuevoNombre, precio: nuevoPrecio });
                                                                    if (res) cargar();
                                                                }}
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={async () => {
                                                                    if (!window.confirm('¿Eliminar producto?')) return;
                                                                    const res = await eliminarProducto(p._id);
                                                                    if (res) cargar();
                                                                }}
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección Resumen de Ventas */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-0 pt-4 pb-3">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle p-2 me-3" style={{ background: 'rgba(40, 167, 69, 0.1)' }}>
                                        <svg width="20" height="20" fill="#28a745" viewBox="0 0 16 16">
                                            <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
                                        </svg>
                                    </div>
                                    <h5 className="mb-0 fw-bold">Resumen de Ventas</h5>
                                </div>
                            </div>
                            <div className="card-body">
                                {resumen.length === 0 ? (
                                    <p className="text-muted text-center py-4">No hay ventas registradas</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="fw-semibold">Mesero</th>
                                                    <th className="fw-semibold">Producto</th>
                                                    <th className="fw-semibold text-center">Cantidad</th>
                                                    <th className="fw-semibold text-end">Total Recaudado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {resumen.map((r, index) => (
                                                    <tr key={`${r.mesero}-${r.producto}-${index}`}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <span className="me-2">🍽️</span>
                                                                <span className="fw-semibold">{r.mesero}</span>
                                                            </div>
                                                        </td>
                                                        <td>{r.producto}</td>
                                                        <td className="text-center">
                                                            <span className="badge bg-info">{Number(r.cantidadVendidad ?? r.cantidadVendida ?? r.cantidad ?? 0) || 0}</span>
                                                        </td>
                                                        <td className="text-end">
                                                            <span className="fw-bold text-success">${Number.isFinite(Number(r.totalRecaudado)) ? Number(r.totalRecaudado).toFixed(2) : '0.00'}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}