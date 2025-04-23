"use client";
import CreateMovieListingPageComponent from "components/CreateMovieListingPage";
import useAuthRedirect from "@/hooks/useAuthRedirect";

export default function CreateMovieListing () {
    const isAuthorized = useAuthRedirect("admin"); // or "admin"

    if (!isAuthorized) return null; // Prevent premature render
    return (
        <div>
            <h1>Create Movie Listing here!</h1>
            <CreateMovieListingPageComponent/>
        </div>
    );
}