"use client";
import MovieBookingSlotsComponent from "components/MovieBookingSlots";
// need to use this hook instead of middleware because we are exporting this application as a static site in netlify
import useAuthRedirect from "@/hooks/useAuthRedirect";

export default function MovieBookingTimes () {
    const isAuthorized = useAuthRedirect("user"); // or "admin"

    if (!isAuthorized) return null; // Prevent premature render
    return (
        <MovieBookingSlotsComponent />
    )
}