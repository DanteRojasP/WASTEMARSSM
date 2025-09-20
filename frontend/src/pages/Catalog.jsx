import { useState } from "react";
import TrashCard from "../components/TrashCard";
import trashData from "../data/trashData";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";

export default function Catalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [categorySearch, setCategorySearch] = useState(""); // 🔍 búsqueda interna en categorías

  const categories = ["Todos", "Plástico", "Metal", "Papel/Cartón", "Vidrio", "Orgánico", "Electrónicos"];

  // Filtro de categorías dentro del menú
  const filteredCategories = categories.filter((c) =>
    c.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Filtro principal
  const filtered = trashData.filter((item) => {
    const matchCategory = category === "Todos" || item.category === category;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6">
      <h1 className="text-4xl font-bold text-center mb-8 uppercase">Catálogo de Residuos</h1>

      {/* Barra de búsqueda */}
      <div className="max-w-2xl mx-auto mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar basura..."
          className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-transparent text-white focus:outline-none focus:border-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Dropdown con buscador interno */}
      <div className="flex justify-center mb-8">
        <Listbox value={category} onChange={setCategory}>
          <div className="relative w-72">
            {/* Botón principal */}
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-gray-800 py-2 pl-3 pr-10 text-left shadow-md border border-gray-600 focus:outline-none">
              <span className="block truncate">{category}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
              </span>
            </Listbox.Button>

            {/* Opciones */}
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-gray-800 shadow-lg border border-gray-700 focus:outline-none z-10">
              {/* 🔍 Input dentro del dropdown */}
              <div className="p-2 border-b border-gray-700">
                <input
                  type="text"
                  placeholder="Buscar categoría..."
                  className="w-full px-3 py-1 rounded bg-gray-900 text-white text-sm focus:outline-none"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                />
              </div>

              {/* Opciones filtradas */}
              {filteredCategories.map((c, idx) => (
                <Listbox.Option
                  key={idx}
                  value={c}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? "bg-gray-700 text-white" : "text-gray-300"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {c}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-400">
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filtered.map((item) => (
          <TrashCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
