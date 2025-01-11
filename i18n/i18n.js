import i18next from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      products: {
        title: "Our Products",
        filters: {
          title: "Filters",
          all: "All",
          price: "Price",
          category: "Category",
          inStock: "In Stock Only",
          priceRange: "Price Range",
          min: "Min",
          max: "Max",
          apply: "Apply",
          clear: "Clear Filters",
          categories: "Categories",
          mobile: {
            filters: "Filters",
            close: "Close",
          },
        },
        sort: {
          label: "Sort by",
          newest: "Newest",
          price_low: "Price: Low to High",
          price_high: "Price: High to Low",
          name_asc: "Name: A to Z",
          name_desc: "Name: Z to A",
        },
        search: {
          placeholder: "Search products...",
        },
        view: {
          grid: "Grid View",
          list: "List View",
        },
        pagination: {
          prev: "Previous",
          next: "Next",
          page: "Page {{page}} of {{total}}",
        },
      },
      common: {
        loading: "Loading...",
        error: "Something went wrong",
      },
    },
  },
  fr: {
    translation: {
      products: {
        title: "Nos Produits",
        filters: {
          title: "Filtres",
          all: "Tout",
          price: "Prix",
          category: "Catégorie",
          inStock: "En Stock Seulement",
          priceRange: "Fourchette de Prix",
          min: "Min",
          max: "Max",
          apply: "Appliquer",
          clear: "Effacer les Filtres",
          categories: "Catégories",
          mobile: {
            filters: "Filtres",
            close: "Fermer",
          },
        },
        sort: {
          label: "Trier par",
          newest: "Plus récent",
          price_low: "Prix: Croissant",
          price_high: "Prix: Décroissant",
          name_asc: "Nom: A à Z",
          name_desc: "Nom: Z à A",
        },
        search: {
          placeholder: "Rechercher des produits...",
        },
        view: {
          grid: "Vue en Grille",
          list: "Vue en Liste",
        },
        pagination: {
          prev: "Précédent",
          next: "Suivant",
          page: "Page {{page}} sur {{total}}",
        },
      },
      common: {
        loading: "Chargement...",
        error: "Une erreur s'est produite",
      },
    },
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18next;
