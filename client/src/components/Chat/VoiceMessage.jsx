import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Avatar from "../common/Avatar";
import { FaPlay, FaStop } from "react-icons/fa";
import { calculateTime, formatTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";

function VoiceMessage({ message }) {
    const [{ userInfo, currentChatUser }, dispatch] = useStateProvider();
    const [audioMessage, setAudioMessage] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);

    const waveFormRef = useRef(null);
    const waveForm = useRef(null);

    useEffect(() => {
        if (waveForm.current === null) {
            waveForm.current = WaveSurfer.create({
                container: waveFormRef.current,
                waveColor: "#CCC",
                progressColor: "#4A9EFF",
                cursorColor: "#7AE3C3",
                barWidth: 2,
                height: 30,
                responsive: true,
            });
            waveForm.current.on("finish", () => {
                setIsPlaying(false);
            });
        }
        return () => {
            waveForm.current.destroy();
        };
    }, []);

    useEffect(() => {
        const audioURL = `${HOST}/${message.message}`;
        const audio = new Audio(audioURL);
        setAudioMessage(audio);
        waveForm.current.load(audioURL);
        waveForm.current.on("ready", () => {
            setTotalDuration(waveForm.current.getDuration());
        });
    }, [message.message]);

    useEffect(() => {
        if (audioMessage) {
            const updatePlayBackTime = () => {
                setCurrentPlayBackTime(audioMessage.currentTime);
            };
            audioMessage.addEventListener("timeupdate", updatePlayBackTime);

            return () => {
                audioMessage.removeEventListener("timeupdate", updatePlayBackTime);
            };
        }
    }, [audioMessage]);

    const handlePlayAudio = () => {
        if (audioMessage) {
            waveForm.current.stop();
            waveForm.current.play();
            audioMessage.play();
            setIsPlaying(true);
        }
    };

    const handlePauseAudio = () => {
        waveForm.current.stop();
        audioMessage.pause();
        setIsPlaying(false);
    };

    return (
        <div className={`flex items-center gap-5 text-white px-4 pr-2 py-4 text-sm rounded-lg ${message.senderId === currentChatUser.id ? "bg-incoming-background" : "bg-outgoing-background"}`}>
            <div>
                <Avatar type="lg" image={message.senderId === currentChatUser.id ? currentChatUser?.profilePicture : userInfo?.profileImage} />
            </div>
            <div className="cursor-pointer text-xl">{!isPlaying ? <FaPlay onClick={handlePlayAudio} /> : <FaStop onClick={handlePauseAudio} />}</div>
            <div className="relative">
                <div className="w-60" ref={waveFormRef}></div>
                <div className="text-bubble-meta text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
                    <span>{formatTime(isPlaying ? currentPlayBackTime : totalDuration)}</span>
                    <div className="flex gap-1">
                        <span>{calculateTime(message.createdAt)}</span>
                        {message.senderId === userInfo.id && <MessageStatus messageStatus={message.messageStatus} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VoiceMessage;
