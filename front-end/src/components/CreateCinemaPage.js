import React, { useState, useContext } from "react";
import "../styles/CreateEntryPage.css";
import "../styles/SelectBoxForm.css";
import DatePicker from "react-datepicker";
import { AppContext } from "../AppContext";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

const CreateCinemaPage = () => {
  const { backendDomain } = useContext(AppContext);
  const [formData, setFormData] = useState({
    location: "",
    capacity: "",
    operator: "",
    halls: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleHallChange = (index, e) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:value
    }));
  }

  const handleBayChange = (hallIndex, bayIndex, e) => {
    const {name, value} = e.target;
    const updatedHalls = [...formData.halls];
    const updatedBays = [...updatedHalls[hallIndex].bays];

    updatedBays[bayIndex][name] = value;
    updatedHalls[hallIndex].bays = updatedBays;
    setFormData({...formData, halls: updatedHalls});
  }

  const addHall = () => {
    setFormData((prevData) => ({
      ...prevData,
      halls: [...prevData.halls, {name: "", bays: [] }]
    })); 
  }

  const addBay = (hallIndex) => {
    const updatedHalls = [...formData.halls];
    updatedHalls[hallIndex].bays = [
      {bay_name: "", rows: "", seats_per_row: ""}
    ];
    setFormData({...formData, halls: updatedHalls});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        backendDomain + "/api/v1/cinema/create-cinema",
        formData
      );

      if (response.status == 201) {
        alert("Cinema created!");
        // history.push("admin-landing-page");
      }
    } catch (error) {
      console.log(error.message);
    }
    console.log("Form Data:", formData);
  };

  return (
    <div className="form-container">
      <form className="user-info-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          >
            <option value="" disabled></option>
            <option value="Tropicana City Mall">Tropicana City Mall</option>
            <option value="Sunway Pyramid">Sunway Pyramid</option>
            <option value="One Utama">One Utama</option>
            <option value="IOI Mall">IOI Mall</option>
            <option value="Mid Valley">Mid Valley</option>
            <option value="Starling Mall">Starling Mall</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="capacity">Capacity</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="operator">Operator</label>
          <select
            id="operator"
            name="operator"
            value={formData.operator}
            onChange={handleChange}
          >
            <option value="" disabled></option>
            <option value="GSC">GSC</option>
            <option value="TGV">TGV</option>
            <option value="DADI">DADI</option>
          </select>
        </div>
        <div className="form-group">
          <label>Halls</label>
          {formData.halls.map((hall, hallIndex) => (
            <div key={hallIndex} className="hall-group">
              <input
                type="text"
                name="name"
                placeholder={`Hall Name ${hallIndex + 1}`}
                value={hall.name}
                onChange={(e) => handleHallChange(hallIndex, e)}
                required
              />

              {hall.bays.map((bay, bayIndex) => (
                <div key={bayIndex} className="bay-group">
                  <input
                    type="text"
                    name="bay_name"
                    placeholder={`Bay Name ${bayIndex + 1}`}
                    value={bay.bay_name}
                    onChange={(e) => handleBayChange(hallIndex, bayIndex, e)}
                    required
                  />
                  <input
                    type="number"
                    name="rows"
                    placeholder="Number of Rows"
                    value={bay.rows}
                    onChange={(e) => handleBayChange(hallIndex, bayIndex, e)}
                    required
                  />
                  <input
                    type="number"
                    name="seats_per_row"
                    placeholder="Seats per Row"
                    value={bay.seats_per_row}
                    onChange={(e) => handleBayChange(hallIndex, bayIndex, e)}
                    required
                  />
                </div>
              ))}
              <button type="button" onClick={() => addBay(hallIndex)}>
                Add Bay
              </button>
            </div>
          ))}
          <button type="button" onClick={addHall}>
            Add Hall
          </button>
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateCinemaPage;
