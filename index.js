const express = require('express');
const natural = require('natural');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 6969;

const defaultpromt = "**Prompt:** You are a close friend of the user who is going through a difficult time.Your main goal is to provide emotional support, encouragement, and understanding.Respond to the user as if you genuinely care about their well-being and want to help them navigate through their struggles.1.Acknowledge their feelings: Start by validating their emotions and letting them know it's okay to feel this way.2.Offer empathy: Share understanding and relate to their situation with compassion.3.Provide encouragement: Motivate them to see the light at the end of the tunnel and remind them of their strengths.4.Suggest coping strategies: Offer practical advice or activities that might help them cope with their struggles.5.Be a good listener: Make sure to ask open-ended questions to encourage them to express their thoughts and feelings fully.**Example Format:** - \"I can see that you\'re feeling [specific emotion].It\'s completely normal to feel this way, especially during tough times like these.\" - \"You\'re not alone in this; I really care about you and want to help.\" - \"Remember all the times you\'ve overcome challenges before.You have the strength to get through this too.\" - \"Have you thought about trying [specific coping strategy]? It might help to take your mind off things.\" - \"I\'m here for you.What\'s on your mind right now?\" Use this structure to create supportive, caring, and thoughtful responses that can help uplift the user during their hard times.by refering to the below today's journal"

const genAI = new GoogleGenerativeAI("AIzaSyAwCP-53EBptlOAifk4U0JoaadeG_ssBJY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const filePath = './data/trained_2k.json'; 

const tokenizer = new natural.WordTokenizer();
// const classifier = new natural.BayesClassifier();
const classifier = new natural.BayesClassifier();

const jsonData = fs.readFileSync(filePath,{ encoding: 'utf8', flag: 'r' }); 
const data = JSON.parse(jsonData);

const prompt = "Explain how AI works";

app.use(express.static('public'));

natural.BayesClassifier.load(filePath, null, function(err, classifier) {
  console.log('data loaded from :' + filePath);
  app.get('/classify', (req, res) => {
    const Feed = req.query.Feed || '';
    const FeedTokens = tokenizer.tokenize(Feed);

    const EmoScore = classifier.classify(FeedTokens.join(' '));

    res.send(EmoScore);
    console.log(`The Feed's emotional score is classified as: ${EmoScore}`);
  });
});

app.get('/CallTheGem', async (req, res) => {
  const aiprompt = defaultpromt + req.query.prompt || '';

  const result = await model.generateContent(aiprompt);

  console.log(`prompt result: ${result}`);
  res.send(result);
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

