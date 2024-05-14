import { createContext } from 'react';
export const AppContext = /*#__PURE__*/createContext({
  updateMode: false,
  setUpdateMode: () => {},
  selectedId: 0,
  setSelectedId: () => {},
  terminalWidth: 147,
  setTerminalWidth: () => {},
  todos: [],
  setTodos: () => {},
  ipData: '',
  setIpData: () => {},
  inputFocus: false,
  setInputFocus: () => {},
  color: '',
  setColor: () => {}
});