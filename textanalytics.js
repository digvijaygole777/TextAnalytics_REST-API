"use strict";
const express = require('express')
const app = express()
const port = 3000
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const { text } = require('body-parser');

const key = '41ca87f466e84a3b9e87428dbd628587';
const endpoint = 'https://systemint.cognitiveservices.azure.com/';

const textAnalyticsClient = new TextAnalyticsClient(endpoint,  new AzureKeyCredential(key));

const bodyParser = require('body-parser')

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(bodyParser.json())

app.get('/sentiment', async (req, res) => {
 
        console.log(req.body.sentiment)
        const sentimentInput = [
            req.body.sentiment
        ];

        try {

            const sentimentResult = await textAnalyticsClient.analyzeSentiment(sentimentInput);
            sentimentResult.forEach(document => {

                var sentimentObj={
                    id:document.id,
                    document_Sentiment:document.sentiment,
                    scorespositive:document.confidenceScores.positive.toFixed(2),
                    scoresnegative:document.confidenceScores.negative.toFixed(2),
                    scoresneutral:document.confidenceScores.neutral.toFixed(2),
                    sentenceSentiment:document.sentences.length

                }
               res.send(sentimentObj)
               
            });
    res.sendStatus(200)

        } catch (e) {
           res.sendStatus(500)
        } finally {
            console.log('Sentiment analyzed');
        }
       
})

app.get('/detectlanguage', async (req, res) => {
 
    console.log(req.body.language)
    const languageinput = [
        req.body.language
    ];

    try {

        const languageResult = await textAnalyticsClient.detectLanguage(languageinput);
        
        const detectedln=languageResult[0].primaryLanguage.name;
        res.json('The language used is ' + detectedln);
        
        res.sendStatus(200)

    } catch (e) {
        res.sendStatus(500) ;
        
    } finally {
        console.log('Language detected');
    }
   
})


app.get('/keyphrases', async (req, res) => {
 
     
    
    const keyphraseInput = [
        req.body.sentence
    ];

    try {

        const keyPhraseResult = await textAnalyticsClient.extractKeyPhrases(keyphraseInput);
        console.log(keyPhraseResult)
        keyPhraseResult.forEach(document => {
            console.log(document.keyPhrases)
            res.send('Key Phrases : '+document.keyPhrases);
            
        });
        
        res.sendStatus(200)

    } catch (e) {
         
        res.sendStatus(500) ;
        
    } finally {
        console.log('Key phrases detected');
    }
   
})
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })