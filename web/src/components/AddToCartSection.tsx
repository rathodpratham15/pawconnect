'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { showToast } from '../store/uiSlice';
import { FoodProduct } from '../types';

interface AddToCartSectionProps {
  product: FoodProduct;
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const dispatch = useDispatch();

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    dispatch(showToast(`Added ${quantity}x ${product.name} to cart!`));
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontWeight: 700, color: '#2C1810', fontSize: '0.95rem' }}>Quantity:</span>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            border: '2px solid #EFE4CF',
            borderRadius: '12px',
            backgroundColor: '#FAF5EB',
          }}
        >
          <button
            type="button"
            onClick={handleDecrement}
            aria-label="Decrease quantity"
            style={{
              border: 'none',
              background: 'transparent',
              padding: '8px 16px',
              fontSize: '1.2rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: '#2C1810',
            }}
          >
            −
          </button>
          <span style={{ padding: '0 8px', fontWeight: 800, fontSize: '1.1rem', minWidth: '32px', textAlign: 'center' }}>
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            aria-label="Increase quantity"
            style={{
              border: 'none',
              background: 'transparent',
              padding: '8px 16px',
              fontSize: '1.2rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: '#2C1810',
            }}
          >
            +
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleAddToCart}
          className="paw-button-primary"
          style={{
            flex: 1,
            padding: '14px 24px',
            fontSize: '1.05rem',
            backgroundColor: added ? '#4E8A5E' : '#ECC067',
            color: added ? '#FFFFFF' : '#2C1810',
            transition: 'background-color 0.2s',
          }}
        >
          {added ? '✓ Added to Cart!' : `Add to Cart • $${(product.price * quantity).toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}

export default AddToCartSection;
