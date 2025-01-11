"use client";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import i18next from "@/i18n/i18n";

export default function LanguageSwitcher() {
  const { t } = useTranslation();

  const languages = [
    {
      code: "en",
      name: "English",
      flag: "/flags/en.png",
    },
    {
      code: "fr",
      name: "Français",
      flag: "/flags/fr.png",
    },
  ];

  const changeLanguage = (lng) => {
    i18next.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded ${
            i18next.language === lang.code ? "bg-gray-100" : ""
          }`}
        >
          <Image
            src={lang.flag}
            alt={lang.name}
            width={20}
            height={20}
            className="rounded-sm"
          />
          <span>{lang.name}</span>
        </button>
      ))}
    </div>
  );
}
