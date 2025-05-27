import { useState } from "react";

const jokeApis = {
  general: "https://official-joke-api.appspot.com/random_joke",
  dad: "https://icanhazdadjoke.com/",
  programming: "https://v2.jokeapi.dev/joke/Programming?type=twopart",
  quotes: "https://api.quotable.io/random",
};

const emojiSets = ["😂🤣😂🤣", "😆😹😆😹", "😄😅😄😅", "😁😜😁😜"];

const JokePage = () => {
  const [joke, setJoke] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [emojiSet, setEmojiSet] = useState("");
  const [animate, setAnimate] = useState(false);
  const [category, setCategory] = useState("general"); // Default category

  const fetchRandomJoke = async () => {
    setAnimate(false); // Reset animation
    setTimeout(() => setAnimate(true), 50); // Re-trigger animation after a short delay

    setJoke({});
    setIsLoading(true);
    setEmojiSet(""); // Clear emojis while loading

    try {
      const jokeUrl = jokeApis[category]; // Get API URL based on selected category
      const response = await fetch(jokeUrl, {
        headers: category === "dad" ? { Accept: "application/json" } : {},
      });
      if (!response.ok) {
        throw new Error("Failed to fetch joke");
      }
      const result = await response.json();

      // Handle different API responses
      if (category === "dad") {
        setJoke({ setup: result.joke, punchline: "" });
      } else if (category === "quotes") {
        // Ensure the "quotes" API response is handled correctly
        setJoke({
          setup: result.content || "No quote available.",
          punchline: result.author ? `${result.author}` : "",
        });
      } else {
        setJoke(result);
      }

      // Randomly select an emoji set
      const randomEmojiIndex = Math.floor(Math.random() * emojiSets.length);
      setEmojiSet(emojiSets[randomEmojiIndex]);

    } catch (error) {
      console.error("Error fetching joke:", error);

      setJoke({
        setup: "Oops!",
        punchline: "Something went wrong. Please try again!",
      });
      
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  const isFirstRender = !joke.setup && !isLoading;

  return (
    <>
      <div className="funme-logo">
        Fun<span>Me</span>
      </div>
      <div className="category-buttons">
        <button
          className={`category-btn ${category === "general" ? "active" : ""}`}
          onClick={() => setCategory("general")}
        >
          General
        </button>
        <button
          className={`category-btn ${category === "dad" ? "active" : ""}`}
          onClick={() => setCategory("dad")}
        >
          Dad Jokes
        </button>
        <button
          className={`category-btn ${
            category === "programming" ? "active" : ""
          }`}
          onClick={() => setCategory("programming")}
        >
          Programming Jokes
        </button>
        <button
          className={`category-btn ${category === "quotes" ? "active" : ""}`}
          onClick={() => setCategory("quotes")}
        >
          Funny Quotes
        </button>
      </div>
      <div className={`joker-container ${animate ? "slide-in" : ""}`}>
        {joke.setup && (
          <div>
            <p className="joke-setup">{`${joke.setup}`}</p>
            <p className="joke-punch-line">{`${joke.punchline}`}</p>
          </div>
        )}
        <p className="joke-para">{isFirstRender && "Click for a joke"}</p>
        <p>{isLoading && "Loading..."}</p>
      </div>
      <div className="bottom-section">
        {emojiSet && <p className="laughing-emojis">{emojiSet}</p>}
        <button className="joke-btn" onClick={fetchRandomJoke}>
          New Joke!
        </button>
      </div>
    </>
  );
};

export default JokePage;
