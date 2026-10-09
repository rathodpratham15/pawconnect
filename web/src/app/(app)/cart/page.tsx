'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { updateQuantity, removeFromCart, clearCart } from '../../../store/cartSlice';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart?.items || []);
  const [checkoutDone, setCheckoutDone] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    setCheckoutDone(true);
    dispatch(clearCart());
  };

  return (
    <main style={{ padding: '2.5rem 1rem 5rem', maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {/* Title */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'inline-block', backgroundColor: '#FAF0D6', color: '#2C1810', px: 1.5, py: 0.5, borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem', mb: 1 }}>
          🛒 Shopping Cart
        </Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#2C1810', margin: 0 }}>
          Your Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)
        </Typography>
      </Box>

      {cartItems.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8, px: 2, borderRadius: '24px', border: '1px solid #EFE4CF', boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛒</div>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#2C1810', mb: 1 }}>
            Your Cart is Currently Empty
          </Typography>
          <Typography variant="body1" sx={{ color: '#6E5D53', maxWidth: '440px', mx: 'auto', mb: 3 }}>
            Explore our curated selection of organic, vet-approved pet foods, wholesome treats, and supplements.
          </Typography>
          <Button
            component={Link}
            href="/products"
            variant="contained"
            color="primary"
            sx={{ fontWeight: 700, px: 3, py: 1.2, borderRadius: '12px' }}
          >
            Browse Food Products 🥫
          </Button>
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 340px' }, gap: 3, alignItems: 'start' }}>
          {/* Items list */}
          <Card sx={{ borderRadius: '20px', border: '1px solid #EFE4CF', p: 3, boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, borderBottom: '1px solid #F0E8D9' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2C1810' }}>
                Items Selected
              </Typography>
              <Button
                size="small"
                onClick={() => dispatch(clearCart())}
                sx={{ color: '#C62828', fontWeight: 600, textTransform: 'none' }}
              >
                Clear Cart
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 2.5 }}>
              {cartItems.map((item) => (
                <Box
                  key={item.product._id}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    pb: 2,
                    borderBottom: '1px solid #FAF5EB',
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#F5EBD7',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={
                        item.product.image ||
                        'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&auto=format&fit=crop&q=80'
                      }
                      alt={item.product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ color: '#8C7769', fontWeight: 700, textTransform: 'uppercase' }}>
                      {item.product.brand}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2C1810' }}>
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#8C5E3C', mt: 0.3 }}>
                      ${item.product.price.toFixed(2)} each
                    </Typography>
                  </Box>

                  {/* Quantity Stepper */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #E2D7C5',
                      borderRadius: '8px',
                      backgroundColor: '#FAF5EB',
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() =>
                        dispatch(updateQuantity({ productId: item.product._id, quantity: item.quantity - 1 }))
                      }
                      sx={{ p: 0.5, color: '#2C1810' }}
                    >
                      −
                    </IconButton>
                    <Typography variant="body2" sx={{ px: 1, fontWeight: 800 }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        dispatch(updateQuantity({ productId: item.product._id, quantity: item.quantity + 1 }))
                      }
                      sx={{ p: 0.5, color: '#2C1810' }}
                    >
                      +
                    </IconButton>
                  </Box>

                  {/* Line Total */}
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2C1810', minWidth: 64, textAlign: 'right' }}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </Typography>

                  {/* Remove */}
                  <IconButton
                    size="small"
                    onClick={() => dispatch(removeFromCart(item.product._id))}
                    sx={{ color: '#A8978A' }}
                  >
                    ✕
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Order Summary */}
          <Card sx={{ borderRadius: '20px', border: '1px solid #EFE4CF', p: 3, boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C1810', mb: 2 }}>
              Order Summary
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#6E5D53' }}>
                Subtotal
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#2C1810' }}>
                ${subtotal.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#6E5D53' }}>
                Estimated Sales Tax (8%)
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#2C1810' }}>
                ${tax.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#6E5D53' }}>
                Standard Shipping
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: shipping === 0 ? '#2E7D32' : '#2C1810' }}>
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </Typography>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2C1810' }}>
                Estimated Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C1810' }}>
                ${total.toFixed(2)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleCheckout}
              sx={{ fontWeight: 800, py: 1.5, borderRadius: '12px', fontSize: '1rem' }}
            >
              Simulate Checkout 🛒
            </Button>
          </Card>
        </Box>
      )}

      {/* Checkout Success Dialog */}
      <Dialog open={checkoutDone} onClose={() => setCheckoutDone(false)}>
        <DialogTitle sx={{ fontWeight: 800, color: '#2C1810', textAlign: 'center', pt: 3 }}>
          🎉 Order Placed Successfully!
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', margin: '0.5rem 0 1rem' }}>🐾</div>
          <Typography variant="body1" sx={{ color: '#6E5D53', lineHeight: 1.6 }}>
            Thank you for supporting nutritional health with PawConnect! Your order confirmation has been generated and details have been dispatched to your email.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={() => setCheckoutDone(false)}
            variant="contained"
            color="primary"
            sx={{ fontWeight: 700, px: 4, borderRadius: '10px' }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
