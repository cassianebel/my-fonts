import { useState, useEffect, useRef } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { IoInvertMode } from "react-icons/io5";
import Panel from "./Components/Panel";
import Modal from "./Components/Modal";

function App() {
  const [theme, setTheme] = useState("light");
  const [myFonts, setmyFonts] = useState([]);
  const [fonts, setFonts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sampleText, setSampleText] = useState(
    "Giant frogs quietly zigzag beneath waxy jungle vines, dodging expert hunters."
  );
  const [fontSize, setFontSize] = useState(32);
  const [fontDetails, setFontDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fontWeight, setFontWeight] = useState("regular");
  const [fontStyle, setFontStyle] = useState("normal");
  const [headingSize, setHeadingSize] = useState(32);
  const [paragraphSize, setParagraphSize] = useState(18);
  const [category, setCategory] = useState("all");
  const [sorting, setSorting] = useState("trending");

  const searchInput = useRef(null);

  const APIKEY = import.meta.env.VITE_GOOGLEFONTS_API_KEY;
  const itemsPerPage = 10;
  const totalPages = totalResults ? Math.ceil(totalResults / itemsPerPage) : 1;
  const indexOfLastFont = currentPage * itemsPerPage;
  const indexOfFirstFont = indexOfLastFont - itemsPerPage;
  const currentFonts = fonts.slice(indexOfFirstFont, indexOfLastFont);

  useEffect(() => {
    const storedFonts = JSON.parse(localStorage.getItem("myFonts"));
    if (storedFonts && storedFonts.length > 0) {
      setmyFonts(storedFonts);
    }
  }, []);

  useEffect(() => {
    let url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${APIKEY}&subset=latin&sort=${sorting}`;
    if (category !== "all") {
      url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${APIKEY}&subset=latin&category=${category}&sort=${sorting}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.items);
        setFonts(data.items);
        setTotalResults(data.items.length);
      });
  }, [APIKEY, sorting, category]);

  useEffect(() => {
    localStorage.setItem("myFonts", JSON.stringify(myFonts));
  }, [myFonts]);

  useEffect(() => {
    if (localStorage.getItem("theme")) {
      setTheme(localStorage.getItem("theme"));
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showDetails = (font) => {
    setFontDetails(font);
    console.log(font);
    openModal();
  };

  const formatFontVariantString = (variant) => {
    return variant.replace(/(\d+)([a-zA-Z]+)/, "$1 $2");
  };

  const setVariant = (variant) => {
    const matchNumber = variant.match(/\d+/);
    const weight = matchNumber ? parseInt(matchNumber[0], 10) : "normal";
    setFontWeight(weight);
    const style = variant.includes("italic") ? "italic" : "normal";
    setFontStyle(style);
  };

  const createVariantString = (font) => {
    let normalWeights = font.variants
      .map((variant) => {
        const weightMatch = variant.match(/\d+/);
        const weight = weightMatch ? weightMatch[0] : "400"; // Default to 400 if no weight is found
        return variant.includes("italic") ? null : weight; // Exclude italic variants
      })
      .filter(Boolean); // Remove null values

    // if (
    //   JSON.stringify(normalWeights) ==
    //   JSON.stringify([
    //     "100",
    //     "200",
    //     "300",
    //     "400",
    //     "500",
    //     "600",
    //     "700",
    //     "800",
    //     "900",
    //   ])
    // ) {
    //   normalWeights = ["100..900"];
    // }

    let italicWeights = font.variants
      .map((variant) => {
        const weightMatch = variant.match(/\d+/);
        const weight = weightMatch ? weightMatch[0] : "400"; // Default to 400 if no weight is found
        return variant.includes("italic") ? weight : null; // Invlude italic variants
      })
      .filter(Boolean); // Remove null values

    // if (
    //   JSON.stringify(italicWeights) ==
    //   JSON.stringify([
    //     "100",
    //     "200",
    //     "300",
    //     "400",
    //     "500",
    //     "600",
    //     "700",
    //     "800",
    //     "900",
    //   ])
    // ) {
    //   italicWeights = ["100..900"];
    // }

    let variantString = "";

    if (italicWeights.length > 0) {
      variantString = `ital,wght@0,${normalWeights.join(
        ";0,"
      )};1,${italicWeights.join(";1,")}`;
    } else {
      variantString = `wght@${normalWeights.join(";")}`;
    }

    return variantString;
  };

  const toggleFav = (font) => {
    setmyFonts((prev) =>
      prev.includes(font)
        ? prev.filter((item) => item !== font)
        : [...prev, font]
    );
  };

  const filterMyFonts = () => {
    fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${APIKEY}`)
      .then((res) => res.json())
      .then((data) => {
        const favs = data.items.filter((font) => myFonts.includes(font.family));
        setFonts(favs);
        setTotalResults(favs.length);
      });
    setCurrentPage(1);
  };

  const findFont = (e) => {
    e.preventDefault();
    const capWords = searchInput.current.value
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${APIKEY}&family=${capWords}`
    )
      .then((res) => res.json())
      .then((data) => {
        setFonts(data.items);
        setTotalResults(data.items.length);
      });
    setCurrentPage(1);
  };

  return (
    <div className={theme}>
      <div className="grid grid-cols-4 bg-neutral-100 text-neutral-950 dark:bg-neutral-900 dark:text-neutral-300">
        <header className="h-screen sticky top-0 flex flex-col justify-between p-10 bg-neutral-300 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
          <div className="flex gap-4 items-center justify-between">
            <h1 className="text-2xl font-extralight">My Fonts</h1>
            <button
              onClick={toggleTheme}
              className="p-2 flex items-center gap-2 cursor-pointer "
            >
              <IoInvertMode className="text-2xl text-black dark:text-white" />
              <span className="sr-only">Theme</span>
            </button>
          </div>
          <Panel heading="Explore Fonts">
            {" "}
            <div className="flex gap-2 items-center">
              <label htmlFor="category" className="font-extralight">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 rounded-md shadow cursor-pointer  border-1 border-neutral-300 bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-700 dark:text-neutral-50"
              >
                <option value="all">all</option>
                <option value="serif">serif</option>
                <option value="sans-serif">sans-serif</option>
                <option value="monospace">monospace</option>
                <option value="display">display</option>
                <option value="handwriting">handwriting</option>
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <label htmlFor="sort" className="font-extralight">
                Sort by
              </label>
              <select
                id="sort"
                name="sort"
                value={sorting}
                onChange={(e) => setSorting(e.target.value)}
                className="px-4 py-2 rounded-md shadow cursor-pointer  border-1 border-neutral-300 bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-700 dark:text-neutral-50"
              >
                <option value="alpha">alpha</option>
                <option value="date">date</option>
                <option value="popularity">popularity</option>
                {/* <option value="style">style</option> */}
                <option value="trending">trending</option>
              </select>
            </div>
            <div className="flex gap-2 items-center justify-between mt-2 font-extralight">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="font-black px-4 py-2 rounded-full cursor-pointer border-1 border-neutral-950 bg-neutral-900 text-neutral-300 dark:bg-neutral-100 dark:text-neutral-800"
              >
                <FaChevronLeft />
                <span className="sr-only">Previous Page</span>
              </button>
              <span>
                Page <span className="font-bold">{currentPage}</span> of{" "}
                <span className="font-normal">{totalPages}</span>
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="font-black px-4 py-2 rounded-full cursor-pointer border-1 border-neutral-950 bg-neutral-900 text-neutral-300 dark:bg-neutral-100 dark:text-neutral-800"
              >
                <FaChevronRight />
                <span className="sr-only">Next Page</span>
              </button>
            </div>
          </Panel>

          <Panel heading="Customize Sample Text">
            <div className="flex gap-2">
              <label htmlFor="fontSize" className="font-extralight">
                Font Size
              </label>
              <input
                type="range"
                min="13"
                max="300"
                id="fontSize"
                name="fontSize"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
              />
              <p>{fontSize}</p>
            </div>
            <div>
              <label
                htmlFor="sampleText"
                className="block font-extralight mb-2"
              >
                Sample Text
              </label>
              <textarea
                id="sampleText"
                name="sampleText"
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                className="block w-full min-h-24 rounded-md p-3 border-1 border-neutral-300 bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900"
              />
            </div>
          </Panel>

          <Panel heading="Find a Font by Name">
            <form onSubmit={(e) => findFont(e)} className="relative">
              <input
                type="text"
                id="search"
                name="search"
                placeholder="font name"
                ref={searchInput}
                className="w-full rounded-full p-2 ps-4 border-1 border-neutral-300 bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900"
              />
              <button
                type="submit"
                className="absolute right-0 font-bold px-4 py-2 rounded-full cursor-pointer border-1 border-neutral-950 bg-neutral-900 text-neutral-300 dark:bg-neutral-100 dark:text-neutral-800"
              >
                search
              </button>
            </form>
          </Panel>

          <button
            className="w-fit flex gap-2 items-center font-bold px-6 py-2 rounded-full cursor-pointer border-1 border-neutral-950 bg-neutral-900 text-neutral-300 dark:bg-neutral-100 dark:text-neutral-800"
            onClick={() => filterMyFonts()}
          >
            <FaHeart />
            <span>view favorites</span>
          </button>
        </header>
        <div className="col-span-3 grid grid-cols-1 grid-rows-10 ">
          {currentFonts.map((font) => {
            const variantString = createVariantString(font);
            return (
              <div
                key={font.family}
                className="relative flex gap-4 items-center px-6 pt-8 pb-4 pe-0 hover:bg-white hover:shadow-lg focus-within:bg-white dark:hover:bg-black dark:hover:shadow-neutral-700/50 dark:focus-within:bg-black group"
              >
                <div className="absolute top-2 hidden group-hover:block group-focus-within:block text-neutral-500 dark:text-neutral-400">
                  <h2 className="font-extralight text-sm">{font.family}</h2>
                </div>
                <button
                  className="text-xl text-neutral-500 dark:text-neutral-400 cursor-pointer"
                  onClick={() => toggleFav(font.family)}
                >
                  {myFonts.includes(font.family) ? <FaHeart /> : <FaRegHeart />}
                </button>
                <div className="overflow-x-scroll overflow-y-clip">
                  <link
                    rel="stylesheet"
                    href={`https://fonts.googleapis.com/css2?family=${font.family.replace(
                      /\s/g,
                      "+"
                    )}:${variantString}&display=swap`} // Correct format
                  />
                  <div
                    style={{
                      fontFamily: `"${font.family}"`,
                      fontSize: fontSize + "px",
                    }}
                    className="w-max"
                  >
                    <button
                      onClick={() => showDetails(font)}
                      className="cursor-pointer"
                    >
                      {sampleText}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {fontDetails && (
          <div className="grid grid-cols-4">
            <div className="border-r-1 me-4 pe-4">
              <p>{fontDetails.family}</p>
              <div className="flex gap-2">
                <label htmlFor="headingSize">Heading Size</label>
                <input
                  type="range"
                  min="13"
                  max="300"
                  id="headingSize"
                  name="headingSize"
                  value={headingSize}
                  onChange={(e) => setHeadingSize(e.target.value)}
                />
                <p>{headingSize}</p>
              </div>
              <div className="flex gap-2">
                <label htmlFor="paragraphSize">Paragraph Size</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  id="paragraphSize"
                  name="paragraphSize"
                  value={paragraphSize}
                  onChange={(e) => setParagraphSize(e.target.value)}
                />
                <p>{paragraphSize}</p>
              </div>
              {fontDetails.variants.map((variant) => (
                <label key={variant} htmlFor={variant} className="block">
                  <input
                    type="radio"
                    name="variant"
                    id={variant}
                    value={variant}
                    onChange={() => setVariant(variant)}
                    className="me-2"
                  />
                  {formatFontVariantString(variant)}
                </label>
              ))}
            </div>
            <div
              className="col-span-3"
              style={{
                fontFamily: `"${fontDetails.family}"`,
                fontWeight: fontWeight,
                fontStyle: fontStyle,
              }}
            >
              <h2
                className="my-8"
                style={{
                  fontSize: headingSize + "px",
                }}
              >
                Quirky Wizards Juggle Flaming Zebras in Daring Midnight
                Spectacle
              </h2>
              <p
                className=""
                style={{
                  fontSize: paragraphSize + "px",
                }}
              >
                Under the glow of a violet moon, a troupe of eccentric wizards
                mesmerized the crowd by juggling flaming zebras with astonishing
                precision. Spectators gasped as the striped creatures twirled
                through the air, their fiery manes casting wild shadows across
                the enchanted forest. Despite the chaotic display, not a single
                whisker was singed, proving once again that magic—when wielded
                by the truly audacious—can turn the impossible into a
                breathtaking reality.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;
