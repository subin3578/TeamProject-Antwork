import { useState, useMemo, useEffect } from "react";

{
  /*
    날짜 : 2024/11/26(화)
    생성자 : 최준혁
    내용 : useInviteModal 채팅 초대 모달 상태관리를 위한 훅 
  */
}

export function useInviteModal() {
  const [availableUsers, setAvailableUsers] = useState([
    { id: 1, name: "정지현", avatar: "https://via.placeholder.com/40" },
    { id: 2, name: "김민희", avatar: "https://via.placeholder.com/40" },
    { id: 3, name: "박현우", avatar: "https://via.placeholder.com/40" },
    { id: 4, name: "이수진", avatar: "https://via.placeholder.com/40" },
  ]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const addUser = (user) => {
    setSelectedUsers((prev) => [...prev, user]);
    setAvailableUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  const removeUser = (user) => {
    setAvailableUsers((prev) => [...prev, user]);
    setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  const filteredUsers = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return availableUsers.filter((user) =>
      user.name.toLowerCase().includes(lowerCaseQuery)
    );
  }, [availableUsers, searchQuery]);

  useEffect(() => {
    console.log("Filtered Users Updated:", filteredUsers);
  }, [filteredUsers]);

  return {
    availableUsers,
    selectedUsers,
    searchQuery,
    setSearchQuery,
    addUser,
    removeUser,
    filteredUsers,
  };
}
