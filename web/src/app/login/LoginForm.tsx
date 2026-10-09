'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../api';
import { setToken, setUser } from '../../auth';
import { User } from '../../types';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromParam = searchParams.get('from');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getValidRedirectPath = (): string => {
    if (fromParam && fromParam.startsWith('/') && !fromParam.startsWith('//')) {
      return fromParam;
    }
    return '/homepage';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      const res = await api.post('/user/login', {
        email: email.trim(),
        password,
      });

      const { token, user } = res.data;
      if (token && user) {
        setToken(token);
        setUser(user as User);
        const destination = getValidRedirectPath();
        router.push(destination);
      } else {
        setErrorMessage('Authentication response was invalid.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        borderRadius: '24px',
        padding: '3rem 2.5rem',
        maxWidth: '460px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(44, 24, 16, 0.25)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🐾</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#2C1810', margin: '0 0 0.5rem' }}>
          Welcome Back
        </h1>
        <p style={{ color: '#6E5D53', fontSize: '0.95rem', margin: 0 }}>
          Sign in to access pet adoption, health tracking, and shelter tools.
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
            Email Address
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
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
            Password
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
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

        <button
          type="submit"
          disabled={submitting}
          className="paw-button-primary"
          style={{ width: '100%', padding: '14px', fontSize: '1.05rem', marginTop: '0.5rem' }}
        >
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem', color: '#6E5D53' }}>
        Don&apos;t have an account yet?{' '}
        <Link href="/signup" style={{ color: '#8C5E3C', fontWeight: 700, textDecoration: 'underline' }}>
          Sign up here
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
        <Link href="/ngo-management" style={{ color: '#8C7769', textDecoration: 'none' }}>
          Are you a shelter representative? Register an NGO →
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;
