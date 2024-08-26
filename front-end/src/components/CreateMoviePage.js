import React, { useState, useContext } from "react";
import "../styles/CreateEntryPage.css";
import "../styles/SelectBoxForm.css";
import DatePicker from "react-datepicker";
import { AppContext } from "../AppContext";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

const CreateMoviePage = () => {
  const { backendDomain } = useContext(AppContext);
  const [formData, setFormData] = useState({
    movieName: "",
    duration: "",
    genre: [],
    ageRating: "",
    startDate: null,
    endDate: null,
    image: null,
  });

  const [selectedBox, setSelectedBox] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
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

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFormData((prevData) => ({
      ...prevData,
      startDate: start,
      endDate: end,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("movieName", formData.movieName);
    formDataToSend.append("duration", formData.duration);
    formDataToSend.append("genre", formData.genre); // Adjust format if needed
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
    console.log(formDataToSend);

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

  const toggleBox = (genreId) => {
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
            placeholder="required"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <div className="box-container">
            {genres.map((genre, i) => (
              <label key={genre.value} className="select-box-label">
                <div
                  className={`select-box ${
                    selectedBox.includes(genre.value) ? "selected" : ""
                  }`}
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
          <select
            id="ageRating"
            name="ageRating"
            value={formData.ageRating}
            onChange={handleChange}
          >
            <option value="" disabled></option>
            <option value="all">Suitable for all ages</option>
            <option value="13">PG-13</option>
            <option value="18">18 and over</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dateRange">Movie date range</label>
          <div>
            <DatePicker
              selected={formData.startDate}
              onChange={handleDateChange}
              startDate={formData.startDate}
              endDate={formData.endDate}
              selectsRange
              dateFormat="yyyy/MM/dd"
              placeholderText="Select a date range"
              name="dateRange"
              isClearable={true}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="image">Upload image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateMoviePage;
