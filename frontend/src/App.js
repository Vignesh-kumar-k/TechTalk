import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./FireBase"; 
import Login from "./Components/Login";
import Signin from "./Components/Signin";
import PrivateRoute from "./Components/PrivateRoute";
import UserProfile from "./Components/DisplayProfile";
import CreateProfile from "./Components/CreateProfile";
import Posts from "./Components/Posts";
import FeedPage from "./Components/FeedPage";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Current user", currentUser); 
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  if (loading) {
    return <p>Loading...</p>; 
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createprofile" element={<CreateProfile />} />
        <Route
          path="/posts"
          element={
            <PrivateRoute user={user}>
              <Posts user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <PrivateRoute user={user}>
              <FeedPage user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute user={user}>
              <UserProfile user={user} />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
