import React from 'react';
import Header from '../components/Header';

const LandingPage = ({ showPage }) => {
  return (
    <section className="min-h-screen flex flex-col">
      <Header showPage={showPage} />
      <main className="flex-grow flex items-center pt-16">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-5xl font-bold leading-tight text-gray-900">
              A confidential space for your mental wellness.
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Manas Dost is an AI-powered digital ecosystem providing accessible, stigma-free mental health support for college students across India.
            </p>
            <button
              onClick={() => showPage('login')}
              className="mt-8 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold px-8 py-4 rounded-lg shadow-xl hover:scale-105 transform transition"
            >
              Get Started as a Student
            </button>
          </div>
          <div>
            <div className="bg-white p-4 rounded-3xl shadow-2xl">
              <img
                src="https://placehold.co/600x400/E2E8F0/4A5568?text=Manas+Dost+Platform"
                alt="Manas Dost Platform Mockup"
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default LandingPage;