import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import { AppProvider, useAppContext } from "./AppContext";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import VerifyEmail from "./components/VerifyEmail";
import ProtectedRoute from "./components/ProtectedRoute";
import NormalUsersLandingPage from "./components/NormalUsersLandingPage";
import AdminLandingPage from "./components/AdminLandingPage";
import CreateMoviePage from "./components/CreateMoviePage";
import CreateCinemaPage from "./components/CreateCinemaPage";
import CreateMovieListingPage from "./components/CreateMovieListingPage";
import ViewAllMovieListingsPage from "./components/ViewAllMovieListingsPage.js";
import AlertProvider from "./AlertContext";
import Alert from "./components/Alert";
import DashboardBar from "./components/DashboardBar";
import MovieBookingPage from "./components/MovieBooking/MovieBookingPage.js";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min.js";

function AppContent() {
  const { user, isLoading } = useAppContext();
  const location = useLocation();
  const pathsWithoutDashboard = ["/login", "/sign-up", "/verify-email"];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {!pathsWithoutDashboard.includes(location.pathname) && <DashboardBar />}
      <Switch>
        <Route exact path="/" render={
          () => {
            if(!user){
              return <Redirect to="/login" />;
            } else if (user === "admin"){
              return <Redirect to="/admin-landing-page" />;
            } else if (user === "user"){
              return <Redirect to="/homepage" />
            }
          }
        } />
        <Route path="/login" component={LoginForm}></Route>
        <Route path="/sign-up" component={SignupForm}></Route>
        <Route path="/verify-email" component={VerifyEmail}></Route>
        <ProtectedRoute
          path="/homepage"
          component={NormalUsersLandingPage}
          roles={["user"]}
        ></ProtectedRoute>
        <ProtectedRoute
          path="/admin-landing-page"
          component={AdminLandingPage}
          roles={["admin"]}
        ></ProtectedRoute>
        <ProtectedRoute
          path="/create-movie-page"
          component={CreateMoviePage}
          roles={["admin"]}
        ></ProtectedRoute>
        <ProtectedRoute
          path="/create-movie-listing-page"
          component={CreateMovieListingPage}
          roles={["admin"]}
        ></ProtectedRoute>
        <ProtectedRoute
          path="/create-cinema-page"
          component={CreateCinemaPage}
          roles={["admin"]}
        ></ProtectedRoute>
        <ProtectedRoute
          path="/view-all-movie-listings"
          component={ViewAllMovieListingsPage}
        ></ProtectedRoute>
         <ProtectedRoute
          path="/book-movie"
          component={MovieBookingPage}
        ></ProtectedRoute>
      </Switch>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AlertProvider>
        <Router>
          <Alert />
          <AppContent />
        </Router>
      </AlertProvider>
    </AppProvider>
  );
}

export default App;
