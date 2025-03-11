import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AppContext } from "../AppContext";
import { useAlert } from "../AlertContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import "../styles/AdminLandingPage.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AdminLandingPage = () => {
  console.log("just came in!");
  const router = useRouter();
  const { backendDomain, user } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();
  const [movieListings, setMovieListing] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      console.log("user is not found");
      router.replace("/login");
      return;
    }

    const fetchMovieListings = async () => {
      try {
        const response = await fetch(
          `${backendDomain}/api/v1/movieListing/show-all-movie-listings`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setMovieListing(data);
        console.log(data);
      } catch (error) {
        showAlert("Failed to fetch movie listings", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieListings();
  }, [backendDomain, showAlert, user, router]);

  const userFirstName = user?.firstname || "";

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <div className="landing-page">
      <h1>Welcome! {userFirstName} </h1>
      <h2>Admin dashboard</h2>

      <div className="admin-panel">
        <Button
          sx={{
            color: "black",
            backgroundColor: "turquoise",
            "&:hover": { backgroundColor: "yellow" },
            marginRight: "12px",
          }}
          onClick={() => navigateTo("/create-movie-page")}
        >
          Create a movie
        </Button>
        <Button
          sx={{
            color: "black",
            backgroundColor: "turquoise",
            "&:hover": { backgroundColor: "yellow" },
            marginRight: "12px",
          }}
          onClick={() => navigateTo("/create-cinema-page")}
        >
          Create a cinema
        </Button>
        <Button
          sx={{
            color: "black",
            backgroundColor: "turquoise",
            "&:hover": { backgroundColor: "yellow" },
            marginRight: "12px",
          }}
          onClick={() => navigateTo("/create-movie-listing-page")}
        >
          Create a movie listing
        </Button>
      </div>

      <Button
        sx={{
          color: "black",
          backgroundColor: "green",
          "&:hover": { backgroundColor: "yellow" },
        }}
        className="view-movie-listings"
        onClick={() => setOpen(true)}
      >
        View movie listings
      </Button>

      {/* Movie Listings Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6">Movie Listings</Typography>
          <Typography sx={{ mt: 2 }}>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul>
                {movieListings.length > 0 ? (
                  movieListings.map((listing) => (
                    <li key={listing._id}>
                      <div>
                        Cinema: {listing.cinemaDetails.operator} -{" "}
                        {listing.cinemaDetails.location} <br />
                        Movie: {listing.movieDetails.movieName} <br />
                        Halls: {listing.cinemaDetails.halls.hall_name} <br />
                        Time: {listing.showTime}
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No movie listings available.</p>
                )}
              </ul>
            )}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminLandingPage;
