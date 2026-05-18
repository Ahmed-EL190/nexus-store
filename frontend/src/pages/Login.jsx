import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { handleImageError } from '../utils/imageFallback';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    setLoading(true);
    try {
      let user;
      if (mode === 'login') user = await login(form.email, form.password);
      else user = await register(form.name, form.email, form.password);
      toast.success(`Welcome${user.name ? ', ' + user.name : ''}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left visual */}
      <div className="hidden lg:flex flex-1 bg-brand-black items-center justify-center relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800" alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" loading="lazy" onError={handleImageError}/>
        <div className="relative text-center">
          <h1 className="font-display text-8xl text-white tracking-widest">NEXUS</h1>
          <p className="text-brand-gray-400 mt-4 font-mono tracking-widest text-xs uppercase">Performance Apparel</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <h2 className="font-display text-4xl tracking-widest mb-2">
            {mode === 'login' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
          </h2>
          <p className="text-brand-gray-500 text-sm mb-8">
            {mode === 'login' ? "Don't have an account? " : "Already have one? "}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-black font-semibold underline">
              {mode === 'login' ? 'Register' : 'Login'}
            </button>
          </p>

          <div className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-mono tracking-widest uppercase text-brand-gray-500 block mb-1">Full Name</label>
                <input name="name" value={form.name} onChange={update} className="input-field" placeholder="Your name"/>
              </div>
            )}
            <div>
              <label className="text-xs font-mono tracking-widest uppercase text-brand-gray-500 block mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={update} className="input-field" placeholder="you@example.com"/>
            </div>
            <div>
              <label className="text-xs font-mono tracking-widest uppercase text-brand-gray-500 block mb-1">Password</label>
              <input name="password" type="password" value={form.password} onChange={update} className="input-field" placeholder="••••••••"/>
            </div>
            <button onClick={submit} disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> : null}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-brand-gray-100 text-xs text-brand-gray-500 font-mono">
            <strong>Demo Admin:</strong> admin@yourbrand.com / Admin@123456
          </div>
        </div>
      </div>
    </div>
  );
}
