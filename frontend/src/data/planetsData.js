// planetsData.js
export const PLANETS = [
  {
    id: "mercury",
    name: "Mercurio",
    color: "gray",
    radius: 2440,
    orbit: 57.9e6,
    period: 88,
  },
  {
    id: "venus",
    name: "Venus",
    color: "yellow",
    radius: 6052,
    orbit: 108.2e6,
    period: 225,
  },
  {
    id: "mars",
    name: "Marte",
    color: "red",
    radius: 3389,
    orbit: 227.9e6,
    period: 687,
    special: true, // 👈 para cargar un componente custom
  },
  // etc…
];
