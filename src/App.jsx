import { useState, useEffect } from "react";
import Modal from "./Components/Modal";

function App() {
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

  const APIKEY = import.meta.env.VITE_GOOGLEFONTS_API_KEY;
  const itemsPerPage = 10;
  const totalPages = totalResults ? Math.ceil(totalResults / itemsPerPage) : 1;
  const indexOfLastFont = currentPage * itemsPerPage;
  const indexOfFirstFont = indexOfLastFont - itemsPerPage;
  const currentFonts = fonts.slice(indexOfFirstFont, indexOfLastFont);

  useEffect(() => {
    fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${APIKEY}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.items);
        setFonts(data.items);
        setTotalResults(data.items.length);
      });
  }, []);

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
    const matchStyle = variant.match(/[a-zA-Z]+/);
    const style = matchStyle ? matchStyle[0] : "normal";
    setFontStyle(style);
  };

  return (
    <>
      <div className="grid grid-cols-4">
        <header className="h-screen sticky top-0 bg-zinc-100 p-10">
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
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded"
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
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Next
            </button>
          </div>
        </header>
        <div className="col-span-3 grid grid-cols-1 grid-rows-10 gap-10 p-10">
          {currentFonts.map((font) => {
            let normalWeights = font.variants
              .map((variant) => {
                const weightMatch = variant.match(/\d+/);
                const weight = weightMatch ? weightMatch[0] : "400"; // Default to 400 if no weight is found
                return variant.includes("italic") ? null : weight; // Exclude italic variants
              })
              .filter(Boolean); // Remove null values

            if (
              JSON.stringify(normalWeights) ==
              JSON.stringify([
                "100",
                "200",
                "300",
                "400",
                "500",
                "600",
                "700",
                "800",
                "900",
              ])
            ) {
              normalWeights = ["100..900"];
            }

            let italicWeights = font.variants
              .map((variant) => {
                const weightMatch = variant.match(/\d+/);
                const weight = weightMatch ? weightMatch[0] : "400"; // Default to 400 if no weight is found
                return variant.includes("italic") ? weight : null; // Invlude italic variants
              })
              .filter(Boolean); // Remove null values

            if (
              JSON.stringify(italicWeights) ==
              JSON.stringify([
                "100",
                "200",
                "300",
                "400",
                "500",
                "600",
                "700",
                "800",
                "900",
              ])
            ) {
              italicWeights = ["100..900"];
            }

            let variantString = "";

            if (italicWeights.length > 0) {
              variantString = `ital,wght@0,${normalWeights.join(
                ";0,"
              )};1,${italicWeights.join(";1,")}`;
            } else {
              variantString = `wght@${normalWeights.join(";")}`;
            }

            return (
              <div key={font.family} className="overflow-x-scroll">
                <link
                  rel="stylesheet"
                  href={`https://fonts.googleapis.com/css2?family=${font.family.replace(
                    /\s/g,
                    "+"
                  )}:${variantString}&display=swap`} // Correct format
                />
                <p
                  style={{
                    fontFamily: `"${font.family}"`,
                    fontSize: fontSize + "px",
                  }}
                  className="w-max"
                >
                  <button onClick={() => showDetails(font)}>
                    {sampleText}
                  </button>
                </p>
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
