import React, { useState, useContext } from "react";
// import "../styles/CreateEntryPage.css";
import "../styles/ViewAllMovieListingsPage.css";
// import "../styles/SelectBoxForm.css";
import { AppContext } from "../AppContext";
import axios from "axios";

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
    const { name, value } = e.target;
  
    setFormData((prevData) => {
      const updatedHalls = [...prevData.halls];
      
      // Update the specific hall's field
      updatedHalls[index] = {
        ...updatedHalls[index],
        [name]: value,
      };
  
      return {
        ...prevData,
        halls: updatedHalls,
      };
    });
  };
  
  // const handleBayChange = (hallIndex, bayIndex, e) => {
  //   const {name, value} = e.target;
  //   let rowElements  = document.getElementsByClassName("rows");
  //   let seatsPerRowElements = document.getElementsByClassName("seats_per_row");
    
  //   if(seatsPerRowElements.length >= 1){
  //     const numberOfRows = rowElements[bayIndex]?.value;
  //     const seatsPerRow = seatsPerRowElements[bayIndex]?.value;

  //     let totalSeatsPerBay = numberOfRows * seatsPerRow;
  //     // setTotalSeats(totalSeatsPerBay);

  //     setTotalSeats((prevData) => ({
  //       ...prevData,
  //       totalSeats: totalSeatsPerBay
  //     }));

  //     setCapacity(totalSeatsPerBay);

  //     console.log(totalSeats);
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       capacity: totalSeatsPerBay
  //     }));
  //   } else {
  //     console.log("Element at the specified bayIndex does not exist");
  //   }
  //   const updatedHalls = [...formData.halls];
  //   const updatedBays = [...updatedHalls[hallIndex].bays];

  //   updatedBays[bayIndex][name] = value;
  //   updatedHalls[hallIndex].bays = updatedBays;
  //   setFormData({...formData, halls: updatedHalls});
  // }

  const calculateCapacity = (halls) => {
    return halls.reduce((totalCapacity, hall) => {
      const hallCapacity = hall.bays.reduce((bayCapacity, bay) => {
        const rows = parseInt(bay.rows) || 0;
        const seatsPerRow = parseInt(bay.seats_per_row) || 0;
        return bayCapacity + (rows * seatsPerRow);
      }, 0);
      return totalCapacity + hallCapacity;
    }, 0);
  };

  const handleBayChange = (hallIndex, bayIndex, e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedHalls = [...prevData.halls];
      const updatedBays = [...updatedHalls[hallIndex].bays];
      updatedBays[bayIndex] = {
        ...updatedBays[bayIndex],
        [name]: value,
      };
      updatedHalls[hallIndex].bays = updatedBays;

      const newCapacity = calculateCapacity(updatedHalls);
      return {
        ...prevData,
        halls: updatedHalls,
        capacity: newCapacity, // Update capacity in formData
      };
    });
  };

  const addHall = () => {
    setFormData((prevData) => ({
      ...prevData,
      halls: [...prevData.halls, {hall_name: "", bays: [] }]
    })); 
  }

  const addBay = (hallIndex) => {
    const updatedHalls = [...formData.halls];
    const newBay = {bay_name: "", rows:"", seats_per_row: ""};
    updatedHalls[hallIndex].bays = [...updatedHalls[hallIndex].bays, newBay];
    setFormData({...formData, halls: updatedHalls});

    console.log(formData);
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
    <div className="max-w-full md:max-w-[1200px] mx-auto mt-5 p-5 border border-gray-300 rounded-lg bg-gray-50 shadow-md">
      <form className="user-info-form" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="font-bold" htmlFor="location">Location</label>
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
            <option value="Pavilion Bukit Bintang">Pavilion Bukit Bintang</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="font-bold" htmlFor="capacity">Capacity</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="font-bold" htmlFor="operator">Operator</label>
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
        <div className="mb-4">
          <label className="font-bold">Halls</label>
          {console.log(formData.halls)}
          {formData.halls.map((hall, hallIndex) => (
            <div key={hallIndex} className="hall-group">
              <input
                type="text"
                name="hall_name"
                className="w-full p-2 text-lg border border-gray-300 rounded-md"
                placeholder={`Hall Name ${hallIndex + 1}`}
                value={hall.hall_name}
                onChange={(e) => handleHallChange(hallIndex, e)}
                required
              />
              {hall.bays.map((bay, bayIndex) => (
                <div key={bayIndex} className="mb-4 pl-4 border-l-2 border-gray-300">
                    <input
                      type="text"
                      name="bay_name"
                      className="w-50 p-1 text-md border border-gray-200 rounded-sm"
                      placeholder={`Bay Name ${bayIndex + 1}`}
                      value={bay.bay_name}
                      onChange={(e) => handleBayChange(hallIndex, bayIndex, e)}
                      required
                    />
                  <div className="mb-3">
                    <input
                      type="number"
                      name="rows"
                      className="w-50 p-1 text-md border border-gray-200 rounded-sm rows"
                      placeholder="Number of Rows"
                      value={bay.rows}
                      onChange={(e) => handleBayChange(hallIndex, bayIndex, e)}
                      required
                    />
                    <input
                      type="number"
                      name="seats_per_row"
                      className="w-50 p-1 text-md border border-gray-200 rounded-sm seats_per_row"
                      placeholder="Seats per Row"
                      value={bay.seats_per_row}
                      onChange={(e) => handleBayChange(hallIndex, bayIndex, e)}
                      required
                    />
                  </div>
                </div>
              ))}
              <button type="button" className="mt-3 bg-yellow-600 text-white py-2 px-4 text-center font-medium rounded-md hover:bg-blue-700" onClick={() => addBay(hallIndex)}>
                Add Bay
              </button>
            </div>
          ))}
          <button type="button" className="mt-3 bg-blue-600 text-white py-2 px-4 text-center font-medium rounded-md hover:bg-blue-700" onClick={addHall}>
            Add Hall
          </button>
        </div>
        <button type="submit" className="bg-green-600 text-white py-3 px-6 text-center font-medium rounded-md hover:bg-green-700 submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateCinemaPage;
