// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.
export const data = {
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