import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "px-4 py-2 border-b-2 border-[#FF9D6F] text-[#FF9D6F] font-semibold tracking-widest"
      : "px-4 py-2 text-white/90 hover:text-[#FF9D6F] transition tracking-widest";

  return (
    <nav className="absolute top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 text-white uppercase text-sm md:text-base tracking-widest">
        
        <NavLink to="/" className="flex items-center">
          <img
            src="/images/logo-proyecto.png"
            alt="Logo WasteMars"
            className="h-20 w-auto cursor-pointer hover:scale-105 transition-transform"
          />
        </NavLink>

        <div className="flex gap-8 items-center">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/mars-simulator" className={linkClass}>
            Simulator
          </NavLink>
          <NavLink to="/game" className={linkClass}>
            Wastecraft
          </NavLink>

          <NavLink
            to="/request"
            className={({ isActive }) =>
              `px-6 py-3 font-bold tracking-widest text-sm md:text-base transition transform ${
                isActive
                  ? "bg-[#FF9D6F] text-black shadow-[0_0_8px_#FF9D6F,0_0_16px_#FF9D6F] scale-102"
                  : "bg-[#FF9D6F] text-black hover:bg-[#f0a585] shadow-[0_0_5px_#FF9D6F,0_0_10px_#FF9D6F] hover:shadow-[0_0_10px_#FF9D6F,0_0_20px_#FF9D6F] hover:scale-102"
              }`
            }
          >
            Request
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
