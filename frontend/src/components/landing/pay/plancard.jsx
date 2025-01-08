import React from "react";
import { Link, Navigate } from "react-router-dom";
{
  /*
    날짜 : 2024/11/27(수)
    생성자 : 최준혁
    내용 : Plancard 컴포넌트 추가

  */
}

const PlanCard = ({ title, price, description, features, link, color }) => {
  return (
    <div
      className={`plan-card ${color} bg-white rounded-lg shadow-md p-6 space-y-6`}
    >
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      <h3 className="text-m font-semibold">{price}</h3>
      <p className="text-sm text-gray-600">월 요금 (1인당)</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <span
              className={`icon ${
                feature.enabled ? "text-green-500" : "text-red-500"
              }`}
            >
              {feature.enabled ? "✔" : "✘"}
            </span>
            <span className="ml-2 text-sm text-gray-700">{feature.text}</span>
          </li>
        ))}
      </ul>
      <Link
        to={link}
        className={`w-full block text-center ${
          color === "basic"
            ? "bg-green-500 hover:bg-green-600"
            : color === "professional"
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-yellow-500 hover:bg-yellow-600"
        } text-white py-2 px-4 rounded-lg transition`}
      >
        결제 하기
      </Link>
    </div>
  );
};

export default PlanCard;
