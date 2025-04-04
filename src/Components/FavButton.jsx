import { FaHeart, FaRegHeart } from "react-icons/fa";

const FavButton = ({ font, setMyFonts, myFonts }) => {
  const toggleFav = (e, font) => {
    e.stopPropagation();
    setMyFonts((prev) =>
      prev.includes(font)
        ? prev.filter((item) => item !== font)
        : [...prev, font]
    );
  };
  return (
    <button
      className="text-xl text-neutral-500 dark:text-neutral-400 cursor-pointer"
      onClick={(e) => toggleFav(e, font.family)}
    >
      {myFonts.includes(font.family) ? (
        <>
          <FaHeart />
          <span className="sr-only">remove {font.family} from favorites</span>
        </>
      ) : (
        <>
          <FaRegHeart />
          <span className="sr-only">add {font.family} to favorites</span>
        </>
      )}
    </button>
  );
};

export default FavButton;
