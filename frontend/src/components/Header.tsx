
import React from 'react';

const Header = () => (
  <header className="w-full max-w-7xl mb-8 text-center">
    <div className="flex items-center justify-center gap-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.262.023.528.023.792 0l.004-.001a11.956 11.956 0 014.265 2.459l-4.265-2.459zm0 0c-.316.032-.63.032-.942 0l.942-.001zM3.75 7.155A11.956 11.956 0 008.015 9.614m-4.265-2.459A11.956 11.956 0 013.75 7.155m12.75 4.74A11.956 11.956 0 0115.985 9.614m4.265 2.459a11.956 11.956 0 00-4.265-2.459m0 0a2.25 2.25 0 01.659 1.591v5.714m-2.25-5.714a2.25 2.25 0 00-.659-1.591L12.5 4.5M14.25 3.104c-.262.023-.528.023-.792 0l-.004-.001a11.956 11.956 0 00-4.265 2.459l4.265-2.459zm0 0c.316.032.63.032.942 0l-.942-.001zM19.25 7.155a11.956 11.956 0 01-4.265 2.459m4.265-2.459a11.956 11.956 0 00-4.265-2.459M5 14.5h14M5 14.5a2.25 2.25 0 01-2.25-2.25v-1.5a2.25 2.25 0 012.25-2.25h14a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25M5 14.5v2.25a2.25 2.25 0 002.25 2.25h9.5a2.25 2.25 0 002.25-2.25V14.5" />
      </svg>
      <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-sky-400 to-cyan-300 text-transparent bg-clip-text">
        Memory Matrix
      </h1>
    </div>
  </header>
);

export default Header;
