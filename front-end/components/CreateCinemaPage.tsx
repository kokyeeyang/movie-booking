import React, { useState, useContext, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { AppContext } from "../src/AppContext";

interface Bay {
  bay_name: string;
  rows: number;
  seats_per_row: number;
}

interface Hall {
  hall_name: string;
  bays: Bay[];
}

interface FormDataState {
  cinema_name: string;
  location: string;
  capacity: number;
  halls: Hall[];
  image: File | null;
}

const CreateCinemaPage: React.FC = () => {
  const appContext = useContext(AppContext);
  const backendDomain = appContext?.backendDomain || "http://localhost:5000";
  const [formData, setFormData] = useState<FormDataState>({
    cinema_name: "",
    location: "",
    capacity: 0,
    halls: [],
    image: null,
  });

  const calculateCapacity = (halls: Hall[]): number => {
    return halls.reduce((total, hall) => {
      return (
        total +
        hall.bays.reduce((bayTotal, bay) => bayTotal + bay.rows * bay.seats_per_row, 0)
      );
    }, 0);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setFormData((prevData) => ({ ...prevData, image: files[0] }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleHallChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedHalls = [...prevData.halls];
      updatedHalls[index] = { ...updatedHalls[index], [name]: value };

      return {
        ...prevData,
        halls: updatedHalls,
        capacity: calculateCapacity(updatedHalls),
      };
    });
  };

  const handleBayChange = (hallIndex: number, bayIndex: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedHalls = [...prevData.halls];
      updatedHalls[hallIndex].bays[bayIndex] = {
        ...updatedHalls[hallIndex].bays[bayIndex],
        [name]: value,
      };

      return {
        ...prevData,
        halls: updatedHalls,
        capacity: calculateCapacity(updatedHalls),
      };
    });
  };

  const addHall = () => {
    setFormData((prevData) => ({
      ...prevData,
      halls: [...prevData.halls, { hall_name: "", bays: [] }],
    }));
  };

  const addBay = (hallIndex: number) => {
    const updatedHalls = [...formData.halls];
    updatedHalls[hallIndex].bays.push({ bay_name: "", rows: 0, seats_per_row: 0 });

    setFormData((prevData) => ({
      ...prevData,
      halls: updatedHalls,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cinemaObj = new FormData();
    cinemaObj.append("cinema_name", formData.cinema_name);
    cinemaObj.append("location", formData.location);
    cinemaObj.append("capacity", String(formData.capacity));
    cinemaObj.append("halls", JSON.stringify(formData.halls));
    if (formData.image) {
      cinemaObj.append("image", formData.image);
    }

    try {
      const response = await axios.post(
        `${backendDomain}/api/v1/cinema/create-cinema`,
        cinemaObj,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        alert("Cinema created!");
      }
    } catch (error) {
      console.error("Error creating cinema:", error);
      alert("Failed to create cinema. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create Cinema</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="cinema_name" value={formData.cinema_name} onChange={handleChange} required />
        <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        <input type="number" name="capacity" value={formData.capacity} readOnly />
        <button type="button" onClick={addHall}>Add Hall</button>

        {formData.halls.map((hall, hallIndex) => (
          <div key={hallIndex}>
            <input type="text" name="hall_name" value={hall.hall_name} onChange={(e) => handleHallChange(hallIndex, e)} required />
            <button type="button" onClick={() => addBay(hallIndex)}>Add Bay</button>
            {hall.bays.map((bay, bayIndex) => (
              <div key={bayIndex}>
                <input type="text" name="bay_name" value={bay.bay_name} onChange={(e) => handleBayChange(hallIndex, bayIndex, e)} required />
                <input type="number" name="rows" value={bay.rows} onChange={(e) => handleBayChange(hallIndex, bayIndex, e)} required />
                <input type="number" name="seats_per_row" value={bay.seats_per_row} onChange={(e) => handleBayChange(hallIndex, bayIndex, e)} required />
              </div>
            ))}
          </div>
        ))}

        <input type="file" name="image" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateCinemaPage;
