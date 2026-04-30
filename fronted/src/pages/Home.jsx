import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from "../components/Hero";
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

export default function Home() {

    useEffect(() => {
    localStorage.removeItem("selectedPlan");
  }, []);
  useEffect(() => {
  const fromStripe = localStorage.getItem("fromStripeCheckout");

  if (fromStripe) {
    // remove flag
    localStorage.removeItem("fromStripeCheckout");

    // force stay on home (no redirect)
    window.history.replaceState({}, "", "/");
  }
}, []);
  return (
    <div>
      <Navbar/>
      <main className=''>
        <Hero/>
        <div className="">
          <Features />
        </div>
        <Pricing/>
      </main>
      <Footer/>
    </div>
  )
}
