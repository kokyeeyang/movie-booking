"use client";
import useAuthRedirect from "@/hooks/useAuthRedirect";

export default function RootPage(){
    useAuthRedirect(null);

    return null;
}

