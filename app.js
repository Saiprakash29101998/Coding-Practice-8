const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
module.exports = app;

const dbPath = path.join(__dirname, "todoApplication.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3025, () => {
      console.log("Server Started at http://localhost:3025");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//API 1

app.get("/todos/", async (request, response) => {
  const { status, priority, search_q = "" } = request.query;
  if (status == undefined && priority == undefined) {
    let getTodosQuery = `
        SELECT *
        FROM todo
        WHERE todo
        LIKE '%${search_q}%';
        `;
    const todosArray = await db.all(getTodosQuery);
    response.send(todosArray);
  } else if (status == undefined) {
    let getTodosQuery = `
        SELECT *
        FROM todo
        WHERE todo
        LIKE '%${search_q}%'
        AND priority = '${priority}';
        `;
    const todosArray = await db.all(getTodosQuery);
    response.send(todosArray);
  } else if (priority == undefined) {
    let getTodosQuery = `
        SELECT *
        FROM todo
        WHERE todo
        LIKE '%${search_q}%'
        AND status = '${status}';
        `;
    const todosArray = await db.all(getTodosQuery);
    response.send(todosArray);
  } else {
    let getTodosQuery = `
            SELECT *
            FROM todo
            WHERE todo
            LIKE '%${search_q}%'
            AND status = '${status}'
            AND priority = '${priority}';
            `;
    const todosArray = await db.all(getTodosQuery);
    response.send(todosArray);
  }
});

//API 2

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoQuery = `
         SELECT *
         FROM todo
         WHERE id = ${todoId};
    `;
  let todo = await db.get(getTodoQuery);
  response.send(todo);
});

//API 3

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const addTodoQuery = `
        INSERT INTO todo(todo, priority, status)
        VALUES ('${todo}', '${priority}', '${status}')
    `;
  await db.run(addTodoQuery);
  //   response.send(temp);
  response.send("Todo Successfully Added");
});

//API 4

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { status, priority, todo } = request.body;
  if (status == undefined && priority == undefined) {
    let updateTodoQuery = `
            UPDATE todo
            SET todo = '${todo}'
            WHERE id = ${todoId};
        `;
    await db.run(updateTodoQuery);
    response.send("Todo Updated");
  } else if (priority == undefined && todo == undefined) {
    let updateTodoQuery = `
            UPDATE todo
            SET status = '${status}'
            WHERE id = ${todoId};
        `;
    await db.run(updateTodoQuery);
    response.send("Status Updated");
  } else {
    let updateTodoQuery = `
            UPDATE todo
            SET priority = '${priority}'
            WHERE id = ${todoId};
        `;
    await db.run(updateTodoQuery);
    response.send("Priority Updated");
  }
});

//API 5

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodo = `
        DELETE FROM todo
        WHERE id = ${todoId};
    `;
  await db.run(deleteTodo);
  response.send("Todo Deleted");
});
