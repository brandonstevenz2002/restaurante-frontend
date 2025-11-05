import { useState, useEffect } from "react";
import { getProductos, crearPedido, getPedidos } from '../services/api';

export default function MeseroDashboard() {
    const [productos, setProductos] = useState([]);
    const [mesa, setMesa] = useState('');
    const [pedido, setPedido] = useState([]);
    const [total, setTotal] = useState(0);
    const [pedidosRealizados, setPedidosRealizados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        async function cargar() {
            try {
                setLoading(true);
                console.log('Cargando productos...');
                const data = await getProductos();
                console.log('Productos recibidos:', data);
                setProductos(data || []); // Aseguramos que siempre sea un array
                
                console.log('Cargando pedidos...');
                const pedidos = await getPedidos();
                console.log('Pedidos recibidos:', pedidos);
                setPedidosRealizados(pedidos || []); // Aseguramos que siempre sea un array
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setProductos([]);
                setPedidosRealizados([]);
            } finally {
                setLoading(false);
            }
        }
        cargar();
    }, []);

    const agregarProducto = (productoId, precio, nombre) => {
        const existente = pedido.find(p => p.producto === productoId);
        let nuevoPedido;
        if (existente) {
            nuevoPedido = pedido.map(p => 
                p.producto === productoId ? { ...p, cantidad: p.cantidad + 1 } : p
            );
        } else {
            nuevoPedido = [...pedido, { producto: productoId, cantidad: 1, nombre, precio }];
        }
        setPedido(nuevoPedido);
        setTotal(total + precio);
    };

    const quitarProducto = (productoId, precio) => {
        const existente = pedido.find(p => p.producto === productoId);
        if (existente.cantidad > 1) {
            const nuevoPedido = pedido.map(p => 
                p.producto === productoId ? { ...p, cantidad: p.cantidad - 1 } : p
            );
            setPedido(nuevoPedido);
        } else {
            setPedido(pedido.filter(p => p.producto !== productoId));
        }
        setTotal(total - precio);
    };

    const enviarPedido = async () => {
        if (!mesa || pedido.length === 0) {
            alert('Por favor ingresa el número de mesa y agrega productos');
            return;
        }

        try {
            setEnviando(true);
            console.log('Preparando pedido para enviar...');
            
            const productosFormateados = pedido.map(p => ({
                productoId: p.producto,
                cantidad: p.cantidad
            }));

            console.log('Enviando pedido:', {
                mesa: parseInt(mesa),
                productos: productosFormateados
            });

            const resultado = await crearPedido({
                mesa: parseInt(mesa),
                productos: productosFormateados,
                total: total
            });

            console.log('Respuesta del servidor:', resultado);

            // Considerar exitoso si el servidor devuelve cualquiera de estos casos:
            // - campo 'pedido' con el pedido creado
            // - un _id/id/pedidoId del pedido
            // - un mensaje que indique 'Pedido creado'
            const okCrear = resultado && (
                resultado.pedido ||
                resultado._id ||
                resultado.id ||
                resultado.pedidoId ||
                (/pedido creado/i).test(resultado.mensaje || '')
            );

            if (okCrear) {
                setMesa('');
                setPedido([]);
                setTotal(0);
                const pedidos = await getPedidos();
                setPedidosRealizados(pedidos || []);
                // Preferir mostrar el mensaje del servidor si lo hay
                alert(resultado.mensaje || 'Pedido creado correctamente');
            } else {
                // Mostrar la respuesta completa para depuración
                console.warn('Respuesta inesperada al crear pedido:', resultado);
                throw new Error('Respuesta inesperada del servidor');
            }
        } catch (error) {
            console.error('Error al crear pedido:', error);
            alert('Error: ' + (error.message || 'No se pudo crear el pedido. Por favor intenta de nuevo.'));
        } finally {
            setEnviando(false);
        }
    };

    const obtenerColorEstado = (estado) => {
        switch(estado.toLowerCase()) {
            case 'procesando': return '#f39c12';
            case 'pendiente': return '#667eea';
            case 'en preparacion': case 'en preparación': return '#f39c12';
            case 'listo': return '#28a745';
            default: return '#6c757d';
        }
    };

    const obtenerEtiquetaEstado = (estado) => {
        switch(estado.toLowerCase()) {
            case 'procesando': return '🔄 Procesando';
            case 'pendiente': return '⏳ Pendiente';
            case 'en preparacion': case 'en preparación': return '👨‍🍳 En Preparación';
            case 'listo': return '✅ Listo';
            default: return estado;
        }
    };

    return (
        <div 
            className="min-vh-100 px-3 py-4"
            style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
        >
            <div className="container-fluid" style={{ maxWidth: '1400px' }}>
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
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                        </svg>
                    </div>
                    <h1 className="fw-bold text-white mb-2" style={{ fontSize: '2rem' }}>
                        🍽️ Panel de Mesero
                    </h1>
                    <p className="text-white mb-0" style={{ opacity: 0.95 }}>
                        Gestión de pedidos y comandas
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-white" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        {/* Panel izquierdo - Crear pedido */}
                        <div className="col-lg-8 mb-4">
                            {/* Selector de Mesa */}
                            <div className="card border-0 shadow-lg mb-4" style={{ borderRadius: '15px' }}>
                                <div 
                                    className="card-header border-0 text-white fw-bold py-3"
                                    style={{ 
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        borderRadius: '15px 15px 0 0'
                                    }}
                                >
                                    📋 Nuevo Pedido
                                </div>
                                <div className="card-body p-4">
                                    <label className="form-label fw-semibold">Número de Mesa</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="form-control form-control-lg"
                                        placeholder="Ej: 5"
                                        value={mesa}
                                        onChange={(e) => {
                                            const valor = parseInt(e.target.value);
                                            if (!isNaN(valor) && valor > 0) {
                                                setMesa(valor);
                                            } else if (e.target.value === '') {
                                                setMesa('');
                                            }
                                        }}
                                        style={{ borderRadius: '10px', border: '2px solid #e9ecef' }}
                                    />
                                </div>
                            </div>

                            {/* Menú de Productos */}
                            <div className="card border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                                <div 
                                    className="card-header border-0 text-white fw-bold py-3"
                                    style={{ 
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        borderRadius: '15px 15px 0 0'
                                    }}
                                >
                                    🍕 Menú Disponible
                                </div>
                                <div className="card-body p-4">
                                    <div className="row">
                                        {productos.map(p => (
                                            <div className="col-md-6 col-xl-4 mb-3" key={p._id}>
                                                <div 
                                                    className="card h-100 border-0 shadow-sm"
                                                    style={{ 
                                                        borderRadius: '12px',
                                                        transition: 'transform 0.2s',
                                                        cursor: 'pointer'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                                >
                                                    <div className="card-body text-center p-3">
                                                        <div 
                                                            className="mx-auto mb-2 d-flex align-items-center justify-content-center"
                                                            style={{
                                                                width: '60px',
                                                                height: '60px',
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                borderRadius: '50%'
                                                            }}
                                                        >
                                                            <span style={{ fontSize: '1.8rem' }}>🍴</span>
                                                        </div>
                                                        <h6 className="fw-bold mb-2">{p.nombre}</h6>
                                                        <p className="text-success fw-bold mb-3" style={{ fontSize: '1.2rem' }}>
                                                            ${p.precio}
                                                        </p>
                                                        <button 
                                                            className="btn btn-sm w-100 text-white"
                                                            onClick={() => agregarProducto(p._id, p.precio, p.nombre)}
                                                            style={{
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                border: 'none',
                                                                borderRadius: '8px'
                                                            }}
                                                        >
                                                            + Agregar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Panel derecho - Resumen y pedidos */}
                        <div className="col-lg-4">
                            {/* Carrito de pedido actual */}
                            <div className="card border-0 shadow-lg mb-4" style={{ borderRadius: '15px', position: 'sticky', top: '20px' }}>
                                <div 
                                    className="card-header border-0 text-white fw-bold py-3"
                                    style={{ 
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        borderRadius: '15px 15px 0 0'
                                    }}
                                >
                                    🛒 Pedido Actual
                                </div>
                                <div className="card-body p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {pedido.length === 0 ? (
                                        <div className="text-center py-4">
                                            <p className="text-muted">No hay productos agregados</p>
                                        </div>
                                    ) : (
                                        <div>
                                            {pedido.map((item, index) => (
                                                <div 
                                                    key={index} 
                                                    className="d-flex justify-content-between align-items-center mb-3 p-2"
                                                    style={{ 
                                                        background: '#f8f9fa',
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    <div className="flex-grow-1">
                                                        <div className="fw-semibold">{item.nombre}</div>
                                                        <small className="text-success">${item.precio} c/u</small>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => quitarProducto(item.producto, item.precio)}
                                                            style={{ borderRadius: '6px', width: '30px', height: '30px', padding: '0' }}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="mx-2 fw-bold">{item.cantidad}</span>
                                                        <button 
                                                            className="btn btn-sm btn-outline-success"
                                                            onClick={() => agregarProducto(item.producto, item.precio, item.nombre)}
                                                            style={{ borderRadius: '6px', width: '30px', height: '30px', padding: '0' }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div 
                                    className="card-footer border-0 p-3"
                                    style={{ background: '#f8f9fa', borderRadius: '0 0 15px 15px' }}
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="fw-bold" style={{ fontSize: '1.2rem' }}>Total:</span>
                                        <span className="fw-bold text-success" style={{ fontSize: '1.5rem' }}>
                                            ${total}
                                        </span>
                                    </div>
                                    <button
                                        className="btn btn-lg w-100 text-white fw-semibold"
                                        onClick={enviarPedido}
                                        disabled={enviando || pedido.length === 0 || !mesa}
                                        style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            border: 'none',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        {enviando ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Enviando...
                                            </>
                                        ) : (
                                            '📤 Enviar a Cocina'
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Mis Pedidos */}
                            <div className="card border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                                <div 
                                    className="card-header border-0 text-white fw-bold py-3"
                                    style={{ 
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        borderRadius: '15px 15px 0 0'
                                    }}
                                >
                                    📝 Pedidos Realizados
                                </div>
                                <div className="card-body p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {pedidosRealizados.length === 0 ? (
                                        <div className="text-center py-3">
                                            <p className="text-muted">No hay pedidos registrados</p>
                                        </div>
                                    ) : (
                                        <div>
                                            {pedidosRealizados.map(p => (
                                                <div 
                                                    key={p._id}
                                                    className="mb-2 p-3"
                                                    style={{ 
                                                        background: '#f8f9fa',
                                                        borderRadius: '10px',
                                                        borderLeft: `4px solid ${obtenerColorEstado(p.estado)}`
                                                    }}
                                                >
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span className="fw-bold">Mesa {p.mesa}</span>
                                                        <span className="fw-bold text-success">${p.total}</span>
                                                    </div>
                                                    <span 
                                                        className="badge px-2 py-1"
                                                        style={{ 
                                                            background: obtenerColorEstado(p.estado),
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        {obtenerEtiquetaEstado(p.estado)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}