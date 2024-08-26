import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../AppContext";
import { Link, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
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
  width: {
    xs: "90%",
    sm: "80%",
    md: "60%",
    lg: "40%",
  },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function ChildModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button onClick={handleOpen}>Open Child Modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 200 }}>
          <h2 id="child-modal-title">Text in a child modal</h2>
          <p id="child-modal-description">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <Button onClick={handleClose}>Close Child Modal</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

const AdminLandingPage = () => {
  console.log("just came in!");
  const location = useLocation();
  const history = useHistory();
  const { backendDomain, frontendDomain, user } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  const [movieListings, setMovieListing] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
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

        movieListings.map((listing) => {
          console.log(listing.cinemaDetails.location);
        });
        console.log(movieListings);
      } catch (error) {
        showAlert("Failed to fetch movie listings", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchMovieListings();
  }, [backendDomain, showAlert]);

  if (!user) {
    console.log("user is not found");
    history.push("/login");
    return null;
  }
  const userFirstName = user.firstname;

  const createMoviePage = () => {
    history.push("create-movie-page");
  };

  const createCinemaPage = () => {
    history.push("create-cinema-page");
  };

  const createMovieListingPage = () => {
    history.push("create-movie-listing-page");
  };

  return (
    <div className="landing-page">
      <h1>Welcome! {userFirstName} </h1>
      <h2>Admin dashboard</h2>
      <div className="admin-panel"></div>
      <p>
        {/* <Link href={`${backendDomain}/api/v1/auth/logout`}>Logout */}
        <button onClick={createMoviePage}>Create a movie</button>
        <button onClick={createCinemaPage}>Create a cinema</button>
        <button onClick={createMovieListingPage}>Create a movie listing</button>
      </p>
      <Button
        sx={{
          color: "black",
          backgroundColor: "green",
          "&:hover": {
            backgroundColor: "yellow",
          },
        }}
        className="view-movie-listings"
        onClick={handleOpen}
      >
        View movie listings
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <section className="movie-listings">
              <h2>Current Movie Listings</h2>
              <ChildModal />
              {loading ? (
                <p>Loading...</p>
              ) : (
                <ul>
                  {movieListings.length > 0 ? (
                    movieListings.map((listing) => (
                      <li key={listing._id}>
                        <div className="">
                          Cinema: -
                          {listing.cinemaDetails.operator +
                            " " +
                            listing.cinemaDetails.location +
                            " "}
                          Movie: {listing.movieDetails.movieName}
                        </div>
                      </li>
                    ))
                  ) : (
                    <p>No movie listings available.</p>
                  )}
                </ul>
              )}
            </section>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminLandingPage;
