import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Heart } from "lucide-react";

function CountryCard({ country }) {
  const { user } = useContext(AuthContext);
  const { name, capital, region, population, flags, languages, cca3 } = country;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user) {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(favorites.includes(cca3));
    }
  }, [user, cca3]);

  const toggleFavorite = () => {
    if (!user) {
      alert("Please log in to add favourites");
      return;
    }
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (isFavorite) {
      const updatedFavorites = favorites.filter((code) => code !== cca3);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(cca3);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  return (
    <article
      className="bg-white border-2 border-gray-200 rounded-md p-3 sm:p-4"
      role="article"
      aria-labelledby={`country-${cca3}`}
    >
      <Link
        to={`/country/${cca3}`}
        className="block"
        aria-label={`View details for ${name.common}`}
      >
        <img
          src={flags.png}
          alt={`Flag of ${name.common}`}
          className="w-full h-36 object-cover rounded-md mb-3"
        />
        <h2
          id={`country-${cca3}`}
          className="text-lg font-bold text-gray-900 mb-1.5"
        >
          {name.common}
        </h2>
        <div className="space-y-1.5">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Capital
            </span>
            <span className="text-xs text-gray-800">
              {capital?.[0] || "N/A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Region
            </span>
            <span className="text-xs text-gray-800">{region}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Population
            </span>
            <span className="text-xs text-gray-800">
              {population.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Languages
            </span>
            <span className="text-xs text-gray-800">
              {languages ? Object.values(languages).join(", ") : "N/A"}
            </span>
          </div>
        </div>
      </Link>
      <button
        onClick={toggleFavorite}
        className={
          "mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-black bg-blue-300 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 $ "
        }
        aria-label={
          isFavorite
            ? `Remove ${name.common} from favorites`
            : `Add ${name.common} to favorites`
        }
      >
        <Heart
          size={25}
          className={`transition-colors duration-200 ${
            isFavorite ? "fill-red-500" : "stroke-red-500"
          }`}
        />
        <span>{isFavorite ? "Remove" : "Add"}</span>
      </button>
    </article>
  );
}

export default CountryCard;
