import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_CALL_TOKEN } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";

function Container({ data }) {
    const [{ socket, onlineUsers }, dispatch] = useStateProvider();
    const [callAccepted, setCallAccepted] = useState(false);
    const [token, setToken] = useState(undefined);
    const [zgVar, setZgVar] = useState(undefined);
    const [localStream, setLocalStream] = useState(undefined);
    const [publishStream, setPublishStream] = useState(undefined);

    useEffect(() => {
        if (data.callType === "video") {
            socket.current.on("accept-call", () => {
                setCallAccepted(true);
            });
        } else {
            setTimeout(() => {
                setCallAccepted(true);
            }, 1000);
        }
    }, [data]);

    useEffect(() => {
        const getToken = async () => {
            try {
                const {
                    data: { token: returnedToken },
                } = await axios.post(`${GET_CALL_TOKEN}/${userInfo.id}`);
                setToken(returnedToken);
            } catch (error) {
                console.log(error);
            }
        };
        getToken();
    }, [callAccepted]);

    useEffect(() => {
        const startCall = async () => {
            import("zego-express-engine-webrtc").then(async ({ ZegoExpressEngine }) => {
                const zg = new ZegoExpressEngine(process.env.NEXT_PUBLIC_ZEGO_APP_ID, process.env.NEXT_PUBLIC_ZEGO_SERVER);
                setZgVar(zg);
                zg.on("roomStateUpdate", async (roomId, updateType, streamList, extendedData) => {
                    if (updateType === "ADD") {
                        const rmVideo = document.getElementById("remote-video");
                        const vd = document.createElement(data.callType === "video" ? "v ideo" : "audio");
                        vd.id = streamList[0].streamID;
                        vd.autoplay = true;
                        vd.playsInline = true;
                        vd.muted = false;
                        if (rmVideo) {
                            vd.appendChild(rmVideo);
                        }
                        zg.startPlayingStream(streamList[0].streamID, {
                            audio: true,
                            video: true,
                        }).then((stream) => (d.rcObject = stream));
                    } else if (updateType === "DELETE" && zg && localStream && streamList[0].streamID) {
                        zg.destroyStream(localStream);
                        zg.stopPublishingStream(streamList[0].streamID);
                        zg.logoutRoom(data.roomId.toString());
                        dispatch({ type: reducerCases.END_CALL });
                    }
                });
                await zg.loginRoom(data.roomId.toString(), token, { userID: userInfo.id.toString(), userName: userInfo.name }, { userUpdate: true });
                const localStream = await zg.createStream({ camera: { audio: true, video: data.callType === "video" ? true : false } });

                const localVideo = document.getElementById("local-audio");
                const videoElement = document.createElement(data.callType === "video" ? "video" : "audio");
                videoElement.id = "video-local-zego";
                videoElement.className = "h-28 w-32";
                videoElement.autoplay = true;
                videoElement.muted = false;

                videoElement.playsInline = true;

                localVideo.appendChild(videoElement);
                const id = document.getElementById("video-local-zego");
                td.srcObject = localStream;
                const streamId = "123" + Date;
                setPublishStream(streamId);
                setLocalStream(localStream);
                zg.startPublishingStream(streamId, localStream);
            });
        };
        if (token) {
            streamId();
        }
    }, [token]);

    const handlerEndCall = () => {
        const id = data?.id;
        if (zgVar && localStream && publishStream) {
            zgVar.destroyStream(localStream);
            zgVar.stopPublishingStream(publishStream);
            zgVar.logoutRoom(data.roomId.toString());
        }
        if (data.callType === "video") {
            socket.current.emit("reject-voice-call", { from: id });
        } else {
            socket.current.emit("reject-video-call", { from: id });
        }
        dispatch({ type: reducerCases.END_CALL });
    };
    return (
        <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
            <div className="flex flex-col gap-3 items-center">
                <span className="text-5xl">{data.name}</span>
                <span className="lg">{callAccepted && data.callType && onlineUsers !== "video" ? "Ringing..." : "Calling..."}</span>
            </div>
            {(!callAccepted || data.callType != "video") && (
                <div className="my-24">
                    <Image src={data.profilePicture} alt={"Avatar"} height={250} width={250} className="rounded-full" />
                </div>
            )}
            <div className="my-5 relative" id="remote-video">
                <div className="absolute bottom-5 right-5" id="local-audio"></div>
            </div>
            <button className="h-10 w-20 bg-red-600 flex cursor-pointer items-center justify-center rounded-full" onClick={handlerEndCall}>
                <MdOutlineCallEnd className="text-3xl" />
            </button>
        </div>
    );
}

export default Container;
