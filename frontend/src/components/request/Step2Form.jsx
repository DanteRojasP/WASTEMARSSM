// frontend/src/components/steps/Step2Form.jsx
import astronautCodes from "../../data/astronautCodes";

// === Colonias locales ===
const LOCAL_COLONIES = [
  { id: 1, name: "Colonia A" },
  { id: 2, name: "Colonia B" },
  { id: 3, name: "Colonia C" },
];

// === Waypoints por colonia ===
const colonyWaypoints = {
  "Colonia A": [
    { id: "A", name: "Alpha-1", x: "20%", y: "35%" },
    { id: "B", name: "Alpha-2", x: "45%", y: "50%" },
    { id: "C", name: "Alpha-3", x: "65%", y: "30%" },
    { id: "D", name: "Alpha-4", x: "70%", y: "65%" },
  ],
  "Colonia B": [
    { id: "A", name: "Olympus-1", x: "25%", y: "25%" },
    { id: "B", name: "Olympus-2", x: "55%", y: "40%" },
    { id: "C", name: "Olympus-3", x: "60%", y: "60%" },
    { id: "D", name: "Olympus-4", x: "30%", y: "70%" },
  ],
  "Colonia C": [
    { id: "A", name: "Elysium-1", x: "35%", y: "20%" },
    { id: "B", name: "Elysium-2", x: "50%", y: "45%" },
    { id: "C", name: "Elysium-3", x: "70%", y: "40%" },
    { id: "D", name: "Elysium-4", x: "40%", y: "70%" },
  ],
};

// === Fondo por colonia ===
const colonyBackgrounds = {
  "Colonia A": "/images/maps/colonia1.jpg",
  "Colonia B": "/images/maps/colonia2.jpg",
  "Colonia C": "/images/maps/colonia3.jpg",
};

// === Roles ===
const cargos = [
  "Commander",
  "Pilot",
  "Flight Engineer",
  "Mission Specialist",
  "Space Medic",
  "Planetary Scientist",
];

