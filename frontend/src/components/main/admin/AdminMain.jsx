import { Line, Doughnut, Bar, Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  BubbleController,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import useAuthStore from "@/store/AuthStore";
import { useEffect, useState } from "react";
import { selectCompany } from "@/api/companyAPI";
import { findVacationUser, getAllUserCompany } from "@/api/userAPI";
import { selectVersion } from "@/api/versionAPI";

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  BubbleController,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function AdminMain() {
  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보 가져오기
  const [path, setPath] = useState();
  const [company, setCompany] = useState();
  const [allUser, setAllUser] = useState();
  const [active, setActive] = useState();
  const [version, setVersion] = useState();
  const [start, setStart] = useState();
  const [expired, setExpired] = useState();
  const [deleted, setDeleted] = useState();
  const [trip, setTrip] = useState();
  const [full, setFull] = useState();
  const [half, setHalf] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const response = await selectCompany(user?.company);
      setCompany(response);
      const date = response.createdAt;
      const formattedDate = `${date[0]}-${String(date[1]).padStart(
        2,
        "0"
      )}-${String(date[2]).padStart(2, "0")}`;

      setStart(formattedDate); // 출력: 2024-12-02
      const response2 = await getAllUserCompany(user?.company);
      const countInactive = response2.filter(
        (item) => item.status === "ACTIVE"
      ).length;
      const countInExpired = response2.filter(
        (item) => item.status === "EXPIRED"
      ).length;
      const countInDeleted = response2.filter(
        (item) => item.status === "DELETED"
      ).length;
      setActive(countInactive);
      setAllUser(response2.length);
      setExpired(countInExpired);
      setDeleted(countInDeleted);
      const response3 = await selectVersion();
      setVersion(response3.version);
      const response4 = await findVacationUser();
      setTrip(response4[0]);
      setFull(response4[1]);
      setHalf(response4[2]);
    };
    const currentUrl = window.location.href;
    const basePath = currentUrl.substring(
      0,
      currentUrl.indexOf("antwork") + "antwork".length
    );
    setPath(basePath);
    fetchData();
  }, []);

  const targetDate = new Date(start);
  const today = new Date();

  const diffInMillis = today - targetDate;

  // 밀리초를 일 수로 변환 (1일 = 24시간 * 60분 * 60초 * 1000밀리초)
  const diffInDays = Math.floor(diffInMillis / (1000 * 60 * 60 * 24));

  // 도넛 차트 데이터
  const doughnutData = {
    labels: ["활성 사용자", "비활성 사용자", "만료된 사용자"],
    datasets: [
      {
        label: "사용자 상태",
        data: [active, deleted, expired],
        backgroundColor: [
          "rgb(54, 162, 235)",
          "rgb(255, 99, 132)",
          "rgb(105, 224, 185)",
        ],
        hoverBackgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(105, 224, 185, 0.8)",
        ],
      },
    ],
  };

  // 막대 차트 데이터
  const barData = {
    labels: ["사용자 상태"], // x축에 공통으로 표시될 값
    datasets: [
      {
        label: "출장", // 범례에 표시될 이름
        data: [trip], // 해당 데이터 값
        backgroundColor: "rgb(54, 162, 235)", // 출장 색상
        hoverBackgroundColor: "rgba(54, 162, 235, 0.8)",
      },
      {
        label: "연차", // 범례에 표시될 이름
        data: [full], // 해당 데이터 값
        backgroundColor: "rgb(255, 99, 132)", // 연차 색상
        hoverBackgroundColor: "rgba(255, 99, 132, 0.8)",
      },
      {
        label: "반차", // 범례에 표시될 이름
        data: [half], // 해당 데이터 값
        backgroundColor: "rgb(105, 224, 185)", // 반차 색상
        hoverBackgroundColor: "rgba(105, 224, 185, 0.8)",
      },
    ],
  };

  return (
    <section className="p-6 space-y-6 bg-gray-100 rounded-lg shadow-lg">
      {/* 헤더 */}
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">관리자 대시보드</h1>
        <div className="flex items-center space-x-4">
          <p className="text-gray-600">관리자님 환영합니다</p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            로그아웃
          </button>
        </div>
      </header>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-green-800 mb-2">
            총 사용자 수
          </h2>
          <p className={`text-4xl font-bold mt-2`}>{allUser}명</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            활동 회원 수
          </h2>
          <p className={`text-4xl font-bold mt-2`}>{active}명</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-red-800 mb-2">AntWork를</h2>
          <p className={`text-3xl font-bold mt-2`}>
            {Math.abs(diffInDays)}
            일동안 사용하고 계십니다.
          </p>
        </div>
      </div>

      <article className="flex gap-10 bg-white rounded-xl shadow-lg justify-center">
        {/* 첫 번째 테이블 */}
        <div className="w-[435px] h-auto p-5">
          <table className="w-full text-left">
            <tbody>
              <tr>
                <td className="px-4 py-2 font-bold text-[20px]">사이트명</td>
                <td className="px-4 py-2 text-[15px]">AntWork</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-[20px]">회사명</td>
                <td className="px-4 py-2 text-[15px]">{company?.name}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-[20px]">URL</td>
                <td className="px-4 py-2 text-[15px]">{path}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 두 번째 테이블 */}
        <div className="w-[435px] h-auto p-5">
          <table className="w-full text-left">
            <tbody>
              <tr>
                <td className="px-4 py-2 font-bold text-[20px]">관리자</td>
                <td className="px-4 py-2 text-[15px]">{user?.name}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-[20px]">시작일자</td>
                <td className="px-4 py-2 text-[15px]">{start}</td>
              </tr>

              <tr>
                <td className="px-4 py-2 font-bold text-[20px]">현재 버전</td>
                <td className="px-4 py-2 text-[15px]">
                  {version} /{" "}
                  {company?.rate === 0
                    ? "무료버전"
                    : company?.rate === 1
                    ? "유료버전"
                    : "알 수 없음"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      {/* 차트와 기타 섹션 */}
      <div className="grid grid-cols-2 gap-6">
        {/* 도넛 차트 */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">사용자 상태</h3>
          <Doughnut data={doughnutData} />
        </div>
        {/* 프로젝트 상태 (막대 차트) */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">휴가 상태</h3>
          <Bar className="mt-[120px]" data={barData} />
        </div>
      </div>
    </section>
  );
}
