"use client";
import AdminLandingPageComponent  from "components/AdminLandingPage";
// need to use this hook instead of middleware because we are exporting this application as a static site in netlify
import useAuthRedirect from "@/hooks/useAuthRedirect";

export default function AdminLandingPage() {
    const isAuthorized = useAuthRedirect("admin"); // or "admin"

    if (!isAuthorized) return null; // Prevent premature render
    return (
        <div>
            <AdminLandingPageComponent />
            {/* Your form components go here */}
        </div>
    );
}
