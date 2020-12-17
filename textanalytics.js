const express = require('express')
const app = express()
const port = 3000
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

const key = '41ca87f466e84a3b9e87428dbd628587';
const endpoint = 'https://systemint.cognitiveservices.azure.com/';

const textAnalyticsClient = new TextAnalyticsClient(endpoint,  new AzureKeyCredential(key));

const bodyParser = require('body-parser')

//swagger defination
const options = {
    swaggerDefinition: {
      info: {
        title: "Text analytics Azure Api",
        version: "1.0.0",
        description: "Text,language analysis and keyphrases generator ",
      },
      host: "localhost:3000",
      basePath: "/",
    },
    apis: ["./textanalytics.js"],
  };

const specs = swaggerJsdoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(bodyParser.json())

 

 /**
 * @swagger
 * /sentiment/{query}:
 *    get:
 *      description: Get response
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Got response 
 *          500:
 *              description: Error
 *      parameters:
 *          - name: query
 *            in: path
 *            required: true
 *            type: string
 *
 */
app.get('/sentiment/:query', async (req, res) => {
  
        var paramater=req.params.query;
        console.log(paramater)

        var sentimentObj;
        if(paramater===undefined || paramater===null || paramater===""){
            res.send('Please send the body')
        }else{

        
        const sentimentInput = [
            paramater
        ];

        try {

            const sentimentResult = await textAnalyticsClient.analyzeSentiment(sentimentInput);
           
            sentimentResult.forEach(document => {

                 sentimentObj={
                    id:document.id,
                    document_Sentiment:document.sentiment,
                    scorespositive:document.confidenceScores.positive.toFixed(2),
                    scoresnegative:document.confidenceScores.negative.toFixed(2),
                    scoresneutral:document.confidenceScores.neutral.toFixed(2),
                    sentenceSentiment:document.sentences.length

                }
                
               
            });
            res.send(200,sentimentObj)
            res.end();

        } catch (e) {
            res.send(e.message); 
        } finally {
            console.log('Sentiment analyzed');
        }
    }
})




 /**
 * @swagger
 * /detectlanguage/{query}:
 *    get:
 *      description: Get response
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Got response 
 *          500:
 *              description: Error
 *      parameters:
 *          - name: query
 *            in: path
 *            required: true
 *            type: string
 *
 */
app.get('/detectlanguage/:query', async (req, res) => {
 
    console.log(req.body.language)
    var paramater=req.params.query;

    if(paramater===undefined || paramater===null || paramater===""){
        res.send('Please send the body')
    }else{
    const languageinput = [
        paramater
    ];

    try {

        const languageResult = await textAnalyticsClient.detectLanguage(languageinput);
        
        const detectedln=languageResult[0].primaryLanguage.name;
        res.json('The language used is ' + detectedln);
        
        res.sendStatus(200)
        res.end();

    } catch (e) {
        res.send(e.message); 
        
    } finally {
        console.log('Language detected');
    }
}
   
})


/**
 * @swagger
 * /keyphrases/{query}:
 *    get:
 *      description: Get response
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Got response 
 *          500:
 *              description: Error
 *      parameters:
 *          - name: query
 *            in: path
 *            required: true
 *            type: string
 *
 */
app.get('/keyphrases/:query', async (req, res) => {

    var paramater=req.params.query;
    if(paramater===undefined || paramater===null || paramater===""){
        res.send('Please send the body')
    }else{
  
    const keyphraseInput = [
        paramater
    ];

    try {
        const keyPhraseResult = await textAnalyticsClient.extractKeyPhrases(keyphraseInput);
        console.log(keyPhraseResult)
        keyPhraseResult.forEach(document => {

            console.log(document.keyPhrases)
            res.send('Key Phrases : '+document.keyPhrases);
            
        });
        
        res.sendStatus(200)
        res.end();

    } catch (e) {
         
         res.send(e.message); 
        
    } finally {
        console.log('Key phrases extracted');
    }
}
   
})
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })