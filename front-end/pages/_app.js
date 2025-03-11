import { AppProvider } from "../AppContext";
import AlertProvider from "../AlertContext";
import Alert from "../components/Alert";
import DashboardBar from "../components/DashboardBar";
import { useRouter } from "next/router";
import "../styles/globals.css"; // Import global styles if needed

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const pathsWithoutDashboard = ["/login", "/sign-up", "/verify-email"];

  return (
    <AppProvider>
      <AlertProvider>
        <Alert />
        {!pathsWithoutDashboard.includes(router.pathname) && <DashboardBar />}
        <Component {...pageProps} />
      </AlertProvider>
    </AppProvider>
  );
}

export default MyApp;
