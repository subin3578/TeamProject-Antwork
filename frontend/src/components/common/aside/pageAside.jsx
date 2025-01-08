import { PAGE_LIST_UID_URI } from "../../../api/_URI";
import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import useToggle from "../../../hooks/useToggle";
import axios from "axios";
import useAuthStore from "../../../store/AuthStore";
import { getSharedPages } from "../../../api/pageAPI";
import { useAsideWebSocket } from "../../../hooks/paging/useAsideWebSocket";
import axiosInstance from "@/utils/axiosInstance";

export default function PageAside({ asideVisible }) {
  const [toggles, toggleSection] = useToggle({
    personalPages: true,
    sharedPages: true,
  });
  const [personalPageList, setPersonalPageList] = useState([]);
  const [sharedPageList, setSharedPageList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageTitles, setPageTitles] = useState({});
  const [stompClient, setStompClient] = useState(null);
  const [componentId, setComponentId] = useState(null);
  const [allPageIds, setAllPageIds] = useState([]);

  const user = useAuthStore((state) => state.user);
  const uid = user?.uid;

  const processedPagesRef = useRef(new Set());
  const personalPagesRef = useRef([]);
  const sharedPagesRef = useRef([]);

  useEffect(() => {
    if (uid) {
      const fetchPersonalPages = async () => {
        try {
          const response = await axiosInstance.get(
            `${PAGE_LIST_UID_URI}/${uid}`
          );
          setPersonalPageList(response.data);
          console.log("Fetched personal pages:", response.data);
          const titles = response.data.reduce((acc, page) => {
            acc[page._id] = page.title;
            return acc;
          }, {});
          setPageTitles(titles);
          console.log("Page titles set:", titles);
        } catch (error) {
          console.error("개인 페이지 목록을 가져오는데 실패했습니다:", error);
        }
      };

      fetchPersonalPages();

      const fetchSharedPages = async () => {
        try {
          setIsLoading(true);
          const response = await getSharedPages(uid);
          setSharedPageList(response);
          console.log("Fetched shared pages:", response);
        } catch (error) {
          console.error("공유된 페이지 목록을 가져오는데 실패했습니다:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSharedPages();
    }
  }, [uid]);

  useEffect(() => {
    personalPagesRef.current = personalPageList;
  }, [personalPageList]);

  useEffect(() => {
    sharedPagesRef.current = sharedPageList;
  }, [sharedPageList]);

  const handleWebSocketMessage = useCallback((message) => {
    try {
      const data = JSON.parse(message.body);

      if (data.title) {
        console.log("Received title update in aside:", data);

        const existsInPersonal = personalPagesRef.current.some(
          (page) => page._id === data._id
        );
        const existsInShared = sharedPagesRef.current.some(
          (page) => page._id === data._id
        );

        if (existsInShared) {
          setSharedPageList((prev) =>
            prev.map((page) =>
              page._id === data._id ? { ...page, title: data.title } : page
            )
          );
        } else if (existsInPersonal) {
          setPersonalPageList((prev) =>
            prev.map((page) =>
              page._id === data._id ? { ...page, title: data.title } : page
            )
          );
        } else {
          const isProcessed = processedPagesRef.current.has(data._id);
          if (!isProcessed) {
            console.log("New page detected, adding to personal list:", data);
            setPersonalPageList((prev) => [...prev, data]);
            processedPagesRef.current.add(data._id);
          }
        }

        setPageTitles((prev) => ({
          ...prev,
          [data._id]: data.title,
        }));
      } else if (data.deleted) {
        console.log("🗑️ Received delete notification in aside:", data);
        console.log("Current personal pages:", personalPageList);
        console.log("Current shared pages:", sharedPageList);

        setPersonalPageList((prev) => {
          const filtered = prev.filter((page) => page._id !== data._id);
          console.log("Updated personal pages after delete:", filtered);
          return filtered;
        });

        setSharedPageList((prev) => {
          const filtered = prev.filter((page) => page._id !== data._id);
          console.log("Updated shared pages after delete:", filtered);
          return filtered;
        });

        setPageTitles((prev) => {
          const newTitles = { ...prev };
          delete newTitles[data._id];
          console.log("Updated page titles after delete:", newTitles);
          return newTitles;
        });

        processedPagesRef.current.delete(data._id);
        console.log("✅ Page successfully removed from all lists");
      }
    } catch (error) {
      console.error("WebSocket 메시지 처리 중 오류:", error);
    }
  }, []);

  const setStompClientCallback = useCallback((client) => {
    setStompClient(client);
  }, []);

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  useEffect(() => {
    if (!componentId) {
      setComponentId(generateUUID());
    }
  }, []);

  useEffect(() => {
    const ids = [...personalPageList, ...sharedPageList].map(
      (page) => page._id
    );
    setAllPageIds(ids);
  }, [personalPageList, sharedPageList]);

  useAsideWebSocket({
    uid,
    handleWebSocketMessage,
    setStompClient: setStompClientCallback,
    stompClientRef: { current: stompClient },
  });

  return (
    <>
      <aside className={`sidebar ${!asideVisible ? "hidden" : ""} table-cell`}>
        <div className="logo">
          <span className="sub-title">Shared Page</span>
          <Link
            to="/antwork/page/write"
            className="image-button-css !bg-[url('/images/ico/page_write_22_999999.svg')]"
            aria-label="등록"
          ></Link>
          <span className="title">Page</span>
        </div>
        <ul className="lnb inline-grid">
          <li className="lnb-item">
            <div className="lnb-header !mb-[10px]">
              <img
                src="/images/ico/page_home_22_999999.svg"
                className="cate-icon !w-[22px] !h-[22px]"
              />
              <Link to="/antwork/page" className="main-cate !text-[16px]">
                홈
              </Link>
            </div>

            <div className="lnb-header !pb-[15px] border-b border-[#ddd]">
              <img
                src="/images/ico/page_search_22_999999.svg"
                className="cate-icon !w-[22px] !h-[22px]"
              />
              <span className="main-cate !text-[16px] ">검색</span>
            </div>
          </li>

          <li className="lnb-item !mt-[15px] !h-[500px] border-b border-[#ddd]">
            <div
              className="lnb-header cursor-pointer "
              onClick={() => toggleSection("personalPages")}
            >
              <span className="main-cate !text-[14px] text-[#757575] cursor-pointer !inline-flex ">
                나의 페이지{" "}
                <img
                  src={
                    toggles.personalPages
                      ? "/images/ico/page_dropup_20_999999.svg"
                      : "/images/ico/page_dropdown_20_999999.svg"
                  }
                  alt="toggle"
                />
              </span>
            </div>
            {toggles.personalPages && (
              <ol>
                {personalPageList.map((page) => (
                  <li key={page._id}>
                    <Link
                      to={`/antwork/page/write?id=${page._id}`}
                      className="block truncate max-w-[200px] hover:text-blue-500"
                      title={pageTitles[page._id] || page.title}
                    >
                      {pageTitles[page._id] || page.title}
                    </Link>
                  </li>
                ))}
              </ol>
            )}

            <div
              className="lnb-header cursor-pointer "
              onClick={() => toggleSection("sharedPages")}
            >
              <span className="main-cate !text-[14px] text-[#757575] cursor-pointer !inline-flex !mt-[12px] ">
                공유받은 페이지{" "}
                <img
                  src={
                    toggles.sharedPages
                      ? "/images/ico/page_dropup_20_999999.svg"
                      : "/images/ico/page_dropdown_20_999999.svg"
                  }
                  alt="toggle"
                />
              </span>
            </div>
            {toggles.sharedPages && (
              <ol>
                {isLoading ? (
                  <li className="text-gray-500 text-center">로딩 중...</li>
                ) : sharedPageList && sharedPageList.length > 0 ? (
                  sharedPageList.map((page) => (
                    <li key={page._id}>
                      <Link
                        to={`/antwork/page/write?id=${page._id}`}
                        className="block truncate max-w-[200px] hover:text-blue-500"
                        title={pageTitles[page._id] || page.title}
                      >
                        {pageTitles[page._id] || page.title}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 text-center">
                    공유된 페이지가 없습니다.
                  </li>
                )}
              </ol>
            )}
          </li>
          <li className="lnb-item">
            <div className="lnb-header !mb-[10px]">
              <img
                src="/images/ico/page_template_22_999999.svg"
                className="cate-icon !w-[22px] !h-[22px]"
              />
              <Link
                to="/antwork/page/template"
                className="main-cate !text-[16px] text-[#757575]"
              >
                템플릿
              </Link>
            </div>

            <div className="lnb-header !mb-[10px]">
              <img
                src="/images/ico/page_delete24_999999.svg"
                className="cate-icon !w-[22px] !h-[22px]"
              />
              <Link
                to="/antwork/page"
                className="main-cate !text-[16px] text-[#757575]"
              >
                휴지통
              </Link>
            </div>
            <div className="lnb-header !mb-[10px]">
              <img
                src="/images/ico/page_setting_22_999999.svg"
                className="cate-icon !w-[22px] !h-[22px]"
              />
              <Link
                to="/antwork/page"
                className="main-cate !text-[16px] text-[#757575]"
              >
                설정
              </Link>
            </div>
          </li>
        </ul>
      </aside>
    </>
  );
}
