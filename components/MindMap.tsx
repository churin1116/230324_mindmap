import React, { useEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';
import { Post, PostNode } from '../lib/post';



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

  const handleNodeClick = (node) => {
    const newNodeName = prompt("Enter the name for the new child node:");
    if (newNodeName) {
      const updatedTreeData = JSON.parse(JSON.stringify(treeData));
      console.log(updatedTreeData);
      console.log(node);
      addChildToNode(node, newNodeName);
      setTreeData(updatedTreeData);
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
    // if (!question || !identity1) return;
    setIsLoading(true);
    try {
      const res = await PostNode("/api/generate", { text: question });

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
          <input type="text" className="form-control mb-4" name="question" placeholder="質問" value={question} onChange={(e) => setQuestion(e.target.value)} />
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