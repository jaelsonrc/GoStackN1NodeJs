const express = require("express");
const cors = require("cors");
const { uuid , isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

function validateId(req, res, next) {
  const id = req.params.id;

  if (!isUuid(id)) return res.status(400).json({ error: 'Invalid repository ID.' });

  return next();
}
app.use('/repositories/:id',validateId);

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.filter((r) => r.title.includes(title))
    : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const id = request.params.id;
  const { title, url, techs } = request.body;
  const index = repositories.findIndex((p) => p.id == id);

  if (index < 0) response.status(400).json({ error: 'Repository not found' });

  const repository = {
    id, title, url, techs, likes: repositories[index].likes
  };

  repositories[index] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const id = request.params.id;
  const index = repositories.findIndex((p) => p.id == id);

  if (index < 0) response.status(400).json({ error: 'Repository not found' });
  repositories.splice(index, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", validateId, (request, response) => {
  const id = request.params.id;
  const index = repositories.findIndex((p) => p.id == id);

  if (index < 0) response.status(400).json({ error: 'Repository not found' });

  repositories[index].likes++;
  response.json(repositories[index]);
});

module.exports = app;
