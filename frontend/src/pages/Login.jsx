import { useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Decorative background blobs */}
      <div style={styles.bgBlob1}></div>
      <div style={styles.bgBlob2}></div>

      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <span style={styles.logoText}>Pixnest</span>
          <span style={styles.logoDot}>.</span>
        </div>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.sub}>Enter your credentials to access the vault</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              placeholder="name@studio.com"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              placeholder="••••••••"
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Opening vault...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footerLink}>
          New to the studio? <Link to="/signup" style={styles.link}>Create Account</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#080810',
    position: 'relative',
    overflow: 'hidden',
    padding: '20px',
  },
  bgBlob1: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(124, 107, 255, 0.12) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    pointerEvents: 'none',
  },
  bgBlob2: {
    position: 'absolute',
    bottom: '20%',
    right: '20%',
    width: '350px',
    height: '350px',
    background: 'radial-gradient(circle, rgba(255, 107, 157, 0.1) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(50px)',
    pointerEvents: 'none',
  },
  card: {
    background: '#12121f',
    border: '1px solid #1e1e35',
    padding: '48px 40px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 10,
    backdropFilter: 'blur(20px)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  logoText: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '32px',
    fontWeight: '800',
    letterSpacing: '-0.04em',
    color: '#f0f0ff',
  },
  logoDot: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#ff6b9d',
  },
  title: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '24px',
    fontWeight: '700',
    color: '#f0f0ff',
    textAlign: 'center',
    marginBottom: '6px',
  },
  sub: {
    color: '#6b6b8a',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '32px',
    lineHeight: '1.5',
  },
  error: {
    background: 'rgba(255, 107, 157, 0.1)',
    border: '1px solid rgba(255, 107, 157, 0.2)',
    color: '#ff6b9d',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '20px',
    textAlign: 'center',
    lineHeight: '1.4',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    color: '#6b6b8a',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #1e1e35',
    background: 'rgba(8, 8, 16, 0.5)',
    color: '#f0f0ff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  button: {
    padding: '14px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #7c6bff 0%, #a25eff 100%)',
    color: '#f0f0ff',
    border: 'none',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(124, 107, 255, 0.3)',
    marginTop: '10px',
  },
  footerLink: {
    color: '#6b6b8a',
    marginTop: '28px',
    fontSize: '14px',
    textAlign: 'center',
  },
  link: {
    color: '#7c6bff',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s',
  },
};