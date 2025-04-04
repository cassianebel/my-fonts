import { useState, useEffect, useRef } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight, FaRegCopy } from "react-icons/fa6";
import Panel from "./Components/Panel";
import Modal from "./Components/Modal";
import FavButton from "./Components/FavButton";
import ThemeButton from "./Components/ThemeButton";
import RangeInput from "./Components/RangeInput";
import SelectMenu from "./Components/SelectMenu";
import PillButton from "./Components/PillButton";

const samples = [
  "The quick brown fox jumps over the lazy dog.",
  "Jovial zebras vex badgers with quirky dancing flips.",
  "The puzzled sphinx of black quartz judges my vow.",
  "Kangaroos jump over quizzical zebras munching frozen waffles.",
  "Dizzy foxes and quirky badgers jolt sleepy humans with zest.",
  "Lumpy toads quietly zigzag between frozen hedgehogs and javelins.",
  "Mixing vodka with fuzzy juice perplexes strong-willed zebras.",
  "Giant frogs quietly zigzag beneath waxy jungle vines, dodging expert hunters.",
  "Exuberant dogs joyfully zigzag while quaint foxes jump over big hills.",
  "Jack quickly wove five exquisite baskets from zigzagging bamboo.",
];

const categories = [
  "all",
  "serif",
  "sans-serif",
  "monospace",
  "display",
  "handwriting",
];

const sortMethods = ["alpha", "date", "popularity", "trending"];

