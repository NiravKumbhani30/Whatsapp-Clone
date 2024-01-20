import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_INITIAL_CONTACTS_ROUTE, gGET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect } from "react";
import ChatLIstItem from "./ChatLIstItem";

function List() {
    const [{ userInfo, userContacts, filteredContacts }, dispatch] = useStateProvider();

    useEffect(() => {
        const getContacts = async () => {
            const {
                data: { users, onlineUsers },
            } = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`);
            dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
            dispatch({ type: reducerCases.SET_USER_CONTACTS, userContacts: users });
        };
        if (userInfo?.id) getContacts();
    }, [userInfo]);

    return (
        <div className=" bg-search-input-container-background flex-grow overflow-hidden max-h-full custom-scrollbar cursor-pointer">
            {filteredContacts && filteredContacts.length > 0
                ? filteredContacts.map((contact) => <ChatLIstItem data={contact} key={contact.id} />)
                : userContacts.map((contact) => <ChatLIstItem data={contact} key={contact.id} />)}
        </div>
    );
}

export default List;
