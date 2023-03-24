import React, { useEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';

// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.
const data = {
  name: 'CEO',
  children: [
    {
      name: 'Manager',
      attributes: {
        department: 'Production',
      },
      children: [
        {
          name: 'Foreman',
          attributes: {
            department: 'Fabrication',
          },
          children: [
            {
              name: 'Worker',
            },
          ],
        },
        {
          name: 'Foreman',
          attributes: {
            department: 'Assembly',
          },
          children: [
            {
              name: 'Worker',
            },
          ],
        },
      ],
    },
  ],
};

const data2 = {
  name: "1. メインの枝1",
  children: [
    {
      name: "1-1. サブの枝1",
      children: [
        { name: "1-1-1. サブの枝1" },
        { name: "1-1-2. サブの枝1" },
        { name: "1-1-3. サブの枝1" },
      ],
    },
    {
      name: "1-2. サブの枝1",
      children: [
        { name: "1-2-1. サブの枝1" },
        { name: "1-2-2. サブの枝1" },
      ],
    },
    {
      name: "1-3. サブの枝1",
      children: [{ name: "1-3-3. サブの枝1" }],
    },
    { name: "1-4. サブの枝1" },
  ],
};

const data3 = {
  name: "1. メインの枝1",
  children: [
    {
      name: "1-1. サブの枝1",
      children: [
        { name: "1-1-1. サブの枝1" },
        { name: "1-1-2. サブの枝1" },
        { name: "1-1-3. サブの枝1" },
      ],
    },
    {
      name: "1-2. サブの枝1",
      children: [
        { name: "1-2-1. サブの枝1" },
        { name: "1-2-2. サブの枝1" },
      ],
    },
    {
      name: "1-3. サブの枝1",
      children: [{ name: "1-3-1. サブの枝1" }, { name: "1-3-2. サブの枝1" }],
    },
    { name: "1-4. サブの枝1" },
    {
      name: "1-5. サブの枝1",
      children: [
        {
          name: "1-5-1. サブの枝1",
          children: [
            { name: "1-5-1-1. サブの枝1" },
            { name: "1-5-1-2. サブの枝1" },
            { name: "1-5-1-3. サブの枝1" },
          ],
        },
        {
          name: "1-5-2. サブの枝1",
          children: [
            { name: "1-5-2-1. サブの枝1" },
            { name: "1-5-2-2. サブの枝1" },
            {
              name: "1-5-2-3. サブの枝1",
              children: [
                { name: "1-5-2-3-1. サブの枝1" },
                { name: "1-5-2-3-2. サブの枝1" },
              ],
            },
          ],
        },
        {
          name: "1-5-3. サブの枝1",
          children: [{ name: "1-5-3-1. サブの枝1" }],
        },
      ],
    },
    {
      name: "1-6. サブの枝1",
      children: [
        {
          name: "1-6-1. サブの枝1",
          children: [
            { name: "1-6-1-1. サブの枝1" },
            { name: "1-6-1-2. サブの枝1" },
            { name: "1-6-1-3. サブの枝1" },
          ],
        },
        { name: "1-6-2. サブの枝1" },
      ],
    },
  ],
};

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
  const [treeData, setTreeData] = useState(data2);
  const treeContainer = useRef(null);

  useEffect(() => {
    if (treeContainer.current) {
      const dimensions = treeContainer.current.getBoundingClientRect();
      setTranslate({ x: dimensions.width / 2, y: dimensions.height / 2 });
    }
  }, [treeContainer]);

  const separation = {
    siblings: 1,
    nonSiblings: 1.5,
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

  return (
    <div
      ref={treeContainer}
      className='w-full h-screen'
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Tree
        data={data3}
        translate={translate}
        separation={separation}
        zoom={0.8}
        initialDepth={2}
        zoomable={true}
        draggable={true}
        onNodeClick={handleNodeClick}
        // onLinkClick={handleNodeClick}
      />
    </div>
  );
}
// zoom プロパティは、ツリーの表示倍率を制御し、initialDepth プロパティは、初期表示時に展開されるツリーの深さを制御します。
// siblings と nonSiblings の間隔を1.2に設定しています。これにより、ツリーの上下の間隔が広がり、上半分が隠れなくなります。また、translate の y 値を dimensions.height / 10 に変更して、上部に十分なスペースが確保されるように調整しました。