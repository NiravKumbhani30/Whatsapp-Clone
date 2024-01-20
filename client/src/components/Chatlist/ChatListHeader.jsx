import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { reducerCases } from "@/context/constants";
import { useRouter } from "next/router";
import ContextMenu from "../common/ContextMenu";
function ChatListHeader() {
    const [{ userInfo }, dispatch] = useStateProvider();
    const router = useRouter();

    const [contextMenuCoordinates, setContextMenuCoordinates] = useState({ x: 0, y: 0 });
    const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

    const showContextMenu = (e) => {
        e.preventDefault();
        setContextMenuCoordinates({ x: e.pageX - 50, y: e.pageY + 20 });
        setIsContextMenuVisible(true);
    };

    const contextMenuOptions = [
        {
            name: "Logout",
            callback: async () => {
                setIsContextMenuVisible(false);
                router.push("/logout");
            },
        },
    ];

    const handlerAllContactsPage = () => {
        dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
    };

    return (
        <div className="h-16 px-4 py-3 flex justify-between items-center">
            <div className="cursor-pointer">
                <Avatar type="sm" image={userInfo?.profileImage} />
            </div>
            <div className="flex gap-6">
                <BsFillChatLeftTextFill className="text-panel-header-icon cursor-pointer text-xl" title="New Chat" onClick={handlerAllContactsPage} />
                <>
                    <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl" title="Menu" onClick={(e) => showContextMenu(e)} id="context-opener" />
                    {isContextMenuVisible && (
                        <ContextMenu options={contextMenuOptions} coordinates={contextMenuCoordinates} ContextMenu={isContextMenuVisible} setContextMenu={setIsContextMenuVisible} />
                    )}
                </>
            </div>
        </div>
    );
}

export default ChatListHeader;
