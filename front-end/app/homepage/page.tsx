"use client";
import NormalUsersLandingPageComponent from "components/NormalUsersLandingPage";
// need to use this hook instead of middleware because we are exporting this application as a static site in netlify
import useAuthRedirect from "@/hooks/useAuthRedirect";

export default function NormalUserHomePage () {
    useAuthRedirect("user");
    return (
        <div>
            <NormalUsersLandingPageComponent />
        </div>
    )
}