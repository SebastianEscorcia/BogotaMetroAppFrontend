import { Login, Welcome, Register,RecoverPassword  } from "./views";
import "./assets/styles/layout.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

export const BogotaMetroApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/recover-password" element={<RecoverPassword/>}></Route>
      </Routes>
    </BrowserRouter>
  );
};
