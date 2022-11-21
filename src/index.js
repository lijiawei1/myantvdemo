import G6 from "@antv/g6";

G6.registerNode(
  "card-node",
  {
    draw: (cfg, group) => {
      const color = cfg.error ? "#F4664A" : "#30BF78";

      const x = -200 / 2;
      const y = -60 / 2;

      const keyShape = group.addShape("rect", {
        attrs: {
          x,
          y,
          width: 200,
          height: 60,
          stroke: color,
          fill: "#fff",
          radius: 2
        },
        name: "card-node-keyshape"
      });

      const titleRect = group.addShape("rect", {
        attrs: {
          x,
          y,
          width: 200,
          height: 20,
          stroke: color,
          fill: color,
          radius: 2
        }
      });

      const title = group.addShape("text", {
        attrs: {
          text: cfg.title,
          x: x + 10,
          y: y + 16,
          fill: "#fff",
          textBaseLine: "top"
        },
        name: "card-node-title-keyshape"
      });

      const subGroup = group.addGroup();

      let panelX = 160;
      cfg.panels?.forEach((panel, i) => {
        const panelTitle = subGroup.addShape("text", {
          attrs: {
            text: panel.title,
            x: x + panelX,
            y: y + 38,
            fill: "#ccc",
            textAlign: "center"
          },
          name: "card-node-panel-title-${i}"
        });

        subGroup.addShape("text", {
          attrs: {
            text: panel.value,
            x: x + panelX,
            y: y + 54,
            fill: "#ccc",
            textAlign: "center"
          },
          name: "card-node-panel-value-${i}"
        });

        const titleBBbox = panelTitle.getBBox();
        panelX = titleBBbox.maxX + 20;
      });

      return keyShape;
    },
    // update: undefined
    update: (cfg, item) => {
      const group = item.getContainer();
      const titleShape = group.find(
        (ele) => ele.get("name") === "card-node-title-keyshape"
      );
      titleShape.attr("text", cfg.title);
    }
  },
  "rect"
);

const container = document.getElementById("container");
const width = container.scrollWidth;
const height = container.scrollHeight;

const graph = new G6.Graph({
  container: "container",
  width,
  height,
  fitCenter: true,
  modes: {
    default: ["drag-canvas", "drag-node"]
  },
  fitView: true,
  defaultNode: {
    type: "card-node"
  }
});

const data = {
  nodes: [
    {
      title: "node2",
      error: false,
      nodeType: "b",
      id: "node2",
      nodeLevel: 0,
      panels: [
        { title: "成功率", value: "31%" },
        { title: "耗时", value: "1343ms" },
        { title: "错误数", value: "43" }
      ],
      x: 100,
      y: 200
    },
    {
      title: "node3",
      error: true,
      nodeType: "a",
      id: "node3",
      nodeLevel: 0,
      panels: [
        { title: "成功率1", value: "45%" },
        { title: "耗时2", value: "133ms" },
        { title: "错误数3", value: "2" }
      ],
      x: 100,
      y: 300
    }
  ],
  edges: []
};

graph.data(data);
graph.render();

graph.updateItem(graph.getNodes()[0], {
  title: "new-title"
});

if (typeof window !== "undefined")
  window.onresize = () => {
    if (!graph || graph.get("destroyed")) return;
    if (!container || !container.scrollWidth || !container.scrollHeight) return;
    graph.changeSize(container.scrollWidth, container.scrollHeight);
  };
