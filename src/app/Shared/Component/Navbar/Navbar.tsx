import Link from 'next/link'
import styles from './Navbar.module.css'

const Navbar = () => {
  return (
    <nav className={`${styles['border-neon-green']} bg-gray-900 border-b-4 shadow-lg`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className={`text-2xl font-bold ${styles['text-neon-green']} tracking-widest`}>
          <span className={`${styles['hover:text-neon-blue']} cursor-pointer`}>🎧 Kodigo Music</span>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-8 text-lg">
            <Link href={"/"} className={`${styles['hover:text-neon-green']} text-white transition duration-300`}>Inicio</Link>
            <Link href={"/Login"} className={`${styles['hover:text-neon-green']} text-white transition duration-300`}>Iniciar Sesion</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar