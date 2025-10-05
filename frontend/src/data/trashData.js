// src/data/trashData.js
const trashData = [
  {
    id: 1,
    name: "Zotek F30",
    category: "Foam Packaging",
    keyMaterials: ["Zotek F30 100%"],
    image: "/images/zotek-f30-foam.jpg",
    stock: {
      units: 20000,
      kg: 20000 * 0.05, // 1000 kg total / 20000 units = 0.05 kg por unidad
    },
    weight: 0.05,
    description: "Zotek F30 high-density packaging foam used to protect space equipment and sensitive components.",
    recycling: [
      "Mechanical recycling to create new foam products",
      "Reuse as insulation material",
      "Shredding for use in fillers and mattresses"
    ],
    impact: "Zotek foam can be recycled multiple times without losing its structural properties, significantly reducing space waste.",
  },
   {
    id: 2,
    name: "Cargo Transfer Bags (CTB)",
    category: "EVA Waste",
    keyMaterials: ["Nomex 92%", "Nylon 3%", "Polyester 2%"],
    image: "/images/ctb-nomex-bag.jpg",
    stock: {
      units: 2000,
      kg: 2000 * 0.05, // 100 kg total / 2000 units = 0.05 kg por unidad
    },
    weight: 0.05,
    description: "Load transfer bags made from fire-resistant Nomex, used in space extravehicular activities (EVA).",
    recycling: [
      "Reuse of Nomex fibers for heat-resistant textiles",
      "Separation of materials (Nomex, Nylon, Polyester) for individual recycling",
      "Conversion into thermal insulation material"
    ],
    impact: "Nomex is highly fire resistant and can be recycled to create new protective textiles, reducing the need for virgin materials.",
    commercialEquivalent: "Nomex White Hood",
  },

  {
    id: 3,
    name: "Clothing",
    category: "Fabrics",
    keyMaterials: ["Cotton/Cellulose 56%", "Nylon 6%", "Polyester 38%"],
    image: "/images/space-clothing.jpg",
    stock: {
      units: 15400,
      kg: 15400 * 0.05, // 770 kg (77% de 1000) / 15400 units = 0.05 kg
    },
    weight: 0.05,
    description: "Everyday clothing worn by astronauts, mainly made of cotton, nylon, and polyester.",
    recycling: [
      "Separation of natural fibers (cotton) for composting or reuse",
      "Recycling polyester and nylon for new textiles",
      "Conversion into cleaning or filling materials"
    ],
    impact: "Textile recycling reduces water and energy consumption by 80% compared to the production of new fibers.",
    commercialEquivalent: "Hanes Men's Undershirt",
  },
  {
    id: 4,
    name: "Towels/Wash Cloths",
    category: "Fabrics",
    keyMaterials: ["Cotton/Cellulose 100%"],
    image: "/images/wash-cloths.jpg",
    stock: {
      units: 4200,
      kg: 4200 * 0.05, // 210 kg (21% de 1000) / 4200 units = 0.05 kg
    },
    weight: 0.05,
    description: "100% cotton towels and washcloths used for personal hygiene in space environments.",
    recycling: [
      "Composting natural cotton fibers",
      "Reuse as cleaning material",
      "Conversion into pulp for recycled paper"
    ],
    impact: "Cotton fibers are biodegradable and can be composted, returning nutrients to the soil.",
    commercialEquivalent: "R&R Textile Wash Cloth",
  },
  {
    id: 5,
    name: "Cleaning Wipes",
    category: "Fabrics",
    keyMaterials: ["Cotton/Cellulose 100%"],
    image: "/images/cleaning-wipes.jpg",
    stock: {
      units: 100,
      kg: 100 * 0.02, // 2 kg  (2% de 100) / 100 unidades
    },
    weight: 0.02,
    description: "Pre-moistened cotton disinfectant wipes used to keep surfaces clean in the space station.",
    recycling: [
      "Composting after drying (organic content)",
      "Separation of liquid waste for treatment",
      "Conversion into biomass for energy generation"
    ],
    impact: "Despite their high moisture content, cotton fibers are completely biodegradable.",
    commercialEquivalent: "Virox PreEmpt Wipes",
  },
  {
    id: 6,
    name: "Overwrap",
    category: "Food Packaging",
    keyMaterials: ["Polyester 13%", "Polyethylene 15%", "Aluminum 30%"],
    image: "/images/food-overwrap.jpg",
    stock: {
      units: 5800,
      kg: 5800 * 0.05, // 290 kg (29% de 1000) / 5800 units = 0.05 kg
    },
    weight: 0.05,
    description: "Multilayer outer wrapping for space food packaging, composed of polyester, polyethylene, and aluminum.",
    recycling: [
      "Separation of aluminum layers for casting",
      "Recycling polyethylene for new plastics",
      "Polyester recovery for textiles"
    ],
    impact: "Multilayer materials are challenging but recyclable. Recovered aluminum saves 95% energy compared to new production.",
    commercialEquivalent: "Glenroy White Ready Seal 225",
  },
  {
    id: 7,
    name: "Rehydratable Pouch",
    category: "Food Packaging",
    keyMaterials: ["Nylon 41%", "Polyethylene 33%", "EVOH 11%"],
    image: "/images/rehydratable-pouch.jpg",
    stock: {
      units: 7800,
      kg: 7800 * 0.05, // 390 kg (39% de 1000) / 7800 units = 0.05 kg
    },
    weight: 0.05,
    description: "Special multi-layer bags for dehydrated food that is rehydrated with hot water in space.",
    recycling: [
      "Separation of nylon layers for textile recycling",
      "Recycling polyethylene for lower-grade plastics",
      "EVOH recovery for barrier applications"
    ],
    impact: "Although complex, these bags can be recycled by separating their layers. Each material recovered significantly reduces waste.",
    commercialEquivalent: "Winpak Multi-Purpose Forming Film (MB225PL)",
  },
  {
    id: 8,
    name: "Drink Pouch",
    category: "Food Packaging",
    keyMaterials: ["Aluminum 24%", "Polyethylene 65%", "PET 11%"],
    image: "/images/drink-pouch.jpg",
    stock: {
      units: 1600,
      kg: 1600 * 0.05, // 80 kg (8% de 1000) / 1600 units = 0.05 kg
    },
    weight: 0.05,
    description: "Capri Sun-style drink pouches adapted for space use, with a special valve for consumption in zero gravity.",
    recycling: [
      "Aluminum recovery through smelting",
      "Recycling polyethylene for new packaging",
      "Recycling PET for textile fibers"
    ],
    impact: "Beverage pouches contain valuable aluminum. Recycling them recovers a material that requires enormous energy to produce.",
    commercialEquivalent: "Kraft Heinz Capri Sun",
  },
  {
    id: 9,
    name: "Aluminum Structure/Struts",
    category: "Structural Elements",
    keyMaterials: ["Aluminum >90%"],
    image: "/images/aluminum-struts.jpg",
    stock: {
      units: 18000,
      kg: 18000 * 0.05, // 900 kg (90% de 1000) / 18000 units = 0.05 kg
    },
    weight: 0.05,
    description: "Aluminum struts and support structures used in the construction of space modules and assembly systems.",
    recycling: [
      "Direct casting to create new aluminum alloys",
      "Reuse in the construction of new space components",
      "Conversion into ingots for terrestrial manufacturing"
    ],
    impact: "Recycling space aluminum saves 95% energy compared to primary production. High-value material with infinite reuse potential.",
    commercialEquivalent: "Uline Aluminum Steam Table Pan",
  },
  {
    id: 10,
    name: "Polymer Matrix Composites",
    category: "Structural Elements",
    keyMaterials: ["Thermoset/Thermoplastic Resin 40%", "Carbon Fiber 60%"],
    image: "/images/carbon-fiber-composite.jpg",
    stock: {
      units: 2000,
      kg: 2000 * 0.05, // 100 kg (10% de 1000) / 2000 units = 0.05 kg
    },
    weight: 0.05,
    description: "Carbon fiber composite materials and thermoset/thermoplastic resins used in lightweight, high-strength structural components.",
    recycling: [
      "Pyrolysis to recover carbon fibers",
      "Crushing for use in fill materials",
      "Chemical recovery of thermoplastic resins"
    ],
    impact: "Although difficult to recycle, recovered carbon fibers retain 90% of their properties and have high commercial value.",
    commercialEquivalent: "True Composites Carbon Fiber and Resin Kit",
  },
  {
    id: 11,
    name: "Air Cushion",
    category: "Other Packaging",
    keyMaterials: ["Polyethylene 100%"],
    image: "/images/air-cushion.jpg",
    stock: {
      units: 800,
      kg: 800 * 0.05, // 4 kg (4% de 100) / 800 units = 0.05 kg
    },
    weight: 0.005,
    description: "Air-filled polyethylene films used as packaging protection and cushioning for fragile products.",
    recycling: [
      "Recycling polyethylene for new plastic films",
      "Conversion into pellets for the manufacture of plastic products",
      "Direct reuse after disinfection"
    ],
    impact: "Polyethylene is 100% recyclable. Recycling it reduces CO2 emissions by 70% compared to virgin production.",
    commercialEquivalent: "Uline Air Pillow Film",
  },
  {
    id: 12,
    name: "Bubble Wrap Filler",
    category: "Other Packaging",
    keyMaterials: ["Polyethylene 100%"],
    image: "/images/bubble-wrap.jpg",
    stock: {
      units: 200,
      kg: 200 * 0.05, // 1 kg (1% de 100) / 200 units = 0.05 kg
    },
    weight: 0.005,
    description: "Small bubble wrap used as protective filling in packaging for delicate components.",
    recycling: [
      "Mechanical recycling to create new polyethylene products",
      "Conversion to plastic wood for construction",
      "Reuse after cleaning"
    ],
    impact: "Lightweight but bulky material. Recycling it prevents accumulation in landfills and oceans.",
    commercialEquivalent: "Office Depot Small Bubble Cushioning",
  },
  {
    id: 13,
    name: "Reclosable Bags",
    category: "Other Packaging",
    keyMaterials: ["Polyethylene 100%"],
    image: "/images/reclosable-bags.jpg",
    stock: {
      units: 1800,
      kg: 1800 * 0.05, // 9 kg (9% de 100) / 1800 units = 0.05 kg
    },
    weight: 0.005,
    description: "Polyethylene ziplock bags used to store samples, small tools, and components in a microgravity environment.",
    recycling: [
      "Cleaning and multiple reuse",
      "Recycling polyethylene for new bags",
      "Conversion into pellets for injection molding"
    ],
    impact: "Reusable bags can be reused dozens of times before final recycling, maximizing their life cycle.",
    commercialEquivalent: "CEL Scientific Kynar Gas Sampling Bags",
  },
  {
    id: 14,
    name: "Anti-Static Bubble Wrap Bags",
    category: "Other Packaging",
    keyMaterials: ["Polyethylene 100%"],
    image: "/images/antistatic-bubble-bags.jpg",
    stock: {
      units: 1800,
      kg: 1800 * 0.05, // 9 kg (9% de 100) / 1800 units = 0.05 kg
    },
    weight: 0.005,
    description: "Bubble bags with antistatic properties to protect sensitive electronic components from electrostatic discharge.",
    recycling: [
      "Specialized recycling to recover antistatic additives",
      "Conversion to lower-grade polyethylene",
      "Reuse in non-critical applications"
    ],
    impact: "Although they contain additives, the base polyethylene is recyclable. Antistatic additives can be recovered for reuse.",
    commercialEquivalent: "Uline Anti-Static Bubble Bags",
  },
  {
    id: 15,
    name: "Plastazote LD45 FR",
    category: "Other Packaging",
    keyMaterials: ["Polyethylene 100%"],
    image: "/images/plastazote-foam.jpg",
    stock: {
      units: 7200,
      kg: 7200 * 0.05, // 36 kg (36% de 100) / 7200 units = 0.05 kg
    },
    weight: 0.005,
    description: "Cross-linked polyethylene foam with flame retardant (FR), used to protect high-value equipment and components.",
    recycling: [
      "Shredding to create cushioning fillers",
      "Mechanical recycling for lower density foams",
      "Conversion into thermal insulation material"
    ],
    impact: "Cross-linked polyethylene foams are recyclable, although more complex. Their lightness reduces space transportation costs.",
    commercialEquivalent: "Zotefoams Plastazote LD45 FR",
  },
  {
    id: 16,
    name: "Nitrile Gloves",
    category: "Gloves",
    keyMaterials: ["Nitrile 100%"],
    image: "/images/nitrile-gloves.jpg",
    stock: {
      units: 20500,
      kg: 20500 * 0.002, // 41 kg (41% de 100) / 20500 units = 0.002 kg por guante
    },
    weight: 0.002,
    description: "Latex-free nitrile medical examination gloves, used for medical procedures, food handling, and personal protection.",
    recycling: [
      "Chemical recycling to recover nitrile monomers",
      "Conversion into lower-grade rubber products",
    ],
    impact: "Nitrile gloves are difficult to recycle due to contamination, but emerging technologies allow up to 70% of the material to be recovered.",
    commercialEquivalent: "Med Pride Medical Examination Nitrile Gloves",
  },
  {
    id: 17,
    name: "Polyethylene Water Bottles",
    category: "Polymeric Feedstock",
    keyMaterials: ["Polyethylene (HDPE/LDPE) 100%"],
    image: "/images/water-bottles-polyethylene.jpg",
    stock: {
      units: 6000,          // ~3-4 bottles per astronaut per day
      kg: 6000 * 0.025,     // 25 grams per bottle
    },
    weight: 0.025, // 25 grams per bottle
    description: "Disposable high/low-density polyethylene bottles used by astronauts for water consumption. Single-material composition makes them easy to recycle mechanically.",
    recycling: [
      "Shredding into small plastic flakes",
      "Washing and drying to remove contaminants",
      "Extrusion into filament for space-based 3D printers",
      "Injection molding for new containers",
      "Conversion into pellets for on-demand manufacturing"
    ],
    impact: "PE bottles are among the most valuable waste streams in space. Their simple mechanical recycling enables high-quality 3D printing filament production for tools, brackets, and spare parts on-demand, reducing Earth dependency.",
    commercialEquivalent: "Water Bottle",
  },
  {
    id: 18,
    name: "Multi-Layer Food Wrappers",
    category: "Polymeric Feedstock",
    keyMaterials: ["Polyethylene 40%", "Polyester 35%", "Aluminum 25%"],
    image: "/images/food-wrappers-multilayer.jpg",
    stock: {
      units: 15000,         
      kg: 15000 * 0.008,    
    },
    weight: 0.008, 
    description: "Silver/gold multi-layer bags and wrappers from dehydrated foods. Complex composition of polyethylene, polyester, and laminated aluminum requiring advanced recycling processes.",
    recycling: [
      "Manual layer separation when possible",
      "Pyrolysis (heating without oxygen) to decompose polymers",
      "Aluminum recovery through selective melting",
      "Chemical depolymerization to obtain base monomers",
      "Conversion into lower-grade composite materials"
    ],
    impact: "Despite recycling complexity, multi-layer wrappers have high generation volume. Chemical recycling via pyrolysis recovers up to 60% of material as oils reconverted into new polymers, closing the material loop.",
    commercialEquivalent: "Metallized Food Packaging Film",
  },
];

export default trashData;
