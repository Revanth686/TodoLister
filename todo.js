#!/usr/bin/env node
const {
  intro,
  note,
  outro,
  select,
  text,
  log,
  spinner,
  confirm,
  cancel,
  isCancel,
} = require("@clack/prompts");
const fs = require("fs");
const pc = require("picocolors");
const path = require("path");

function writeToFile(todos) {
  fs.writeFileSync(
    path.join(__dirname, "/todos.json"),
    JSON.stringify(todos),
    "utf-8"
  );
}

async function loadFromFile() {
  const data = fs.existsSync(path.join(__dirname, "todos.json"))
    ? fs.readFileSync(path.join(__dirname, "todos.json"), "utf-8")
    : "[]";
  const d = JSON.parse(data);
  // console.log("read file parse ", d);
  return d;
}

function logItems(allTodos) {
  const todoList = allTodos.map((todo) => {
    return ` ${pc.yellow(`${pc.bold(todo.id)}. ${todo.title}`)} `;
  });
  log.info(
    `${pc.underline(pc.yellow("All todos:"))}\n${
      todoList.length ? todoList.join("\n") : pc.yellow("No todos set")
    }`
  );
}

function handleCancellation(val) {
  if (isCancel(val)) {
    cancel(pc.yellow(`Operation cancelled`));
    process.exit(0);
  }
}

const todo = (async () => {
  let allTodos = await loadFromFile();
  let option;

  intro(pc.blue(pc.bold(`Welcome to TodoLister`)));
  log.message(pc.dim(pc.bold(`hit ctrl+c to exit`)));

  do {
    option = await select({
      message: pc.green(pc.bold("Select action")),
      options: [
        { value: 1, label: "1.get all todos" },
        { value: 2, label: "2.add new todo" },
        { value: 3, label: "3.del a todo" },
        { value: 4, label: "4.Purge all" },
      ],
    });
    handleCancellation(option);
    // const s = spinner();
    // s.start();
    // s.stop();

    //DISPLAY ALL TODOS
    if (option === 1) {
      // allTodos = ["one", "to", "thre"];
      const allTodos = await loadFromFile();
      logItems(allTodos);
    }
    //ADDING A NEW TODO
    else if (option === 2) {
      allTodos = await loadFromFile();
      let index = -1;
      do {
        index = Math.floor(Math.random() * 100);
      } while (allTodos.find((todo) => todo.id === index));
      // } while (todoIndexes.includes(index));
      const todoValue = await text({
        message: pc.green(pc.bold("enter todo :")),
        placeholder: "become elon musk",
      });
      handleCancellation(todoValue);
      allTodos.push({
        id: index,
        title: todoValue,
      });
      await writeToFile(allTodos);
      logItems(allTodos);
    }
    //DEL A TODO WITH ID
    else if (option === 3) {
      allTodos = await loadFromFile();
      const delId = await text({
        message: pc.green(pc.bold("enter ID of todo u wanna del")),
        placeholder: "ex: 1",
      });
      handleCancellation(delId);
      allTodos = allTodos.filter((todo) => todo.id !== Number(delId));
      await writeToFile(allTodos);
      log.info(`successfully deleted ${delId}`);
      logItems(allTodos);
    } else {
      //DEL ALL TODOS
      allTodos = [];
      await writeToFile(allTodos);
      log.info("deleted all todos");
    }
    //CONFIRMING TO EXIT
    const confirming = await confirm({
      message: pc.green(pc.bold("Wanna exit? ")),
    });
    option = confirming ? 0 : option;
  } while (option);

  outro(pc.blue(pc.bold(`Arigatou gozaimasu!!`)));
})();
