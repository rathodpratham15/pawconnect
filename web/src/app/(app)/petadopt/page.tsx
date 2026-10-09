'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../../api';
import { Pet } from '../../../types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Slider from '@mui/material/Slider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

export default function PetAdoptPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [dogBreeds, setDogBreeds] = useState<string[]>([]);
  const [catBreeds, setCatBreeds] = useState<string[]>([]);

  // Filter states
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [breedFilter, setBreedFilter] = useState('ALL');
  const [sizeFilter, setSizeFilter] = useState('ALL');
  const [maxAgeFilter, setMaxAgeFilter] = useState<number>(20);

  // Adopt Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info'>('success');

  // Add Pet Dialog State
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [formType, setFormType] = useState('Dog');
  const [formBreed, setFormBreed] = useState('');
  const [formAge, setFormAge] = useState<number | ''>('');
  const [formSize, setFormSize] = useState('Medium');
  const [formDisability, setFormDisability] = useState(false);
  const [formHealthConcerns, setFormHealthConcerns] = useState('');
  const [formShelter, setFormShelter] = useState('');
  const [formName, setFormName] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [submittingPet, setSubmittingPet] = useState(false);
  const [addPetError, setAddPetError] = useState('');

  // Fetch initial pets and breeds
  useEffect(() => {
    fetchPets();
    fetchBreeds();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/pets');
      if (Array.isArray(res.data)) {
        setPets(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch pets:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBreeds = async () => {
    try {
      const [dogRes, catRes] = await Promise.allSettled([
        api.get('/breeds/dog'),
        api.get('/breeds/cat'),
      ]);
      if (dogRes.status === 'fulfilled' && Array.isArray(dogRes.value.data)) {
        setDogBreeds(dogRes.value.data);
      }
      if (catRes.status === 'fulfilled' && Array.isArray(catRes.value.data)) {
        setCatBreeds(catRes.value.data);
      }
    } catch (err) {
      console.warn('Could not load breeds dynamically:', err);
    }
  };

  const availableBreedsForFilter =
    typeFilter === 'Dog'
      ? dogBreeds
      : typeFilter === 'Cat'
      ? catBreeds
      : Array.from(new Set([...dogBreeds, ...catBreeds]));

  const availableBreedsForForm = formType === 'Dog' ? dogBreeds : catBreeds;

  // Filtered pet list
  const filteredPets = pets.filter((pet) => {
    if (typeFilter !== 'ALL' && pet.type?.toLowerCase() !== typeFilter.toLowerCase()) {
      return false;
    }
    if (breedFilter !== 'ALL' && pet.breed?.toLowerCase() !== breedFilter.toLowerCase()) {
      return false;
    }
    if (sizeFilter !== 'ALL' && pet.size?.toLowerCase() !== sizeFilter.toLowerCase()) {
      return false;
    }
    if (pet.age > maxAgeFilter) {
      return false;
    }
    return true;
  });

  const handleAdoptClick = async (pet: Pet) => {
    const petName = pet.name || 'this pet';
    try {
      await api.post(`/pets/${pet._id}/adopt`, {});
      setToastSeverity('success');
      setToastMessage(`Adoption request for ${petName} saved. You can follow its status under "My adoption requests". 🐾`);
    } catch (err: any) {
      // 409 = this user already has a pending request for the pet
      setToastSeverity(err.response?.status === 409 ? 'info' : 'error');
      setToastMessage(err.response?.data?.message || 'Could not send your adoption request. Please try again.');
    }
  };

  const handleAddPetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddPetError('');

    if (formAge === '' || Number(formAge) < 0) {
      setAddPetError('Please enter a valid age.');
      return;
    }
    if (!formBreed) {
      setAddPetError('Please select or specify a breed.');
      return;
    }
    if (!formShelter.trim()) {
      setAddPetError('Shelter location is required.');
      return;
    }

    setSubmittingPet(true);

    try {
      const healthArray = formHealthConcerns
        ? formHealthConcerns.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      // Check fallback photo preview if image is not provided
      let finalImageUrl = formImageUrl.trim();
      if (!finalImageUrl) {
        try {
          const typeEndpoint = formType.toLowerCase() === 'cat' ? 'cat' : 'dog';
          const imgRes = await api.get(`/breeds/${typeEndpoint}/image?breed=${encodeURIComponent(formBreed)}`);
          if (imgRes.data?.imageUrl) {
            finalImageUrl = imgRes.data.imageUrl;
          }
        } catch {
          // ignore
        }
      }

      const res = await api.post('/pets', {
        name: formName.trim() || undefined,
        type: formType,
        breed: formBreed,
        age: Number(formAge),
        size: formSize,
        disabilityStatus: formDisability,
        healthConcerns: healthArray,
        shelterLocation: formShelter.trim(),
        imageUrl: finalImageUrl || undefined,
      });

      if (res.data) {
        setPets((prev) => [res.data, ...prev]);
        setToastMessage(`Added ${res.data.name || 'new pet'} successfully!`);
        setOpenAddDialog(false);
        // Reset form
        setFormName('');
        setFormBreed('');
        setFormAge('');
        setFormHealthConcerns('');
        setFormShelter('');
        setFormImageUrl('');
        setFormDisability(false);
      }
    } catch (err: any) {
      setAddPetError(err.response?.data?.message || err.message || 'Failed to add pet listing.');
    } finally {
      setSubmittingPet(false);
    }
  };

  return (
    <main style={{ padding: '2.5rem 1rem 5rem', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
      {/* Title & Action Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, marginBottom: 3 }}>
        <Box>
          <Box sx={{ display: 'inline-block', backgroundColor: '#FAF0D6', color: '#2C1810', px: 1.5, py: 0.5, borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem', mb: 1 }}>
            🐾 Verified Adoption Portal
          </Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#2C1810', margin: 0 }}>
            Pet Adoption
          </Typography>
          <Typography variant="body1" sx={{ color: '#6E5D53', marginTop: 0.5 }}>
            Filter by species, breed, and age to find your companion.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddDialog(true)}
          sx={{ fontWeight: 700, borderRadius: '14px', px: 3, py: 1.2 }}
        >
          ➕ Add New Pet
        </Button>
      </Box>

      {/* Filter Bar */}
      <Card
        sx={{
          borderRadius: '20px',
          border: '1px solid #EFE4CF',
          backgroundColor: '#FFFFFF',
          padding: '1.75rem',
          marginBottom: '2.5rem',
          boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2C1810', textTransform: 'uppercase', marginBottom: 2 }}>
          Filter Available Rescues
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2.5, alignItems: 'center' }}>
          {/* Type Filter */}
          <FormControl fullWidth size="small">
            <InputLabel id="type-filter-label">Species / Type</InputLabel>
            <Select
              labelId="type-filter-label"
              value={typeFilter}
              label="Species / Type"
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setBreedFilter('ALL');
              }}
            >
              <MenuItem value="ALL">All Types</MenuItem>
              <MenuItem value="Dog">Dog</MenuItem>
              <MenuItem value="Cat">Cat</MenuItem>
            </Select>
          </FormControl>

          {/* Breed Filter */}
          <FormControl fullWidth size="small">
            <InputLabel id="breed-filter-label">Breed</InputLabel>
            <Select
              labelId="breed-filter-label"
              value={breedFilter}
              label="Breed"
              onChange={(e) => setBreedFilter(e.target.value)}
            >
              <MenuItem value="ALL">All Breeds</MenuItem>
              {availableBreedsForFilter.map((breed) => (
                <MenuItem key={breed} value={breed}>
                  {breed}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Size Filter */}
          <FormControl fullWidth size="small">
            <InputLabel id="size-filter-label">Size</InputLabel>
            <Select
              labelId="size-filter-label"
              value={sizeFilter}
              label="Size"
              onChange={(e) => setSizeFilter(e.target.value)}
            >
              <MenuItem value="ALL">All Sizes</MenuItem>
              <MenuItem value="Small">Small</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Large">Large</MenuItem>
            </Select>
          </FormControl>

          {/* Max Age Slider */}
          <Box sx={{ px: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#6E5D53', display: 'block', mb: 0.5 }}>
              Max Age: {maxAgeFilter} years
            </Typography>
            <Slider
              value={maxAgeFilter}
              min={1}
              max={20}
              step={1}
              onChange={(_, val) => setMaxAgeFilter(val as number)}
              sx={{ color: '#ECC067' }}
            />
          </Box>
        </Box>
      </Card>

      {/* Pet Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#ECC067' }} />
        </Box>
      ) : filteredPets.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6, px: 2, borderRadius: '20px', border: '1px solid #EFE4CF' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#2C1810', mb: 1 }}>
            No pets found matching your filters
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5D53', mb: 3 }}>
            Try resetting your filters or check back as shelters update their rescues.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setTypeFilter('ALL');
              setBreedFilter('ALL');
              setSizeFilter('ALL');
              setMaxAgeFilter(20);
            }}
            sx={{ borderColor: '#ECC067', color: '#2C1810' }}
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {filteredPets.map((pet) => {
            const photo =
              pet.imageUrl ||
              (pet.type?.toLowerCase() === 'cat'
                ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80');

            return (
              <Card
                key={pet._id}
                sx={{
                  borderRadius: '20px',
                  border: '1px solid #EFE4CF',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)',
                }}
              >
                <Box sx={{ position: 'relative', height: 220, backgroundColor: '#F0E8D9' }}>
                  <img
                    src={photo}
                    alt={`Photo of ${pet.name || 'Pet'}`}
                    loading="lazy"
                    width={400}
                    height={220}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {pet.disabilityStatus && (
                    <Chip
                      label="Special Needs"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        backgroundColor: '#D9534F',
                        color: '#FFFFFF',
                        fontWeight: 700,
                      }}
                    />
                  )}
                  <Chip
                    label={pet.type}
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      right: 10,
                      backgroundColor: 'rgba(44, 24, 16, 0.75)',
                      color: '#FFFFFF',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 800, color: '#2C1810', mb: 0.5 }}>
                    {pet.name || 'Unnamed Sweetheart'}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', mb: 1.5 }}>
                    <Chip label={pet.breed} size="small" sx={{ backgroundColor: '#FAF5EB', color: '#4E3E34', fontWeight: 600 }} />
                    <Chip label={`${pet.age} ${pet.age === 1 ? 'yr' : 'yrs'}`} size="small" sx={{ backgroundColor: '#FAF5EB', color: '#4E3E34', fontWeight: 600 }} />
                    <Chip label={pet.size} size="small" sx={{ backgroundColor: '#FAF5EB', color: '#4E3E34', fontWeight: 600 }} />
                  </Box>

                  <Typography variant="body2" sx={{ color: '#8C7769', mb: 1 }}>
                    📍 <strong>Shelter:</strong> {pet.shelterLocation}
                  </Typography>

                  {pet.healthConcerns && pet.healthConcerns.length > 0 && (
                    <Typography variant="caption" sx={{ color: '#968174', mb: 2, display: 'block' }}>
                      <strong>Health:</strong> {pet.healthConcerns.join(', ')}
                    </Typography>
                  )}

                  <Box sx={{ mt: 'auto', display: 'flex', gap: 1, pt: 1.5 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => handleAdoptClick(pet)}
                      sx={{ fontWeight: 700, borderRadius: '12px' }}
                    >
                      Adopt Me 🐾
                    </Button>
                    <Button
                      component={Link}
                      href={`/pets/${pet._id}`}
                      variant="outlined"
                      sx={{ borderColor: '#EFE4CF', color: '#2C1810', borderRadius: '12px' }}
                    >
                      Details
                    </Button>
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Add Pet Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#2C1810', pb: 1 }}>
          🐾 List a New Pet for Adoption
        </DialogTitle>
        <DialogContent dividers>
          {addPetError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {addPetError}
            </Alert>
          )}

          <Box component="form" id="add-pet-form" onSubmit={handleAddPetSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Pet Name (optional)"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Bella"
              fullWidth
              size="small"
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl size="small" fullWidth>
                <InputLabel id="form-type-label">Species *</InputLabel>
                <Select
                  labelId="form-type-label"
                  value={formType}
                  label="Species *"
                  onChange={(e) => {
                    setFormType(e.target.value);
                    setFormBreed('');
                  }}
                >
                  <MenuItem value="Dog">Dog</MenuItem>
                  <MenuItem value="Cat">Cat</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel id="form-breed-label">Breed *</InputLabel>
                <Select
                  labelId="form-breed-label"
                  value={formBreed}
                  label="Breed *"
                  onChange={(e) => setFormBreed(e.target.value)}
                >
                  {availableBreedsForForm.map((breed) => (
                    <MenuItem key={breed} value={breed}>
                      {breed}
                    </MenuItem>
                  ))}
                  <MenuItem value="Mixed Breed">Mixed Breed</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Age (in years) *"
                type="number"
                value={formAge}
                onChange={(e) => setFormAge(e.target.value === '' ? '' : Number(e.target.value))}
                fullWidth
                size="small"
                required
              />

              <FormControl size="small" fullWidth>
                <InputLabel id="form-size-label">Size *</InputLabel>
                <Select
                  labelId="form-size-label"
                  value={formSize}
                  label="Size *"
                  onChange={(e) => setFormSize(e.target.value)}
                >
                  <MenuItem value="Small">Small</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Large">Large</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Shelter Location *"
              required
              value={formShelter}
              onChange={(e) => setFormShelter(e.target.value)}
              placeholder="e.g. North Bay Animal Rescue, San Francisco"
              fullWidth
              size="small"
            />

            <TextField
              label="Health Concerns (comma separated)"
              value={formHealthConcerns}
              onChange={(e) => setFormHealthConcerns(e.target.value)}
              placeholder="e.g. Mild hip dysplasia, Vaccinated, Neutered"
              fullWidth
              size="small"
            />

            <TextField
              label="Photo URL (optional - will auto-fallback to breed image)"
              value={formImageUrl}
              onChange={(e) => setFormImageUrl(e.target.value)}
              placeholder="https://..."
              fullWidth
              size="small"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formDisability}
                  onChange={(e) => setFormDisability(e.target.checked)}
                  color="primary"
                />
              }
              label="Special Care or Disability Accommodations Required"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenAddDialog(false)} sx={{ color: '#6E5D53' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-pet-form"
            variant="contained"
            color="primary"
            disabled={submittingPet}
            sx={{ fontWeight: 700, borderRadius: '10px' }}
          >
            {submittingPet ? 'Saving...' : 'Add Pet Listing'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Snackbar */}
      <Snackbar
        open={!!toastMessage}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setToastMessage(null)} severity={toastSeverity} sx={{ width: '100%', fontWeight: 700 }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </main>
  );
}
