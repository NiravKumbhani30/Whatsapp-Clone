import { createContext, useContext, useReducer } from "react";

export const stateContext = createContext();

export const StateProvider = ({ initialState, reducer, children }) => <stateContext.Provider value={useReducer(reducer, initialState)}>{children}</stateContext.Provider>;

export const useStateProvider = () => useContext(stateContext);
