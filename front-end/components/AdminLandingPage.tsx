"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppContext, useAppContext } from "../src/AppContext";
import { useAlert } from "../src/AlertContext";

interface CinemaDetails {
  operator: string;
  location: string;
  halls: { hall_name: string };
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

const AdminLandingPage: React.FC = () => {
  const router = useRouter();
  const appContext = useContext(AppContext);
  const backendDomain = appContext?.backendDomain || "https://localhost:5000";
  const { user } = useAppContext();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState<boolean>(true);
  const [movieListings, setMovieListing] = useState<MovieListing[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
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
    <div className="min-h-screen px-4 py-8 bg-gray-50 text-center">
      <h1 className="text-3xl font-bold mb-2">Welcome! {userFirstName}</h1>
      <h2 className="text-xl text-gray-600 mb-8">Admin Dashboard</h2>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <button
          onClick={() => navigateTo("/create-movie-page")}
          className="bg-cyan-400 text-black hover:bg-yellow-300 px-4 py-2 rounded-xl shadow"
        >
          Create a Movie
        </button>
        <button
          onClick={() => navigateTo("/create-cinema-page")}
          className="bg-cyan-400 text-black hover:bg-yellow-300 px-4 py-2 rounded-xl shadow"
        >
          Create a Cinema
        </button>
        <button
          onClick={() => navigateTo("/create-movie-listing-page")}
          className="bg-cyan-400 text-black hover:bg-yellow-300 px-4 py-2 rounded-xl shadow"
        >
          Create a Movie Listing
        </button>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="bg-green-600 text-white hover:bg-yellow-300 hover:text-black px-6 py-2 rounded-xl shadow"
      >
        View Movie Listings
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-semibold mb-4">Movie Listings</h3>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : (
              <ul className="space-y-4">
                {movieListings.length > 0 ? (
                  movieListings.map((listing) => (
                    <li key={listing._id} className="text-left border-b pb-2">
                      <p>
                        <strong>Cinema:</strong> {listing.cinemaDetails?.operator} - {listing.cinemaDetails?.location}
                      </p>
                      <p>
                        <strong>Movie:</strong> {listing.movieDetails?.movieName}
                      </p>
                      <p>
                        <strong>Halls:</strong> {listing.cinemaDetails?.halls?.hall_name}
                      </p>
                      <p>
                        <strong>Time:</strong> {listing.showTime}
                      </p>
                    </li>
                  ))
                ) : (
                  <p>No movie listings available.</p>
                )}
              </ul>
            )}
            <div className="mt-6 text-right">
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-500 text-white hover:bg-gray-700 px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLandingPage;
