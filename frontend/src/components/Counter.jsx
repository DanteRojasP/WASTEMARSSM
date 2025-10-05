// frontend/src/components/Counter.jsx
import { useState, useEffect } from "react";

export default function Counter({ end = 1000, duration = 2000, label }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 50); // cada 50ms aumenta
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <div className="text-center">
      <h4 className="text-6xl md:text-7xl font-extrabold tracking-widest text-[#E27B58]">
        {count.toLocaleString()} {/* 👈 esto añade la coma: 1,250 */}
      </h4>
      <p className="text-lg text-[#99857A] mt-2 uppercase">{label}</p>
    </div>
  );
}
