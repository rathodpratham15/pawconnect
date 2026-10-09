import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang); // This triggers the language change
  };

  return (
    <div>
      <button style={{paddingRight: '5px', paddingLeft: '10px'}} onClick={() => handleLanguageChange('en')}>{t('languageSwitcher.english')}</button>
      <button style={{paddingRight: '10px', paddingLeft: '5px'}} onClick={() => handleLanguageChange('fr')}>{t('languageSwitcher.french')}</button>
    </div>
  );
};

export default LanguageSwitcher;
