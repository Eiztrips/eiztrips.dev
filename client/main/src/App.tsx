import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Callback from './pages/Callback';

function App() {
  return (
      <BrowserRouter>
          <div className="app">
              <Navbar />
              <main>
                  <Routes>
                      <Route
                          path="/"
                          element={
                              <>
                                  <Hero />
                                  <Skills />
                                  <Projects />
                                  <Contact />
                              </>
                          }
                      />
                      <Route
                          path="/callback"
                          element={<Callback />}
                      />
                  </Routes>
              </main>
              <Footer />
          </div>
      </BrowserRouter>
  );
}

export default App;
