import { useState } from "react";

{
  /*
    날짜 : 2024/11/28(화)
    생성자 : 최준혁
    내용 : 요금 plancard 안에 내용 상태관리를 위한 훅 
  */
}

const usePlans = () => {
  const [plans] = useState([
    {
      title: "Free 요금제",
      price: "0원",
      description: "무료 체험 요금제입니다.",
      features: [
        { text: "메시지: 팀원 간 채팅 기능 제공 (최대 5명)", enabled: true },
        { text: "프로젝트: 프로젝트 2개 생성 가능", enabled: true },
        { text: "드라이브: 5GB 스토리지 제공", enabled: true },
        { text: "페이지: 페이지 생성 불가 (읽기만 가능)", enabled: false },
        { text: "게시판: 공지사항 읽기 전용", enabled: false },
      ],
      link: `/complete`, // Free 요금제 링크
      color: "basic",
    },
    {
      title: "Month 요금제",
      price: "100,000원",
      description: "월별 결제 요금제입니다.",
      features: [
        {
          text: "메시지: 팀 채팅 및 파일 첨부 기능 (최대 15명)",
          enabled: true,
        },
        { text: "프로젝트: 프로젝트 10개 생성 가능", enabled: true },
        { text: "드라이브: 50GB 스토리지 제공", enabled: true },
        { text: "페이지: 페이지 5개 생성 가능", enabled: true },
        { text: "게시판: 게시판 작성 및 댓글 가능", enabled: true },
      ],
      link: `/toss?title=${encodeURIComponent(
        "Month 요금제"
      )}&price=${encodeURIComponent("$50")}`, // Month 요금제 링크
      color: "professional",
    },
    {
      title: "Year 요금제",
      price: "1,000,000원",
      description: "1년 결제 요금제입니다.",
      features: [
        {
          text: "메시지: 무제한 팀 채팅 및 대규모 파일 공유 지원",
          enabled: true,
        },
        { text: "프로젝트: 무제한 프로젝트 생성 가능", enabled: true },
        { text: "드라이브: 1TB 스토리지 제공", enabled: true },
        { text: "페이지: 무제한 페이지 생성 가능", enabled: true },
        { text: "게시판: 게시판 작성, 댓글, 커스터마이징 가능", enabled: true },
      ],
      link: `/toss?title=${encodeURIComponent(
        "Year 요금제"
      )}&price=${encodeURIComponent("$550")}`, // Year 요금제 링크
      color: "advanced",
    },
  ]);

  return plans;
};

export default usePlans;
