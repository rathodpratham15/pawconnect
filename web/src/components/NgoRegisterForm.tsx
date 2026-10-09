'use client';

import React, { useState } from 'react';
import api from '../api';

export function NgoRegisterForm() {
  const [name, setName] = useState('');
  const [registrationId, setRegistrationId] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number | ''>('');
  const [longitude, setLongitude] = useState<number | ''>('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');

  const [detectingLocation, setDetectingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setDetectingLocation(true);
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(Number(position.coords.latitude.toFixed(6)));
        setLongitude(Number(position.coords.longitude.toFixed(6)));
        setDetectingLocation(false);
      },
      (error) => {
        setDetectingLocation(false);
        setErrorMessage(`Location error: ${error.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (name.trim().length < 5) {
      setErrorMessage('NGO Name must be at least 5 characters long.');
      return;
    }
    if (!registrationId.trim()) {
      setErrorMessage('Registration ID is required.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Shelter address is required.');
      return;
    }
    if (latitude === '' || longitude === '') {
      setErrorMessage('Please specify valid latitude and longitude (or click Detect my location).');
      return;
    }
    if (!phone.trim() || !/^\d+$/.test(phone.trim())) {
      setErrorMessage('Please enter a valid numeric phone number.');
      return;
    }
    if (description.trim().length < 5) {
      setErrorMessage('Description must be at least 5 characters long.');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/ngos', {
        name: name.trim(),
        registrationId: registrationId.trim(),
        location: {
          latitude: Number(latitude),
          longitude: Number(longitude),
          address: address.trim(),
        },
        contactInfo: `${countryCode} ${phone.trim()}`,
        description: description.trim(),
      });

      setSuccessMessage('Submitted – it will appear after admin approval');
      setName('');
      setRegistrationId('');
      setAddress('');
      setLatitude('');
      setLongitude('');
      setPhone('');
      setDescription('');
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'Failed to submit NGO registration.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '2.5rem',
        border: '1px solid #EFE4CF',
        boxShadow: '0 4px 20px rgba(44, 24, 16, 0.05)',
      }}
    >
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2C1810', margin: '0 0 0.5rem' }}>
        Register a Non-Profit Organization
      </h2>
      <p style={{ color: '#6E5D53', fontSize: '0.95rem', margin: '0 0 2rem' }}>
        Join PawConnect&apos;s network of verified rescue sanctuaries. Registrations are reviewed by administrators before being published.
      </p>

      {successMessage && (
        <div
          style={{
            backgroundColor: '#E8F5E9',
            border: '1px solid #A5D6A7',
            color: '#2E7D32',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            backgroundColor: '#FFEBEE',
            border: '1px solid #FFCDD2',
            color: '#C62828',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            fontWeight: 600,
          }}
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* NGO Name */}
        <div>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px', color: '#2C1810' }}>
            NGO Name (≥ 5 characters) *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Hope Paws Animal Sanctuary"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid #DCD0BE',
              fontSize: '1rem',
              backgroundColor: '#FAF5EB',
            }}
          />
        </div>

        {/* Registration ID */}
        <div>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px', color: '#2C1810' }}>
            Official Government Registration ID *
          </label>
          <input
            type="text"
            required
            value={registrationId}
            onChange={(e) => setRegistrationId(e.target.value)}
            placeholder="e.g. NGO-REG-2024-8891"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid #DCD0BE',
              fontSize: '1rem',
              backgroundColor: '#FAF5EB',
            }}
          />
        </div>

        {/* Shelter Address */}
        <div>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px', color: '#2C1810' }}>
            Physical Shelter Address *
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 104 Rescue Way, San Francisco, CA"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid #DCD0BE',
              fontSize: '1rem',
              backgroundColor: '#FAF5EB',
            }}
          />
        </div>

        {/* Lat / Long + Detect Location */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#2C1810' }}>
              Coordinates (Latitude / Longitude) *
            </label>
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={detectingLocation}
              style={{
                background: '#FAF0D6',
                border: '1px solid #ECC067',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#2C1810',
                cursor: 'pointer',
              }}
            >
              {detectingLocation ? 'Detecting...' : '📍 Detect my location'}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input
              type="number"
              step="any"
              required
              value={latitude}
              onChange={(e) => setLatitude(e.target.value === '' ? '' : parseFloat(e.target.value))}
              placeholder="Latitude (e.g. 37.7749)"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid #DCD0BE',
                fontSize: '1rem',
                backgroundColor: '#FAF5EB',
              }}
            />
            <input
              type="number"
              step="any"
              required
              value={longitude}
              onChange={(e) => setLongitude(e.target.value === '' ? '' : parseFloat(e.target.value))}
              placeholder="Longitude (e.g. -122.4194)"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid #DCD0BE',
                fontSize: '1rem',
                backgroundColor: '#FAF5EB',
              }}
            />
          </div>
        </div>

        {/* Phone with Country Code */}
        <div>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px', color: '#2C1810' }}>
            Contact Phone *
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '8px' }}>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              style={{
                padding: '12px 8px',
                borderRadius: '10px',
                border: '1px solid #DCD0BE',
                fontSize: '1rem',
                backgroundColor: '#FAF5EB',
                fontWeight: 600,
              }}
            >
              <option value="+1">+1 (US/CA)</option>
              <option value="+91">+91 (IN)</option>
              <option value="+44">+44 (UK)</option>
            </select>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Numeric digits only (e.g. 5551234567)"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid #DCD0BE',
                fontSize: '1rem',
                backgroundColor: '#FAF5EB',
              }}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px', color: '#2C1810' }}>
            Mission & Facilities Description (≥ 5 characters) *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your rescue mission, volunteer capacity, shelter grounds, and medical protocols..."
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid #DCD0BE',
              fontSize: '1rem',
              backgroundColor: '#FAF5EB',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="paw-button-primary"
          style={{ width: '100%', padding: '14px', fontSize: '1.05rem', marginTop: '0.5rem' }}
        >
          {submitting ? 'Submitting registration...' : 'Register NGO'}
        </button>
      </form>
    </div>
  );
}

export default NgoRegisterForm;
