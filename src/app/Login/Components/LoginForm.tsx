'use client'
import { useForm } from 'react-hook-form'
import styles from './LoginForm.module.css'
import { Ilogin } from '@/app/Shared/Interfaces/Login.interface'

const LoginForm = () => {

    const {register,handleSubmit,formState: {errors}} = useForm<Ilogin>()

    const onSubmit = (data:Ilogin) => {
        console.log(data)
    }

  return (
    <div className={`${styles['border-neon-green']} bg-gray-900 text-white w-full max-w-md p-8 border rounded-lg shadow-lg`}>
        <h2 className={`${styles['text-neon-green']} text-3xl font-bold text-center mb-6`}>Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Input Usuario */}
            <div className="mb-4">
                <label className={`${styles['text-neon-green']} block text-sm font-bold mb-2`}>Usuario</label>
                <input type="text" placeholder="Ingresa tu usuario" className={`${styles['border-neon-green']} w-full p-3 bg-gray-800 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue`} {...register("username",{required:true,maxLength:24,minLength:10})}/>
                {
                    errors.username?.type === "required" && <span className="border-2 border-red-500 block mt-2 p-3 w-full text-red-500 border rounded-lg">El campo usuario esta vacio</span> || 
                    errors.username?.type === "maxLength" && <span className="border-2 border-yellow-500 block mt-2 p-3 w-full text-yellow-500 border rounded-lg">El campo supera el maximo de caracteres</span> ||
                    errors.username?.type === "minLength" && <span className="border-2 border-yellow-500 block mt-2 p-3 w-full text-yellow-500 border rounded-lg">El campo no supera los caracteres minimos</span>
                }
            </div>
                
            {/* Input Contraseña */}
            <div className="mb-4">
                <label className={`${styles['text-neon-green']} block text-sm font-bold mb-2`}>Contraseña</label>
                <input type="password" placeholder="********" className={`${styles['border-neon-green']} p-3 w-full p-3 bg-gray-800 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue`} {...register("password",{required:true, maxLength:10,minLength:5})}/>
                {
                    errors.password?.type === "required" && <span className="border-2 border-red-500 block mt-2 p-3 w-full text-red-500 border rounded-lg">El campo contraseña esta vacio</span> || 
                    errors.password?.type === "maxLength" && <span className="border-2 border-yellow-500 block mt-2 p-3 w-full text-yellow-500 border rounded-lg">El campo supera el maximo de caracteres</span> ||
                    errors.password?.type === "minLength" && <span className="border-2 border-yellow-500 block mt-2 p-3 w-full text-yellow-500 border rounded-lg">El campo no supera los caracteres minimos</span>
                }
            </div>

            {/* Botón de Login */}
            <button type='submit' className={`${styles['bg-neon-green']} w-full text-black font-bold py-3 rounded-lg hover:bg-neon-blue transition duration-300`}>Iniciar Sesión</button>
        </form>

        {/* Enlace de registro */}
        <p className="text-center text-sm text-gray-500 mt-6">¿No tienes una cuenta? 
            <a href="#" className={`${styles['text-neon-green']} hover:text-neon-blue`}>Regístrate</a>
        </p>
    </div>
  )
}

export default LoginForm