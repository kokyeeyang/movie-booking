"use client";
import React, { useState, useContext, ChangeEvent, FormEvent } from "react";
import "../styles/CreateEntryPage.css";
import "../styles/SelectBoxForm.css";
import DatePicker from "react-datepicker";
import { AppContext } from "../src/AppContext";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

interface FormData {
  movieName: string;
  duration: string;
  genre: string[];
  ageRating: string;
  startDate: Date | null;
  endDate: Date | null;
  image: File | null;
}

const CreateMoviePage: React.FC = () => {
  const appContext = useContext(AppContext);
  const backendDomain = appContext?.backendDomain || "localhost:5000";
  // const { backendDomain } = useContext(AppContext);
  const [formData, setFormData] = useState<FormData>({
    movieName: "",
    duration: "",
    genre: [],
    ageRating: "",
    startDate: null,
    endDate: null,
    image: null,
  });

  const [selectedBox, setSelectedBox] = useState<string[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files) {
      setFormData((prevData) => ({
        ...prevData,
        image: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    if(!dates) return;
    const [start, end] = dates;
    setFormData((prevData) => ({
      ...prevData,
      startDate: start ?? null,
      endDate: end ?? null,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("movieName", formData.movieName);
    formDataToSend.append("duration", formData.duration);
    formDataToSend.append("genre", JSON.stringify(formData.genre)); // Ensure proper format
    formDataToSend.append("ageRating", formData.ageRating);
    formDataToSend.append(
      "startDate",
      formData.startDate ? formData.startDate.toISOString() : ""
    );
    formDataToSend.append(
      "endDate",
      formData.endDate ? formData.endDate.toISOString() : ""
    );
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await axios.post(
        `${backendDomain}/api/v1/movie/create-movie`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        alert("Movie created!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleBox = (genreId: string) => {
    if (selectedBox.includes(genreId)) {
      setSelectedBox(selectedBox.filter((value) => value !== genreId));
      setFormData((prevData) => ({
        ...prevData,
        genre: prevData.genre.filter((g) => g !== genreId),
      }));
    } else {
      setSelectedBox([...selectedBox, genreId]);
      setFormData((prevData) => ({
        ...prevData,
        genre: [...prevData.genre, genreId],
      }));
    }
  };

  const genres = [
    { id: 1, value: "comedy" },
    { id: 2, value: "sci-fi" },
    { id: 3, value: "romance" },
    { id: 4, value: "mystery" },
    { id: 5, value: "k-drama" },
    { id: 6, value: "thriller" },
  ];

  return (
    <div className="form-container">
      <form className="user-info-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="movieName">Name</label>
          <input
            type="text"
            id="movieName"
            name="movieName"
            value={formData.movieName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="duration">Duration</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <div className="box-container">
            {genres.map((genre) => (
              <label key={genre.value} className="select-box-label">
                <div
                  className={`select-box ${selectedBox.includes(genre.value) ? "selected" : ""}`}
                  onClick={() => toggleBox(genre.value)}
                  aria-checked={selectedBox.includes(genre.value)}
                  role="checkbox"
                >
                  {genre.value}
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="ageRating">Age Rating</label>
          <select id="ageRating" name="ageRating" value={formData.ageRating} onChange={handleChange}>
            <option value="" disabled></option>
            <option value="all">Suitable for all ages</option>
            <option value="13">PG-13</option>
            <option value="18">18 and over</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dateRange">Movie date range</label>
          <DatePicker
            selected={formData.startDate || undefined}
            onChange={(update) => handleDateChange(update)}
            startDate={formData.startDate || undefined}
            endDate={formData.endDate || undefined}
            selectsRange
            dateFormat="yyyy/MM/dd"
            placeholderText="Select a date range"
            isClearable
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Upload image</label>
          <input type="file" id="image" name="image" accept="image/*" onChange={handleChange} />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default CreateMoviePage;
