import logo from "./logo.svg";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegisterPage from "./pages/Register";
import Home from "./pages/Home";
import axios from "axios";
import CreateTopics from "./pages/CreateTopics";
import { ToastContainer } from "react-toastify";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

function App() {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create-topic" element={<CreateTopics />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
