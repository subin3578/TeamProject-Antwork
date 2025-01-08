import { Link } from "react-router-dom";
import useModalStore from "../../../store/modalStore";
import AdminModal from "../../common/modal/adminModal";
import useAuthStore from "./../../../store/AuthStore";
import { useEffect, useState } from "react";
import {
  deleteUser,
  findDeleteUser,
  searchUser,
  selectMembers,
} from "./../../../api/userAPI";

export default function AdminMember() {
  const openModal = useModalStore((state) => state.openModal);
  const user = useAuthStore((state) => state.user); // Zustand에서 사용자 정보 가져오기

  const [members, setMembers] = useState([]); // 멤버 목록 상태
  const [totalMembers, setTotalMembers] = useState(0); // 전체 멤버 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [pageSize, setPageSize] = useState(10); // 페이지 크기
  const [searchNow, setSearchNow] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [searchDelete, setSearchDelete] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown 상태
  useEffect(() => {
    const loadMembers = async () => {
      if (!user?.company) return; // 회사 정보가 없으면 실행하지 않음
      if (searchNow || searchDelete) {
        return;
      }
      try {
        const data = await selectMembers(user.company, currentPage, pageSize);
        setMembers(data.content); // 멤버 리스트 설정
        setTotalMembers(data.totalElements); // 전체 멤버 수 설정
        setIsCheck([]);
      } catch (error) {
        console.error("멤버 데이터를 가져오는 중 오류 발생:", error);
      }
    };
    loadMembers();
  }, [user?.company, currentPage, pageSize]);

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(totalMembers / pageSize);

  const handlePageChange = (newPage) => setCurrentPage(newPage);
  const handlePageSizeChange = (e) => setPageSize(parseInt(e.target.value, 10));

  // 검색 기능
  const searchKeyword = async (event) => {
    event.preventDefault();
    console.log("Hi!!!");

    const formData = new FormData(event.target);
    console.log(formData.get("type"));

    const response = await searchUser(
      formData,
      user.company,
      currentPage,
      pageSize
    );
    console.log("호호호호호" + response.content.length);
    setMembers(response.content);
    setTotalMembers(response.content.length);
    setSearchNow(true);
  };

  const chcekId = (e) => {
    const value = e.target.value; // 체크박스의 value 값
    const isChecked = e.target.checked; // 체크 여부
    console.log(value);
    setIsCheck((prev) => prev.filter((id) => id !== Number(value)));
    if (isChecked) {
      // 체크된 경우: 배열에 추가
      setIsCheck((prev) => [...prev, Number(value)]);
    }
    console.log(isCheck); // 상태는 비동기적으로 업데이트됨
  };
  const handleMasterCheckboxChange = (e) => {
    if (e.target.checked) {
      setIsCheck(members.map((member) => member.id)); // 모든 체크박스 선택
    } else {
      setIsCheck([]); // 모든 체크박스 해제
    }
  };
  const isAllChecked =
    members.length > 0 &&
    members.every((member) => isCheck.includes(member.id));

  const updateCheckUser = async (type) => {
    console.log(type);
    if (type == "delete") {
      if (!confirm("정말 삭제하시겠습니까?")) {
        return;
      }
      if (isCheck.length == 0) {
        alert("체크된 유저가 없습니다!");
      } else {
        alert("체크된 유저가 비활성화되었습니다!");
      }
    } else if (type == "password") {
      if (!confirm("비밀번호를 초기화하시겠습니까?")) {
        return;
      }
      if (isCheck.length == 0) {
        alert("체크된 유저가 없습니다!");
      } else {
        alert("체크된 유저의 비밀번호를 초기화했습니다!");
      }
    }
    await deleteUser(isCheck, type);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Dropdown 상태를 토글
  };

  const handleStatusClick = async (status) => {
    console.log(`Selected status: ${status}`);
    // 필요한 로직 추가
    if (status == "ACTIVE") {
      setSearchDelete(false);
      const data = await selectMembers(user.company, currentPage, pageSize);
      setMembers(data.content); // 멤버 리스트 설정
      setTotalMembers(data.totalElements); // 전체 멤버 수 설정
      setIsCheck([]);
      setIsDropdownOpen((prev) => !prev);
      return;
    }
    const response = await findDeleteUser(
      user.company,
      currentPage,
      pageSize,
      status
    );
    setMembers(response.content); // 멤버 리스트 설정
    setTotalMembers(response.totalElements); // 전체 멤버 수 설정
    setIsCheck([]);
    setSearchDelete(true);
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <>
      <AdminModal />
      <article className="page-list">
        <div className="content-header">
          <h1>멤버 관리</h1>
          <p className="!mb-5">멤버 관리하는 페이지 입니다.</p>
        </div>
        <section className="mb-4 mx-4">
          <div className="flex justify-between items-center">
            <div className="text-gray-600 mx-4">
              <span>전체 멤버 수: </span>
              <strong>{totalMembers} 명</strong>
            </div>
            <div>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600"
                onClick={() => openModal("member-invite")}
              >
                멤버 생성
              </button>
              <button
                className="bg-yellow-500 text-white py-2 px-4 rounded mr-2 hover:bg-yellow-600"
                onClick={() => openModal("position-change")}
              >
                직위 변경
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded mr-2 hover:bg-red-600"
                onClick={() => updateCheckUser("delete")}
              >
                멤버 삭제
              </button>

              <div className="relative inline-block">
                {" "}
                {/* 버튼과 드롭다운을 감싸는 컨테이너 */}
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded mr-2 hover:bg-green-600"
                  onClick={toggleDropdown}
                >
                  상태별 조회
                </button>
                {isDropdownOpen && (
                  <div className="absolute mt-2 w-40 bg-white border border-gray-300 rounded shadow-md">
                    <ul className="list-none p-2">
                      {["ACTIVE", "EXPIRED", "DELETED"].map((status) => (
                        <li
                          key={status}
                          className="cursor-pointer py-1 px-2 hover:bg-gray-200"
                          onClick={() => handleStatusClick(status)}
                        >
                          {status}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                onClick={() => updateCheckUser("password")}
              >
                비밀번호 초기화
              </button>
            </div>
          </div>
        </section>
        <section className="h-[800px] overflow-auto mx-4">
          <div className="flex justify-between mb-4 mx-4">
            <div className="flex items-center">
              <form onSubmit={searchKeyword}>
                <select name="type" className="outline-none mr-[10px]">
                  <option value="이름">이름</option>
                  <option value="부서">부서</option>
                  <option value="직급">직급</option>
                  <option value="이메일">이메일</option>
                </select>
                <input
                  type="text"
                  name="keyword"
                  placeholder="검색어 입력"
                  className="border border-gray-300 rounded py-2 px-4 mr-2"
                />
                <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400">
                  검색
                </button>
              </form>
            </div>
            {!searchNow && (
              <div className="flex items-center">
                <span className="text-gray-600">페이지당</span>
                <select
                  className="border border-gray-300 rounded mx-2"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value="20">10</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span className="text-gray-600">개</span>
              </div>
            )}
          </div>
          <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden ml-4 mr-4">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={isAllChecked}
                    onChange={handleMasterCheckboxChange}
                  />
                </th>
                <th className="py-3 px-6 text-left">이름</th>
                <th className="py-3 px-6 text-left">부서</th>
                <th className="py-3 px-6 text-left">직급</th>
                <th className="py-3 px-6 text-left">이메일</th>
                <th className="py-3 px-6 text-left">상태</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="text-center">
                    <input
                      type="checkbox"
                      className="mx-auto"
                      value={member.id}
                      checked={isCheck.includes(member.id)} // 선택 여부
                      onChange={(e) => chcekId(e)}
                    />
                  </td>

                  <td className="py-3 px-6">{member.name}</td>
                  <td className="py-3 px-6">{member.departmentName}</td>
                  <td className="py-3 px-6">{member.position}</td>
                  <td className="py-3 px-6">{member.email}</td>
                  <td className="py-3 px-6">{member.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center mt-4">
            {/* 이전 버튼 */}
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="text-gray-700 py-2 px-4 rounded-l hover:bg-gray-100"
              >
                이전
              </button>
            )}

            {/* 현재 페이지 표시 */}
            <span className="mx-4">{currentPage}</span>

            {/* 다음 버튼 */}
            {currentPage < totalPages && !searchNow && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="text-gray-700 py-2 px-4 rounded-r hover:bg-gray-100"
              >
                다음
              </button>
            )}
          </div>
        </section>
      </article>
    </>
  );
}
