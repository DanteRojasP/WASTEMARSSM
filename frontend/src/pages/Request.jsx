// frontend/src/pages/Request.jsx
import { useState } from "react";
import trashData from "../data/trashData";
import kitsData from "../data/kitsData";

// Componentes
import Stepper from "../components/request/Stepper";
import Step1Select from "../components/request/Step1Select";
import Step1Kits from "../components/request/Step1Kits"; 
import Step2Form from "../components/request/Step2Form";
import Step3Summary from "../components/request/Step3Summary";
import Step4Success from "../components/request/Step4Success";
import CartSidebar from "../components/request/CartSidebar";
import ItemModal from "../components/request/ItemModal";

export default function Request() {
  const [step, setStep] = useState(0); // arranca en landing
  const [submitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [cart, setCart] = useState([]);

  // clonamos los datos
  const [inventory, setInventory] = useState(
    trashData.map((t) => ({ ...t, stock: { ...(t.stock || {}) } }))
  );
  const [kitsInventory, setKitsInventory] = useState(
    kitsData.map((k) => ({ ...k }))
  );

  const [form, setForm] = useState({
    type: "",
    amount: "",
    unit: "kg",
    firstName: "",
    lastName: "",
    nationality: "",
    astronautCode: "",
    deliveryMethod: "",
    waypoint: "",
    terms: false,
  });

  // Fondos por paso
  const backgrounds = {
    0: "/backgrounds/bg-main.jpg",
    1: "/backgrounds/bg-step1.jpg",
    1.5: "/backgrounds/bg-step1-kits.jpg", // ⬅️ agregado para Step1Kits
    2: "/backgrounds/bg-step2.jpg",
    3: "/backgrounds/bg-step3.jpg",
    4: "/backgrounds/bg-step4.jpg",
  };

  /* -----------------------
     Helpers de stock (trash)
     ----------------------- */
  const getTrashByName = (name) => inventory.find((i) => i.name === name);

  const getAvailableUnits = (invItem) => {
    if (!invItem) return 0;
    if (typeof invItem.amount === "number") return invItem.amount;
    if (invItem.stock?.units !== undefined) return invItem.stock.units;
    if (invItem.stock?.kg !== undefined && invItem.weight) {
      return Math.floor(invItem.stock.kg / invItem.weight);
    }
    return 0;
  };

  const getAvailableKg = (invItem) => {
    if (!invItem) return 0;
    if (invItem.stock?.kg !== undefined) return invItem.stock.kg;
    if (typeof invItem.amount === "number" && invItem.weight)
      return invItem.amount * invItem.weight;
    return 0;
  };

  const clamp = (v) => (v < 0 ? 0 : v);

  // resta unidades/ks del inventario
  const subtractTrashStock = ({ name, units = 0, kg = 0 }) => {
    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.name !== name) return inv;
        const copy = { ...inv, stock: { ...(inv.stock || {}) } };

        if (typeof copy.amount === "number") {
          copy.amount = clamp(copy.amount - units);
        }
        if (copy.stock?.units !== undefined) {
          copy.stock.units = clamp(copy.stock.units - units);
        }
        if (copy.stock?.kg !== undefined) {
          copy.stock.kg = clamp(copy.stock.kg - kg);
        } else if (kg > 0 && copy.weight) {
          if (copy.stock?.units !== undefined) {
            const fromKgToUnits = Math.floor(kg / copy.weight);
            copy.stock.units = clamp(copy.stock.units - fromKgToUnits);
          }
        }
        if (copy.stock?.kg !== undefined && copy.weight) {
          copy.stock.units = Math.floor(copy.stock.kg / copy.weight);
        }
        return copy;
      })
    );
  };

  const addBackTrashStock = ({ name, units = 0, kg = 0 }) => {
    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.name !== name) return inv;
        const copy = { ...inv, stock: { ...(inv.stock || {}) } };
        if (typeof copy.amount === "number") {
          copy.amount = copy.amount + units;
        }
        if (copy.stock?.units !== undefined) {
          copy.stock.units = (copy.stock.units || 0) + units;
        }
        if (copy.stock?.kg !== undefined) {
          copy.stock.kg = (copy.stock.kg || 0) + kg;
        } else if (kg > 0 && copy.weight) {
          if (copy.stock?.units !== undefined) {
            const fromKgToUnits = Math.floor(kg / copy.weight);
            copy.stock.units = (copy.stock.units || 0) + fromKgToUnits;
          }
        }
        if (copy.stock?.kg !== undefined && copy.weight) {
          copy.stock.units = Math.floor(copy.stock.kg / copy.weight);
        }
        return copy;
      })
    );
  };

  /* -----------------------
     Añadir al carrito
     ----------------------- */
  const addToCart = (item, amount = 1, unit = "unid") => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    const kitInv = kitsInventory.find((k) => k.name === item.name);
    if (kitInv) {
      const availableKits =
        typeof kitInv.amount === "number" ? kitInv.amount : 0;
      const already = cart
        .filter((c) => c.name === item.name && c.unit === unit)
        .reduce((s, c) => s + c.amount, 0);

      if (already + numericAmount > availableKits) {
        alert(`⚠️ Solo hay ${availableKits} kits disponibles.`);
        return;
      }

      setCart((prev) => {
        const idx = prev.findIndex(
          (p) => p.name === item.name && p.unit === unit
        );
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = {
            ...copy[idx],
            amount: copy[idx].amount + numericAmount,
          };
          return copy;
        }
        return [
          ...prev,
          {
            name: item.name,
            amount: numericAmount,
            unit,
            image: item.image,
            category: item.category,
          },
        ];
      });

      setKitsInventory((prev) =>
        prev.map((k) =>
          k.name === item.name ? { ...k, amount: k.amount - numericAmount } : k
        )
      );

      return;
    }

    const invItem = getTrashByName(item.name);
    if (!invItem) {
      alert("Item no disponible");
      return;
    }

    const availableUnits = getAvailableUnits(invItem);
    const availableKg = getAvailableKg(invItem);

    const alreadyUnitsInCart = cart
      .filter((c) => c.name === item.name && c.unit === "unid")
      .reduce((s, c) => s + c.amount, 0);
    const alreadyKgInCart = cart
      .filter((c) => c.name === item.name && c.unit === "kg")
      .reduce((s, c) => s + c.amount, 0);

    if (unit === "unid") {
      if (alreadyUnitsInCart + numericAmount > availableUnits) {
        alert(`⚠️ Solo hay ${availableUnits} unidades disponibles de ${item.name}.`);
        return;
      }
    } else {
      if (alreadyKgInCart + numericAmount > availableKg) {
        alert(`⚠️ Solo hay ${availableKg.toFixed(2)} kg disponibles de ${item.name}.`);
        return;
      }
    }

    setCart((prev) => {
      const idx = prev.findIndex(
        (p) => p.name === item.name && p.unit === unit
      );
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], amount: copy[idx].amount + numericAmount };
        return copy;
      }
      return [
        ...prev,
        {
          name: item.name,
          amount: numericAmount,
          unit,
          image: item.image,
          category: item.category,
        },
      ];
    });

    if (unit === "unid") {
      subtractTrashStock({
        name: item.name,
        units: numericAmount,
        kg: numericAmount * (invItem.weight || 0),
      });
    } else {
      subtractTrashStock({ name: item.name, kg: numericAmount });
    }
  };

  /* -----------------------
     Quitar del carrito
     ----------------------- */
  const removeFromCart = (index) => {
    const item = cart[index];
    if (!item) return;

    const kitInv = kitsInventory.find((k) => k.name === item.name);
    if (kitInv) {
      setKitsInventory((prev) =>
        prev.map((k) =>
          k.name === item.name ? { ...k, amount: k.amount + Number(item.amount) } : k
        )
      );
    } else {
      if (item.unit === "unid") {
        addBackTrashStock({
          name: item.name,
          units: Number(item.amount),
          kg: Number(item.amount) * (getTrashByName(item.name)?.weight || 0),
        });
      } else {
        addBackTrashStock({ name: item.name, kg: Number(item.amount) });
      }
    }

    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  /* -----------------------
     Actualizar cantidad
     ----------------------- */
  const updateQuantity = (index, newAmountRaw) => {
    const numericAmount = Number(newAmountRaw);
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    const itemInCart = cart[index];
    if (!itemInCart) return;

    const kitInv = kitsInventory.find((k) => k.name === itemInCart.name);
    if (kitInv) {
      const diff = numericAmount - itemInCart.amount;
      if (diff > 0) {
        if (diff > kitInv.amount) {
          alert("⚠️ No hay suficiente stock del kit para esa cantidad");
          return;
        }
        setKitsInventory((prev) =>
          prev.map((k) =>
            k.name === itemInCart.name ? { ...k, amount: k.amount - diff } : k
          )
        );
      } else if (diff < 0) {
        setKitsInventory((prev) =>
          prev.map((k) =>
            k.name === itemInCart.name ? { ...k, amount: k.amount + Math.abs(diff) } : k
          )
        );
      }

      const updatedCart = [...cart];
      updatedCart[index] = { ...itemInCart, amount: numericAmount };
      setCart(updatedCart);
      return;
    }

    const invItem = getTrashByName(itemInCart.name);
    if (!invItem) return;

    const diff = numericAmount - itemInCart.amount;
    if (itemInCart.unit === "unid") {
      const availableUnits = getAvailableUnits(invItem);
      if (diff > 0 && diff > availableUnits) {
        alert(`⚠️ Solo quedan ${availableUnits} unidades disponibles.`);
        return;
      }

      if (diff > 0) {
        subtractTrashStock({
          name: itemInCart.name,
          units: diff,
          kg: diff * (invItem.weight || 0),
        });
      } else if (diff < 0) {
        addBackTrashStock({
          name: itemInCart.name,
          units: Math.abs(diff),
          kg: Math.abs(diff) * (invItem.weight || 0),
        });
      }
    } else {
      const availableKg = getAvailableKg(invItem);
      if (diff > 0 && diff > availableKg) {
        alert(`⚠️ Solo quedan ${availableKg.toFixed(2)} kg disponibles.`);
        return;
      }

      if (diff > 0) {
        subtractTrashStock({ name: itemInCart.name, kg: diff });
      } else if (diff < 0) {
        addBackTrashStock({ name: itemInCart.name, kg: Math.abs(diff) });
      }
    }

    const updatedCart = [...cart];
    updatedCart[index] = { ...itemInCart, amount: numericAmount };
    setCart(updatedCart);
  };

  // 🔹 Confirmar
  const handleSubmit = () => {
    setSubmitted(true);
    setStep(4);
  };

  return (
    <div className="relative flex flex-col min-h-screen text-white">
      {/* Fondo dinámico */}
      <div
        key={step}
        className="absolute inset-0 bg-cover bg-center bg-fixed animate-fadeZoom"
        style={{
          backgroundImage: `url('${
            backgrounds[step] || "/backgrounds/bg-main.jpg"
          }')`,
        }}
      ></div>

      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 pt-28 pb-28 px-6">
          <div className="max-w-6xl mx-auto flex gap-12">
            <div className="flex-1 pr-6">
              <h1 className="text-4xl font-bold text-center mb-4">Request</h1>
              <p className="text-center text-gray-300 mb-16">
                Complete the steps to recycle on Mars
              </p>

{/* LANDING (step 0) */}
{step === 0 && (
  <div className="space-y-10 text-center">
    <p className="text-lg text-gray-300">
      Choose the type of request you want to make
    </p>

    <div className="flex justify-center flex-wrap gap-20">
      {/* === Opción 1: ITEMS === */}
      <button
        onClick={() => setStep(1)}
        className="group flex flex-col items-center justify-center gap-4 w-64 h-64 border-2 border-[#FF9D6F] text-[#FF9D6F] rounded-2xl overflow-hidden shadow-lg transition-all duration-300
                   hover:bg-[#FF9D6F] hover:text-black hover:border-transparent"
      >
        <p className="text-lg font-semibold transition-colors duration-300 group-hover:text-black">
          ITEMS
        </p>
        {/* Imagen normal */}
        <img
          src="/images/recycle.png"
          alt="Reciclar"
          className="w-32 h-32 transition-transform duration-300 group-hover:hidden"
        />
        {/* Imagen hover */}
        <img
          src="/images/recycle_hover.png" // tu versión “inversa”
          alt="Reciclar hover"
          className="w-32 h-32 transition-transform duration-300 hidden group-hover:block"
        />
      </button>

      {/* === Opción 2: KITS === */}
      <button
        onClick={() => setStep(1.5)}
        className="group flex flex-col items-center justify-center gap-4 w-64 h-64 border-2 border-[#FF9D6F] text-[#FF9D6F] rounded-2xl overflow-hidden shadow-lg transition-all duration-300
                   hover:bg-[#FF9D6F] hover:text-black hover:border-transparent"
      >
        <p className="text-lg font-semibold transition-colors duration-300 group-hover:text-black">
          KITS
        </p>
        {/* Imagen normal */}
        <img
          src="/images/recycle2.png"
          alt="Kits"
          className="w-32 h-32 transition-transform duration-300 group-hover:hidden"
        />
        {/* Imagen hover */}
        <img
          src="/images/recycle2_hover.png" // tu versión “inversa”
          alt="Kits hover"
          className="w-32 h-32 transition-transform duration-300 hidden group-hover:block"
        />
      </button>
    </div>
  </div>
)}






              {step > 0 && <Stepper step={step === 1.5 ? 1 : step} />}

              {step === 1 && (
                <Step1Select
                  inventory={inventory}
                  search={search}
                  setSearch={setSearch}
                  setSelectedItem={setSelectedItem}
                  cart={cart}
                  setStep={setStep}
                />
              )}

              {step === 1.5 && (
                <Step1Kits addToCart={addToCart} setStep={setStep} />
              )}

              {step === 2 && (
                <Step2Form form={form} setForm={setForm} setStep={setStep} />
              )}

              {step === 3 && (
                <Step3Summary
                  cart={cart}
                  form={form}
                  setStep={setStep}
                  handleSubmit={handleSubmit}
                />
              )}

              {step === 4 && submitted && <Step4Success />}
            </div>

            {/* Sidebar */}
            {step > 0 && step < 3 && (
              <div className="w-[350px]">
                <CartSidebar
                  cart={cart}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                  setStep={setStep}
                  step={step}
                />
              </div>
            )}

            {selectedItem && (
              <ItemModal
                item={selectedItem}
                setSelectedItem={setSelectedItem}
                form={form}
                setForm={setForm}
                addToCart={addToCart}
                setStep={setStep}
              />
            )}
          </div>
        </main>

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
    </div>
  );
}
