import React from "react";
import { useState, useEffect, useContext } from "react";
import { Text, useInput, Box, useApp } from "ink";
import fs from "fs";
import { UncontrolledTextInput } from "ink-text-input";
import { AppContext } from "./Contexts.js";
import terminalSize from "terminal-size";

// const dataFilePath = path.resolve(__dirname, 'todos.json');
const dataFilePath = new URL("todos.json", import.meta.url).pathname;
function loadTodos() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // Return an empty array if file doesn't exist or data is invalid
    return [];
  }
}
function saveTodos(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data), "utf8");
  } catch (error) {
    console.error("Error saving todo data:", error);
  }
}
function InputBox({
  borderStyle,
  placeholder
}) {
  const {
    ipData,
    setIpData,
    todos,
    setTodos,
    inputFocus,
    setInputFocus,
    updateMode,
    setUpdateMode,
    selectedId,
    color
  } = useContext(AppContext);
  const handleSubmit = val => {
    if (updateMode) {
      val && setTodos(prev => {
        const newTodos = prev.map((todo, index) => {
          return index === selectedId ? val : todo;
        });
        return newTodos;
      });
      setUpdateMode(false);
      setInputFocus(false);
      setIpData("");
      saveTodos(todos);
    } else {
      val && setTodos(prevData => {
        const newData = prevData;
        newData.push(`${val.trim()}`);
        return newData;
      });
      setIpData("");
      setInputFocus(false);
      saveTodos(todos);
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Box, {
    flexGrow: 1,
    borderStyle: borderStyle,
    borderColor: color
  }, /*#__PURE__*/React.createElement(UncontrolledTextInput, {
    focus: inputFocus,
    value: ipData,
    onChange: setIpData,
    placeholder: placeholder,
    onSubmit: handleSubmit
  })));
}
function handleKeyPress(letter, key, appContext) {
  const {
    todos,
    inputFocus,
    setInputFocus,
    selectedId,
    setSelectedId,
    updateMode,
    setUpdateMode,
    setTodos,
    gCount,
    setGCount
  } = appContext;
  if (!key) return;
  if (!updateMode && !inputFocus) {
    if (letter === "a") {
      //adding a todo
      setInputFocus(true);
      if (gCount.length == 1) setGCount([]);
    } else if (letter == "k" || key.upArrow) {
      //navigation
      selectedId > 0 && setSelectedId(prev => prev - 1);
      if (gCount.length == 1) setGCount([]);
    } else if (letter == "j" || key.downArrow) {
      selectedId < todos.length - 1 && setSelectedId(prev => prev + 1);
      if (gCount.length == 1) setGCount([]);
    } else if (letter === "u") {
      //updating
      setUpdateMode(true);
      setInputFocus(true);
      if (gCount.length == 1) setGCount([]);
    } else if (letter === "d") {
      //deleting
      setTodos(prev => {
        const newTodos = prev.filter((_, index) => index != selectedId);
        return newTodos;
      });
      saveTodos(todos);
      if (gCount.length == 1) setGCount([]);
    } else if (letter == "g") {
      if (gCount.length == 0) setGCount(["g"]);
      if (gCount.length == 1) {
        setSelectedId(0);
        setGCount([]);
      }
    } else if (letter === "G") setSelectedId(todos.length - 1);
  }
}
function Header() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Box, {
    justifyContent: "center"
  }, /*#__PURE__*/React.createElement(Text, {
    bold: true
  }, "TODOLISTER")));
}
function TodosListing() {
  //TODO:
  //cli screen instructions --help,--color
  //add a .Dockerfile
  //test it in docker container,
  //git push,npm publish
  const {
    todos,
    terminalWidth,
    selectedId,
    updateMode,
    inputFocus,
    color
  } = useContext(AppContext);
  const lineLength = terminalWidth - 6;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Box, {
    borderColor: color,
    flexDirection: "column",
    borderStyle: "round"
  }, /*#__PURE__*/React.createElement(Box, {
    columnGap: 1,
    flexDirection: "column",
    flexGrow: 1,
    paddingX: 2,
    paddingY: 1
  }, !todos.length && /*#__PURE__*/React.createElement(Box, {
    padding: 1,
    justifyContent: "center",
    alignItems: "center"
  }, /*#__PURE__*/React.createElement(Text, null, "No Todos set")), todos.map((todo, index) => {
    return /*#__PURE__*/React.createElement(Box, {
      key: index
    }, updateMode && selectedId === index ? /*#__PURE__*/React.createElement(InputBox, {
      placeholder: "ENTER UPDATED TODO",
      borderStyle: "classic"
    }) : /*#__PURE__*/React.createElement(Text, {
      color: color,
      inverse: selectedId === index,
      bold: selectedId === index,
      key: index
    }, `${todo}${" ".repeat(Math.floor(todo.length / lineLength + 1) * lineLength - todo.length)}`));
  }), inputFocus && !updateMode && /*#__PURE__*/React.createElement(InputBox, {
    placeholder: "ENTER TODO",
    borderStyle: "round"
  })), /*#__PURE__*/React.createElement(Box, {
    flexDirection: "row",
    gap: 2,
    marginTop: 1,
    justifyContent: "center"
  }, /*#__PURE__*/React.createElement(Text, {
    color: "grey",
    dim: true
  }, /*#__PURE__*/React.createElement(Text, {
    bold: true
  }, "j/\u2193\u02D7"), "select", /*#__PURE__*/React.createElement(Text, {
    bold: true
  }, "\u02D7k/\u2191")), /*#__PURE__*/React.createElement(Text, {
    color: "grey",
    dim: true
  }, /*#__PURE__*/React.createElement(Text, {
    bold: true
  }, "a"), "dd"), /*#__PURE__*/React.createElement(Text, {
    color: "grey",
    dim: true
  }, /*#__PURE__*/React.createElement(Text, {
    bold: true
  }, "u"), "pdate"), /*#__PURE__*/React.createElement(Text, {
    color: "grey",
    dim: true
  }, /*#__PURE__*/React.createElement(Text, {
    bold: true
  }, "d"), "elete"), /*#__PURE__*/React.createElement(Text, {
    color: "grey",
    dim: true
  }, /*#__PURE__*/React.createElement(Text, {
    bold: true
  }, "G\u02D7"), "bottom"), /*#__PURE__*/React.createElement(Text, {
    color: "grey",
    dim: true
  }, /*#__PURE__*/React.createElement(Text, {
    bold: true
  }, "gg\u02D7"), "top"))));
}
function App({
  prefColor
}) {
  const [todos, setTodos] = useState(loadTodos || ["sample"]);
  const [ipData, setIpData] = useState("sample");
  const [inputFocus, setInputFocus] = useState(false);
  const [terminalWidth, setTerminalWidth] = useState(147);
  const [selectedId, setSelectedId] = useState(0);
  const [updateMode, setUpdateMode] = useState(false);
  const [color, _] = useState(prefColor);
  const [gCount, setGCount] = useState([]);
  const {
    exit
  } = useApp();
  useEffect(() => {
    const tSize = terminalSize();
    setTerminalWidth(tSize.columns);
    let todoList = loadTodos();
    setTodos(todoList);
  }, []);
  useInput((letter, key) => {
    handleKeyPress(letter, key, {
      updateMode,
      setUpdateMode,
      selectedId,
      setSelectedId,
      terminalWidth,
      setTerminalWidth,
      todos,
      setTodos,
      ipData,
      setIpData,
      inputFocus,
      setInputFocus,
      gCount,
      setGCount
    });
    if (!inputFocus && !updateMode && letter === "q") {
      saveTodos(todos);
      exit();
    }
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AppContext.Provider, {
    value: {
      updateMode,
      setUpdateMode,
      selectedId,
      setSelectedId,
      terminalWidth,
      setTerminalWidth,
      todos,
      setTodos,
      ipData,
      setIpData,
      inputFocus,
      setInputFocus,
      color,
      gCount,
      setGCount
    }
  }, /*#__PURE__*/React.createElement(Box, {
    flexDirection: "column"
  }, /*#__PURE__*/React.createElement(Header, null), /*#__PURE__*/React.createElement(TodosListing, null))));
}
export default App;