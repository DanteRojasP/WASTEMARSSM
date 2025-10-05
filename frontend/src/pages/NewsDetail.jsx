import { useParams } from "react-router-dom";
import newsData from "../data/newsData";
import { Facebook, Linkedin, Twitter, Rss } from "lucide-react";

export default function NewsDetail() {
  const { id } = useParams();
  const news = newsData.find((n) => n.id === Number(id));

  if (!news) return <p className="text-center mt-12">Noticia no encontrada.</p>;

  return (
    <div
      className="min-h-screen bg-[#111] text-white pt-24 relative"
      style={{ fontFamily: "Orbitron, sans-serif" }}
    >
      {/* 🔹 Fondo con imagen + filtro */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/backgrounds/bg-projects.jpg')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90"
        aria-hidden="true"
      />

      {/* 🔹 Contenido principal */}
      <div className="relative max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Sidebar info */}
        <aside className="md:col-span-1 text-sm space-y-6 bg-[#1c1c1c]/90 p-5 rounded-2xl border border-[#8E6A5A] shadow-2xl h-fit">
          <div>
            <p className="font-semibold text-[#FF9D6F]">{news.author}</p>
            <p className="text-[#99857A]">{news.date}</p>
          </div>
          <div>
            <p className="uppercase text-[#99857A] text-xs">Release</p>
            <p className="font-mono">{news.releaseId}</p>
          </div>
          <div>
            <p className="uppercase text-[#99857A] text-xs">Location</p>
            <p>{news.location}</p>
          </div>
          <div className="flex gap-4 text-[#99857A]">
            {news.rssLink ? (
              <a href={news.rssLink} target="_blank" rel="noreferrer">
                <Rss className="w-5 h-5 cursor-pointer hover:text-orange-500 transition" />
              </a>
            ) : (
              <Rss className="w-5 h-5 cursor-pointer hover:text-orange-500" />
            )}
          </div>
        </aside>

        {/* Main content */}
        <article className="md:col-span-3 space-y-6 bg-[#1c1c1c]/90 p-8 rounded-2xl border border-[#8E6A5A] shadow-2xl">
          <p className="uppercase text-[#99857A] text-sm">{news.readTime}</p>
          <h1 className="text-4xl font-bold leading-tight text-[#FF9D6F]">
            {news.title}
          </h1>

          <img
            src={news.image}
            alt={news.title}
            className="w-full h-96 object-cover rounded-lg shadow-md border border-[#663926]/30"
          />
          {news.imageCredit && (
            <p className="text-xs italic text-[#99857A]">
              Credits: {news.imageCredit}
            </p>
          )}

          <div className="prose prose-lg max-w-none text-white">
            <p>{news.content}</p>
          </div>
        </article>
      </div>

      {/* 🔹 Redes sociales */}
      <section className="relative min-h-[40vh] mt-16 flex items-center justify-center overflow-hidden">
        {/* Fondo con overlay igual al del home */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/backgrounds/bg-redes.jpg')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90"
          aria-hidden="true"
        />

        {/* Contenido */}
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
              {
                href: "https://www.facebook.com/profile.php?id=61581493784450",
                img: "/images/facebook.png",
                alt: "Facebook",
              },
              {
                href: "https://www.youtube.com/@PAWSteam-NASA",
                img: "/images/twitter.png",
                alt: "Twitter",
              },
              {
                href: "https://www.instagram.com/wastemars.paws",
                img: "/images/instagram.png",
                alt: "Instagram",
              },
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
