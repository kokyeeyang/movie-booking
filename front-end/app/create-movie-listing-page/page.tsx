"use client";
import CreateMovieListingPageComponent from "components/CreateMovieListingPage";
import useAuthRedirect from "@/hooks/useAuthRedirect";

export default function CreateMovieListing () {
    useAuthRedirect("admin");
    return (
        <div>
            <h1>Create Movie Listing here!</h1>
            <CreateMovieListingPageComponent/>
        </div>
    );
}