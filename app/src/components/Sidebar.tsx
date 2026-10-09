import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import the hook for translations
import { clearSession, getUser } from '../auth';
import '../styles/Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { t } = useTranslation(); // Initialize the translation hook
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearSession();
    toggleSidebar();
    navigate('/login', { replace: true });
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button
        className="close-sidebar"
        onClick={toggleSidebar}
        aria-label={t("sidebar.closeSidebar")}
      >
        &times;
      </button>
      <nav className="sidebar-nav">
        <ul>
          <li><Link to="/foodproducts">{t("sidebar.foodProducts")}</Link></li>
          <li><Link to="/dietgenerator">{t("sidebar.dietGenerator")}</Link></li>
          <li><Link to="/profile">{t("sidebar.profile")}</Link></li>
          <li><Link to="/geolocation">{t("sidebar.geolocation")}</Link></li>
          <li><Link to="/clipboard">{t("sidebar.clipboard")}</Link></li>
          <li><Link to="/network">{t("sidebar.network")}</Link></li>
          <li><Link to="/bluetooth">{t("sidebar.bluetooth")}</Link></li>
          {user?.role === 'ADMIN' && (
            <li><Link to="/admin">{t("sidebar.admin", "Admin")}</Link></li>
          )}
          <li><a href="/login" onClick={(e) => { e.preventDefault(); handleLogout(); }}>{t("sidebar.logout", "Logout")}</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
