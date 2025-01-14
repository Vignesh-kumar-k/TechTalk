import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../FireBase.js";

const PrivateRoute = ({ children }) => {
  const user = auth.currentUser; // Check if the user is authenticated

  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
