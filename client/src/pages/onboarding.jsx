import Avatar from "@/components/common/Avatar";
import Input from "@/components/common/Input";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function onboarding() {
    const router = useRouter();
    const [{ userInfo, newUser }, dispatch] = useStateProvider();

    useEffect(() => {
        if (!newUser && !userInfo?.email) router.push("/login");
        else if (!newUser && userInfo?.email) router.push("/");
    }, [newUser, userInfo, router]);

    const [name, setName] = useState(userInfo?.name || "");
    const [about, setAbout] = useState("");
    const [image, setImage] = useState("/default_avatar.png");

    const onBoardUserHandler = async () => {
        if (validateDetails()) {
            const email = userInfo?.email;
            try {
                const { data } = await axios.post(ONBOARD_USER_ROUTE, { name, email, about, image });
                if (data.status) {
                    dispatch({ type: reducerCases.SET_NEW_USER, newUser: false });
                    dispatch({
                        type: "SET_USER_INFO",
                        userInfo: {
                            id: data.user.id,
                            name,
                            email,
                            profileImage: image,
                            status: about,
                        },
                    });
                    router.push("/");
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const validateDetails = () => {
        if (name.length < 3) {
            return false;
        }
        return true;
    };
    return (
        <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col justify-center items-center">
            <div className="flex items-center justify-center gap-2">
                <Image src="/whatsapp.gif" alt="Whatsapp" width={200} height={200} />
                <span className="text-7xl">Whtasapp</span>
            </div>
            <h2 className="text-2xl">Create Your Profile</h2>
            <div className="flex gap-5 mt-6">
                <div className="flex flex-col items-center justify-center mt-5 gap-6">
                    <Input name="Display Name" state={name} setState={setName} label />
                    <Input name="About" state={about} setState={setAbout} label />
                    <div className="flex items-center justify-center">
                        <button className="flex items-center justify-center gap-7 bg-search-input-container-background p-3 rounded-lg" onClick={onBoardUserHandler}>
                            Create Profile
                        </button>
                    </div>
                </div>
                <Avatar type="xl" image={image} setImage={setImage} />
            </div>
        </div>
    );
}

export default onboarding;
