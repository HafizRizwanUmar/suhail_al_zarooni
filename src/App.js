import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import AddArticle from "./components/Dashboard/AddArticle";
import Article from "./components/Dashboard/AllArticle";
import Users from "./components/Dashboard/AllUsers";
import About from "./components/About/About";
import AdminDashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Dashboard/Login";
import LegacySignup from "./components/Dashboard/LegacySignup";
import CategoryPage from "./components/Shared/CategoryPage";
import ArticleDetailPage from "./components/Shared/ArticleDetailPage";
import Home from "./components/Home/Home";
import { AuthProvider } from "./context/AuthContext";
import SecurityGuard from "./components/Shared/SecurityGuard";

import ContributorsPage from "./components/Contributors/Contributors";
import ContributorProfilePage from "./components/Contributors/ContributorProfile";

function App() {
  return (
    <AuthProvider>
      <Router>
      <div className="App">
        <SecurityGuard>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/article/:id" element={<ArticleDetailPage />} />
            
            {/* Contributor Pages */}
            <Route path="/contributors" element={<ContributorsPage />} />
            <Route path="/contributor/:id" element={<ContributorProfilePage />} />
            
            {/* Category Pages */}
            <Route path="/events" element={<CategoryPage category="event" title="Events" />} />
            <Route path="/foundation" element={<CategoryPage category="foundation" title="Foundation" />} />
            <Route path="/museum" element={<CategoryPage category="museum" title="Museum" />} />
            <Route path="/media" element={<CategoryPage category="media" title="Media" />} />
            <Route path="/collection" element={<CategoryPage category="collection" title="Collection" />} />
            <Route path="/meetup" element={<CategoryPage category="meetup" title="Meetup" />} />

            {/* Admin Routes */}
            <Route path="/adminlogin" element={<Login />} />
            <Route path="/admindashboard" element={<AdminDashboard/>} />
            <Route path="/legacy-signup" element={<LegacySignup />} />
            <Route path="/add-article" element={<AddArticle />} />
            <Route path="/all-articles" element={<Article />} />
            
            <Route path="*" element={<Navigate to="/home" replace={true} />} />
          </Routes>
        </SecurityGuard>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
