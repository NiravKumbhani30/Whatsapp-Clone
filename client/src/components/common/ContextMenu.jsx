import React, { useEffect, useRef } from "react";

function ContextMenu({ options, coordinates, ContextMenu, setContextMenu }) {
    const ContextMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (e.target.id !== "context-opener") {
                if (ContextMenuRef.current && !ContextMenuRef.current.contains(e.target)) {
                    setContextMenu(false);
                }
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.addEventListener("click", handleClickOutside);
        };
    }, []);

    const handleClick = (e, callback) => {
        e.stopPropagation();
        setContextMenu(false);
        callback();
    };

    return (
        <div className={`bg-dropdown-background fixed py-2 z-[100] shadow-xl`} ref={ContextMenuRef} style={{ top: coordinates.y, left: coordinates.x }}>
            <ul>
                {options.map(({ name, callback }) => (
                    <li className="px-4 py-1.5 cursor-pointer hover:bg-background-default-hover" key={name} onClick={(e) => handleClick(e, callback)}>
                        <span className="text-white">{name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ContextMenu;
