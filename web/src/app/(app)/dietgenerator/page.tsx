'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

interface DietPlan {
  dailyCalories: number;
  proteinGrams: number;
  fatGrams: number;
  fiberGrams: number;
  waterMl: number;
  mealsPerDay: number;
  recommendations: string[];
  sampleMeals: { time: string; item: string; portion: string }[];
}

export default function DietGeneratorPage() {
  const [petType, setPetType] = useState('Dog');
  const [breed, setBreed] = useState('Golden Retriever');
  const [weight, setWeight] = useState<number | ''>(24);
  const [age, setAge] = useState<number | ''>(4);
  const [activity, setActivity] = useState('Moderate');
  const [healthCondition, setHealthCondition] = useState('None');

  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);

  const calculateDietPlan = (e: React.FormEvent) => {
    e.preventDefault();

    const w = Number(weight) || 10;
    const a = Number(age) || 3;

    // Standard veterinary RER (Resting Energy Requirement) formula: 70 * (weight in kg ^ 0.75)
    const rer = 70 * Math.pow(w, 0.75);

    // Multiplier for species, life-stage and activity
    let multiplier = 1.6;
    if (petType === 'Dog') {
      if (a < 1) multiplier = 2.5; // Puppy
      else if (a > 8) multiplier = 1.2; // Senior
      else if (activity === 'High') multiplier = 1.9;
      else if (activity === 'Low') multiplier = 1.3;
    } else {
      // Cat
      if (a < 1) multiplier = 2.0; // Kitten
      else if (a > 10) multiplier = 1.1; // Senior
      else if (activity === 'High') multiplier = 1.4;
      else multiplier = 1.2;
    }

    // Health adjustments
    if (healthCondition === 'Weight Management') multiplier *= 0.85;
    if (healthCondition === 'Active Recovery') multiplier *= 1.15;

    const targetCalories = Math.round(rer * multiplier);

    // Macronutrients
    let proteinPct = petType === 'Cat' ? 0.35 : 0.28;
    let fatPct = 0.22;
    let carbPct = 1 - (proteinPct + fatPct);

    if (healthCondition === 'Sensitive Digestion') {
      proteinPct = 0.26;
      fatPct = 0.18;
    }

    const proteinGrams = Math.round((targetCalories * proteinPct) / 4);
    const fatGrams = Math.round((targetCalories * fatPct) / 9);
    const fiberGrams = Math.round((targetCalories * carbPct) / 4);
    const waterMl = Math.round(w * (petType === 'Cat' ? 50 : 60));
    const mealsPerDay = a < 1 ? 3 : 2;

    const recommendations: string[] = [];
    if (petType === 'Cat') {
      recommendations.push('Include wet food to maintain urinary tract hydration, as felines have a low intrinsic thirst drive.');
      recommendations.push('Ensure complete taurine and arachidonic acid supplementation, essential amino acids for cats.');
    } else {
      recommendations.push('Incorporate lean novel animal proteins (chicken breast, salmon, or turkey) with steamed pumpkins for digestion.');
      recommendations.push('Avoid table scraps, cooked poultry bones, and high-sodium gravies.');
    }

    if (healthCondition === 'Joint Health / Arthritis') {
      recommendations.push('Add Omega-3 fatty acids (EPA & DHA fish oil) and glucosamine to support joint cartilage.');
    }
    if (healthCondition === 'Weight Management') {
      recommendations.push('Replace high-calorie treats with fresh green beans or carrot sticks.');
    }

    const sampleMeals = [
      {
        time: 'Morning (07:30)',
        item: `Balanced ${petType} formulation with steamed pumpkin & bone broth`,
        portion: `${Math.round(targetCalories / mealsPerDay / 3.5)}g`,
      },
      {
        time: 'Evening (18:00)',
        item: `Whole animal protein recipe with Omega-3 oil & probiotics`,
        portion: `${Math.round(targetCalories / mealsPerDay / 3.5)}g`,
      },
    ];

    if (mealsPerDay === 3) {
      sampleMeals.splice(1, 0, {
        time: 'Midday (13:00)',
        item: 'Nutritional energy booster & digestible puree',
        portion: `${Math.round(targetCalories / mealsPerDay / 3.5)}g`,
      });
    }

    setDietPlan({
      dailyCalories: targetCalories,
      proteinGrams,
      fatGrams,
      fiberGrams,
      waterMl,
      mealsPerDay,
      recommendations,
      sampleMeals,
    });
  };

  return (
    <main style={{ padding: '2.5rem 1rem 5rem', maxWidth: '1180px', margin: '0 auto', width: '100%' }}>
      {/* Title */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'inline-block', backgroundColor: '#FAF0D6', color: '#2C1810', px: 1.5, py: 0.5, borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem', mb: 1 }}>
          🥣 Science-Based Nutrition Calculator
        </Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#2C1810', mb: 1 }}>
          Personalized Pet Diet Generator
        </Typography>
        <Typography variant="body1" sx={{ color: '#6E5D53', maxWidth: '640px', mx: 'auto' }}>
          Compute tailored caloric targets and macronutrient distributions based on your companion&apos;s physiology.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '420px 1fr' }, gap: 4, alignItems: 'start' }}>
        {/* Form */}
        <Card
          sx={{
            p: 3,
            borderRadius: '20px',
            border: '1px solid #EFE4CF',
            boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C1810', mb: 2.5 }}>
            Pet Physiological Profile
          </Typography>

          <Box component="form" onSubmit={calculateDietPlan} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="diet-type-label">Species *</InputLabel>
              <Select
                labelId="diet-type-label"
                value={petType}
                label="Species *"
                onChange={(e) => setPetType(e.target.value)}
              >
                <MenuItem value="Dog">Dog (Canine)</MenuItem>
                <MenuItem value="Cat">Cat (Feline)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Breed"
              required
              size="small"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="e.g. Labrador Retriever, Siamese"
              fullWidth
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Weight (kg) *"
                required
                type="number"
                size="small"
                slotProps={{ htmlInput: { step: '0.1', min: '0.5' } }}
                value={weight}
                onChange={(e) => setWeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
                fullWidth
              />

              <TextField
                label="Age (years) *"
                required
                type="number"
                size="small"
                slotProps={{ htmlInput: { step: '0.5', min: '0.1' } }}
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : parseFloat(e.target.value))}
                fullWidth
              />
            </Box>

            <FormControl fullWidth size="small">
              <InputLabel id="diet-activity-label">Activity Level</InputLabel>
              <Select
                labelId="diet-activity-label"
                value={activity}
                label="Activity Level"
                onChange={(e) => setActivity(e.target.value)}
              >
                <MenuItem value="Low">Low (Sedentary / Couch Potato)</MenuItem>
                <MenuItem value="Moderate">Moderate (Daily walks / Play)</MenuItem>
                <MenuItem value="High">High (Agility / Working dog)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel id="diet-health-label">Health Condition / Needs</InputLabel>
              <Select
                labelId="diet-health-label"
                value={healthCondition}
                label="Health Condition / Needs"
                onChange={(e) => setHealthCondition(e.target.value)}
              >
                <MenuItem value="None">None (Standard Wellness)</MenuItem>
                <MenuItem value="Weight Management">Weight Management (Weight Loss)</MenuItem>
                <MenuItem value="Joint Health / Arthritis">Joint Health / Arthritis Support</MenuItem>
                <MenuItem value="Sensitive Digestion">Sensitive Digestion / Allergies</MenuItem>
                <MenuItem value="Active Recovery">Active Recovery / Nursing</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ fontWeight: 800, py: 1.5, borderRadius: '12px', mt: 1 }}
            >
              Generate Meal Plan 🥣
            </Button>
          </Box>
        </Card>

        {/* Results Area */}
        <Box>
          {dietPlan ? (
            <Card
              sx={{
                p: { xs: 2.5, md: 3.5 },
                borderRadius: '24px',
                border: '1px solid #EFE4CF',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 6px 24px rgba(44, 24, 16, 0.06)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <div>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 800, color: '#2C1810' }}>
                    Custom Daily Diet Plan
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6E5D53' }}>
                    Formulated for a {age}-year-old {breed} ({weight} kg)
                  </Typography>
                </div>
                <Chip
                  label={`${dietPlan.dailyCalories} kcal / day`}
                  sx={{ backgroundColor: '#ECC067', color: '#2C1810', fontWeight: 800, fontSize: '1rem', py: 2 }}
                />
              </Box>

              <Divider sx={{ my: 2.5 }} />

              {/* Macro breakdown cards */}
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2C1810', textTransform: 'uppercase', mb: 1.5 }}>
                Daily Macronutrient Targets
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1.5, backgroundColor: '#FAF5EB', borderRadius: '14px', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#8C7769', fontWeight: 700, textTransform: 'uppercase' }}>
                    Crude Protein
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C1810' }}>
                    {dietPlan.proteinGrams} g
                  </Typography>
                </Box>

                <Box sx={{ p: 1.5, backgroundColor: '#FAF5EB', borderRadius: '14px', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#8C7769', fontWeight: 700, textTransform: 'uppercase' }}>
                    Healthy Fats
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C1810' }}>
                    {dietPlan.fatGrams} g
                  </Typography>
                </Box>

                <Box sx={{ p: 1.5, backgroundColor: '#FAF5EB', borderRadius: '14px', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#8C7769', fontWeight: 700, textTransform: 'uppercase' }}>
                    Fiber / Carbs
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C1810' }}>
                    {dietPlan.fiberGrams} g
                  </Typography>
                </Box>

                <Box sx={{ p: 1.5, backgroundColor: '#FAF5EB', borderRadius: '14px', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#8C7769', fontWeight: 700, textTransform: 'uppercase' }}>
                    Hydration
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C1810' }}>
                    {dietPlan.waterMl} ml
                  </Typography>
                </Box>
              </Box>

              {/* Sample meals schedule */}
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2C1810', textTransform: 'uppercase', mb: 1.5 }}>
                Recommended Meal Schedule ({dietPlan.mealsPerDay} meals daily)
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                {dietPlan.sampleMeals.map((meal, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      border: '1px solid #EFE4CF',
                      backgroundColor: '#FFFDF9',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#ECC067', backgroundColor: '#2C1810', px: 1, py: 0.2, borderRadius: '6px' }}>
                        {meal.time}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2C1810', mt: 0.5 }}>
                        {meal.item}
                      </Typography>
                    </div>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#8C5E3C' }}>
                      {meal.portion}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Veterinary recommendations */}
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2C1810', textTransform: 'uppercase', mb: 1 }}>
                Veterinary Nutrition Advice
              </Typography>
              <Box component="ul" sx={{ pl: 2.5, m: 0, color: '#5C483D', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {dietPlan.recommendations.map((rec, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>
                    {rec}
                  </li>
                ))}
              </Box>
            </Card>
          ) : (
            <Card
              sx={{
                p: 5,
                borderRadius: '24px',
                border: '2px dashed #E5D8C4',
                backgroundColor: 'transparent',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥣</div>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C1810', mb: 1 }}>
                Ready to Calculate Your Pet&apos;s Nutrition
              </Typography>
              <Typography variant="body2" sx={{ color: '#6E5D53', maxWidth: '440px', mx: 'auto' }}>
                Fill out the species, weight, age, and lifestyle parameters on the left to see an instant caloric target and meal schedule.
              </Typography>
            </Card>
          )}
        </Box>
      </Box>
    </main>
  );
}
