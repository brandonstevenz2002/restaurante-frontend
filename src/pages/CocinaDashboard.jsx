import { useEffect, useState } from "react";
import { getPedidos, actualizarEstadoPedido, getProductos } from '../services/api';

export default function CocinaDashboard() {
    const [pedidos, setPedidos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function cargar() {
            setLoading(true);
            const pedidosData = await getPedidos();
            const productosData = await getProductos();
            setPedidos(pedidosData);
            setProductos(productosData);
            setLoading(false);
        }
        cargar();
    }, []);

    const cambiarEstado = async (id) => {
        if (!window.confirm('¿Marcar pedido como LISTO?')) return;
        
        try {
            setLoading(true);
            await actualizarEstadoPedido(id, 'listo');
            const pedidosActualizados = await getPedidos();
            setPedidos(pedidosActualizados);
        } catch (error) {
            console.error('Error al actualizar estado del pedido:', error);
            // Mostrar el mensaje de error crudo para depuración (puede ser JSON o texto)
            const msg = error && error.message ? error.message : 'No se pudo actualizar el estado. Intenta de nuevo.';
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    const obtenerNombreProducto = (id) => {
        // id puede venir como string o como objeto con distintas formas
        let buscado = id;
        if (id && typeof id === 'object') {
            // puede ser { producto: 'id' } o { productoId: 'id' } o el propio objeto producto
            buscado = id.producto || id.productoId || id._id || id.id || id;
        }
        const producto = productos.find(p => p._id === buscado || p.id === buscado);
        return producto ? producto.nombre : 'Producto desconocido';
    };

    const pedidosPendientes = pedidos.filter(p => p.estado !== 'listo');
    const pedidosListos = pedidos.filter(p => p.estado === 'listo');

    return (
        <div 
            className="min-vh-100 px-3 py-4"
            style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
        >
            <div className="container">
                {/* Botón Cerrar Sesión */}
                <div className="d-flex justify-content-end mb-3">
                    <button
                        className="btn btn-outline-light"
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
                {/* Header */}
                <div className="text-center mb-4">
                    <div 
                        className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                        style={{
                            width: '80px',
                            height: '80px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '50%'
                        }}
                    >
                        <svg width="40" height="40" fill="white" viewBox="0 0 16 16">
                            <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5v-1zM8.5 5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1zM3 11.5A1.5 1.5 0 0 1 4.5 10h1A1.5 1.5 0 0 1 7 11.5v1A1.5 1.5 0 0 1 5.5 14h-1A1.5 1.5 0 0 1 3 12.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm4.5.5a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 9 12.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z"/>
                        </svg>
                    </div>
                    <h1 className="fw-bold text-white mb-2" style={{ fontSize: '2rem' }}>
                        👨‍🍳 Panel de Cocina
                    </h1>
                    <p className="text-white mb-0" style={{ opacity: 0.95 }}>
                        Gestión de pedidos en tiempo real
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                            <div className="card-body text-center py-3">
                                <h3 className="mb-1" style={{ color: '#667eea', fontSize: '2rem' }}>
                                    {pedidosPendientes.length}
                                </h3>
                                <p className="text-muted mb-0 fw-semibold">Pedidos Pendientes</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                            <div className="card-body text-center py-3">
                                <h3 className="mb-1" style={{ color: '#28a745', fontSize: '2rem' }}>
                                    {pedidosListos.length}
                                </h3>
                                <p className="text-muted mb-0 fw-semibold">Pedidos Listos</p>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-white" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Pedidos Pendientes */}
                        {pedidosPendientes.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-white fw-bold mb-3">🔥 En Preparación</h4>
                                <div className="row">
                                    {pedidosPendientes.map(p => (
                                        <div key={p._id} className="col-lg-6 mb-3">
                                            <div 
                                                className="card border-0 shadow-lg h-100"
                                                style={{ 
                                                    borderRadius: '15px',
                                                    borderLeft: '5px solid #667eea'
                                                }}
                                            >
                                                <div className="card-body">
                                                    {/* Header del pedido */}
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <div>
                                                            <h5 className="mb-1 fw-bold">Mesa {p.mesa}</h5>
                                                            <span 
                                                                className="badge px-3 py-2"
                                                                style={{
                                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                    fontSize: '0.85rem'
                                                                }}
                                                            >
                                                                {p.estado}
                                                            </span>
                                                        </div>
                                                        <button 
                                                            className="btn btn-success btn-lg"
                                                            onClick={() => cambiarEstado(p._id)}
                                                            style={{ borderRadius: '10px' }}
                                                        >
                                                            ✓ Listo
                                                        </button>
                                                    </div>

                                                    {/* Lista de productos */}
                                                    <div 
                                                        className="p-3"
                                                        style={{ 
                                                            background: '#f8f9fa',
                                                            borderRadius: '10px'
                                                        }}
                                                    >
                                                        <p className="fw-semibold mb-2 text-secondary">Productos:</p>
                                                        <ul className="list-unstyled mb-0">
                                                            {p.productos.map((prod, index) => (
                                                                <li key={index} className="mb-2 d-flex align-items-center">
                                                                    <span 
                                                                        className="badge bg-primary me-2"
                                                                        style={{ minWidth: '30px' }}
                                                                    >
                                                                        {prod.cantidad}x
                                                                    </span>
                                                                    <span className="fw-semibold">
                                                                        {obtenerNombreProducto(prod.producto)}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pedidos Listos */}
                        {pedidosListos.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-white fw-bold mb-3">✓ Listos para Servir</h4>
                                <div className="row">
                                    {pedidosListos.map(p => (
                                        <div key={p._id} className="col-lg-6 mb-3">
                                            <div 
                                                className="card border-0 shadow h-100"
                                                style={{ 
                                                    borderRadius: '15px',
                                                    borderLeft: '5px solid #28a745',
                                                    opacity: 0.85
                                                }}
                                            >
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <div>
                                                            <h5 className="mb-1 fw-bold">Mesa {p.mesa}</h5>
                                                            <span className="badge bg-success px-3 py-2">
                                                                {p.estado}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div 
                                                        className="p-3"
                                                        style={{ 
                                                            background: '#f8f9fa',
                                                            borderRadius: '10px'
                                                        }}
                                                    >
                                                        <p className="fw-semibold mb-2 text-secondary">Productos:</p>
                                                        <ul className="list-unstyled mb-0">
                                                            {p.productos.map((prod, index) => (
                                                                <li key={index} className="mb-2 d-flex align-items-center">
                                                                    <span 
                                                                        className="badge bg-secondary me-2"
                                                                        style={{ minWidth: '30px' }}
                                                                    >
                                                                        {prod.cantidad}x
                                                                    </span>
                                                                    <span>
                                                                        {obtenerNombreProducto(prod.producto)}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sin pedidos */}
                        {pedidos.length === 0 && (
                            <div className="text-center py-5">
                                <div 
                                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        borderRadius: '50%'
                                    }}
                                >
                                    <span style={{ fontSize: '3rem' }}>😴</span>
                                </div>
                                <h4 className="text-white">No hay pedidos en este momento</h4>
                                <p className="text-white-50">Los nuevos pedidos aparecerán aquí automáticamente</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}