import { selectCompany } from "@/api/companyAPI";
import { findVacationUser, getAllUserCompany } from "@/api/userAPI";
import { selectVersion } from "@/api/versionAPI";
import useAuthStore from "@/store/AuthStore";
import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";

export default function AdminService() {
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

  // 도넛 차트 데이터
  const doughnutData2 = {
    labels: ["출장", "연차", "반차"],
    datasets: [
      {
        label: "사용자 상태",
        data: [trip, full, half],
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

  return (
    <>
      <div className="w-[941px] h-auto bg-white rounded-lg p-[20px] mx-auto border-[1px] border-solid border-gray">
        {/* 헤더 */}
        <div className="content-header">
          <h1>서비스 정보</h1>
          <p className="!mb-5">기본 서비스 정보를 제공하는 페이지입니다.</p>
        </div>
        <article className="flex gap-10 ">
          {/* 첫 번째 테이블 */}
          <div className="w-[435px] h-auto p-5">
            <table className="w-full text-left">
              <tbody>
                <tr>
                  <td className="px-4 py-2 font-bold text-[15px]">사이트명</td>
                  <td className="px-4 py-2">AntWork</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-[15px]">회사명</td>
                  <td className="px-4 py-2">{company?.name}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-[15px]">URL</td>
                  <td className="px-4 py-2">{path}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-[15px]">
                    총 유저 수
                  </td>
                  <td className="px-4 py-2">{allUser}명</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-[15px]">활동 유저</td>
                  <td className="px-4 py-2">{active}명</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 두 번째 테이블 */}
          <div className="w-[435px] h-auto p-5">
            <table className="w-full text-left">
              <tbody>
                <tr>
                  <td className="px-4 py-2 font-bold text-[15px]">관리자</td>
                  <td className="px-4 py-2">{user?.name}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-[15px]">시작일자</td>
                  <td className="px-4 py-2">{start}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-[15px]">사용 기간</td>
                  <td className="px-4 py-2">
                    저희 AntWork를 {Math.abs(diffInDays)}
                    일째 사용하고 계십니다.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-[15px]">현재 버전</td>
                  <td className="px-4 py-2">
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
      </div>
      <div className="flex justify-center gap-5 ">
        <div className="w-[462px] h-[500px] bg-white rounded-lg p-[20px] border-[1px] border-solid border-gray">
          <h3 className="text-lg font-bold text-gray-800 mb-4">유저 상태</h3>
          <Doughnut data={doughnutData} />
        </div>
        <div className="w-[462px] h-[500px] bg-white rounded-lg p-[20px] border-[1px] border-solid border-gray">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            금일 부재 인원
          </h3>
          <Bar data={doughnutData2} className="mt-[100px]" />
        </div>
      </div>
    </>
  );
}
