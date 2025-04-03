import React, { useState, useContext, useEffect } from "react";
import "../styles/ViewAllMovieListingsPage.css";
// import "../styles/style.css";
// import MainStage from "../MainStage";
import Box from "@mui/material/Box";
import { AppContext } from "../src/AppContext";
import { useAlert } from "../src/AlertContext";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MovieLocationsPage = () => {
  const router = useRouter();
  const appContext = useContext(AppContext);
  const backendDomain = appContext?.backendDomain || process.env.BACKEND_DOMAIN || "http://localhost:5000";
  const { showAlert } = useAlert();
  interface Cinema {
    _id: string;
    name: string;
    location: string;
    image: string;
  }
  const [cinemaLocation, setCinemaLocation] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);
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
 
  const redirectToCinemaPage = (cinemaId: string) => {
    router.push(`/view-cinema-movie-times?cinemaId=${cinemaId}`);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };
  return (
    <div className="container mx-auto p-4">
      <Box className="bg-white border-2 border-black p-4 mb-4">
        <Typography variant="h6" component="h2">
          Cinema Locations
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <section className="movie-listings">
            <h2 className="ml-10 font-semibold text-lg">Cinemas</h2>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : cinemaLocation.length > 0 ? (
              <div className="w-full pb-8 md:w-[80%] lg:w-[100%]">
                <Slider {...sliderSettings}>
                  {cinemaLocation.map((cinema) => {
                    const imageUrl = `${backendDomain}/${cinema.image}`;
                    return (
                      <div
                        key={cinema._id}
                        className="w-full lg:w-[90%] sm:w-[50%] h-auto object-cover ml-6 sm:ml-2 cursor-pointer"
                        onClick={() => redirectToCinemaPage(cinema._id)}
                      >
                        <img
                          src={imageUrl}
                          alt={cinema.name}
                          className="w-full h-40 object-cover rounded-lg shadow-md"
                        />
                        <h3 className="mt-2 text-lg font-semibold">{cinema.name}</h3>
                        <p className="text-gray-600">{cinema.location}</p>
                      </div>
                    );
                  })}
                </Slider>
              </div>
            ) : (
              <p className="text-gray-500">No cinemas available.</p>
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

export default MovieLocationsPage;
