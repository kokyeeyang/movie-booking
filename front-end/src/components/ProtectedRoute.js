import { useRouter } from "next/router";
import { useAppContext } from "../AppContext";
import { useEffect, useState } from "react";

const ProtectedRoute = (WrappedComponent, roles = []) => {
  return function WithAuth(props) {
    const { user, isLoading } = useAppContext();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          router.replace("/login"); // Redirect to login if not authenticated
        } else if (roles.length > 0 && !roles.includes(user.role)) {
          router.replace("/homepage"); // Redirect if role is unauthorized
        } else {
          setLoading(false); // Allow rendering
        }
      }
    }, [user, isLoading, router]);

    if (isLoading || loading) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default ProtectedRoute;
