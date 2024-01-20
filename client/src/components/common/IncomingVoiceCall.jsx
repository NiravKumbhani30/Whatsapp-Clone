import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import Image from "next/image";
import React from "react";

function IncomingVoiceCall() {
    const [{ incomingVoiceCall, socket }, dispatch] = useStateProvider();

    const handlerAcceptCall = () => {
        dispatch({
            type: reducerCases.SET_VOICE_CALL,
            voiceCall: {
                ...incomingVoiceCall,
                type: "in-coming",
            },
        });
        socket.current.emit("accept-incoming-call", { id: incomingVoiceCall.id });
        dispatch({
            type: reducerCases.SET_INCOMING_VOICE_CALL,
            incomingVoiceCall: undefined,
        });
    };

    const handlerRejectCall = () => {
        dispatch({ type: reducerCases.END_CALL });
        socket.current.emit("reject-voice-call", { from: incomingVoiceCall.id });
    };
    return (
        <div className="h-24 w-80 fixed bottom-8 mb-0 right-6 z-50 rounded-lg flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14">
            <div>
                <Image src={incomingVoiceCall.profilePicture} alt="Avatar" height={60} width={60} className="rounded-full" />
            </div>
            <div>
                <div>{incomingVoiceCall.name}</div>
                <div className="text-xs">Incoming Voice Call</div>
                <div className="flex gap-2 mt-2">
                    <button className="bg-red-500 p-1 px-3 text-sm rounded-full" onClick={handlerRejectCall}>
                        Reject
                    </button>
                    <button className="bg-green-500 p-1 px-3 text-sm rounded-full" onClick={handlerAcceptCall}>
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}

export default IncomingVoiceCall;
