"use client";
import React, { useState, useContext, useEffect, ChangeEvent, FormEvent } from "react";
import "../styles/CreateEntryPage.css";
import "../styles/SelectBoxForm.css";
import { AppContext } from "../src/AppContext";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

interface Movie {
  _id: string;
  movieName: string;
  startDate?: string;
  endDate?: string;
}

interface Cinema {
  _id: string;
  operator: string;
  location: string;
}

interface Hall {
  _id: string;
  hall_name: string;
}

interface Timing {
  id: number;
  value: string;
}

const CreateMovieListingPage: React.FC = () => {
  const appContext = useContext(AppContext);
  const backendDomain = appContext?.backendDomain || "http://localhost:5000";
  // const { backendDomain } = useContext(AppContext);
  
  const [formData, setFormData] = useState({
    movie: "",
    cinema: "",
    hall: "",
    timing: [] as string[],
    startDate: "",
    endDate: "",
  });

  const [movies, setMovies] = useState<Movie[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [selectedBox, setSelectedBox] = useState<string[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get<Movie[]>(`${backendDomain}/api/v1/movie/select-all-movies`);
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    const fetchCinemas = async () => {
      try {
        const response = await axios.get<Cinema[]>(`${backendDomain}/api/v1/cinema/show-all-cinema-locations`);
        setCinemas(response.data);
      } catch (error) {
        console.error("Error fetching cinemas:", error);
      }
    };

    fetchMovies();
    fetchCinemas();
  }, [backendDomain]);

  const toggleBox = (timingId: string) => {
    setSelectedBox((prev) =>
      prev.includes(timingId) ? prev.filter((value) => value !== timingId) : [...prev, timingId]
    );

    setFormData((prevData) => ({
      ...prevData,
      timing: prevData.timing.includes(timingId)
        ? prevData.timing.filter((g) => g !== timingId)
        : [...prevData.timing, timingId],
    }));
  };

  const timings: Timing[] = [
    { id: 1, value: "11.00 am" },
    { id: 2, value: "1.30 pm" },
    { id: 3, value: "4.00 pm" },
    { id: 4, value: "6.30 pm" },
    { id: 5, value: "9.00 pm" },
    { id: 6, value: "11.30 pm" },
  ];

  const fetchHalls = async (cinemaId: string) => {
    try {
      const response = await axios.get<Hall[]>(`${backendDomain}/api/v1/cinema/${cinemaId}/halls`);
      setHalls(response.data);
    } catch (error) {
      console.error("Error fetching halls:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "movie") {
      const selectedMovie = movies.find((movie) => movie._id === value);
      if (selectedMovie) {
        setFormData((prevData) => ({
          ...prevData,
          startDate: selectedMovie.startDate || "",
          endDate: selectedMovie.endDate || "",
        }));
      }
    }

    if (name === "cinema") fetchHalls(value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      for (let i = 0; i < formData.timing.length; i++) {
        const timing = formData.timing[i];
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);

        for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
          const currentDate = new Date(day).toISOString().split("T")[0];
          const movieListingData = {
            movie: formData.movie,
            cinema: formData.cinema,
            hall: formData.hall,
            showTime: timing,
            showDate: currentDate,
          };

          await axios.post(
            `${backendDomain}/api/v1/movieListing/create-movie-listing`,
            movieListingData,
            { headers: { "Content-Type": "application/json" }, withCredentials: true }
          );
        }
      }
      alert("Movie listing created!");
    } catch (error) {
      console.error("Error creating movie listing:", error);
    }
  };

  return (
    <div className="form-container">
      <form className="user-info-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="movie">Movies</label>
          <select name="movie" value={formData.movie} onChange={handleChange}>
            <option value="">Select a movie</option>
            {movies.map((movie) => (
              <option key={movie._id} value={movie._id}>{movie.movieName}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="cinema">Cinemas</label>
          <select name="cinema" value={formData.cinema} onChange={handleChange}>
            <option value="">Select a cinema</option>
            {cinemas.map((cinema) => (
              <option key={cinema._id} value={cinema._id}>
                {cinema.operator} {cinema.location}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default CreateMovieListingPage;