function App() {
  const [theme, setTheme] = useState("light");
  const [myFonts, setMyFonts] = useState([]);
  const [fonts, setFonts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sampleText, setSampleText] = useState(
    samples[Math.floor(Math.random() * samples.length)]
  );
  const [fontSize, setFontSize] = useState(32);
  const [fontDetails, setFontDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [headingVariant, setHeadingVariant] = useState("regular");
  const [headingFontWeight, setHeadingFontWeight] = useState("regular");
  const [headingFontStyle, setHeadingFontStyle] = useState("normal");
  const [paragraphVariant, setParagraphVariant] = useState("regular");
  const [paragraphFontWeight, setParagraphFontWeight] = useState("regular");
  const [paragraphFontStyle, setParagraphFontStyle] = useState("normal");
  const [headingSize, setHeadingSize] = useState(32);
  const [paragraphSize, setParagraphSize] = useState(18);
  const [copyType, setCopyType] = useState("cssLink");
  const [copying, setCopying] = useState("copy");
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
      setMyFonts(storedFonts);
    }
  }, []);

  useEffect(() => {
    let url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${APIKEY}&subset=latin&capability=VF&sort=${sorting}`;
    if (category !== "all") {
      url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${APIKEY}&subset=latin&capability=VF&category=${category}&sort=${sorting}`;
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

  const setHeadingWeightStyle = (variant) => {
    setHeadingVariant(variant);
    const matchNumber = variant.match(/\d+/);
    const weight = matchNumber ? parseInt(matchNumber[0], 10) : "normal";
    setHeadingFontWeight(weight);
    const style = variant.includes("italic") ? "italic" : "normal";
    setHeadingFontStyle(style);
  };

  const setParagraphWeightStyle = (variant) => {
    setParagraphVariant(variant);
    const matchNumber = variant.match(/\d+/);
    const weight = matchNumber ? parseInt(matchNumber[0], 10) : "normal";
    setParagraphFontWeight(weight);
    const style = variant.includes("italic") ? "italic" : "normal";
    setParagraphFontStyle(style);
  };

  const createVariantString = (font) => {
    let normalWeights = font.variants
      .map((variant) => {
        const weightMatch = variant.match(/\d+/);
        const weight = weightMatch ? weightMatch[0] : "400"; // Default to 400 if no weight is found
        return variant.includes("italic") ? null : weight; // Exclude italic variants
      })
      .filter(Boolean); // Remove null values

    let italicWeights = font.variants
      .map((variant) => {
        const weightMatch = variant.match(/\d+/);
        const weight = weightMatch ? weightMatch[0] : "400"; // Default to 400 if no weight is found
        return variant.includes("italic") ? weight : null; // Invlude italic variants
      })
      .filter(Boolean); // Remove null values

    // if Variable Font get weights from axis start and end
    if (font.axes !== undefined) {
      const weightAxis = font.axes.find((axis) => axis.tag === "wght");
      if (weightAxis !== undefined) {
        font.variants.map((variant) => {
          if (variant === "regular") {
            normalWeights = [`${weightAxis.start}..${weightAxis.end}`];
          } else if (variant === "italic") {
            italicWeights = [`${weightAxis.start}..${weightAxis.end}`];
          }
        });
      }
    }

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

  const filterMyFonts = () => {
    fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${APIKEY}&capability=VF`
    )
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
    if (searchInput.current?.value?.trim()) {
      const capWords = searchInput.current.value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=${APIKEY}&capability=VF&family=${capWords}`
      )
        .then((res) => res.json())
        .then((data) => {
          setFonts(data.items);
          setTotalResults(data.items.length);
        });
      setCurrentPage(1);
    }
  };

  const shuffleSampleText = () => {
    let newSample;
    do {
      newSample = samples[Math.floor(Math.random() * samples.length)];
    } while (newSample === sampleText); // Keep shuffling until it's different

    setSampleText(newSample);
  };

  const handleCopy = (fontDetails) => {
    setCopying("copying");
    const copy =
      copyType === "cssLink"
        ? `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${fontDetails.family.replace(
            /\s/g,
            "+"
          )}:${createVariantString(fontDetails)}&display=swap" />`
        : `@import url('https://fonts.googleapis.com/css2?family=${fontDetails.family.replace(
            /\s/g,
            "+"
          )}:${createVariantString(fontDetails)}&display=swap');`;

    navigator.clipboard
      .writeText(copy)
      .then(() => setCopying("copied!"))
      .catch((err) => console.error("Failed to copy:", err));

    setTimeout(() => {
      setCopying("copy");
    }, 800);
  };

  return (
    <div className={theme}>
      <div className="grid grid-cols-4 bg-neutral-100 text-neutral-950 dark:bg-neutral-900 dark:text-neutral-400">
        <header className="h-screen overflow-y-scroll  sticky top-0 flex flex-col justify-between gap-4 p-10 bg-neutral-300 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
          <div className="flex gap-4 items-center justify-between">
            <h1 className="text-2xl font-extralight">My Fonts</h1>
            <ThemeButton theme={theme} setTheme={setTheme} />
          </div>
          <Panel heading="Explore Fonts">
            <SelectMenu
              id="category"
              name="category"
              label="Category"
              value={category}
              handleChange={setCategory}
              options={categories}
            />
            <SelectMenu
              id="sort"
              name="sort"
              label="Sort by"
              value={sorting}
              handleChange={setSorting}
              options={sortMethods}
            />
            <div className="flex gap-2 items-center justify-between mt-2 font-extralight">
              <PillButton
                type="button"
                clickHandler={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPage === 1}
                icon={<FaChevronLeft />}
                text="Previous Page"
                srOnly={true}
              />
              <span>
                Page <span className="font-bold">{currentPage}</span> of{" "}
                <span className="font-normal">{totalPages}</span>
              </span>
              <PillButton
                type="button"
                clickHandler={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage >= totalPages}
                icon={<FaChevronRight />}
                text="Next Page"
                srOnly={true}
              />
            </div>
          </Panel>

          <Panel heading="Customize Sample Text">
            <RangeInput
              name="fontSize"
              id="fontSize"
              value={fontSize}
              handleChange={setFontSize}
              min="13"
              max="300"
            />
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
                className="block w-full min-h-24 max-h-40 rounded-md p-3 border-1 border-neutral-300 bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900"
              />
            </div>
            <div className="mx-auto">
              <PillButton
                type="button"
                srOnly={false}
                disabled={false}
                text="shuffle sample text"
                clickHandler={shuffleSampleText}
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
              <div className="absolute right-0 top-0">
                <PillButton
                  type="submit"
                  text="search"
                  disabled={false}
                  srOnly={false}
                />
              </div>
            </form>
          </Panel>
          <div className="mx-auto">
            <PillButton
              type="button"
              disabled={false}
              srOnly={false}
              icon={<FaHeart />}
              text="view favorites"
              clickHandler={filterMyFonts}
            />
          </div>
        </header>
        <div className="col-span-3 grid grid-cols-1 grid-rows-10 ">
          {currentFonts.map((font) => {
            const variantString = createVariantString(font);
            return (
              <div
                onClick={() => showDetails(font)}
                key={font.family}
                className="relative flex gap-4 items-center px-6 pt-8 pb-4 pe-0 hover:bg-white hover:shadow-lg focus-within:bg-white dark:hover:bg-black hover:shadow-electric-violet-900/25 dark:focus-within:bg-black group"
              >
                <div className="absolute top-2 hidden group-hover:block group-focus-within:block text-neutral-500 dark:text-neutral-400">
                  <h2 className="font-extralight text-sm">{font.family}</h2>
                </div>
                <FavButton
                  font={font}
                  myFonts={myFonts}
                  setMyFonts={setMyFonts}
                />
                <div className="overflow-x-scroll overflow-y-clip">
                  <link
                    rel="stylesheet"
                    href={`https://fonts.googleapis.com/css2?family=${font.family.replace(
                      /\s/g,
                      "+"
                    )}:${variantString}&display=swap`}
                  />
                  <button
                    style={{
                      fontFamily: `"${font.family}"`,
                      fontSize: fontSize + "px",
                    }}
                    onClick={() => showDetails(font)}
                    className="min-w-full w-max cursor-pointer"
                  >
                    {sampleText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {fontDetails && (
          <div className="grid grid-cols-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <FavButton
                  font={fontDetails}
                  myFonts={myFonts}
                  setMyFonts={setMyFonts}
                />
                <h2 className="font-extralight text-2xl">
                  {fontDetails.family}
                </h2>
                <div className="ms-auto">
                  <ThemeButton theme={theme} setTheme={setTheme} />
                </div>
              </div>

              <Panel heading="Heading">
                <RangeInput
                  name="headingSize"
                  id="headingSize"
                  value={headingSize}
                  handleChange={setHeadingSize}
                  min="13"
                  max="300"
                />

                <fieldset>
                  <legend className="font-extralight mb-2">Style</legend>
                  {fontDetails.axes === undefined
                    ? fontDetails.variants.map((variant) => (
                        <label
                          key={"h" + variant}
                          htmlFor={"h" + variant}
                          className="inline-block m-2 px-3 py-1 rounded-full cursor-pointer shadow border-neutral-50 bg-neutral-50 text-neutral-800 hover:bg-white hover:border-white has-checked:bg-electric-violet-300 has-checked:border-electric-violet-300 dark:bg-neutral-950 dark:text-neutral-300 dark:border-neutral-950 hover:dark:bg-black hover:dark:border-black dark:has-checked:bg-electric-violet-700 dark:has-checked:border-electric-violet-700 has-checked:shadow-none has-checked:inset-shadow-sm inset-shadow-electric-violet-500 dark:inset-shadow-electric-violet-950"
                        >
                          <input
                            type="radio"
                            name="hvariant"
                            id={"h" + variant}
                            value={variant}
                            checked={headingVariant === variant}
                            onChange={() => setHeadingWeightStyle(variant)}
                            className="hidden"
                          />
                          {formatFontVariantString(variant)}
                        </label>
                      ))
                    : fontDetails.variants.map((variant) => {
                        const weightAxis = fontDetails.axes.find(
                          (axis) => axis.tag === "wght"
                        );
                        const weightOptions = weightAxis
                          ? Array.from(
                              {
                                length:
                                  (weightAxis.end - weightAxis.start) / 100 + 1,
                              },
                              (_, i) => weightAxis.start + i * 100
                            )
                          : [];
                        if (variant === "regular") variant = "";
                        return weightOptions.map((weight) => (
                          <label
                            key={weight + variant}
                            className="inline-block m-2 px-3 py-1 rounded-full cursor-pointer shadow border-neutral-50 bg-neutral-50 text-neutral-800 hover:bg-white hover:border-white has-checked:bg-electric-violet-300 has-checked:border-electric-violet-300 dark:bg-neutral-950 dark:text-neutral-300 dark:border-neutral-950 hover:dark:bg-black hover:dark:border-black dark:has-checked:bg-electric-violet-700 dark:has-checked:border-electric-violet-700 has-checked:shadow-none has-checked:inset-shadow-sm inset-shadow-electric-violet-500 dark:inset-shadow-electric-violet-950"
                          >
                            <input
                              type="radio"
                              name="hvariant"
                              value={weight + variant}
                              checked={headingVariant === weight + variant}
                              onChange={() =>
                                setHeadingWeightStyle(weight + variant)
                              }
                              className="hidden"
                            />
                            {formatFontVariantString(weight + variant)}
                          </label>
                        ));
                      })}
                </fieldset>
              </Panel>
              <Panel heading="Paragraph">
                <RangeInput
                  name="paragraphSize"
                  id="paragraphSize"
                  value={paragraphSize}
                  handleChange={setParagraphSize}
                  min="1"
                  max="50"
                />
                <fieldset>
                  <legend className="font-extralight">Style</legend>
                  {fontDetails.axes === undefined
                    ? fontDetails.variants.map((variant) => (
                        <label
                          key={"p" + variant}
                          htmlFor={"p" + variant}
                          className="inline-block m-2 px-3 py-1 rounded-full cursor-pointer shadow border-neutral-50 bg-neutral-50 text-neutral-800 hover:bg-white hover:border-white has-checked:bg-electric-violet-300 has-checked:border-electric-violet-300 dark:bg-neutral-950 dark:text-neutral-300 dark:border-neutral-950 hover:dark:bg-black hover:dark:border-black dark:has-checked:bg-electric-violet-700 dark:has-checked:border-electric-violet-700 has-checked:shadow-none has-checked:inset-shadow-sm inset-shadow-electric-violet-500 dark:inset-shadow-electric-violet-950"
                        >
                          <input
                            type="radio"
                            name="pvariant"
                            id={"p" + variant}
                            value={variant}
                            checked={paragraphVariant === variant}
                            onChange={() => setParagraphWeightStyle(variant)}
                            className="hidden"
                          />
                          {formatFontVariantString(variant)}
                        </label>
                      ))
                    : fontDetails.variants.map((variant) => {
                        const weightAxis = fontDetails.axes.find(
                          (axis) => axis.tag === "wght"
                        );
                        const weightOptions = weightAxis
                          ? Array.from(
                              {
                                length:
                                  (weightAxis.end - weightAxis.start) / 100 + 1,
                              },
                              (_, i) => weightAxis.start + i * 100
                            )
                          : [];
                        if (variant === "regular") variant = "";
                        return weightOptions.map((weight) => (
                          <label
                            key={weight + variant}
                            className="inline-block m-2 px-3 py-1 rounded-full cursor-pointer shadow border-neutral-50 bg-neutral-50 text-neutral-800 hover:bg-white hover:border-white has-checked:bg-electric-violet-300 has-checked:border-electric-violet-300 dark:bg-neutral-950 dark:text-neutral-300 dark:border-neutral-950 hover:dark:bg-black hover:dark:border-black dark:has-checked:bg-electric-violet-700 dark:has-checked:border-electric-violet-700 has-checked:shadow-none has-checked:inset-shadow-sm inset-shadow-electric-violet-500 dark:inset-shadow-electric-violet-950"
                          >
                            <input
                              type="radio"
                              name="pvariant"
                              value={weight + variant}
                              checked={paragraphVariant === weight + variant}
                              onChange={() =>
                                setParagraphWeightStyle(weight + variant)
                              }
                              className="hidden"
                            />
                            {formatFontVariantString(weight + variant)}
                          </label>
                        ));
                      })}
                </fieldset>
              </Panel>
            </div>

            <div className="col-span-3 flex flex-col gap-20 ms-14">
              <div>
                <h3
                  className="my-8"
                  style={{
                    fontFamily: `"${fontDetails.family}"`,
                    fontWeight: headingFontWeight,
                    fontStyle: headingFontStyle,
                    fontSize: headingSize + "px",
                  }}
                >
                  Quirky Wizards Juggle Flaming Zebras in Daring Midnight
                  Spectacle
                </h3>
                <p
                  className=""
                  style={{
                    fontFamily: `"${fontDetails.family}"`,
                    fontWeight: paragraphFontWeight,
                    fontStyle: paragraphFontStyle,
                    fontSize: paragraphSize + "px",
                  }}
                >
                  Under the glow of a violet moon, a troupe of eccentric wizards
                  mesmerized the crowd by juggling flaming zebras with
                  astonishing precision. Spectators gasped as the striped
                  creatures twirled through the air, their fiery manes casting
                  wild shadows across the enchanted forest. Despite the chaotic
                  display, not a single whisker was singed, proving once again
                  that magic—when wielded by the truly audacious—can turn the
                  impossible into a breathtaking reality.
                </p>
              </div>
              <Panel heading="Code">
                <div className="flex justify-between gap-10">
                  <fieldset>
                    <label
                      htmlFor="cssLink"
                      className="inline-block m-2 px-3 py-1 rounded-full cursor-pointer shadow border-neutral-50 bg-neutral-50 text-neutral-800 hover:bg-white hover:border-white has-checked:bg-electric-violet-300 has-checked:border-electric-violet-300 dark:bg-neutral-950 dark:text-neutral-300 dark:border-neutral-950 hover:dark:bg-black hover:dark:border-black dark:has-checked:bg-electric-violet-700 dark:has-checked:border-electric-violet-700 has-checked:shadow-none has-checked:inset-shadow-sm inset-shadow-electric-violet-500 dark:inset-shadow-electric-violet-950"
                    >
                      <input
                        id="cssLink"
                        name="cssType"
                        value="cssLink"
                        type="radio"
                        checked={copyType === "cssLink"}
                        onChange={() => setCopyType("cssLink")}
                        className="hidden"
                      />
                      {"<link>"}
                    </label>
                    <label
                      htmlFor="cssImport"
                      className="inline-block m-2 px-3 py-1 rounded-full cursor-pointer shadow border-neutral-50 bg-neutral-50 text-neutral-800 hover:bg-white hover:border-white has-checked:bg-electric-violet-300 has-checked:border-electric-violet-300 dark:bg-neutral-950 dark:text-neutral-300 dark:border-neutral-950 hover:dark:bg-black hover:dark:border-black dark:has-checked:bg-electric-violet-700 dark:has-checked:border-electric-violet-700 has-checked:shadow-none has-checked:inset-shadow-sm inset-shadow-electric-violet-500 dark:inset-shadow-electric-violet-950"
                    >
                      <input
                        id="cssImport"
                        name="cssType"
                        value="cssImport"
                        type="radio"
                        checked={copyType === "cssImport"}
                        onChange={() => setCopyType("cssImport")}
                        className="hidden"
                      />
                      {"@import"}
                    </label>
                  </fieldset>

                  <button
                    onClick={() => handleCopy(fontDetails)}
                    className="flex items-center gap-2 w-fit font-bold px-4 py-2 rounded-full cursor-pointer shadow border-1 border-electric-violet-300 bg-electric-violet-300 text-neutral-900 hover:bg-electric-violet-400 hover:border-electric-violet-400 dark:bg-electric-violet-900 dark:text-neutral-100 dark:border-electric-violet-900 hover:dark:bg-electric-violet-800 hover:dark:border-electric-violet-800 transition-colors duration-300"
                  >
                    <FaRegCopy />
                    <span>{copying}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                  <code className="block text-sm whitespace-pre-wrap">
                    {copyType === "cssLink"
                      ? `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${fontDetails.family.replace(
                          /\s/g,
                          "+"
                        )}:${createVariantString(fontDetails)}&display=swap" />`
                      : `@import url('https://fonts.googleapis.com/css2?family=family=${fontDetails.family.replace(
                          /\s/g,
                          "+"
                        )}:${createVariantString(fontDetails)}&display=swap');`}
                  </code>
                </pre>
              </Panel>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;
