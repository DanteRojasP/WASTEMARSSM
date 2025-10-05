export default function Step4Success({ recycledItems = [] }) {
  // Calcular estadísticas rápidas según los ítems reciclados
  const totalWeight = recycledItems
    .reduce((sum, item) => sum + (item.weight || 0.3), 0)
    .toFixed(2);
  const co2Saved = (totalWeight * 0.22).toFixed(2);
  const energySaved = (totalWeight * 5).toFixed(1);

  const phrases = [
    "Mission accomplished! Every recycled item helps make your colony more sustainable.",
    "Your waste has a second life. Keep up the good work!",
    "Level up in recycling! Your colony appreciates your effort.",
    "Thanks to you, Mars will be a cleaner place.",
    "Your efforts today could support tomorrow's greenhouse.",
  ];

  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

  return (
    <div className="text-center py-12 px-6 bg-[#071014] border border-[#151515] rounded-2xl shadow-xl max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-[#FF9D6F] mb-4">
        Request submitted successfully! 
      </h2>
      <p className="text-[#99857A] mb-2">
        Thank you for recycling on Mars. Your delivery will be processed shortly.
      </p>
      <p className="text-white mb-6 font-medium">
        Your order will be ready in 2 hours.
      </p>

      {/* Stats Panel reemplazado por imagen */}
      <div className="mb-4 flex justify-center">
        <img
          src="/images/project/final.gif"
          alt="Mission Stats"
          className="w-48 h-auto rounded-xl shadow-md"
        />
      </div>

      {/* Motivational Panel */}
      <div className="bg-[#1c1c1c] border border-[#663926]/40 rounded-xl p-5">
        <p className="text-[#FF9D6F] font-semibold text-lg mb-2">
          Achievement Unlocked!
        </p>
        <p className="text-[#99857A] italic">"{randomPhrase}"</p>
      </div>
    </div>
  );
}
