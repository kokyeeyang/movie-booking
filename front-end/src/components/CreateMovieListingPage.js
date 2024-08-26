import React, { useState, useContext, useEffect } from "react";
import "../styles/CreateEntryPage.css";
import "../styles/SelectBoxForm.css";
import DatePicker from "react-datepicker";
import { AppContext } from "../AppContext";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

const CreateMovieListingPage = () => {
  const { user, setUser, backendDomain } = useContext(AppContext);
  console.log(user);
  const [formData, setFormData] = useState({
    movie: "",
    cinema: "",
  });

  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);

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
          `${backendDomain}/api/v1/cinema/select-all-cinemas`
        );

        setCinemas(response.data);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };

    fetchMovies();
    fetchCinemas();
  }, [backendDomain]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // const formDataToSend = new FormData();
    // formDataToSend.append("movie", formData.movie);
    // formDataToSend.append("location", formData.location);

    // console.log(formDataToSend);

    try {
      console.log(formData);
      const response = await axios.post(
        `${backendDomain}/api/v1/movieListing/create-movie-listing`,
        formData,
        {
          headers: {
            // "Content-Type": "multipart/form-data",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        alert("Movie listing created!");
      }
    } catch (error) {
      console.error("Error:", error);
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
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateMovieListingPage;
