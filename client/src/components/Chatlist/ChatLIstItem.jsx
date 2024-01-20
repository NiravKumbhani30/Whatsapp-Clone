import React from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { FaCamera, FaMicrophone } from "react-icons/fa";

function ChatLIstItem({ data, isContactPage }) {
    const [{ userInfo, currentChatUser }, dispatch] = useStateProvider();
    const handleContactClick = () => {
        if (!isContactPage) {
            dispatch({
                type: reducerCases.CHANGE_CURRENT_CHAT_USER,
                user: {
                    name: data.name,
                    about: data.about,
                    profilePicture: data.profilePicture,
                    email: data.email,
                    id: userInfo.id === data.senderId ? data.receiverId : data.senderId,
                },
            });
        } else {
            dispatch({
                type: reducerCases.CHANGE_CURRENT_CHAT_USER,
                user: { ...data },
            });
            dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
        }
    };

    return (
        <div className={`flex cursor-pointer items-center hover:bg-background-default-hover`} onClick={handleContactClick}>
            <div className="min-w-fit px-5 pt-3 pb-1">
                <Avatar type="lg" image={data?.profilePicture} />
            </div>
            <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
                <div className="flex justify-between">
                    <div>
                        <span className="text-white">{data?.name}</span>
                    </div>
                    {!isContactPage && <div className={`${!data.totalUnreadMessage > 0 ? "text-secondary" : "text-icon-green"} text-sm `}>{calculateTime(data.createdAt)}</div>}
                </div>
                <div className="flex border-b border-conversation-border pb-2 pt-1">
                    <div className="flex justify-between w-full">
                        <span className="text-secondary line-clamp-1 text-sm">
                            {isContactPage ? (
                                data?.about || "\u00A0"
                            ) : (
                                <div className="flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px]">
                                    {data.senderId === userInfo.id && <MessageStatus messageStatus={data.messageStatus} />}
                                    {data.type === "text" && <span className="truncate">{data.message}</span>}
                                    {data.type === "image" && (
                                        <span className="flex gap-1 items-center">
                                            <FaCamera className="text-panel-header-icon" />
                                            Audio
                                        </span>
                                    )}
                                    {data.type === "audio" && (
                                        <span className="flex gap-1 items-center">
                                            <FaMicrophone className="text-panel-header-icon" />
                                            Audio
                                        </span>
                                    )}
                                </div>
                            )}
                        </span>
                        {data.totalUnreadMessage > 0 && <span className="bg-icon-green px-[5px] rounded-full text-sm ">{data.totalUnreadMessage}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatLIstItem;
