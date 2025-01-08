import { getChannelCUnreadCount } from '@/api/chattingAPI'
import { useStomp } from '@/provides/StompProvide'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

const ChannelListItem = ({ channel, user }) => {
    const [unreadCount, setUnreadCount] = useState(0)
    const { isConnected, subscribe, sendMessage } = useStomp();

    useEffect(() => {
        async function fetchUnreadData() {
            const unreadCount = await getChannelCUnreadCount({ channelId: channel.id, userId: user.id })
            setUnreadCount(unreadCount);
        }

        fetchUnreadData();
    }, [channel.id, user.id])

    useEffect(() => {
        if (!channel || !isConnected) {
            return;
        }

        const unsubscribe = subscribe(`/topic/chatting/channel/${channel.id}/messages`,
            async (message) => {
                setUnreadCount(prev => prev + 1)
            }
        )

        return () => {
            unsubscribe();
        };
    }, [channel.id, isConnected]); // 의존성 배열

    return (
        <li key={channel.id} >
            <NavLink
                to={`/antwork/chatting/channel/${channel.id}`}
                className="flex items-center p-2 rounded-md hover:bg-gray-100 transition pl-0"
            >
                {channel.ChannelPrivacy ? (
                    <span className="mr-2">🔒</span> // 비공개 채널
                ) : (
                    <span className="mr-2">📢</span> // 공개 채널
                )}
                <div className="flex-1 ml-2">
                    <p className="font-medium text-gray-800 text-[14px] truncate">{channel.name}</p>
                </div>
                {unreadCount !== 0 ?
                    <span className="ml-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[12px] font-bold rounded-full shadow-md">
                        {unreadCount}
                    </span>
                    : null}

            </NavLink>
        </li>
    )
}

export default ChannelListItem
