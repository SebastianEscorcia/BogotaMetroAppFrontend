import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {  BogotaMetroApp } from './BogotaMetroApp'
import "@fortawesome/fontawesome-free/css/all.min.css";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BogotaMetroApp/>
  </StrictMode>,
)
