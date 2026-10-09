'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../../api';
import { FoodProduct } from '../../../types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';

export default function FoodProductsAppPage() {
  const [products, setProducts] = useState<FoodProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('NAME');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/foodProduct');
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch food products:', err);
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'NAME') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'PRICE_LOW') {
      return a.price - b.price;
    }
    if (sortBy === 'PRICE_HIGH') {
      return b.price - a.price;
    }
    if (sortBy === 'BEST_SELLERS') {
      return (b.sold || 0) - (a.sold || 0);
    }
    return 0;
  });

  return (
    <main style={{ padding: '2.5rem 1rem 5rem', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'inline-block', backgroundColor: '#FAF0D6', color: '#2C1810', px: 1.5, py: 0.5, borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem', mb: 1 }}>
            🥫 Premium Pet Nutrition
          </Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#2C1810', margin: 0 }}>
            Food Products & Nutrition
          </Typography>
          <Typography variant="body1" sx={{ color: '#6E5D53', mt: 0.5 }}>
            Veterinary-approved formulas and healthy organic treats.
          </Typography>
        </Box>

        {/* Sort Select */}
        <FormControl sx={{ minWidth: 220 }} size="small">
          <InputLabel id="sort-select-label">Sort Products By</InputLabel>
          <Select
            labelId="sort-select-label"
            value={sortBy}
            label="Sort Products By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="NAME">Product Name</MenuItem>
            <MenuItem value="PRICE_LOW">Price: Low → High</MenuItem>
            <MenuItem value="PRICE_HIGH">Price: High → Low</MenuItem>
            <MenuItem value="BEST_SELLERS">Best Sellers</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#ECC067' }} />
        </Box>
      ) : sortedProducts.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6, px: 2, borderRadius: '20px', border: '1px solid #EFE4CF' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#2C1810', mb: 1 }}>
            No products available
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5D53' }}>
            Our nutritionist catalog is updating. Check back soon!
          </Typography>
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
          {sortedProducts.map((prod) => {
            const photo =
              prod.image ||
              'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80';

            return (
              <Link
                key={prod._id}
                href={`/products/${prod._id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Card
                  sx={{
                    borderRadius: '18px',
                    border: '1px solid #EFE4CF',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 24px rgba(44, 24, 16, 0.08)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', height: 200, backgroundColor: '#F5EBD7' }}>
                    <img
                      src={photo}
                      alt={prod.name}
                      loading="lazy"
                      width={300}
                      height={200}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <Chip
                      label={`$${prod.price.toFixed(2)}`}
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        backgroundColor: '#ECC067',
                        color: '#2C1810',
                        fontWeight: 800,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      }}
                    />
                  </Box>

                  <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="caption" sx={{ color: '#8C7769', fontWeight: 700, textTransform: 'uppercase' }}>
                      {prod.brand}
                    </Typography>
                    <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 800, color: '#2C1810', mt: 0.5, mb: 1 }}>
                      {prod.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6E5D53', fontSize: '0.85rem', lineHeight: 1.4, mb: 1.5, flex: 1 }}>
                      {prod.description || prod.nutritionDetails}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #F5EBD7' }}>
                      <Typography variant="caption" sx={{ color: '#8C5E3C', fontWeight: 700 }}>
                        View Nutrition Details →
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Link>
            );
          })}
        </Box>
      )}
    </main>
  );
}
