// frontend/src/pages/Home.jsx
import { Link, useNavigate } from "react-router-dom";
import ThreeScene from "../components/ThreeScene";
import newsData from "../data/newsData";
import systemData from "../data/systemData";
import Counter from "../components/Counter"; // <- librería para la animación
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Inyectamos la fuente "Orbitron" de Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="w-full text-white bg-black" style={{ fontFamily: "Orbitron, sans-serif" }}>
      {/* === HERO (portada) === */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/backgrounds/mars-bg.jpg')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90"
          aria-hidden="true"
        />

        <div className="relative z-10 px-6">
          <h1 className="text-7xl md:text-9xl font-extrabold uppercase tracking-widest leading-tight text-[#ffffff]">
            WASTEMARS
          </h1>
          <p className="text-xl md:text-2xl font-medium mt-4 tracking-wide text-[#C67B5C]">
            Start recycling with us
          </p>
          <button
          onClick={() => navigate("/request")} 
          className="mt-12 inline-block px-6 py-3 border border-[#E27B58] text-[#E27B58] hover:bg-[#E27B58] hover:text-black transition"
          >
           Recycle →
          </button>
        </div>
      </section>

      {/* === SECCIÓN 3D === */}
      <section
        id="three-section"
        className="relative flex flex-col md:flex-row items-center justify-between min-h-screen px-8 py-20 overflow-hidden"
      >
        {/* 🔹 Fondo detrás del 3D */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('/backgrounds/mars-scene-bg.jpg')",
            zIndex: 0,
          }}
          aria-hidden="true"
        />

        {/* 🔸 Contenido izquierdo */}
        <div className="z-10 max-w-xl p-6">
          <h2 className="text-4xl md:text-5xl font-bold uppercase text-[#FF9D6F]">
            ABOUT US
          </h2>
          <p className="text-[#99857A] leading-relaxed mt-6">
            WasteMars aims to demonstrate how waste management could play a crucial role 
            in future human colonies on Mars. It also features an interactive recycling 
            system for students, along with simulations of future missions and colonies.
          </p>
          <button
            onClick={() => scrollTo("data-section")}
            className="mt-12 inline-block px-6 py-3 border border-[#E27B58] text-[#E27B58] hover:bg-[#E27B58] hover:text-black transition"
          >
            More ↓
          </button>

          <div className="mt-16 flex justify-center gap-12">
            <Counter end={1250} duration={3000} label="RECYCLED KG" />
            <Counter end={45} duration={2000} label="COMPLETED PROJECTS" />
          </div>
        </div>

        {/* 🔸 Escena 3D */}
        <div className="w-full md:w-1/2 p-6 z-10">
          <div className="h-[60vh] md:h-[80vh] rounded-2xl overflow-hidden">
            <ThreeScene />
          </div>
        </div>
      </section>

      {/* === FUNCIONAMIENTO DEL SISTEMA === */}
      <section 
      id="data-section"
      className="relative px-8 py-20 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold uppercase mb-12 text-[#FF9D6F]">
            {systemData.title}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {systemData.items.map((item) => (
              <div key={item.id} className="flex flex-col items-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-32 h-32 object-contain mb-4"
                />
                <p className="font-semibold text-[#E27B58]">{item.title}</p>
                <p className="text-[#99857A] text-sm leading-relaxed mt-1">
                {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === EL JUEGO === */}
      <section className="relative min-h-[60vh] px-8 py-20 text-center overflow-hidden">
        {/* 🔹 Fondo detrás */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/backgrounds/mars-game-bg.jpg')" }}
          aria-hidden="true"
        />
        {/* 🔸 Overlay para oscurecer */}
        <div className="absolute inset-0 bg-black/70" aria-hidden="true" />

        {/* 🔸 Contenido */}
        <div className="relative z-10">
          <h3 className="text-3xl font-bold uppercase mb-6 text-[#FF9D6F]">
            WASTECRAFT
          </h3>
          <p className="max-w-3xl mx-auto text-[#D1B7A3] text-lg leading-relaxed">
            Educational game focused on teaching and raising awareness about the materials 
            found on Mars. Through creativity and problem-solving, the user must combine 
            different resources to create new elements, applying the principles of 
            the 3Rs: Reduce, Reuse, and Recycle.
          </p>

          <div className="mt-12">
            <Link
              to="/game"
              className="inline-block px-6 py-3 border border-[#E27B58] text-[#E27B58] hover:bg-[#E27B58] hover:text-black transition"
            >
              Play →
            </Link>
          </div>
        </div>
      </section>

      {/* === NOTICIAS === */}
      <section className="relative min-h-screen px-8 py-20 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto relative z-10">
          <h3 className="text-4xl font-bold uppercase mb-12 text-center text-[#FF9D6F]">
            Latest Projects
          </h3>

          <div className="grid gap-8 md:grid-cols-3">
            {newsData.slice(0, 3).map((news) => (
              <Link
                to={`/news/${news.id}`}
                key={news.id}
                className="group bg-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#E27B58] transition"
              >
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="p-6">
                  <h4 className="text-lg font-semibold mb-2 text-white group-hover:text-[#E27B58] transition">
                    {news.title}
                  </h4>
                  <p className="text-[#99857A] text-sm leading-relaxed line-clamp-3">
                    {news.description}
                  </p>
                  <div className="mt-4 text-xs text-[#8E6A5A] flex items-center justify-between">
                    <span>{news.readTime}</span>
                    <span className="px-3 py-1 rounded-full text-[#FF9D6F] bg-[#663926]/40 font-medium">
                      {news.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === REDES SOCIALES === */}
      <section
        className="relative min-h-[40vh] bg-[#1a1a1a] flex items-center justify-center"
        style={{ backgroundImage: "url('/backgrounds/bg-redes.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 text-center px-6">
          <div className="mb-6">
            <img
              src="/images/logo-proyecto.png"
              alt="Logo del proyecto"
              className="mx-auto w-40 md:w-56"
            />
          </div>

          <div className="flex justify-center space-x-10">
            {[
              { href: "https://www.facebook.com/profile.php?id=61581493784450", img: "/images/facebook.png", alt: "Facebook" },
              { href: "https://www.youtube.com/@PAWSteam-NASA", img: "/images/twitter.png", alt: "Twitter" },
              { href: "https://www.instagram.com/wastemars.paws", img: "/images/instagram.png", alt: "Instagram" },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="transition-transform transform hover:scale-110"
              >
                <img
                  src={social.img}
                  alt={social.alt}
                  className="w-12 h-12 transition"
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
