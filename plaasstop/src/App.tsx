import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Amplify } from "aws-amplify";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import { API_URL, AMPLIFY_CONFIG } from "./config/api";
import { DbUser, CognitoUser } from "./types";

import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import FindFarms from "./pages/FindFarms";
import About from "./pages/About";
import "./index.css";

Amplify.configure(AMPLIFY_CONFIG);

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const [user, setUser] = useState<CognitoUser | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);

  const [isSyncing, setIsSyncing] = useState<boolean>(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    checkUser();

    const listener = Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signedIn":
          checkUser();
          break;
        case "signedOut":
          setUser(null);
          setDbUser(null);
          setIsSyncing(false);
          break;
      }
    });

    return () => listener();
  }, []);

  async function checkUser(): Promise<void> {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      await syncUserWithBackend(currentUser);
    } catch (err) {
      console.log("No current user session");
      setUser(null);
      setDbUser(null);
    } finally {
      setIsSyncing(false);
    }
  }

  async function syncUserWithBackend(cognitoUser: CognitoUser): Promise<void> {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken?.toString();

      if (!token) throw new Error("No access token found");

      const payload = {
        id: cognitoUser.userId,
        role: "buyer",
        name: cognitoUser.username,
      };

      const syncResponse = await fetch(`${API_URL}/api/auth/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!syncResponse.ok)
        throw new Error(`Sync failed: ${syncResponse.statusText}`);

      const profileResponse = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!profileResponse.ok) throw new Error("Failed to fetch profile");

      const profileData = (await profileResponse.json()) as DbUser;

      setDbUser(profileData);
    } catch (error) {
      console.error("Backend Sync Error:", error);
      setSyncError("Failed to sync user profile.");
    }
  }

  if (isSyncing && !user) {
    return (
      <div className="flex h-screen justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <ErrorBoundary>
          {syncError && (
            <div className="bg-red-100 text-red-700 p-2 text-center text-sm">
              {syncError}
            </div>
          )}

          <Navbar
            user={user}
            dbUser={dbUser}
            onOpenAuth={() => setIsAuthOpen(true)}
          />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<FindFarms />} />
            <Route
              path="/vendors"
              element={<div className="p-20 text-center">Vendor Portal</div>}
            />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>

          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
