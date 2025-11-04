import React from 'react';
// ADDED: Import the Link component from React Router
import { Link } from 'react-router-dom';
import Header from '../components/Header';

// --- Icon Components (unchanged) ---
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);
const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m0 0a2.494 2.494 0 01-4.988 0M12 17.747a2.494 2.494 0 004.988 0M12 6.253a2.494 2.494 0 014.988 0M12 6.253a2.494 2.494 0 00-4.988 0" />
  </svg>
);
const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

// MODIFIED: 'showPage' prop is removed
const LandingPage = () => {
  return (
    <div className="bg-[#FFF9F0] text-[#2C3E50]">
      {/* The Header component no longer needs the showPage prop */}
      <Header />

      {/* Hero Section */}
      <main className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#FF9F43]/20 rounded-full filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-[#00A896]/20 rounded-full filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="container relative mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight md:leading-tight max-w-4xl mx-auto">
            <span className="bg-gradient-to-r from-[#FF9F43] to-[#FF6B6B] bg-clip-text text-transparent">
              Find Your Sunshine,
            </span>
            <br />
            Even on Cloudy Days.
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-[#2C3E50]/80">
            Manas Dost is your bright, friendly, and confidential space to grow, heal, and rediscover your joy. Made for students, by design.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            {/* --- MODIFIED: Replaced <button> with <Link> and onClick with 'to' --- */}
            <Link
              to="/signup"
              className="bg-[#FF9F43] text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section (Unchanged) */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">A Toolkit for a Brighter You</h2>
            <p className="mt-4 text-lg text-[#2C3E50]/80">Everything you need to build resilience and find balance.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="flex items-center justify-center h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-[#FF9F43]/80 to-[#FF6B6B]/80 text-white shadow-lg">
                <ChatIcon />
              </div>
              <h3 className="text-2xl font-bold mt-6">AI Companion</h3>
              <p className="mt-2 text-[#2C3E50]/80">Chat with our supportive AI, trained to listen and provide guidance 24/7. It's completely confidential.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-20 w-20 mx-auto rounded-2xl bg-[#00A896]/80 text-white shadow-lg">
                <BookOpenIcon />
              </div>
              <h3 className="text-2xl font-bold mt-6">Guided Journals</h3>
              <p className="mt-2 text-[#2C3E50]/80">Explore your thoughts and track your mood with structured journaling exercises designed by therapists.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-20 w-20 mx-auto rounded-2xl bg-[#FF6B6B]/80 text-white shadow-lg">
                <HeartIcon />
              </div>
              <h3 className="text-2xl font-bold mt-6">Resource Library</h3>
              <p className="mt-2 text-[#2C3E50]/80">Access a curated collection of articles, meditations, and breathing exercises to help you cope and thrive.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Unchanged) */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Real Stories, Real Hope</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-[#FF9F43]">
              <p className="text-[#2C3E50]/90">"For the first time, I felt like I could talk about my exam stress without any judgment. The AI companion is surprisingly helpful and always available."</p>
              <p className="mt-4 font-bold text-[#FF9F43]">- B.Tech Student, IIT Delhi</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-[#00A896]">
              <p className="text-[#2C3E50]/90">"The journaling prompts are my favorite part. They help me untangle my thoughts after a long day. It’s become a part of my daily routine."</p>
              <p className="mt-4 font-bold text-[#00A896]">- Arts Major, Mumbai University</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer (Unchanged) */}
      <footer className="bg-[#2C3E50] text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="font-bold text-2xl">Manas Dost</p>
          <p className="mt-4 max-w-md mx-auto">Your mental wellness is a priority. We're here to support you on your journey.</p>
          <div className="mt-8 flex justify-center gap-6 text-sm font-semibold">
              <a href="#" className="hover:text-[#FF9F43] transition-colors">About Us</a>
              <a href="#" className="hover:text-[#FF9F43] transition-colors">FAQ</a>
              <a href="#" className="hover:text-[#FF9F43] transition-colors">Contact</a>
              <a href="#" className="hover:text-[#FF9F43] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#FF9F43] transition-colors">Terms of Service</a>
          </div>
          <p className="mt-8 text-sm text-white/70">&copy; {new Date().getFullYear()} Manas Dost. All rights reserved. A project for the students of India.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

