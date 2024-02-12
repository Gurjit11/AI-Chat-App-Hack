import "./App.css";
import { useState } from "react";
import Footer from "./components/Footer";
import Confetti from "./components/Confetti";
import YouTubeSearch from "./components/YoutubeSearch";
import GPT from "./components/GPT";

function App() {
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [transcribe, setTranscribe] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answering, setAnswering] = useState(false);
  const [answer, setAnswer] = useState("");
  const [clearing, setClearing] = useState(false);
  const [clear, setClear] = useState("");

  const handleAddUrl = () => {
    setUrls([...urls, ""]);
  };

  const handleChangeUrl = (index, value) => {
    const updatedUrls = [...urls];
    updatedUrls[index] = value;
    setUrls(updatedUrls);
  };

  const fetchTranscript = (e) => {
    setLoading(true);
    e.preventDefault();
    fetch(`${process.env.REACT_APP_BACKEND_URL}/transcribe`, {
      method: "POST",
      body: JSON.stringify({
        video_url: url,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // setData(data)
        setTranscribe(data.script);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };
  // console.log(transcribe)

  const fetchAnswer = (e) => {
    setAnswering(true);
    e.preventDefault();
    fetch(`${process.env.REACT_APP_BACKEND_URL}/query`, {
      method: "POST",
      body: JSON.stringify({
        query: question,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // setData(data)
        setAnswer(data.ans);
        setAnswering(false);
      })
      .catch((err) => {
        setAnswering(false);
        console.error(err);
      });
  };
  // console.log(transcribe)

  const fetchClear = (e) => {
    setClearing(true);
    e.preventDefault();
    fetch(`${process.env.REACT_APP_BACKEND_URL}/clear`, {
      method: "POST",
      body: JSON.stringify({
        query: question,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // setData(data)
        setClear(data.ans);
        setClearing(false);
      });
  };
  // console.log(transcribe)

  return (
    <div className="">
      <div className="sm:p-20 py-12 px-2 bg-[url('../public/bg.jpeg')] h-[400px] bg-cover">
        <div className=" mt-12 mb-24">
          <div className="text-white ">
            <p className="text-5xl font-bold">AI Video Quering Tool</p>
            <p className="mt-3 text-xl">
              Take a youtube url and generate transcript{" "}
            </p>
            <p className="text-xl"> and AI is ready to ans all questions</p>
            <p className="text-xl"> about that video</p>
          </div>
          <YouTubeSearch />
        </div>
        <div className="pb-3">
          <div className="pb-20 pt-10 sm:px-20 sm:mx-20 px-3 mx-2 mb-20 rounded-xl bg-gradient-to-br from-black to-blue-950 border-[0.1px] border-gray-700 shadow-blue-900 shadow-[0px_10px_50px_3px_rgba(0,0,0,0.1)] text-white ">
            <div className="bg-gradient-to-br from-blue-500 mb-8 to-cyan-400 bg-clip-text text-transparent text-3xl flex justify-center font-bold">
              Query Videos using AI
            </div>
            <form onSubmit={fetchTranscript}>
              {/* <div className="mb-4">
                <label className="block  font-semibold  mb-2">
                  Youtube Video URLs:{" "}
                  <span className="text-blue-500 text-sm font-semibold">
                    (Please provide videos shorter than 5 mins as the API is
                    limited)
                  </span>
                </label>
                {urls.map((url, index) => (
                  <input
                    key={index}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                    type="url"
                    value={url}
                    onChange={(e) => handleChangeUrl(index, e.target.value)}
                    placeholder="Enter the url..."
                    required
                  />
                ))}
                <button
                  className="bg-blue-500 hover:bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2"
                  type="button"
                  onClick={handleAddUrl}
                >
                  Add URL
                </button>
              </div> */}
              <div className="mb-4">
                <label className="block  font-semibold  mb-2">
                  Youtube Video URL:{" "}
                  <span className="text-blue-500 text-sm font-semibold">
                    ( Please take videos shorter than 5 mins as the api is
                    limited )
                  </span>
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter the url..."
                  name="video_url"
                  id="video_url"
                  required
                />
              </div>
              <button
                className="bg-blue-500 hover:bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Transcribe
              </button>
            </form>
            {loading ? "AI is working on it..." : null}
            {transcribe ? (
              <>
                <h2 className="text-2xl font-semibold mt-8 mb-4">
                  Transcription
                </h2>
                <div className="shadow-[0px_0px_25px_rgba(0,0,0,0.35)] rounded-lg p-2 bg-gradient-to-br from-blue-900 to-blue-950 text-white overflow-y-auto max-h-[300px] w-full">
                  <code className=" p-1">{transcribe}</code>
                </div>
              </>
            ) : null}
            {transcribe ? (
              <>
                <form onSubmit={fetchAnswer}>
                  <div className="mb-4 mt-20">
                    <label className="block text-white font-semibold mb-2">
                      Question about video:{" "}
                      <span className="text-blue-500 text-sm font-semibold">
                        ( AI may take some time... )
                      </span>
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Enter the question..."
                      name="video_url"
                      id="video_url"
                      required
                    />
                  </div>
                  <button
                    className="bg-blue-500 hover:bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    {answering ? "Thinking..." : "Get Answer"}
                  </button>
                </form>
              </>
            ) : null}

            {answer ? (
              <>
                <h2 className="text-xl font-semibold mt-8 mb-4">Answer</h2>
                <div className="shadow-[0px_0px_25px_rgba(0,0,0,0.35)] rounded-lg p-2 bg-gradient-to-br from-blue-900 to-blue-950 text-white overflow-y-auto max-h-[300px] w-full">
                  <code className=" p-1">{answer}</code>
                </div>
              </>
            ) : null}

            {transcribe ? (
              <button
                className="bg-red-500 hover:bg-gradient-to-r from-orange-500 via-red-600 to-pink-400 mt-4 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={fetchClear}
              >
                {clearing ? "Clearing..." : "Clear DB"}
              </button>
            ) : null}
            {transcribe ? (
              clear ? (
                <span className="text-blue-500 ml-3">( {clear} )</span>
              ) : (
                <span className="text-blue-500 ml-3">
                  ( Please Clear DB if you want to start a new conversation )
                </span>
              )
            ) : null}
            {clear ? <Confetti /> : null}
            <GPT />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
