import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-[calc(100vh-70px)] px-6 py-12">

      <div className="mx-auto flex min-h-[calc(100vh-166px)] max-w-[875px] items-center justify-center">

        <section className="w-full rounded-[2px] bg-[#292929] px-8 py-20 text-center sm:px-14">

          <h1 className="text-[34px] font-extrabold leading-tight sm:text-[38px]">
            Welcome to{' '}

            <span className="text-primary-yellow">
              The Social Hub
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-5 text-white/90 sm:text-[16px]">
            Your one-stop hub for{' '}
            <strong>exciting events</strong>{' '}
            — meet, explore, and experience like never before!
          </p>

          <button
            type="button"
            onClick={() => navigate('/events')}
            className="
              mt-5
              rounded-md
              bg-primary-yellow
              px-5
              py-2
              text-[11px]
              font-bold
              text-[#171717]
              transition
              hover:-translate-y-0.5
              hover:bg-[#ffd43b]
            "
          >
            Explore Events
          </button>

        </section>

      </div>

    </main>
  );
};

export default Home;