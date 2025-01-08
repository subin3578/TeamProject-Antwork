import { calendarLanguage } from "@/api/calendarAPI";
import { getUserByUid } from "@/api/userAPI";
import useAuthStore from "@/store/AuthStore";
import { useEffect, useState } from "react";

export default function CalendarSetting() {
  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보 가져오기
  const id = user?.id;
  const languages = [
    { label: "English", value: "en" },
    { label: "한국어 (Korean)", value: "ko" },
    { label: "日本語 (Japanese)", value: "ja" },
    { label: "Français (French)", value: "fr" },
    { label: "Español (Spanish)", value: "es" },
    { label: "Deutsch (German)", value: "de" },
    { label: "Italiano (Italian)", value: "it" },
    { label: "Português (Portuguese)", value: "pt" },
    { label: "Русский (Russian)", value: "ru" },
    { label: "中文 (Simplified Chinese)", value: "zh-cn" },
    { label: "中文 (Traditional Chinese)", value: "zh-tw" },
    { label: "العربية (Arabic)", value: "ar" },
    { label: "Nederlands (Dutch)", value: "nl" },
    { label: "Svenska (Swedish)", value: "sv" },
    { label: "Polski (Polish)", value: "pl" },
    { label: "Türkçe (Turkish)", value: "tr" },
    { label: "Tiếng Việt (Vietnamese)", value: "vi" },
    { label: "हिन्दी (Hindi)", value: "hi" },
  ];
  const [language, setLanguage] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserByUid(user?.uid);
      setLanguage(data.calendarLanguage);
    };
    fetchData();
  }, []);

  const handleChange = async (event) => {
    setLanguage(event.target.value);
    await calendarLanguage(id, event.target.value);
  };
  return (
    <article className="page-list w-[1100px] mx-auto">
      <div className="content-header">
        <h1>Calendar</h1>
        <p className="!mb-5">캘린더 설정 페이지 입니다.</p>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">calendar 언어 관리</h2>
          <div className="mb-6 flex gap-2">
            <select value={language} onChange={handleChange}>
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </section>
      </div>
    </article>
  );
}
