import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import { formatTime } from "@/utils/CalculateTime";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPauseCircle, FaPlay, FaStop, FaTrash } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

function CaptureAudio({ hide }) {
    const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();

    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [waveForm, setWaveForm] = useState(null);
    const [recodingDuration, setRecodingDuration] = useState(0);
    const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [renderedAudio, setRenderedAudio] = useState(null);

    const audioRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const waveFormRef = useRef(null);

    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setRecodingDuration((prev) => {
                    setTotalDuration(prev + 1);
                    return prev + 1;
                });
            }, 1000);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isRecording]);

    useEffect(() => {
        const waveSurfer = WaveSurfer.create({
            container: waveFormRef.current,
            waveColor: "#CCC",
            progressColor: "#4A9EFF",
            cursorColor: "#7AE3C3",
            barWidth: 2,
            height: 40,
            responsive: true,
        });
        setWaveForm(waveSurfer);
        waveSurfer.on("finish", () => {
            setIsPlaying(false);
        });
        return () => {
            waveSurfer.destroy();
        };
    }, []);

    useEffect(() => {
        if (waveForm) handleStartRecording();
    }, [waveForm]);

    const handleStartRecording = () => {
        setRecodingDuration(0);
        setCurrentPlayBackTime(0);
        setTotalDuration(0);
        setIsRecording(true);
        navigator.mediaDevices
            ?.getUserMedia({ audio: true })
            .then((stream) => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioRef.current.srcObject = stream;

                const chunks = [];
                mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
                    const audioUrl = URL.createObjectURL(blob);
                    const audio = new Audio(audioUrl);
                    setRecordedAudio(audio);

                    waveForm.load(audioUrl);
                };
                mediaRecorder.start();
            })
            .catch((error) => {
                console.error("Error accessing microphone:  ", error);
            });
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            waveForm.stop();

            const audioChunks = [];
            mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
                audioChunks.push(event.data);
            });

            mediaRecorderRef.current.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
                const audioFile = new File([audioBlob], "recording.mp3");
                setRenderedAudio(audioFile);
            });
        }
    };

    useEffect(() => {
        if (recordedAudio) {
            const updatePlayBackTime = () => {
                setCurrentPlayBackTime(recordedAudio.currentTime);
            };
            recordedAudio.addEventListener("timeupdate", updatePlayBackTime);

            return () => {
                recordedAudio.removeEventListener("timeupdate", updatePlayBackTime);
            };
        }
    }, [recordedAudio]);

    const handlePlayRecording = () => {
        if (recordedAudio) {
            waveForm.stop();
            waveForm.play();
            recordedAudio.play();
            setIsPlaying(true);
        }
    };
    const handlePauseRecording = () => {
        waveForm.stop();
        recordedAudio.pause();
        setIsPlaying(false);
    };

    const sendRecording = async () => {
        try {
            const formData = new FormData();
            formData.append("audio", renderedAudio);
            const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                params: {
                    from: userInfo?.id,
                    to: currentChatUser?.id,
                },
            });
            if (response.status === 201) {
                socket.current.emit("send-msg", {
                    to: currentChatUser.id,
                    from: userInfo.id,
                    message: response.data.message,
                });
                dispatch({
                    type: reducerCases.ADD_MESSAGE,
                    newMessage: {
                        ...response.data.message,
                    },
                    fromSelf: true,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteAudio = () => {
        hide();
    };
    return (
        <div className="flex text-2xl w-full justify-end items-center">
            <div className="pt-1">
                <FaTrash className="text-panel-header-icon" onClick={handleDeleteAudio} />
            </div>
            <div className="bg-search-input-container-background mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center rounded-full drop-shadow-lg">
                {isRecording ? (
                    <div className="text-red-500 animate-pulse 2-60 text-center">
                        Recording <span>{recodingDuration}s</span>
                    </div>
                ) : (
                    <div>{recordedAudio && <>{!isPlaying ? <FaPlay onClick={handlePlayRecording} /> : <FaStop onClick={handlePauseRecording} />}</>}</div>
                )}
                <div className="w-60" ref={waveFormRef} hidden={isRecording}></div>
                {recordedAudio && isPlaying && <span>{formatTime(currentPlayBackTime)}</span>}
                {recordedAudio && !isPlaying && <span>{formatTime(totalDuration)}</span>}

                <audio ref={audioRef} hidden />
            </div>

            <div className="mr-4">
                {!isRecording ? <FaMicrophone className="text-red-500" onClick={handleStartRecording} /> : <FaPauseCircle className="text-red-500" onClick={handleStopRecording} />}
            </div>
            <div>
                <MdSend className="text-panel-header-icon cursor-pointer mr-4" title="Send audio" onClick={sendRecording} />
            </div>
        </div>
    );
}

export default CaptureAudio;
