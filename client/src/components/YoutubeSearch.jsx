import React, { useState } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function YouTubeSearch() {
  // Create state variables for search query and video list
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const notify = (text) =>
    toast(text, { className: "text-white bg-blue-500 font-semibold" });
  // Define the API key and URL for YouTube Data API v3
  const API_KEY = "AIzaSyCR8QsFiXpfKoJ-rpWrzr-9PdOzLFF4qtA";
  const API_URL = "https://www.googleapis.com/youtube/v3/search";

  // Define a function to handle the form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Make a GET request to the API with the query and the API key as parameters
    const response = await axios.get(API_URL, {
      params: {
        q: query,
        part: "snippet",
        maxResults: 5,
        key: API_KEY,
        type: "video",
      },
    });
    // Extract the video list from the response data
    const videoList = response.data.items;
    // Update the state with the video list
    setVideos(videoList);
  };

  const copyURL = (url) => {
    // Copy the URL to the clipboard using the navigator.clipboard.writeText() function
    navigator.clipboard.writeText(url);
    // Alert the user that the URL has been copied
    notify(`Copied URL👌`);
  };

  // Define a function to render the video list as HTML cards
  const renderVideos = () => {
    return videos.map((video) => {
      // Get the video id, title, description and thumbnail from the video object
      const videoId = video.id.videoId;
      const videoTitle = video.snippet.title;
      const videoDescription = video.snippet.description;
      const videoThumbnail = video.snippet.thumbnails.medium.url;
      // Construct the video URL from the video id
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      // Return a card element with the video information
      return (
        <div key={videoId} className="">
          <YouTube videoId={videoId} className="" />

          <p className="border border-blue-700 pl-2 ">
            {videoUrl}

            <button
              className="ml-5 bg-blue-500 font-semibold p-2"
              onClick={() => copyURL(videoUrl)}
            >
              Copy URL
            </button>
          </p>
        </div>
      );
    });
  };

  // Return the JSX code for the component
  return (
    <div className="mt-20">
      <div className="pb-20 pt-10 sm:px-20 sm:mx-20 px-3 mx-2 mb-20 rounded-xl bg-gradient-to-br from-black to-blue-950 border-[0.1px] border-gray-700 shadow-blue-900 shadow-[0px_10px_50px_3px_rgba(0,0,0,0.1)] text-white ">
        <div className="bg-gradient-to-br from-blue-500 mb-8 to-cyan-400 bg-clip-text text-transparent text-3xl flex justify-center font-bold">
          Search Youtube
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group font-semibold ">
            <label htmlFor="query">Enter a search term</label>
            <input
              type="text"
              id="query"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              value={query}
              placeholder="Search for videos..."
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2"
          >
            Search
          </button>
        </form>
        <div className="flex overflow-x-auto gap-5">{renderVideos()}</div>
      </div>
      <ToastContainer className="bg-transparent" />
    </div>
  );
}

export default YouTubeSearch;
