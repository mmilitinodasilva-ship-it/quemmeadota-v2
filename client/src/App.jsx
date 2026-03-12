import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Pets from './pages/Pets'
import PetDetails from './pages/PetDetails'
import Favorites from './pages/Favorites'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import AboutUs from './pages/AboutUs'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfUse from './pages/TermsOfUse'
import CareTips from './pages/CareTips'
import AdoptionGuide from './pages/AdoptionGuide'
import FAQ from './pages/FAQ'
import Ngos from './pages/Ngos'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext'
import { PetProvider } from './context/PetContext'
import { FavoriteProvider } from './context/FavoriteContext'
import { SocketProvider } from './context/SocketContext'

function App() {
  return (
    <AuthProvider>
      <PetProvider>
        <FavoriteProvider>
          <SocketProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/pets" element={<Pets />} />
                  <Route path="/pets/:id" element={<PetDetails />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfUse />} />
                  <Route path="/care-tips" element={<CareTips />} />
                  <Route path="/adoption-guide" element={<AdoptionGuide />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/ngos" element={<Ngos />} />
                  <Route path="/admin/*" element={<AdminDashboard />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </SocketProvider>
        </FavoriteProvider>
      </PetProvider>
    </AuthProvider>
  )
}

export default App
