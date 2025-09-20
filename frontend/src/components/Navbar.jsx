import { NavLink } from "react-router-dom";

export default function Navbar(){
  const linkClass = ({isActive}) => isActive 
    ? "px-4 py-2 border-b-2 border-white"
    : "px-4 py-2 hover:text-gray-300";

  return (
    <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-80 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 text-white uppercase text-sm tracking-wide">
        <div className="font-bold text-lg">MarsWaste</div>
        <div className="flex gap-6">
          <NavLink to="/" className={linkClass}>Inicio</NavLink>
          <NavLink to="/catalog" className={linkClass}>Datos</NavLink>
          <NavLink to="/game" className={linkClass}>Juego</NavLink>
        </div>
      </div>
    </nav>
  );
}
