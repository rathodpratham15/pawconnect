import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/Header.css';
import Sidebar from './Sidebar'; // Import Sidebar component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import Font Awesome
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'; // Import specific icon
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useTranslation } from 'react-i18next'; // Import useTranslation for translation support

interface HeaderProps {
  showHamburger?: boolean;
  showCart?: boolean;
  bgColor?: string;
}

const Header: React.FC<HeaderProps> = ({ showHamburger = false, showCart = false, bgColor = '#ecc067' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { t } = useTranslation(); // Use the translation hook

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCartClick = () => {
    navigate('/cart'); // Navigate to the cart page
  };

  return (
    <>
      <header className="header" style={{ backgroundColor: bgColor }}>
        {showHamburger && (
          <button
            className="hamburger-menu"
            aria-label={t('header.menu')} // Use translation key for "Menu"
            onClick={toggleSidebar}
          >
            &#9776;
          </button>
        )}

        <div className="header-title">
          <span className="paw-icon">🐾</span>
          <h1>{t('header.title')}</h1> {/* Use translation key for "Paw Connect" */}
        </div>

        {showCart && (
          <button
            className="cart-button"
            aria-label={t('header.cart')} // Use translation key for "Cart"
            onClick={handleCartClick} // Handle click event
          >
            <FontAwesomeIcon icon={faShoppingCart} /> {/* Cart icon */}
          </button>
        )}
        <LanguageSwitcher />
      </header>

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Header;
