const express = require('express');
const natural = require('natural');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 6969;

const filePath = './data/trained_2k.json'; 

const tokenizer = new natural.WordTokenizer();
// const classifier = new natural.BayesClassifier();
const classifier = new natural.BayesClassifier();

const jsonData = fs.readFileSync(filePath,{ encoding: 'utf8', flag: 'r' }); 
const data = JSON.parse(jsonData);

app.use(express.static('public'));

natural.BayesClassifier.load(filePath, null, function(err, classifier) {
  console.log('data loaded from :' + filePath);
  app.get('/classify', (req, res) => {
    const Feed = req.query.Feed || '';
    const FeedTokens = tokenizer.tokenize(Feed);

    const EmoScore = classifier.classify(FeedTokens.join(' '));
    res.send(`The Feed's emotional score is classified as: ${EmoScore}`);
  });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

