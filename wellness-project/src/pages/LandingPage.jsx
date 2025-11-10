import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

// --- Icon Components ---
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m0 0a2.494 2.494 0 01-4.988 0M12 17.747a2.494 2.494 0 004.988 0M12 6.253a2.494 2.494 0 014.988 0M12 6.253a2.494 2.494 0 00-4.988 0" /></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;

const LandingPage = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      <Header />

      <main className="relative pt-24 pb-20 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 -left-20 w-72 h-72 bg-orange-200/50 rounded-full filter blur-2xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 -right-20 w-72 h-72 bg-teal-200/50 rounded-full filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="container relative mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight max-w-4xl mx-auto">
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Find Your Sunshine,
            </span>
            <br />
            Even on Cloudy Days.
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-gray-600">
            Manas Dost is your bright, friendly, and confidential space to grow, heal, and rediscover your joy. Made for students, by design.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto bg-orange-500 text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Start Your Journey
            </Link>
             <Link
              to="/login"
              className="w-full sm:w-auto bg-white text-orange-500 font-bold px-8 py-3 rounded-lg shadow-md hover:shadow-lg border border-gray-200 transform hover:-translate-y-1 transition-all duration-300"
            >
              I Have an Account
            </Link>
          </div>
        </div>
      </main>

      <section id="features" className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">A Toolkit for a Brighter You</h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600">Everything you need to build resilience and find balance.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center p-4">
              <div className="flex items-center justify-center h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-orange-400 to-red-400 text-white shadow-lg">
                <ChatIcon />
              </div>
              <h3 className="text-xl font-bold mt-6">AI Companion</h3>
              <p className="mt-2 text-gray-600">Chat with our supportive AI, trained to listen and provide guidance 24/7. It's completely confidential.</p>
            </div>
            <div className="text-center p-4">
              <div className="flex items-center justify-center h-16 w-16 mx-auto rounded-2xl bg-teal-400 text-white shadow-lg">
                <BookOpenIcon />
              </div>
              <h3 className="text-xl font-bold mt-6">Guided Journals</h3>
              <p className="mt-2 text-gray-600">Explore your thoughts and track your mood with structured journaling exercises designed by therapists.</p>
            </div>
            <div className="text-center p-4">
              <div className="flex items-center justify-center h-16 w-16 mx-auto rounded-2xl bg-red-400 text-white shadow-lg">
                <HeartIcon />
              </div>
              <h3 className="text-xl font-bold mt-6">Resource Library</h3>
              <p className="mt-2 text-gray-600">Access a curated collection of articles, meditations, and breathing exercises to help you cope and thrive.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Real Stories, Real Hope</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg border-t-4 border-orange-400">
              <p className="text-gray-700">"For the first time, I felt like I could talk about my exam stress without any judgment. The AI companion is surprisingly helpful and always available."</p>
              <p className="mt-4 font-bold text-orange-500">- B.Tech Student, IIT Delhi</p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg border-t-4 border-teal-400">
              <p className="text-gray-700">"The journaling prompts are my favorite part. They help me untangle my thoughts after a long day. It’s become a part of my daily routine."</p>
              <p className="mt-4 font-bold text-teal-500">- Arts Major, Mumbai University</p>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="bg-gray-800 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="font-bold text-xl">Manas Dost</p>
          <p className="mt-4 max-w-md mx-auto text-gray-400">Your mental wellness is a priority. We're here to support you on your journey.</p>
          <div className="mt-8 flex justify-center gap-4 sm:gap-6 text-sm font-semibold flex-wrap">
              <a href="#" className="hover:text-orange-400 transition-colors">About Us</a>
              <a href="#" className="hover:text-orange-400 transition-colors">FAQ</a>
              <a href="#" className="hover:text-orange-400 transition-colors">Contact</a>
              <a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a>
          </div>
          <p className="mt-8 text-sm text-gray-500">&copy; {new Date().getFullYear()} Manas Dost. All rights reserved. A project for the students of India.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
