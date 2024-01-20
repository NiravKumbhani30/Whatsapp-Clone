import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import Image from "next/image";
import React from "react";
import MessageStatus from "../common/MessageStatus";

function ImageMessage({ message }) {
    const [{ currentChatUser, userInfo }] = useStateProvider();
    return (
        <div className={`p-1 rounded-lg ${message.senderId === currentChatUser.id ? "bg-incoming-background" : "bg-outgoing-background"}`}>
            <div className="relative">
                <Image src={`${HOST}/${message.message}`} className="rounded-lg" alt="asset" height={300} width={300} />
                <div className="absolute bottom-1 right-1 flex items-end gap-1">
                    <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">{calculateTime(message.createdAt)}</span>
                    <span className="text-bubble-meta">{message.senderId === userInfo.id && <MessageStatus messageStatus={message.messageStatus} />}</span>
                </div>
            </div>
        </div>
    );
}

export default ImageMessage;
