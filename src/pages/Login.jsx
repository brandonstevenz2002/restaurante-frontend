import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export default function Login() {
  const [clave, setClave] = useState('');
  const [rol, setRol] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const credenciales = { clave, rol };
    const data = await login(credenciales);

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.rol);
      if (data.rol === 'administrador') navigate('/admin');
      else if (data.rol === 'mesero') navigate('/mesero');
      else if (data.rol === 'cocina') navigate('/cocina');
    } else {
      alert('Credenciales inválidas');
      setLoading(false);
    }
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center px-3"
      style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            
            {/* Card principal */}
            <div 
              className="card shadow-lg border-0"
              style={{ borderRadius: '20px', maxWidth: '500px', margin: '0 auto' }}
            >
              
              {/* Header con icono */}
              <div className="card-body text-center pt-4 pb-3" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '20px 20px 0 0'
              }}>
                <div 
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '70px',
                    height: '70px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%'
                  }}
                >
                  <svg width="35" height="35" fill="white" viewBox="0 0 16 16">
                    <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A2.968 2.968 0 0 1 3 2.506V2.5zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43a.522.522 0 0 0 .023.07zM9 3h2.932a.56.56 0 0 0 .023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0V3zM1 4v2h6V4H1zm8 0v2h6V4H9zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5V7zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5H7z"/>
                  </svg>
                </div>
                <h2 className="fw-bold mb-2 text-white" style={{ fontSize: '1.75rem' }}>Bienvenido</h2>
                <p className="text-white mb-0" style={{ fontSize: '0.95rem', opacity: 0.95 }}>Sistema de Gestión de Restaurante</p>
              </div>

              {/* Formulario */}
              <div className="card-body px-4 py-4">
                <form onSubmit={handleSubmit}>
                  
                  {/* Campo Contraseña */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      Contraseña
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <svg width="18" height="18" fill="currentColor" className="text-secondary" viewBox="0 0 16 16">
                          <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                        </svg>
                      </span>
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        placeholder="Ingresa tu contraseña"
                        value={clave}
                        onChange={(e) => setClave(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Campo Rol */}
                  <div className="mb-4">
                    <label htmlFor="rol" className="form-label fw-semibold">
                      Rol de Usuario
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <svg width="18" height="18" fill="currentColor" className="text-secondary" viewBox="0 0 16 16">
                          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                          <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                        </svg>
                      </span>
                      <select
                        id="rol"
                        className="form-select"
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                        required
                      >
                        <option value="">Selecciona tu rol</option>
                        <option value="administrador">👔 Administrador</option>
                        <option value="mesero">🍽️ Mesero</option>
                        <option value="cocina">👨‍🍳 Cocina</option>
                      </select>
                    </div>
                  </div>

                  {/* Botón de ingreso */}
                  <button
                    type="submit"
                    className="btn btn-lg w-100 text-white fw-semibold mt-3"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Verificando...
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </button>
                </form>

                {/* Texto de ayuda */}
                <div className="text-center mt-4">
                  <small className="text-muted">
                    ¿Problemas para acceder? Contacta al administrador
                  </small>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <small className="text-white-50">
                © 2024 Sistema de Restaurante. Todos los derechos reservados.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}