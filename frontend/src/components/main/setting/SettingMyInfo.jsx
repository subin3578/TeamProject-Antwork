import { useEffect, useRef, useState } from "react";
import useAuthStore from "./../../../store/AuthStore";
import {
  getUserByUid,
  updateImg,
  updateInfo,
  updatePassword,
} from "@/api/userAPI";

export default function SettingMyinfo() {
  const fileInputRef = useRef(null);
  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보 가져오기
  console.log("12345" + JSON.stringify(user));

  const [userInfo, setUserInfo] = useState();
  const [name, setName] = useState(userInfo?.name);
  const [email, setEmail] = useState(userInfo?.email);
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phoneNumber);
  const [previewImage, setPreviewImage] = useState(userInfo?.profileImageUrl);
  const [imgFile, setImgFile] = useState();
  const [currentPassword, setCurrentPassword] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const data2 = await getUserByUid(user?.uid);
      setUserInfo(data2);
      console.log(JSON.stringify(data2));
      console.log(userInfo);
    };

    fetchData();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // 이미지 유효성 검사
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert("유효한 이미지 형식이 아닙니다.");
        return;
      }

      if (file.size > maxSize) {
        alert("이미지 크기는 5MB 이하여야 합니다.");
        return;
      }

      // 이미지 미리보기
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        console.log("readererererer" + file);
        setImgFile(file);
        // 여기서 서버로 이미지 업로드 로직 추가 가능
      };
      reader.readAsDataURL(file);
    }
  };

  // 파일 입력 트리거 함수
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const updateInfomation = (info, type) => {
    console.log("혹시혹시혹시혹시혹시" + info + ":::" + type);

    if (type == "phoneNumber") {
      const cleaned = info.replace(/\D/g, ""); // 숫자만 남기기
      const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
      const formatted = match ? `${match[1]}-${match[2]}-${match[3]}` : cleaned;
      info = formatted;
      console.log("혹시나???" + info);
      // 유효성 검사
      if (
        !/^(\d{3})-(\d{3,4})-(\d{4})$/.test(formatted) &&
        formatted.length > 0
      ) {
        alert("올바른 형식이 아닙니다.");
        return;
      }
    }

    if (type == "img" && info == undefined) {
      alert("수정할 이미지를 올려주세요.");
      return;
    } else if (type == "img") {
      const formData = new FormData();
      formData.append("profileImage", imgFile);
      console.log(...formData);
      const fetchData = async () => {
        updateImg(formData, user?.uid);
      };
      fetchData();
      alert("이미지가 변경되었습니다!");
      return;
    }

    const fetchData = async () => {
      updateInfo(info, user?.uid, type);
    };
    fetchData();
    
    alert("정보가 수정되었습니다!");
  };

  const checkPassword = (pass, type) => {
    console.log(pass);
    const fetchData = async () => {
      const response = await updatePassword(pass, user?.uid, type);
      if (type == "check") {
        if (response) {
          setIsPasswordCorrect(true);
        } else {
          alert("비밀번호가 틀렸습니다!");
          setIsPasswordCorrect(false);
        }
      } else if (type == "update") {
        alert("비밀번호가 변경되었습니다!");
      }
    };
    fetchData();
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    // 비밀번호 비교
    if (value !== newPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setErrorMessage("");
    }
  };

  return (
    <article className="page-list w-[1100px] mx-auto">
      <div className="content-header">
        <h1>Setting</h1>
        <p className="!mb-5">개인 설정 페이지 입니다.</p>
      </div>
      <div className="flex items-center space-x-4 float-left">
        <div className="flex items-center mx-[15px] mt-[10px]">
          <div className="relative w-50 h-50 ml-4 ">
            <img
              src={
                previewImage ||
                userInfo?.profileImageUrl ||
                "../../images/pngegg.png"
              }
              alt="프로필"
              className="w-[150px] h-[150px] rounded-full border border-gray-300 object-cover"
              onClick={handleImageClick}
            />
            {/* 숨겨진 파일 입력 */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
            />

            {/* 이미지 업로드 버튼 */}
            <button
              onClick={() => updateInfomation(imgFile, "img")}
              className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition"
            >
              사진 저장
            </button>
          </div>
        </div>
      </div>

      <form className="space-y-6 p-[20px] border border-black-200 rounded-[10px] w-[800px] mx-5 mb-5 ml-[230px]">
        <p className=" float-right text-gray-400">
          * 부서,직급 변경은 관리자에게 문의하세요.
        </p>
        <h3 className="text-lg font-semibold text-gray-700 ">기본정보</h3>

        {/* 입력 필드 섹션 */}
        <div className="space-y-4 ]">
          {/* 부서 */}
          <div className="flex items-center mx-[10px]">
            <label className="w-1/3 text-gray-700 font-medium">
              &nbsp;부서
            </label>
            <input
              type="text"
              placeholder={userInfo?.departmentName}
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              readOnly
            />
          </div>
          {/* 직급 */}
          <div className="flex items-center mx-[10px]">
            <label className="w-1/3 text-gray-700 font-medium">직급</label>
            <input
              type="text"
              placeholder={userInfo?.position}
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              readOnly
            />
          </div>
          <div className="flex items-center mx-[10px]">
            <label className="w-1/3 text-gray-700 font-medium">
              &nbsp;이름
            </label>
            <input
              type="text"
              placeholder={userInfo?.name}
              value={name} // 상태와 연결
              onChange={(e) => setName(e.target.value)} // 상태 업데이트
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="button"
              className=" ml-3 px-6 p-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
              onClick={() => updateInfomation(name, "name")}
            >
              수정
            </button>
          </div>

          {/* 이메일 */}
          <div className="flex items-center mx-[10px]">
            <label className="w-1/3 text-gray-700 font-medium">
              &nbsp;이메일
            </label>
            <input
              type="email"
              placeholder={userInfo?.email}
              value={email} // 상태와 연결
              onChange={(e) => setEmail(e.target.value)} // 상태 업데이트
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              className=" ml-3 px-6 p-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
              type="button"
              onClick={() => updateInfomation(email, "email")}
            >
              수정
            </button>
          </div>
          <div className="flex items-center mx-[10px]">
            <label className="w-1/3 text-gray-700 font-medium">
              &nbsp;전화번호
            </label>
            <input
              type="text"
              placeholder={userInfo?.phoneNumber}
              value={phoneNumber} // 상태와 연결
              onChange={(e) => setPhoneNumber(e.target.value)} // 상태 업데이트
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              className=" ml-3 px-6 p-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
              type="button"
              onClick={() => updateInfomation(phoneNumber, "phoneNumber")}
            >
              수정
            </button>
          </div>
        </div>
      </form>
      <form className="space-y-6  p-[20px] border border-black-200 rounded-[10px] w-[800px] mt-0 mx-5 mb-5 ml-[230px]">
        {/* 비밀번호 변경 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700  !mt-[5px] mb-[10px]">
            비밀번호 변경
          </h3>
          {!isPasswordCorrect && (
            <div className="flex items-center mx-[15px] !mt-[20px]">
              <label className="w-1/3 text-gray-700 font-medium ">
                현재 비밀번호
              </label>
              <input
                type="password"
                placeholder="현재 비밀번호"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                className=" ml-3 px-6 p-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
                type="button"
                onClick={() => checkPassword(currentPassword, "check")}
              >
                비밀번호 확인
              </button>
            </div>
          )}
          {isPasswordCorrect && (
            <>
              <div className="flex items-center mx-[15px]">
                <label className="w-1/3 text-gray-700 font-medium">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  placeholder="새 비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center mx-[15px]">
                <label className="w-1/3 text-gray-700 font-medium">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  placeholder="비밀번호 확인"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              {/* 경고 메시지 */}
              {errorMessage && (
                <div className="mx-[15px] mt-2 text-sm text-red-500">
                  {errorMessage}
                </div>
              )}
            </>
          )}
        </div>

        {isPasswordCorrect && (
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              onClick={() => setIsPasswordCorrect(false)}
            >
              취소
            </button>
            {!errorMessage && (
              <button
                type="button"
                onClick={() => checkPassword(newPassword, "update")}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                저장
              </button>
            )}
          </div>
        )}
      </form>
    </article>
  );
}
