'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../api';
import { setToken, setUser } from '../../auth';
import { User, UserRole } from '../../types';

export function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<UserRole>('USER');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.post('/user', {
        name: name.trim(),
        email: email.trim(),
        password,
        address: address.trim(),
        role,
      });

      const { token, user } = res.data;
      if (token && user) {
        setToken(token);
        setUser(user as User);
        router.push('/homepage');
      } else {
        // If API creates account without token, automatically log in
        try {
          const loginRes = await api.post('/user/login', {
            email: email.trim(),
            password,
          });
          setToken(loginRes.data.token);
          setUser(loginRes.data.user);
          router.push('/homepage');
        } catch {
          router.push('/login');
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to create account. Please try again.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        borderRadius: '24px',
        padding: '3rem 2.5rem',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(44, 24, 16, 0.25)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🐾</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#2C1810', margin: '0 0 0.5rem' }}>
          Create an Account
        </h1>
        <p style={{ color: '#6E5D53', fontSize: '0.95rem', margin: 0 }}>
          Join our animal welfare community to adopt, donate, and care for pets.
        </p>
      </div>

      {errorMessage && (
        <div
          style={{
            backgroundColor: '#FFEBEE',
            border: '1px solid #FFCDD2',
            color: '#C62828',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            fontWeight: 600,
          }}
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px', color: '#2C1810' }}>
            Full Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1px solid #DCD0BE',
              backgroundColor: '#FFFFFF',
              fontSize: '1rem',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px', color: '#2C1810' }}>
            Email Address *
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1px solid #DCD0BE',
              backgroundColor: '#FFFFFF',
              fontSize: '1rem',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px', color: '#2C1810' }}>
            Password (min 6 characters) *
          </label>
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1px solid #DCD0BE',
              backgroundColor: '#FFFFFF',
              fontSize: '1rem',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px', color: '#2C1810' }}>
            Address / City *
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 742 Evergreen Terrace, Springfield"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1px solid #DCD0BE',
              backgroundColor: '#FFFFFF',
              fontSize: '1rem',
            }}
          />
        </div>

        {/* Radio: Regular user or NGO */}
        <div>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', color: '#2C1810' }}>
            Account Role
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #E2D7C5',
                backgroundColor: role === 'USER' ? '#FAF0D6' : '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="role"
                value="USER"
                checked={role === 'USER'}
                onChange={() => setRole('USER')}
              />
              <div>
                <span style={{ fontWeight: 700, color: '#2C1810' }}>I&apos;m a regular user / Pet Parent</span>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#6E5D53' }}>
                  Adopt pets, generate custom diets, shop for nutrition products
                </p>
              </div>
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #E2D7C5',
                backgroundColor: role === 'NGO' ? '#FAF0D6' : '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="role"
                value="NGO"
                checked={role === 'NGO'}
                onChange={() => setRole('NGO')}
              />
              <div>
                <span style={{ fontWeight: 700, color: '#2C1810' }}>I&apos;m an NGO representative</span>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#6E5D53' }}>
                  Manage rescue animals, list adoption pets, create fundraisers
                </p>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="paw-button-primary"
          style={{ width: '100%', padding: '14px', fontSize: '1.05rem', marginTop: '0.5rem' }}
        >
          {submitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem', color: '#6E5D53' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: '#8C5E3C', fontWeight: 700, textDecoration: 'underline' }}>
          Sign in
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
        <Link href="/ngo-management" style={{ color: '#8C7769', textDecoration: 'none' }}>
          Are you an NGO? Sign up as NGO or register shelter →
        </Link>
      </div>
    </div>
  );
}

export default SignupForm;
