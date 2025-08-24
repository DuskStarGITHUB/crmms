/**
 * =====================================================
 *  NAME    : homeRouter.tsx
 *  DESCRIPTION: module home init
 * =====================================================
 */

// ROUTES
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./homePage";
import ConfigurationPage from "./configurationPage";
import ProfilePage from "./profilePage";


// ASEEMBLY MODULE
export default function HomeRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<HomePage />}>
          <Route path="configuration" element={<ConfigurationPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}