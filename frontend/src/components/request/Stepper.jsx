export default function Stepper({ step }) {
  const steps = ["Selection", "Form", "Summary", "Order Submitted"]
  const totalSegments = Math.max(steps.length - 1, 1)
  const progressPercent = ((step - 1) / totalSegments) * 100

  return (
    <div className="relative flex items-center justify-between mb-10">
      {/* Línea base (detrás de los círculos) */}
      {/* left-5 / right-5 inserta la línea para que empiece/termine en el centro aproximado de los círculos */}
      <div
        className="absolute left-5 right-5 top-5 h-[2px] bg-[#8E6A5A]"
        aria-hidden="true"
      />

      {/* Línea de progreso (encima de la base, pero debajo de los círculos) */}
      {/* Se usa calc para que la barra de progreso termine antes del inset derecho */}
      <div
        className="absolute left-5 top-5 h-[2px] bg-[#C67B5C]"
        style={{ width: `calc((100% - 2.5rem) * ${progressPercent / 100})` }}
        aria-hidden="true"
      />

      {steps.map((label, index) => {
        const current = index + 1
        const isActive = current === step
        const isCompleted = current < step

        return (
          <div key={index} className="flex-1 flex flex-col items-center relative">
            {/* Círculo (siempre sobre la línea) */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold relative z-20
                ${isActive ? "bg-[#C67B5C] text-white" :
                  isCompleted ? "bg-[#8E6A5A] text-white" :
                  "bg-black text-gray-400"}`}
            >
              {isCompleted ? "✓" : current}
            </div>

            {/* Texto debajo */}
            <span className="mt-2 text-sm text-white text-center z-20">
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
