import ThreeScene from "../components/ThreeScene";

export default function Home() {
  return (
    <div className="w-full text-white bg-black">
      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between h-screen px-8">
        <div className="z-10 max-w-xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold uppercase">
            PROYECTO <br /> PAWS
          </h1>
          <p className="text-gray-300">
            PAWS busca mostrar cómo la gestión de residuos puede ser clave 
            en futuros asentamientos humanos en Marte.
          </p>
          <a
            href="#data-section"
            className="inline-block px-6 py-3 border border-white hover:bg-white hover:text-black transition"
          >
            Explore →
          </a>
        </div>
        <div className="absolute inset-0 md:relative md:w-1/2">
          <ThreeScene />
        </div>
      </section>

      {/* Data Section con fondo y overlay */}
      <section
        id="data-section"
        className="relative min-h-screen flex flex-col items-center justify-center px-8 py-20 bg-black"
      >
        {/* Imagen de fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/backgrounds/mars-bg.jpg')" }} // 👈 cambia la ruta a tu imagen
        ></div>

        {/* Overlay degradado */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"></div>

        {/* Contenido */}
        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-bold uppercase mb-6">Datos del Proyecto</h2>
          <p className="max-w-2xl text-gray-300 text-lg leading-relaxed mx-auto">
            Colocar más info, estadísticas, gráficos, etc.
          </p>
        </div>
      </section>


      {/* Data Section 2 con fondo y overlay */}
      <section
        id="data-section2"
        className="relative min-h-screen flex flex-col items-center justify-center px-8 py-20 bg-black"
      >
        {/* Imagen de fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/backgrounds/space-bg.jpg')" }} // 👈 cambia la ruta a tu imagen
        ></div>

        {/* Overlay degradado */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"></div>

        {/* Contenido */}
        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-bold uppercase mb-6">Datos del Proyecto</h2>
          <p className="max-w-2xl text-gray-300 text-lg leading-relaxed mx-auto">
            Colocar más info, estadísticas, gráficos, etc.
          </p>
        </div>
      </section>
    </div>
  );
}