import { useStomp } from '@/provides/StompProvide';
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

const DmListItem = ({ dm, user }) => {

    const { isConnected, subscribe } = useStomp();
    const [isNew, setIsNew] = useState(false);

    useEffect(() => {
        if (!dm || !isConnected) {
            return;
        }

        const unsubscribe = subscribe(`/topic/chatting/dm/${dm.dmId}/messages`,
            async (message) => {
                console.log("DM 와씀")
                setIsNew(true)
            }
        )

        return () => {
            unsubscribe();
        };
    }, [dm.dmId, isConnected]); // 의존성 배열

    return (
        <li>
            <NavLink
                to={`/antwork/chatting/dm/${dm.dmId}`}
                className="flex items-center p-2 rounded-md hover:bg-gray-100 transition pl-0"
            >
                <span className="text-lg">🗨️</span>
                <div className="flex-1 ml-2">
                    <p className="font-medium text-gray-800 text-[14px] truncate w-[150px]">{dm.dmName}</p>
                    <p className="text-sm text-gray-500 truncate">
                        {isNew ? <span className='text-sm text-blue-400'>새로운 메시지가 있습니다.</span> : "새로운 메시지가 없습니다."}
                    </p>
                </div>
            </NavLink>
        </li>
    )
}

export default DmListItem
