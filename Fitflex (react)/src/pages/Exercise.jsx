import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Exercise.css';

const Exercise = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);

  // Fetch Exercise Details
  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (id) => {
    const options = {
      method: 'GET',
      url: `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`,
      headers: {
        'X-RapidAPI-Key': '70d4c319a1mshcd61effa4a6161bp1e2d7ejsn3efcd8fbd6c8', 
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
      }
    };

    try {
      const response = await axios.request(options);
      console.log("Exercise Data:", response.data);

      if (response.data?.name) {
        setExercise(response.data);
        fetchRelatedVideos(response.data.name);
      } else {
        console.error("Exercise name not found!");
      }
    } catch (error) {
      console.error("Error fetching exercise data:", error);
    }
  };

  // Fetch YouTube Related Videos
  const fetchRelatedVideos = async (name) => {
    console.log("Searching for videos related to:", name);

    const options = {
      method: 'GET',
      url: 'htps://youtube-search-and-download.p.rapidapi.com/search',
      params: {
        query: name,
        hl: 'en',
        upload_date: 't',
        duration: 'l',
        type: 'v',
        sort: 'r'
      },
      headers: {
         'x-rapidapi-key': '70d4c319a1mshcd61effa4a6161bp1e2d7ejsn3efcd8fbd6c8',
         'x-rapidapi-host': 'youtube-search-and-download.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      console.log("YouTube API Response:", response.data);

      if (response.data?.contents) {
        setRelatedVideos(response.data.contents);
      } else {
        console.error("No videos found!");
      }
    } catch (error) {
      console.error("YouTube API Error:", error.response ? error.response.data : error.message);

    }
  };

  return (
    <div className='exercise-page'>
      {/* Exercise Details Section */}
      {exercise && (
        <div className="exercise-container">
          <div className="exercise-image">
            <img src={exercise.gifUrl} alt="exercise img" />
          </div>

          <div className="exercise-data">
            <h3>{exercise.name}</h3>
            <span>
              <b>Target:</b>
              <p>{exercise.target}</p>
            </span>
            <span>
              <b>Equipment:</b>
              <p>{exercise.equipment}</p>
            </span>
            <span>
              <b>Secondary Muscles:</b>
              <ul>
                {exercise.secondaryMuscles.map((muscle, index) => (
                  <li key={index}>{muscle}</li>
                ))}
              </ul>
            </span>
            <div className="exercise-instructions">
              <h3>Instructions</h3>
              {exercise.instructions.map((instruction, index) => (
                <ul key={index}>
                  <li>{instruction}</li>
                </ul>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related Videos Section */}
      <div className="related-videos-container">
        <h3>Related Videos on YouTube</h3>
        {relatedVideos.length > 0 && (
          <div className="related-videos">
            {relatedVideos.map((item, index) => {
              if (item.video) {
                return (
                  index < 15 && (
                    <div
                      className="related-video"
                      key={index}
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${item.video.videoId}`, "_blank")}
                    >
                      {item.video.thumbnails && item.video.thumbnails.length > 0 && (
                        <img src={item.video.thumbnails[0].url} alt="Video Thumbnail" />
                      )}
                      <h4>{item.video.title ? item.video.title.slice(0, 40) : "No Title"}...</h4>
                      <span>
                        <p>{item.video.channelName || "Unknown Channel"}</p>
                        <p>{item.video.viewCountText || "No Views"}</p>
                      </span>
                    </div>
                  )
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercise;
