import React, { useState, useContext, useEffect } from "react";
import "../styles/ViewAllMovieListingsPage.css";
// import "../styles/style.css";
// import MainStage from "../MainStage";
import Box from "@mui/material/Box";
import { AppContext } from "../AppContext";
import { useAlert } from "../AlertContext";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MovieListingsPage = () => {
  const { backendDomain } = useContext(AppContext);
  const [cinemaLocation, setCinemaLocation] = useState([]);
  const { showAlert } = useAlert();
  const { loading, setLoading } = useState(true);
  const history = useHistory();
  useEffect(() => {
    const fetchCinemaLocations = async () => {
      try {
        const response = await fetch(
          `${backendDomain}/api/v1/cinema/show-all-cinema-locations`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setCinemaLocation(data);
        // setLoading(false);
      } catch (error) {
        console.log(error);
        showAlert("Failed to fetch movie listings", "error");
        // setLoading(false);
      } finally {
        // setLoading(false);
      }
    };
    fetchCinemaLocations();
  }, [backendDomain, showAlert]);
  const handleAction = (movieId) => {
    alert(`Action clicked for movie ID: ${movieId}`);
  };
  const redirectToCinemaPage = (cinemaId) => {
    // console.log(cinemaId);
    history.push("view-cinema-movie-times", { data: cinemaId });
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // Tailwind's 'sm' breakpoint (mobile screens)
        settings: {
          slidesToShow: 1, // Show only one slide
        },
      },
    ],
  };
  return (
    <div className="container mx-auto p-4">
      <Box className="bg-white border-2 border-black p-4 mb-4 sm:bg-red">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Cinema Locations
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <section className="movie-listings">
            <h2 className="ml-10">Cinemas</h2>
            {loading ? (
              <p>Loading...</p>
            ) : cinemaLocation.length > 0 ? (
              <div className="h-full w-[300px] pb-8 sm:w-[20%] md:w-[80%] lg:w-[100%] h-[250px] md:h-[300px] lg:h-[350px]">
                <Slider {...settings}>
                  {cinemaLocation.map((cinema) => {
                    const imageUrl = `${backendDomain}/${cinema.image}`;
                    return (
                      <div
                        key={cinema._id}
                        className="w-full lg:w-[90%] sm:w-[50%] h-auto object-cover ml-6 sm:ml-2"
                        onClick={() => redirectToCinemaPage(cinema._id)}
                      >
                        <img src={imageUrl} alt={cinema.name} />
                        <h3>{cinema.name}</h3>
                        <p>{cinema.location}</p>
                      </div>
                    );
                  })}
                </Slider>
              </div>
            ) : (
              <p>No cinemas available.</p>
            )}
          </section>
        </Typography>
      </Box>
    </div>
  );
};

/* <div className="w-full mx-auto h-[500px] sm:h-[300px] md:h-[400px] lg:h-[500px] bg-gray-100">
  <Slider {...settings}>
    <div className="h-full">
      <img
        src="movie1.jpg"
        alt="Movie 1"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="h-full">
      <img
        src="movie2.jpg"
        alt="Movie 2"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="h-full">
      <img
        src="movie3.jpg"
        alt="Movie 3"
        className="w-full h-full object-cover"
      />
    </div>
  </Slider>
</div>; */

export default MovieListingsPage;
