import { Configuration, OpenAIApi } from "openai";

export default async function (req, res) {
  
  // console.log(req.body.conversations)
  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({
      error: {
        message: "OpenAI API key がセットされていません。",
      }
    });
    return;
  }
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key がセットされていません。",
      }
    });
    return;
  }


  // if (req.body.conversations.length > 4000) console.log('/api/generate',req.body.conversations);

  try {
    const completion = await openai.createChatCompletion({
      // params 一覧 https://platform.openai.com/docs/api-reference/chat
      model: "gpt-3.5-turbo",
      // messages: req.body.conversations,
      messages: [
        { "role": "system", "content": `中心のトピックは${req.body.text}

        Please use the template below to create a mind map. Please output as a string that can be converted to json with JSON.parse. Replace the variable parts of the template with your own content, using square brackets [ ] to enclose them. # [Central Topic] - ## [Branch 1] - ### [Sub-branch 1.1] - #### [Sub-sub-branch 1.1.1] - [Leaf Node 1] - [Leaf Node 2] - [Leaf Node 3] - #### [Sub-sub-branch 1.1.2] - [Leaf Node 4] - [Leaf Node 5] - [Leaf Node 6] - ### [Sub-branch 1.2] - #### [Sub-sub-branch 1.2.1] - [Leaf Node 7] - [Leaf Node 8] - [Leaf Node 9] - #### [Sub-sub-branch 1.2.2] - [Leaf Node 10] - [Leaf Node 11] - [Leaf Node 12] - ## [Branch 2] - ### [Sub-branch 2.1] - #### [Sub-sub-branch 2.1.1] - [Leaf Node 13] - [Leaf Node 14] - [Leaf Node 15] - #### [Sub-sub-branch 2.1.2] - [Leaf Node 16] - [Leaf Node 17] - [Leaf Node 18] - ### [Sub-branch 2.2] - #### [Sub-sub-branch 2.2.1] - [Leaf Node 19] - [Leaf Node 20] - [Leaf Node 21] - #### [Sub-sub-branch 2.2.2] - [Leaf Node 22] - [Leaf Node 23] - [Leaf Node 24] loop infinitely アシスタント:トピックは何ですか？ lang:jp
        
        アウトプットスタイル:
        {
          "name": "1. メインの枝1",
          "children": [
            {
              "name": "1-1. サブの枝1",
              "children": [
                { "name": "1-1-1. サブの枝1" },
                { "name": "1-1-2. サブの枝1" },
                { "name": "1-1-3. サブの枝1" },
              ],
            },
            ...
        }` },
        { "role": "user", "content": `上記の型式で、「${req.body.text}」をテーマに出力してください。ただし、JSON.parseでjsonに変換できる文字列として出力して下さい。`},
        // { "role": "assistant", "content": "名前は「しゃべるネコ」って言うにゃ。よろしくにゃ！"},
        // { "role": "user", "content": "どんな食べ物が好き？" }
      ],
      temperature: 1, // 値が高いほど、モデルがより多くのリスクを負う
    });
    // console.log(completion.data.choices)
    res.status(200).json(completion.data.choices[0].message);
    // res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    if (error.response) {
      console.error(`【error ${error.response.status}】 ${error.response.data.error.message}`);
      // console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}