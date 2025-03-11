import ProtectedRoute from "../components/ProtectedRoute";
import AdminLandingPage from "../components/AdminLandingPage";

export default ProtectedRoute(AdminLandingPage, ["admin"]);
