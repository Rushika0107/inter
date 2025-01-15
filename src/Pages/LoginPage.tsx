import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { user, login, logout, register, loginWithGoogle, loginWithFacebook } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, password);
      navigate('/home');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please log in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err: any) {
      setError(err.message || 'Logout failed. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Google login failed. Please try again.');
    }
  };
  const handleFacebookLogin = async () => {
    setError('');
    try {
      await loginWithFacebook();
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Google login failed. Please try again.');
    }
  };

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
        <h2 className="text-4xl font-semibold text-center mb-6">Welcome, {user.email}</h2>
        <div className="flex flex-col items-center space-y-4">
          <button
            className="bg-red-800 hover:bg-red-900 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-xl w-full bg-gray-800 p-10 rounded-lg shadow-xl space-y-8">
        <h2 className="text-4xl font-semibold text-center text-indigo-500">Welcome Back</h2>
        
        {/* Social login buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white"
            onClick={handleGoogleLogin}
            aria-label="Login with Google"
          >
            <i className="fab fa-google text-xl"></i>
          </button>
          <button
            className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white"
            onClick={handleFacebookLogin}
            aria-label="Login with Facebook"
          >
            <i className="fab fa-facebook-f text-xl"></i>
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-lg text-gray-300">Or Login with Email</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex flex-col items-center space-y-4">
            <button
              type="submit"
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition duration-300"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-400">Don't have an account?</p>
          <button
            type="button"
            onClick={handleRegister}
            className="mt-4 w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition duration-300"
          >
            Register
          </button>
        </div>
      </div>

      <div className="mt-12 text-center text-gray-500">
        <p>By continuing, you agree to our <a href="/terms" className="text-indigo-500 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-indigo-500 hover:underline">Privacy Policy</a>.</p>
      </div>
    </div>
  );
};

export default LoginPage;
