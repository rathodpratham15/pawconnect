import React, { useState } from "react";
import "../styles/DietGenerator.css";
import Header from "../components/Header";
import { useTranslation } from 'react-i18next';

interface DietPlan {
  foodType: string;
  feedingSchedule: string;
  allergies: string[];
  petName: string;
  petAge: number;
  petBreed: string;
  petSize: string;
  petGender: string;
  petWeight: number;
}

interface Step {
  label: string;
  key: keyof DietPlan;
  type: "text" | "number" | "button" | "multiselect";
  placeholder?: string;
  options?: { value: string; label: string }[];
}

const DietGenerator: React.FC = () => {
  const { t } = useTranslation(); // useTranslation hook
  const [formData, setFormData] = useState<DietPlan>({
    foodType: "Dry Food",
    feedingSchedule: "Twice a day",
    allergies: [],
    petName: "",
    petAge: 0,
    petBreed: "",
    petSize: "small",
    petGender: "male",
    petWeight: 0,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [dietPlanResponse, setDietPlanResponse] = useState<DietPlan | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const allergiesOptions = ["Gluten", "Dairy", "Chicken", "Corn", "Soy", "Beef", "Fish", "Lamb"];

  const steps: Step[] = [
    { label: t('dietGenerator.petName'), key: "petName", type: "text", placeholder: t('dietGenerator.enterPetName') },
    { label: t('dietGenerator.petGender'), key: "petGender", type: "button", options: [{ value: "male", label: t('dietGenerator.male') }, { value: "female", label: t('dietGenerator.female') }] },
    { label: t('dietGenerator.petAge'), key: "petAge", type: "number", placeholder: t('dietGenerator.enterPetAge') },
    { label: t('dietGenerator.petWeight'), key: "petWeight", type: "number", placeholder: t('dietGenerator.enterPetWeight') },
    { label: t('dietGenerator.petBreed'), key: "petBreed", type: "text", placeholder: t('dietGenerator.enterPetBreed') },
    {
      label: t('dietGenerator.petSize'),
      key: "petSize",
      type: "button",
      options: [
        { value: "small", label: t('dietGenerator.small') },
        { value: "medium", label: t('dietGenerator.medium') },
        { value: "large", label: t('dietGenerator.large') },
      ],
    },
    {
      label: t('dietGenerator.foodType'),
      key: "foodType",
      type: "button",
      options: [
        { value: "Dry Food", label: t('dietGenerator.dryFood') },
        { value: "Wet Food", label: t('dietGenerator.wetFood') },
        { value: "Raw Food", label: t('dietGenerator.rawFood') },
        { value: "Grain-Free Food", label: t('dietGenerator.grainFreeFood') },
      ],
    },
    {
      label: t('dietGenerator.allergies'),
      key: "allergies",
      type: "button", 
    },
    {
      label: t('dietGenerator.feedingSchedule'),
      key: "feedingSchedule",
      type: "text",
      placeholder: t('dietGenerator.feedingSchedulePlaceholder'),
    },
  ];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleButtonSelect = (key: keyof DietPlan, value: string) => {
    setFormData((prev) => {
      if (key === "allergies") {
        const newAllergies = prev.allergies.includes(value)
          ? prev.allergies.filter((allergy) => allergy !== value)
          : [...prev.allergies, value];
        return { ...prev, allergies: newAllergies };
      }
      return { ...prev, [key]: value };
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setDietPlanResponse({ ...formData });
    setIsSubmitted(true);
    setCurrentStep(steps.length); 
  };

  const generateTips = (): string[] => {
    const tips: string[] = [];
    tips.push(t('dietGenerator.waterTip'));
    if (formData.petSize === "small") {
      tips.push(t('dietGenerator.smallPetTip'));
    } else if (formData.petSize === "medium") {
      tips.push(t('dietGenerator.mediumPetTip'));
    } else if (formData.petSize === "large") {
      tips.push(t('dietGenerator.largePetTip'));
    }
    if (formData.allergies.includes("Gluten")) {
      tips.push(t('dietGenerator.glutenFreeTip'));
    }
    if (formData.allergies.includes("Chicken")) {
      tips.push(t('dietGenerator.chickenFreeTip'));
    }
    return tips;
  };

  const generateMealPlans = (): string[] => {
    const mealPlans: string[] = [];
    if (formData.foodType === "Dry Food") {
      mealPlans.push(t('dietGenerator.dryFoodMeal1'));
      mealPlans.push(t('dietGenerator.dryFoodMeal2'));
    } else if (formData.foodType === "Wet Food") {
      mealPlans.push(t('dietGenerator.wetFoodMeal1'));
      mealPlans.push(t('dietGenerator.wetFoodMeal2'));
    } else if (formData.foodType === "Raw Food") {
      mealPlans.push(t('dietGenerator.rawFoodMeal1'));
      mealPlans.push(t('dietGenerator.rawFoodMeal2'));
    } else if (formData.foodType === "Grain-Free Food") {
      mealPlans.push(t('dietGenerator.grainFreeFoodMeal1'));
      mealPlans.push(t('dietGenerator.grainFreeFoodMeal2'));
    }
    return mealPlans;
  };

  const calculateProteinIntake = (): string => {
    let proteinRequirement = 0;
    if (formData.petSize === "small") {
      proteinRequirement = formData.petWeight * 2.5; 
    } else if (formData.petSize === "medium") {
      proteinRequirement = formData.petWeight * 3;
    } else if (formData.petSize === "large") {
      proteinRequirement = formData.petWeight * 3.5;
    }
    return `${t('dietGenerator.proteinIntake')}: ${proteinRequirement} ${t('dietGenerator.gramsPerDay')}`;
  };

  const currentField = steps[currentStep];

  return (
    <>
      <Header showCart showHamburger />
      <div className="diet-generator-container">
        <h2 className="title">{t('dietGenerator.title')}</h2>
        <form onSubmit={handleSubmit} className="diet-form">
          {currentStep < steps.length && !isSubmitted && (
            <div className="form-step">
              <label htmlFor={currentField.key}>{currentField.label}</label>

              {currentField.type === "text" || currentField.type === "number" ? (
                <input
                  type={currentField.type}
                  id={currentField.key}
                  name={currentField.key}
                  placeholder={currentField.placeholder}
                  value={formData[currentField.key] || ""}
                  onChange={handleChange}
                  required
                />
              ) : currentField.type === "button" ? (
                <div className="button-options">
                  {currentField.key === "allergies" ? (
                    allergiesOptions.map((allergy) => (
                      <button
                        key={allergy}
                        type="button"
                        className={formData.allergies.includes(allergy) ? "selected" : ""}
                        onClick={() => handleButtonSelect("allergies", allergy)}
                      >
                        {allergy}
                      </button>
                    ))
                  ) : (
                    currentField.options?.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={formData[currentField.key] === option.value ? "selected" : ""}
                        onClick={() => handleButtonSelect(currentField.key, option.value)}
                      >
                        {option.label}
                      </button>
                    ))
                  )}
                </div>
              ) : null}
            </div>
          )}

          <div className="form-navigation">
            {currentStep > 0 && !isSubmitted && <button type="button" onClick={handleBack}>{t('dietGenerator.back')}</button>}
            {currentStep < steps.length - 1 && !isSubmitted ? (
              <button type="button" onClick={handleNext}>{t('dietGenerator.next')}</button>
            ) : !isSubmitted ? (
              <button type="submit">{t('dietGenerator.submit')}</button>
            ) : null}
          </div>
        </form>

        {isSubmitted && dietPlanResponse && currentStep === steps.length && (
          <div className="diet-plan-card">
            <h3>{t('dietGenerator.generatedPlan')} {dietPlanResponse.petName}</h3>
            <div className="diet-plan-details">
              <p><strong>{t('dietGenerator.petName')}:</strong> {dietPlanResponse.petName}</p>
              <p><strong>{t('dietGenerator.gender')}:</strong> {dietPlanResponse.petGender}</p>
              <p><strong>{t('dietGenerator.age')}:</strong> {dietPlanResponse.petAge} {t('dietGenerator.years')}</p>
              <p><strong>{t('dietGenerator.weight')}:</strong> {dietPlanResponse.petWeight} kg</p>
              <p><strong>{t('dietGenerator.breed')}:</strong> {dietPlanResponse.petBreed}</p>
              <p><strong>{t('dietGenerator.size')}:</strong> {dietPlanResponse.petSize}</p>
              <p><strong>{t('dietGenerator.foodType')}:</strong> {dietPlanResponse.foodType}</p>
              <p><strong>{t('dietGenerator.feedingSchedule')}:</strong> {dietPlanResponse.feedingSchedule}</p>
              <p><strong>{t('dietGenerator.allergies')}:</strong> {dietPlanResponse.allergies.join(", ") || t('dietGenerator.none')}</p>
            </div>

            <div className="diet-tips">
              <h3>{t('dietGenerator.dietTips')}</h3>
              <ul>
                {generateTips().map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="meal-plans">
              <h3>{t('dietGenerator.mealPlans')}</h3>
              <ul>
                {generateMealPlans().map((mealPlan, index) => (
                  <li key={index}>{mealPlan}</li>
                ))}
              </ul>
            </div>

            <div className="protein-intake">
              <h3>{calculateProteinIntake()}</h3>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DietGenerator;
