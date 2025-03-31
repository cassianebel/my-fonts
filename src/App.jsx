import { useState, useEffect, useRef } from "react";
import Modal from "./Components/Modal";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function App() {
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
    let url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${APIKEY}&sort=${sorting}`;
    if (category !== "all") {
      url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${APIKEY}&category=${category}&sort=${sorting}`;
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
    <>
      <div className="grid grid-cols-4 bg-zinc-100">
        <header className="h-screen sticky top-0 bg-zinc-300 p-10">
          <div className="flex gap-2">
            <label htmlFor="fontSize">Font Size</label>
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
            <label htmlFor="sampleText" className="block">
              Sample Text
            </label>
            <textarea
              id="sampleText"
              name="sampleText"
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              className="block w-full border-1 rounded p-3"
            />
          </div>
          <div>
            <form onSubmit={(e) => findFont(e)}>
              <input
                type="text"
                id="search"
                name="search"
                placeholder="find by font name"
                ref={searchInput}
              />
              <button type="submit">find</button>
            </form>
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 bg-zinc-200 rounded"
            >
              <option value="all">all</option>
              <option value="serif">serif</option>
              <option value="sans-serif">sans-serif</option>
              <option value="monospace">monospace</option>
              <option value="display">display</option>
              <option value="handwriting">handwriting</option>
            </select>
          </div>
          <div>
            <label htmlFor="sort">Sort by</label>
            <select
              id="sort"
              name="sort"
              value={sorting}
              onChange={(e) => setSorting(e.target.value)}
              className="px-4 py-2 bg-zinc-200 rounded"
            >
              <option value="alpha">alpha</option>
              <option value="date">date</option>
              <option value="popularity">popularity</option>
              {/* <option value="style">style</option> */}
              <option value="trending">trending</option>
            </select>
          </div>
          <div>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-zinc-200 rounded"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-zinc-200 rounded"
            >
              Next
            </button>
          </div>

          <button
            className="flex gap-2 items-center "
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
                className="flex gap-4 items-center p-6 pe-0 hover:bg-white "
              >
                <button
                  className="text-xl text-zinc-500"
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
                    <button onClick={() => showDetails(font)}>
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
    </>
  );
}

export default App;