export default function Step2Form({ form, setForm, setStep }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const validateAstronautCode = (code) => astronautCodes.includes(code);

  const activeWaypoints = colonyWaypoints[form.colonia] || [];
  const getMapImage = (colonia) => colonyBackgrounds[colonia] || "/backgrounds/default.jpg";

  return (
    <div className="text-white space-y-8" style={{ fontFamily: "Orbitron, sans-serif" }}>
      <h2 className="text-3xl font-bold uppercase mb-4 text-[#FF9D6F]">Astronaut Form</h2>

      {/* === Datos Personales === */}
      <section className="bg-[#1c1c1c] p-4 rounded-xl border border-[#663926]/40 space-y-4">
        <h3 className="text-xl font-semibold text-[#FF9D6F]">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="firstName"
            placeholder="Name"
            value={form.firstName}
            onChange={handleChange}
            className="p-3 bg-[#1a1a1a] border border-[#663926]/40 rounded-md text-[#E27B58] placeholder-[#99857A] focus:outline-none focus:border-[#FF9D6F]"
          />
          <input
            name="lastName"
            placeholder="LastName"
            value={form.lastName}
            onChange={handleChange}
            className="p-3 bg-[#1a1a1a] border border-[#663926]/40 rounded-md text-[#E27B58] placeholder-[#99857A] focus:outline-none focus:border-[#FF9D6F]"
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email || ""}
          onChange={handleChange}
          className="w-full p-3 bg-[#1a1a1a] border border-[#663926]/40 rounded-md text-[#E27B58] placeholder-[#99857A] focus:outline-none focus:border-[#FF9D6F]"
        />

        <select
          name="nationality"
          value={form.nationality}
          onChange={handleChange}
          className="w-full p-3 bg-[#1a1a1a] border border-[#663926]/40 rounded-md text-[#E27B58] focus:outline-none focus:border-[#FF9D6F]"
        >
          <option value="">Select your country</option>
          <option value="Peru">Peru</option>
          <option value="Mexico">Mexico</option>
          <option value="Argentina">Argentina</option>
          <option value="Colombia">Colombia</option>
          <option value="Chile">Chile</option>
          <option value="Bolivia">Bolivia</option>
          <option value="Spain">Spain</option>
          <option value="USA">USA</option>
          <option value="Brazil">Brazil</option>
          <option value="Other">Other</option>
        </select>
      </section>

      {/* === Datos Astronauta === */}
      <section className="bg-[#1c1c1c] p-4 rounded-xl border border-[#663926]/40 space-y-4">
        <h3 className="text-xl font-semibold text-[#FF9D6F]">Astronaut Information</h3>

        <input
          name="astronautCode"
          placeholder="Astronaut Code (Ej: ASTRO-2025-001)"
          value={form.astronautCode}
          onChange={handleChange}
          className="w-full p-3 bg-[#1a1a1a] border border-[#663926]/40 rounded-md text-[#E27B58] placeholder-[#99857A] focus:outline-none focus:border-[#FF9D6F]"
        />
        {form.astronautCode && !validateAstronautCode(form.astronautCode) && (
          <p className="text-red-400 text-sm">
            ⚠️ Invalid code, please request one at the space base.
          </p>
        )}

        <input
          name="mission"
          placeholder="Mission"
          value={form.mission || ""}
          onChange={handleChange}
          className="w-full p-3 bg-[#1a1a1a] border border-[#663926]/40 rounded-md text-[#E27B58] placeholder-[#99857A] focus:outline-none focus:border-[#FF9D6F]"
        />

        <select
          name="role"
          value={form.role || ""}
          onChange={handleChange}
          className="w-full p-3 bg-[#1a1a1a] border border-[#663926]/40 rounded-md text-[#E27B58] focus:outline-none focus:border-[#FF9D6F]"
        >
          <option value="">Select your role</option>
          {cargos.map((cargo, i) => (
            <option key={i} value={cargo}>
              {cargo}
            </option>
          ))}
        </select>
      </section>

      {/* === Método de Envío === */}
      <section className="bg-[#1c1c1c] p-4 rounded-xl border border-[#663926]/40 space-y-4">
        <h3 className="text-xl font-semibold text-[#FF9D6F]">Choose Shipping Method</h3>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() =>
              setForm({ ...form, deliveryMethod: "personal", waypoint: "", colonia: "" })
            }
            className={`px-4 py-2 rounded-lg font-bold uppercase tracking-wide border transition ${
              form.deliveryMethod === "personal"
                ? "bg-[#FF9D6F] text-black border-[#FF9D6F]"
                : "bg-[#1a1a1a] text-[#E27B58] border border-[#663926]/40 hover:bg-[#E27B58] hover:text-black"
            }`}
          >
            In-person Pickup
          </button>
          <button
            type="button"
            onClick={() =>
              setForm({ ...form, deliveryMethod: "rover", colonia: "", base: "" })
            }
            className={`px-4 py-2 rounded-lg font-bold uppercase tracking-wide border transition ${
              form.deliveryMethod === "rover"
                ? "bg-[#FF9D6F] text-black border-[#FF9D6F]"
                : "bg-[#1a1a1a] text-[#E27B58] border border-[#663926]/40 hover:bg-[#E27B58] hover:text-black"
            }`}
          >
            Rover Delivery
          </button>
        </div>

        {/* Recojo Personal */}
        {form.deliveryMethod === "personal" && (
          <div className="space-y-4">
            <label className="block text-[#FF9D6F] font-semibold uppercase">
              Select your Martian Colony
            </label>
            <select
              name="colonia"
              value={form.colonia || ""}
              onChange={handleChange}
              className="w-full p-3 bg-[#1a1a1a] border border-[#663926]/40 rounded-md text-[#E27B58] focus:outline-none focus:border-[#FF9D6F]"
            >
              <option value="">Choose a colony</option>
              {LOCAL_COLONIES.map((col) => (
                <option key={col.id} value={col.name}>
                  {col.name}
                </option>
              ))}
            </select>

            {form.colonia && (
              <div className="relative w-full h-72 rounded-lg overflow-hidden border border-[#663926]/40">
                <img
                  src={getMapImage(form.colonia)}
                  alt={`Mapa ${form.colonia}`}
                  className="w-full h-full object-cover"
                />
                {activeWaypoints.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setForm({ ...form, waypoint: w.name })}
                    className={`absolute px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wide transition ${
                      form.waypoint === w.name
                        ? "bg-[#FF9D6F] text-black"
                        : "bg-[#1a1a1a] text-[#E27B58] border border-[#663926]/40 hover:bg-[#E27B58] hover:text-black"
                    }`}
                    style={{ top: w.y, left: w.x }}
                  >
                    {w.id}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rover */}
        {form.deliveryMethod === "rover" && (
          <div className="space-y-4">
            <select
              name="colonia"
              value={form.colonia || ""}
              onChange={handleChange}
              className="w-full p-3 bg-[#1a1a1a] border border-[#663926]/40 rounded-md text-[#E27B58] focus:outline-none focus:border-[#FF9D6F]"
            >
              <option value="">Choose a colony</option>
              {LOCAL_COLONIES.map((col) => (
                <option key={col.id} value={col.name}>
                  🪐 {col.name}
                </option>
              ))}
            </select>

            <input
              name="base"
              placeholder="Base"
              value={form.base || ""}
              onChange={handleChange}
              className="w-full p-3 bg-[#1a1a1a] border border-[#663926]/40 rounded-md text-[#E27B58] placeholder-[#99857A] focus:outline-none focus:border-[#FF9D6F]"
            />
          </div>
        )}
      </section>

      {/* Términos */}
      <label className="flex items-center gap-2 text-[#99857A]">
        <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} />
        <span>I confirm that all my information is correct; no changes are allowed.</span>
      </label>

      {/* Botones */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setStep(1)}
          className="px-4 py-2 bg-[#1a1a1a] border border-[#663926]/40 text-[#99857A] rounded-lg hover:text-white hover:border-[#E27B58] transition"
        >
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={
            !form.firstName ||
            !form.lastName ||
            !form.email ||
            !form.nationality ||
            !form.astronautCode ||
            !validateAstronautCode(form.astronautCode) ||
            !form.deliveryMethod ||
            (form.deliveryMethod === "personal" && (!form.colonia || !form.waypoint)) ||
            (form.deliveryMethod === "rover" && (!form.colonia || !form.base)) ||
            !form.terms
          }
          className="px-6 py-2 bg-[#FF9D6F] text-black rounded-lg hover:bg-[#E27B6F] disabled:bg-gray-600 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
