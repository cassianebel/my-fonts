import { useState, useEffect } from "react";

function App() {
  const [fonts, setFonts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [sampleText, setSampleText] = useState(
    "Wizardly gnomes flick javelins over exuberant dogs basking in the quartz sun."
  );
  const [fontSize, setFontSize] = useState(36);
  const APIKEY = import.meta.env.VITE_GOOGLEFONTS_API_KEY;

  useEffect(() => {
    fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${APIKEY}`)
      .then((res) => res.json())
      .then((data) => {
        setFonts(data.items.slice(0, 10));
        setTotalResults(data.items.length);
      });
  }, []);

  return (
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
        <div>{totalResults}</div>
      </header>
      <div className="col-span-3 grid grid-cols-1 grid-rows-10 gap-10 p-10">
        {fonts.map((font) => (
          <div key={font.family} className="overflow-x-scroll">
            <link
              rel="stylesheet"
              href={`https://fonts.googleapis.com/css2?family=${font.family.replace(
                /\s/g,
                "+"
              )}&display=swap`}
            />
            <p
              style={{ fontFamily: font.family, fontSize: fontSize + "px" }}
              className="w-max"
            >
              {sampleText}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
