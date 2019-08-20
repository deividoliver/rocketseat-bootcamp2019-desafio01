const express = require("express");

const server = express();

var projects = [],
  countRequest = 0;

server.use(express.json());

server.use((req, res, next) => {
  console.time("request");
  console.log(
    `Method: ${req.method}; URL: ${req.url}; Num Request: ${++countRequest}`
  );
  next();
  console.timeEnd("request");
});

function checkProjectExist(req, res, next) {
  const { id } = req.params;
  function find(project) {
    return project.id == id;
  }
  const index = projects.findIndex(find);
  if (index < 0) {
    return res.status(400).json("Project does not exist");
  }
  req.project = projects[index];
  req.index = index;
  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const project = { id: req.body.id, title: req.body.title, tasks: [] };
  projects.push(project);
  return res.json(project);
});

server.post("/projects/:id/tasks", checkProjectExist, (req, res) => {
  const task = req.body.title;
  var project = req.project;

  project.tasks.push(task);
  projects[req.index] = project;

  return res.json(project);
});

server.put("/projects/:id", checkProjectExist, (req, res) => {
  const { title } = req.body;
  var project = req.project;

  project.title = title;
  projects[req.index] = project;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExist, (req, res) => {
  projects.splice(req.index, 1);

  return res.send();
});

server.listen(3000);
