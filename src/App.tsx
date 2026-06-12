import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PublishForm } from "@/components/opportunities/PublishForm";
import { OpportunityDetail } from "@/components/opportunities/OpportunityDetail";
import { ApplicationDetail } from "@/components/applications/ApplicationCard";
import HomePage from "@/pages/HomePage";
import OpportunitiesPage from "@/pages/OpportunitiesPage";
import ProfilePage from "@/pages/ProfilePage";
import ApplicationsPage from "@/pages/ApplicationsPage";
import MessagesPage from "@/pages/MessagesPage";
import CreditsPage from "@/pages/CreditsPage";
import NotFoundPage from "@/pages/NotFoundPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function AppShell() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <PublishForm />
      <OpportunityDetail />
      <ApplicationDetail />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppShell />
    </Router>
  );
}
