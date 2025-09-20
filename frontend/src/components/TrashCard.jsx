import { Link } from "react-router-dom";

export default function TrashCard({ item }) {
  return (
    <Link 
      to={`/data/${item.id}`} 
      className="cursor-pointer bg-white text-black rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col items-center"
    >
      <img src={item.image} alt={item.name} className="h-40 w-40 object-cover rounded mb-4" />
      <h3 className="text-lg font-bold">{item.name}</h3>
      <p className="text-sm text-gray-500">{item.category}</p>
    </Link>
  );
}