import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
     
      <nav className="flex justify-between items-center px-8 py-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-blue-500">BlogHub</h1>
        <ul className="flex space-x-6 items-center">
          <li>
            <Link to="/" className="hover:text-blue-400 transition">
              Home
            </Link>
          </li>
          
          <li>
            <Link to="/login" className="hover:text-blue-400 transition">
              Login
            </Link>
          </li>
          <li>
            <Link to="/register">
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition">
                Sign Up
              </button>
            </Link>
          </li>
        </ul>
      </nav>

   
      <section className="flex flex-col items-center justify-center flex-grow text-center mt-10 px-6">
        <h2 className="text-6xl md:text-7xl font-extrabold text-blue-500 leading-tight mb-6 drop-shadow-[0_0_20px_rgba(37,99,235,0.6)]">
          <span className="block">Explore.</span>
          <span className="block">Create.</span>
          <span className="block">Share.</span>
        </h2>

        <p className="text-lg text-gray-300 max-w-2xl mb-8">
          Your one-stop platform to read, write, and share amazing blogs with the world.
          Join a community of passionate writers and readers!
        </p>

        <Link to="/register">
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition text-white shadow-lg shadow-blue-500/30">
            Register Now
          </button>
        </Link>
      </section>


      <section className="mt-20 px-6 pb-20">
        <h3 className="text-3xl font-bold text-center mb-10">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-600/50 shadow-blue-600/40 transition">
            <h4 className="text-xl font-semibold text-blue-400 mb-2">
              Write Effortlessly
            </h4>
            <p className="text-gray-300">
              Create and publish blogs with our simple, distraction-free editor designed for creativity.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-600/50 shadow-blue-600/40 transition">
            <h4 className="text-xl font-semibold text-blue-400 mb-2">
              Explore Blogs
            </h4>
            <p className="text-gray-300">
              Browse blogs across various topics — technology, lifestyle, travel, and more!
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-600/50 shadow-blue-600/40 transition">
            <h4 className="text-xl font-semibold text-blue-400 mb-2">
              Connect & Grow
            </h4>
            <p className="text-gray-300">
              Engage with other writers, share feedback, and grow your personal writing journey.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
