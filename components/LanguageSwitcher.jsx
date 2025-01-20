import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
export default function LanguageSwitcher() {
  const [locale, setLocale] = useState("");
  const router = useRouter();
  useEffect(() => {
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("MYNEXTAPP_LOCALE="))
      ?.split("=")[1];

    if (cookieLocale) {
      setLocale(cookieLocale);
    } else {
      const browserLocale = navigator.language.slice(0, 2);
      setLocale(browserLocale);
      document.cookie = `MYNEXTAPP_LOCALE=${browserLocale};`;
      router.refresh();
    }
  }, [router]);

  const handleLocaleChange = (locale) => {
    setLocale(locale);

    document.cookie = `MYNEXTAPP_LOCALE=${locale};`;
    router.refresh();
  };
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 px-3 h-[40px] rounded-full"
          >
            <Globe className="h-4 w-4" />

            <span className="text-sm">{locale === "fr" ? "FR" : "EN"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto bg-white">
          <DropdownMenuItem
            className={`cursor-pointer ${
              locale === "en" ? "bg-slate-100" : ""
            }`}
            onClick={() => handleLocaleChange("en")}
          >
            EN
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`cursor-pointer ${
              locale === "fr" ? "bg-slate-100" : ""
            }`}
            onClick={() => handleLocaleChange("fr")}
          >
            FR
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <Button
        variant={locale === "fr" ? "default" : "outline"}
        onClick={() => {
          handleLocaleChange("fr");
        }}
      >
        FR
      </Button>
      <Button
        variant={locale === "en" ? "default" : "outline"}
        onClick={() => {
          handleLocaleChange("en");
        }}
      >
        EN
      </Button> */}
    </div>
  );
}
