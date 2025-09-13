const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
const { v4: uuid } = require('uuid');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

const posts = [];
posts.push({
  id: uuid(),
  author: 'Sample Author',
  title: 'Hello, Blog!',
  content: 'This is a sample post. Edit or delete me!',
  createdAt: new Date()
});

app.get('/', (req, res) => {
  const sorted = [...posts].sort((a, b) => b.createdAt - a.createdAt);
  res.render('index', { posts: sorted });
});

app.post('/posts', (req, res) => {
  const { author, title, content } = req.body;
  if (!author || !title || !content) {
    return res.status(400).send('Please provide author, title, and content.');
  }
  posts.push({ id: uuid(), author, title, content, createdAt: new Date() });
  res.redirect('/#posts');
});

app.get('/posts/:id/edit', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).send('Post not found.');
  res.render('edit', { post });
});

app.put('/posts/:id', (req, res) => {
  const idx = posts.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).send('Post not found.');
  const { author, title, content } = req.body;
  posts[idx] = { ...posts[idx], author, title, content };
  res.redirect('/#posts');
});

app.delete('/posts/:id', (req, res) => {
  const idx = posts.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).send('Post not found.');
  posts.splice(idx, 1);
  res.redirect('/#posts');
});

app.use((req, res) => {
  res.status(404).send('Page not found.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Blog app running on http://localhost:${PORT}`);
});
