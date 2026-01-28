import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData);
      navigate('/explore');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-screen w-screen flex justify-center items-center border'>
        <h1 className='bg-primary-bg'>TEST</h1>
        <div className='flex flex-col gap-8 space-y-5 h-fit w-fit bg-black/40 shadow-xl p-5'>
            <h2 className='text-primary-yellow text-4xl font-bold text-center mb-8'>Login</h2>

            {error && <div>{error}</div>}

            <form className='flex flex-col gap-6'>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-input-bg border-2 border-primary-yellow rounded text-white placeholder-primary-yellow placeholder-opacity-80 focus:outline-none "
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-input-bg border-2 border-primary-yellow rounded text-white placeholder-primary-yellow placeholder-opacity-80 focus:outline-none "
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-yellow text-gray-900 p-4 rounded font-bold text-lg bg-yellow-300 transition disabled:opacity-60"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <button
                    type="button"
                    onClick={() => window.location.href = 'http:       localhost:5000/api/auth/google'}
                    className="w-full bg-red-600 text-white p-4 rounded font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition"
                >
                    <span className="text-xl font-bold">G</span> Login with Google
                </button>
            </form>

            <p className="text-center mt-5 text-gray-400">
                Don't have an account? <Link to="/signup" className="text-primary-yellow hover:underline font-semibold">Sign up</Link>
            </p>
        </div>
    </div>
  )
}; 
//   return (
//     <div className="min-h-[300px] flex items-center justify-center p-10 space-y-7">
//       <div className="w-full h-full max-w-md bg-card-bg rounded-lg p-10 shadow-xl space-y-7">
//         <h2 className="text-primary-yellow text-4xl font-bold text-center mb-8">Login</h2>
        
//         {error && <div className="bg-red-600 text-white p-3 rounded mb-5 text-center">{error}</div>}

//         <form onSubmit={handleSubmit} className="space-y-6 bg-white mt-4">
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="w-full p-4 bg-input-bg border-2 border-primary-yellow rounded text-white placeholder-primary-yellow placeholder-opacity-80 focus:outline-none border-yellow-300"
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="w-full p-4 bg-input-bg border-2 border-primary-yellow rounded text-white placeholder-primary-yellow placeholder-opacity-80 focus:outline-none 
//             border-yellow-300"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-primary-yellow text-gray-900 p-4 rounded font-bold text-lg bg-yellow-300 transition disabled:opacity-60"
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>

//           <button
//             type="button"
//             onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
//             className="w-full bg-red-600 text-white p-4 rounded font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition"
//           >
//             <span className="text-xl font-bold">G</span> Login with Google
//           </button>
//         </form>

//         <p className="text-center mt-5 text-gray-400">
//           Don't have an account? <Link to="/signup" className="text-primary-yellow hover:underline font-semibold">Sign up</Link>
//         </p>
//       </div>
//     </div>
//   );


export default Login;