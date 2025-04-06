"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AppContext, useAppContext } from "../src/AppContext";
import { useAlert } from "../src/AlertContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
// import styles from "@/styles/AdminLandingPage.module.css"; // Update CSS import for Next.js
import styles from "../styles/AdminLandingPage.module.css";

// Define types for movie listings
interface CinemaDetails {
  operator: string;
  location: string;
  halls: { hall_name: string }; // Adjust if `halls` is an array
}

interface MovieDetails {
  movieName: string;
}

interface MovieListing {
  _id: string;
  cinemaDetails: CinemaDetails;
  movieDetails: MovieDetails;
  showTime: string;
}

const style = {
  position: "absolute" as const, // Ensures TypeScript recognizes it correctly
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AdminLandingPage: React.FC = () => {
  console.log("just came in!");
  const router = useRouter();
  const appContext = useContext(AppContext);
  const backendDomain = appContext?.backendDomain || "https://localhost:5000";
  const {user} = useAppContext();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState<boolean>(true);
  const [movieListings, setMovieListing] = useState<MovieListing[]>([]);
  const [open, setOpen] = useState<boolean>(false);

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
        const data: MovieListing[] = await response.json();
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

  const userFirstName: string = user?.firstname || "";

  const navigateTo = (path: string): void => {
    router.push(path);
  };

  return (
    <div className={styles.landingPage}>
      <h1>Welcome! {userFirstName} </h1>
      <h2>Admin Dashboard</h2>

      <div className={styles.adminPanel}>
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
        className={styles.viewMovieListings}
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
                        Cinema: {listing.cinemaDetails?.operator} -{" "}
                        {listing.cinemaDetails?.location} <br />
                        Movie: {listing.movieDetails?.movieName} <br />
                        Halls: {listing.cinemaDetails?.halls?.hall_name} <br />
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
