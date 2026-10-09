import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PetCare.css";
import Header from "../components/Header";
import mainPageImage from "../images/yellow_dog3.png";
// Importing images
import vetImage from "../images/vet.png";
import petSalonImage from "../images/petsalon.png";
import foodProductsImage from "../images/catfood.png";
import dietGeneratorImage from "../images/petdiet.png";
import petTherapyImage from "../images/pettherapy.png";
import { useTranslation } from "react-i18next";

const PetCare: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const petCareOptions = [
    { name: t("petCare.vet"), path: "/vet", image: vetImage },
    { name: t("petCare.petSalon"), path: "/petsalon", image: petSalonImage },
    { name: t("petCare.foodProducts"), path: "/foodproducts", image: foodProductsImage },
    { name: t("petCare.dietGenerator"), path: "/dietgenerator", image: dietGeneratorImage },
    { name: t("petCare.petTherapy"), path: "/pettherapy", image: petTherapyImage },
  ];

  return (
    <div className="petcare-page">
      <Header bgColor="#ffffff" showCart={true} showHamburger={true} />
      <main>
        <section className="main-page">
          <img
            src={mainPageImage}
            alt="Main Page Banner"
            className="main-page-image"
          />
          <div className="overlay-content">
            <h1 className="main-text">{t("petCare.title")}</h1>
            <p>{t("petCare.description")}</p>
          </div>
        </section>
        <div className="pet-care-container">
          <h1 className="pet-care-title">{t("petCare.discoverServices")}</h1>
          <div className="pet-care-grid">
            {petCareOptions.map((option, index) => (
              <button
                key={index}
                className="pet-care-card"
                onClick={() => navigate(option.path)}
              >
                <div className="pet-care-image-container">
                  <img
                    src={option.image}
                    alt={option.name}
                    className="pet-care-image"
                  />
                  <div className="pet-care-text-overlay">{option.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PetCare;
