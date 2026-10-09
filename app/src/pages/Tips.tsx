import React, { useEffect } from "react";
import "../styles/Tips.css";
import Img1 from "../images/Img2.png";
import Img2 from "../images/Img3.png";
import Img3 from "../images/Img1.png";
import Img4 from "../images/Img4.png";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";

const EnhancedTipsPage: React.FC = () => {
  const { t } = useTranslation();

  // Add scroll animation on mount
  useEffect(() => {
    const elements = document.querySelectorAll(".tips-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
          }
        });
      },
      { threshold: 0.3 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header bgColor="transparent"/>
      <div className="enhanced-tips-page">
        <div className="hero-section">
          <h1>{t("enhancedTipsPage.title")}</h1>
          <p>{t("enhancedTipsPage.intro")}</p>
        </div>

        <section className="tips-section">
          <div className="tips-left">
            <img src={Img1} alt="Tips Image" className="tips-image" />
          </div>
          <div className="tips-right">
            <h2>{t("enhancedTipsPage.sections.hygiene.title")}</h2>
            <ul className="tips-points">
              {(t("enhancedTipsPage.sections.hygiene.points", { returnObjects: true }) as string[]).map((point: string, index: number) => (
                <li key={index}>&#8226; {point}</li>
              ))}
            </ul>
            <blockquote className="tips-quote">
              {t("enhancedTipsPage.sections.hygiene.quote")}
            </blockquote>
          </div>
        </section>

        <section className="tips-section">
          <div className="tips-left2">
            <h2>{t("enhancedTipsPage.sections.food.title")}</h2>
            <ul className="tips-points2">
              {(t("enhancedTipsPage.sections.food.points", { returnObjects: true }) as string[]).map((point: string, index: number) => (
                <li key={index}>&#8226; {point}</li>
              ))}
            </ul>
            <blockquote className="tips-quote">
              {t("enhancedTipsPage.sections.food.quote")}
            </blockquote>
          </div>
          <div className="tips-right2">
            <img src={Img2} alt="Tips Image" className="tips-image2" />
          </div>
        </section>

        <section className="tips-section">
          <div className="tips-left">
            <img src={Img3} alt="Tips Image" className="tips-image" />
          </div>
          <div className="tips-right">
            <h2>{t("enhancedTipsPage.sections.exercise.title")}</h2>
            <ul className="tips-points">
              {(t("enhancedTipsPage.sections.exercise.points", { returnObjects: true }) as string[]).map((point: string, index: number) => (
                <li key={index}>&#8226; {point}</li>
              ))}
            </ul>
            <blockquote className="tips-quote">
              {t("enhancedTipsPage.sections.exercise.quote")}
            </blockquote>
          </div>
        </section>

        <section className="tips-section">
          <div className="tips-left2">
            <h2>{t("enhancedTipsPage.sections.safety.title")}</h2>
            <ul className="tips-points2">
              {(t("enhancedTipsPage.sections.safety.points", { returnObjects: true }) as string[]).map((point: string, index: number) => (
                <li key={index}>&#8226; {point}</li>
              ))}
            </ul>
            <blockquote className="tips-quote">
              {t("enhancedTipsPage.sections.safety.quote")}
            </blockquote>
          </div>
          <div className="tips-right2">
            <img src={Img4} alt="Tips Image" className="tips-image2" />
          </div>
        </section>
      </div>
    </>
  );
};

export default EnhancedTipsPage;
