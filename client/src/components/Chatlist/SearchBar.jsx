import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import React from "react";
import { BiSearchAlt2, BiFilter } from "react-icons/bi";

function SearchBar() {
    const [{ contactSearch }, dispatch] = useStateProvider();

    return (
        <div className="bg-search-input-container-background flex py-3 pl-5 items-center gap-3 h-14">
            <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
                <div>
                    <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-xl" />
                </div>
                <div>
                    <input
                        type="text"
                        className="bg-transparent text-sm focus:outline-none text-white w-full"
                        placeholder="Search or start new chat"
                        onChange={(e) => dispatch({ type: reducerCases.SET_FILTERED_CONTACTS, contactSearch: e.target.value })}
                    />
                </div>
            </div>
            <div className="pr-5 pl-3 ">
                <BiFilter className="text-panel-header-icon cursor-pointer text-xl" />
            </div>
        </div>
    );
}

export default SearchBar;
