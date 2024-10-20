import styles from './LoginForm.module.css'

const LoginForm = () => {
  return (
    <div className={`${styles['border-neon-green']} bg-gray-900 text-white w-full max-w-md p-8 border rounded-lg shadow-lg`}>
        <h2 className={`${styles['text-neon-green']} text-3xl font-bold text-center mb-6`}>Iniciar Sesión</h2>
            
        {/* Input Usuario */}
        <div className="mb-4">
            <label className={`${styles['text-neon-green']} block text-sm font-bold mb-2`}>Usuario</label>
            <input type="text" placeholder="Ingresa tu usuario" className={`${styles['border-neon-green']} w-full p-3 bg-gray-800 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue`}/>
        </div>
            
        {/* Input Contraseña */}
        <div className="mb-4">
            <label className={`${styles['text-neon-green']} block text-sm font-bold mb-2`}>Contraseña</label>
            <input type="password" placeholder="********" className={`${styles['border-neon-green']} w-full p-3 bg-gray-800 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue`}/>
        </div>

        {/* Botón de Login */}
        <button className={`${styles['bg-neon-green']} w-full text-black font-bold py-3 rounded-lg hover:bg-neon-blue transition duration-300`}>Iniciar Sesión</button>
            
        {/* Enlace de registro */}
        <p className="text-center text-sm text-gray-500 mt-6">¿No tienes una cuenta? 
            <a href="#" className={`${styles['text-neon-green']} hover:text-neon-blue`}>Regístrate</a>
        </p>
    </div>
  )
}

export default LoginForm