import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'ja', label: 'JP', flag: '🇯🇵' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('ja') ? 'ja' : 'en';

  return (
    <div className="relative flex items-center bg-white/15 backdrop-blur-xl rounded-full p-[3px] border border-white/30 shadow-sm">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-colors duration-300 cursor-pointer ${
            currentLang === lang.code
              ? 'text-white'
              : 'text-forest/60 hover:text-forest'
          }`}
        >
          <span className="text-sm leading-none">{lang.flag}</span>
          <span>{lang.label}</span>
        </button>
      ))}

      {/* Animated pill indicator */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        className="absolute top-[3px] bottom-[3px] rounded-full bg-sage-dark shadow-lg shadow-sage-dark/30"
        style={{
          width: `calc(50% - 3px)`,
          left: currentLang === 'en' ? '3px' : 'calc(50%)',
        }}
      />
    </div>
  );
}
