import React, { useState, useContext, useEffect } from "react";
import "../styles/CreateEntryPage.css";
import "../styles/SelectBoxForm.css";
import { AppContext } from "../AppContext";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/SelectBoxForm.css";

const CreateMovieListingPage = () => {
  const { user, setUser, backendDomain } = useContext(AppContext);
  const [formData, setFormData] = useState({
    movie: "",
    cinema: "",
    timing: [],
  });

  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [halls, setHalls] = useState([]);
  const [seatingLayout, setSeatingLayout] = useState([]);
  const [selectedBox, setSelectedBox] = useState([]);

  useEffect(() => {
    const fetchMovies = async (req, res) => {
      try {
        const response = await axios.get(
          `${backendDomain}/api/v1/movie/select-all-movies`
        );
        setMovies(response.data);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };

    const fetchCinemas = async (req, res) => {
      try {
        const response = await axios.get(
          `${backendDomain}/api/v1/cinema/show-all-cinema-locations`
        );

        setCinemas(response.data);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };

    fetchMovies();
    fetchCinemas();
  }, [backendDomain]);

  const toggleBox = (timingId) => {
    if (selectedBox.includes(timingId)) {
      setSelectedBox(selectedBox.filter((value) => value !== timingId));
      setFormData((prevData) => ({
        ...prevData,
        timing: prevData.timing.filter((g) => g !== timingId),
      }));
    } else {
      setSelectedBox([...selectedBox, timingId]);
      setFormData((prevData) => ({
        ...prevData,
        timing: [...prevData.timing, timingId],
      }));
    }
  };

  const timings = [
    { id: 1, value: "11.00 am" },
    { id: 2, value: "1.30 pm" },
    { id: 3, value: "4.00 pm" },
    { id: 4, value: "6.30 pm" },
    { id: 5, value: "9.00 pm" },
    { id: 6, value: "11.30 pm" },
  ];

  const fetchHalls = async (cinemaId) => {
    console.log("inside fetch halls");
    try {
      const response = await axios.get(
        `${backendDomain}/api/v1/cinema/${cinemaId}/halls`
      );
      setHalls(response.data);
    } catch (error) {
      console.log("Error fetching halls:", error);
    }
  };

  const fetchSeatingLayout = async (hallId) => {
    try {
      const response = await axios.get(
        `${backendDomain}/api/v1/cinema/${hallId}/bays`
      );
      console.log(response);
    } catch (error) {
      console.log("Error fetching seating layout: ", error);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name == "movie") {
      const selectedMovie = movies.find((movie) => movie._id === value);

      if (selectedMovie) {
        setFormData((prevData) => ({
          ...prevData,
          startDate: selectedMovie.startDate,
          endDate: selectedMovie.endDate,
        }));
      }
    }

    // if a cinema is selected, fetch associated halls
    if (name == "cinema") {
      fetchHalls(value);
    }

    if (name == "hall") {
      fetchSeatingLayout(value);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    let allSuccessful = true; // Track the success of all API calls
    try {
      // TODO need to save into multiple different documents, instead of one single document
      // also need to get the associated cinema seats, bay etc and save into movie listing
      console.log(movies);
      for (let i = 0; i < formData.timing.length; i++) {
        const timing = formData.timing[i];
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);

        for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
          const currentDate = new Date(day).toISOString().split("T")[0];

          // for (const showTime of timing) {
          const movieListingData = {
            movie: formData.movie,
            cinema: formData.cinema,
            hall: formData.hall,
            showTime: formData.timing[i],
            showDate: currentDate,
          };
          console.log(movieListingData);
          const response = await axios.post(
            `${backendDomain}/api/v1/movieListing/create-movie-listing`,
            movieListingData,
            {
              headers: {
                // "Content-Type": "multipart/form-data",
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          if (response.status !== 201) {
            allSuccessful = false; // Mark as failed if status is not 201
          }
        }
      }
      if (allSuccessful) {
        alert("Movie listing created!");
      } else {
        alert(
          "Some movie listings could not be created. Check the console for details."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      allSuccessful = false;
    }
  };
  return (
    <div className="form-container">
      <form className="user-info-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="movie">Movies</label>
          <select name="movie" value={formData.movie} onChange={handleChange}>
            <option value>Select a movie</option>
            {movies.map((movie) => (
              <option value={movie._id}>{movie.movieName}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="cinema">Cinemas</label>
          <select name="cinema" value={formData.cinema} onChange={handleChange}>
            <option value>Select a cinema</option>
            {cinemas.map((cinema) => (
              <option value={cinema._id}>
                {cinema.operator + " " + cinema.location}
              </option>
            ))}
          </select>
        </div>
        {formData.cinema && (
          <div className="form-group">
            <label htmlFor="hall">Halls</label>
            <select name="hall" value={formData.hall} onChange={handleChange}>
              <option value>Select a hall</option>
              {halls.map((hall) => (
                <option key={hall._id} value={hall._id}>
                  {hall.hall_name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="timing">Timings</label>
          <div className="box-container">
            {timings.map((timing, i) => (
              <label key={timing.value} className="select-box-label">
                <div
                  className={`select-box ${
                    selectedBox.includes(timing.value) ? "selected" : ""
                  }`}
                  onClick={() => toggleBox(timing.value)}
                  aria-checked={selectedBox.includes(timing.value)}
                  role="checkbox"
                >
                  {timing.value}
                </div>
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateMovieListingPage;
