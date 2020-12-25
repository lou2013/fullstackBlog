import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import articleModel from './articleInfoModel';
import path from 'path';
const app = express();
try {
  app.use(bodyParser.json());
  mongoose.connect('mongodb+srv://lou2013:king9797@cluster0.utskd.mongodb.net/fullstack?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  app.use(express.static(path.join(__dirname, '/build')));
  app.post('/api/articles/:name/addcomment', async (req, res) => {
    try {
      const article = await articleModel.findOne({ name: req.params.name });
      const Comment = req.body;
      if (!article) {
        return res.status(404).json({ msg: '404 not found' });
      }
      article.comments.push(Comment);
      await article.save();
      return res.status(200).json(article);
    } catch (err) {
      return res.status(500).json({ msg: 'internal error', err });
    }
  });

  app.post('/api/articles/:name/upvote', async (req, res) => {
    try {
      const article = await articleModel.findOne({ name: req.params.name });
      if (!article) {
        return res.status(404).json({ msg: '404 not found' });
      }
      article.upVotes += 1;
      await article.save();
      res.status(200).json(article);
    } catch (err) {
      return res.status(500).json({ msg: 'internal error', err });
    }
  });

  app.get('/api/articles/:name', async (req, res) => {
    try {
      const { name } = req.params;
      const article = await articleModel.find({ name });
      res.status(200).json(article);
    } catch (err) {
      res.status(500).json({ msg: 'an internal error occured', err: err.stack });
    }
  });
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'));
  });
  app.listen(8000, () => {
    console.log('app is running of port 8000');
  });
} catch (err) {
  console.log(err);
}
