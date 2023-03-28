import React, { useEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';
import { Configuration, OpenAIApi } from "openai";

async function generateMindMap(text, apiKey) {
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

  if (!configuration.apiKey) {
    throw new Error("OpenAI API key がセットされていません。");
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `中心のトピックは${text}

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
        }`,
        },
        {
          role: "user",
          content: `上記の型式で、「${text}」をテーマに出力してください。ただし、JSON.parseでjsonに変換できる文字列として出力して下さい。`,
        },
      ],
      temperature: 1, // 値が高いほど、モデルがより多くのリスクを負う
    });
    return completion.data.choices[0].message;
  } catch (error) {
    if (error.response) {
      console.error(
        `【error ${error.response.status}】 ${error.response.data.error.message}`
      );
      return error.response.data;
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return {
        error: {
          message: "An error occurred during your request.",
        },
      };
    }
  }
}


const addChildToNode = (node, newNodeName) => {
  if (!node.children) {
    node.children = [];
  }

  node.children.push({
    name: newNodeName,
    children: [],
  });
};



export default function OrgChartTree() {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState(null);
  const [treeData, setTreeData] = useState([{ name: "Press the button above!" }]);
  const treeContainer = useRef(null);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (treeContainer.current) {
      const dimensions = treeContainer.current.getBoundingClientRect();
      setTranslate({ x: dimensions.width / 2, y: dimensions.height / 2 });
    }
  }, [treeContainer]);

  const separation = {
    siblings: 1,
    nonSiblings: 1,
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setLastMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const dx = e.clientX - lastMousePosition.x;
      const dy = e.clientY - lastMousePosition.y;

      setTranslate((prevTranslate) => ({
        x: prevTranslate.x + dx,
        y: prevTranslate.y + dy,
      }));

      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
  };
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [question, setQuestion] = useState<string>("チャット GPT の使い方、初心者向けに優しく解説する");

  function parseJSON(obj) {
    try {
      console.log(obj)
      // 最初と最後の文字が同じ「'」または「"」であれば削除する
      const firstChar = obj.charAt(0);
      const lastChar = obj.charAt(obj.length - 1);
      if ((firstChar === "'" && lastChar === "'") || (firstChar === '"' && lastChar === '"')) {
        obj = obj.slice(1, -1);
      }
      const replacedString = obj.replace(/`/g, "");

      // 最初の「{」の前の文字列を削除する
      const braceIndex = replacedString.indexOf("{");
      const formattedString = replacedString.slice(braceIndex);

      // 変換後のJSONを作成
      const formattedJson = JSON.parse(formattedString);
      console.log(obj)
      console.log(formattedJson)
      // obj = JSON.parse(obj);
      return formattedJson;
    } catch (e) {
      console.log('error : ',e)
      return null;
    }
  }
  async function onSubmit(e) {
    e.preventDefault();

    if (!apiKey) {
      alert("APIキーが入力されていません。");
      return;
    }

    setIsLoading(true);
    try {
      const res = await generateMindMap(question, apiKey);

      const newData = parseJSON(res.content);
      console.log('newDAta : ',newData)
      setResult(String(res.content));
      // console.log(String(res.content))
      if (newData) {
        setTreeData(newData);
        setIsReady(true)
      }
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
    setIsLoading(false);
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className='px-2 md:px-4 my-5'>
        <input
            type="password"
            className="form-control mb-4"
            name="apikey"
            placeholder="APIキー"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        <input
            type="text"
            className="form-control mb-4"
            name="question"
            placeholder="質問"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        <div>
          {!isLoading ?
            <div className="flex justify-center mt-">
              <button type="submit" className="w-24 bg-main bg-main-hover text-white text-lg font-bold py-1 rounded transition">Generate</button>
            </div>
            :
            <div className="mt-"><div className="loader text-main"></div></div>
          }
        </div>
      </form>
      {/* <div className='my-8'>{result}</div> */}
      <div
          ref={treeContainer}
          className='w-full h-screen'
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <Tree
            data={treeData}
            // data={data3}
            translate={translate}
            separation={separation}
            zoom={0.8}
            initialDepth={2}
            zoomable={true}
            draggable={true}
            // onNodeClick={handleNodeClick}
            // onLinkClick={handleNodeClick}
          />
        </div>
    </>
  );
}
// zoom プロパティは、ツリーの表示倍率を制御し、initialDepth プロパティは、初期表示時に展開されるツリーの深さを制御します。
// siblings と nonSiblings の間隔を1.2に設定しています。これにより、ツリーの上下の間隔が広がり、上半分が隠れなくなります。また、translate の y 値を dimensions.height / 10 に変更して、上部に十分なスペースが確保されるように調整しました。
