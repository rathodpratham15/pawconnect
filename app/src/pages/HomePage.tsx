import React, { useState } from "react";
import { useTranslation } from 'react-i18next';  // Import i18n for translations
import "../styles/HomePage.css";
import mainPageImage from "../images/sample2.png";
import donationImg from "../images/yellow_dog2.png";
import feedbackImg from "../images/pink_dog1.png";
import contactImg from "../images/yellow_dog4.png";
import Header from "../components/Header";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
    const { t } = useTranslation();  // Initialize translation hook
    const [currentIndex, setCurrentIndex] = useState(0);

    const faqs = [
        {
            question: t("homePage.faq1Question"),
            answer: t("homePage.faq1Answer"),
        },
        {
            question: t("homePage.faq2Question"),
            answer: t("homePage.faq2Answer"),
        },
        {
            question: t("homePage.faq3Question"),
            answer: t("homePage.faq3Answer"),
        },
        {
            question: t("homePage.faq4Question"),
            answer: t("homePage.faq4Answer"),
        },
        {
            question: t("homePage.faq5Question"),
            answer: t("homePage.faq5Answer"),
        },
        {
            question: t("homePage.faq6Question"),
            answer: t("homePage.faq6Answer"),
        },
    ];

    const ITEMS_PER_PAGE = 3;

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex + ITEMS_PER_PAGE) % faqs.length
        );
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex - ITEMS_PER_PAGE + faqs.length) % faqs.length
        );
    };

    const displayedFaqs = faqs.slice(
        currentIndex,
        currentIndex + ITEMS_PER_PAGE
    );

    return (
        <div className="home-page">
            <Header bgColor="#ffffff" showCart={true} showHamburger={true} />
            <main>
                <section className="main-page">
                    <img
                        src={mainPageImage}
                        alt="Main Page Banner"
                        className="main-page-image"
                    />
                    <div className="overlay-content">
                        <h1 className="main-text">{t("homePage.mainText")}</h1>
                        <p>{t("homePage.mainDescription")}</p>
                        <button className="main-button"><Link to="/petadopt" style={{color: '#ffffff', textDecoration: 'none'}}>{t("homePage.adoptButton")}</Link></button>
                    </div>
                </section>
                <section className="main-actions">
                    <div className="action-card action-card1"><Link to="/petadopt" style={{color: '#ffffff', textDecoration: 'none'}}>{t("homePage.adoptPet")}</Link></div>
                    <div className="action-card action-card2"><Link to="/ngo" style={{color: '#ffffff', textDecoration: 'none'}}>{t("homePage.searchNgo")}</Link></div>
                    <div className="action-card action-card3"><Link to="/petCare" style={{color: '#ffffff', textDecoration: 'none'}}>{t("homePage.petCare")}</Link></div>
                </section>

                <section className="donation-section">
                    <div className="donation-left">
                        <img
                            src={donationImg}
                            alt="Donation Image"
                            className="donation-image"
                        />
                    </div>
                    <div className="donation-right">
                        <h2>{t("homePage.donation")}</h2>
                        <p>{t("homePage.donationDescription")}</p>
                        <ul className="donation-points">
                            <li>{t("homePage.donationPoint1")}</li>
                            <li>{t("homePage.donationPoint2")}</li>
                            <li>{t("homePage.donationPoint3")}</li>
                        </ul>
                        <blockquote className="donation-quote">
                            {t("homePage.donationQuote")}
                        </blockquote>
                        {/* TODO: Need to change the navigation */}
                        <button className="donation-button"><Link to="/ngo-management" style={{color: '#ffffff', textDecoration: 'none'}}>{t("homePage.donateNow")}</Link></button>
                    </div>
                </section>

                <section className="faq-section">
                    <h2 className="faq-title">{t("homePage.faqTitle")}</h2>
                    <div className="faq-navigation">
                        <button onClick={handlePrev} className="nav-button">
                            {t("homePage.faqNavPrev")}
                        </button>
                        <div className="faq-container">
                            {displayedFaqs.map((faq, index) => (
                                <div key={index} className="faq-card">
                                    <h3 className="faq-question">
                                        {faq.question}
                                    </h3>
                                    <div className="faq-answer">
                                        {faq.answer}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleNext} className="nav-button">
                            {t("homePage.faqNavNext")}
                        </button>
                    </div>
                </section>

                <section className="feedback-section">
            <div className="feedback-left">
                <h2>{t("homePage.feedbackTitle")}</h2>
                <p>{t("homePage.feedbackDescription")}</p>
                <form className="feedback-form">
                    <div className="form-group">
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            placeholder={t("homePage.namePlaceholder")} 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder={t("homePage.emailPlaceholder")} 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            id="feedback"
                            name="feedback"
                            placeholder={t("homePage.feedbackPlaceholder")}
                            rows={4} 
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="feedback-button">{t("homePage.submitButton")}</button>
                </form>
            </div>
            <div className="feedback-right">
                <img
                    src={feedbackImg}
                    alt="Feedback Image"
                    className="feedback-image"
                />
            </div>
        </section>

                <footer className="contact-section">
                    <img
                        src={contactImg}
                        alt="Page footer"
                        className="contact-section-image"
                    />
                    <div className="footer-overlay-content">
                        <h1 className="footer-text">{t("homePage.contactUs")}</h1>
                        <div className="contact-details">
                            <p><strong>{t("homePage.address")}</strong></p>
                            <p><strong>{t("homePage.phone")}</strong></p>
                            <p><strong>{t("homePage.email")}</strong></p>
                            <p><strong>{t("homePage.workingHours")}</strong></p>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default HomePage;
