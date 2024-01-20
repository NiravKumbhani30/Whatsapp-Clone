import { useStateProvider } from "@/context/StateContext";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
const Container = dynamic(() => import("./Container"), { ssr: false });

function VoiceCall() {
    const [{ voiceCall, socket, userInfo }, dispatch] = useStateProvider();

    useEffect(() => {
        if (voiceCall.type === "out-going") {
            socket.current.emit("outgoing-voice-call", {
                to: voiceCall.id,
                from: {
                    id: userInfo.id,
                    profilePicture: userInfo.profileImage,
                    name: userInfo.name,
                },
                callType: voiceCall.callType,
                roomId: voiceCall.roomId,
            });
        }
    }, [voiceCall]);

    return <Container data={voiceCall} />;
}

export default VoiceCall;
