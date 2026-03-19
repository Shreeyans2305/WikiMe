import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import CreateWiki from "./pages/CreateWiki";
import WikiPage from "./pages/WikiPage";
import EditWiki from "./pages/EditWiki";
import NotFound from "./pages/NotFound";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateWiki />} />
        <Route path="/wiki/:slug" element={<WikiPage />} />
        <Route path="/edit/:slug" element={<EditWiki />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;