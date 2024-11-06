import React, { useEffect, useRef } from "react";
// Line 组件：用于绘制折线或平滑曲线图
const Line = ({
  data,
  xFieldName,
  yFieldName,
  color = "black",
  lineWidth = 2,
  smooth = false,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current; // 获取 canvas 元素
    const context = canvas.getContext("2d"); // 获取 2D 绘图上下文

    // 计算数据点的最小值和最大值，用于缩放
    const { minX, maxX, minY, maxY } = data.reduce(
      (acc, d) => {
        const x = d[xFieldName];
        const y = d[yFieldName];
        return {
          minX: Math.min(acc.minX, x),
          maxX: Math.max(acc.maxX, x),
          minY: Math.min(acc.minY, y),
          maxY: Math.max(acc.maxY, y),
        };
      },
      {
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity,
      }
    );

    // 定义缩放函数，将数据值按比例缩放到 canvas 宽度和高度
    const scaleX = (xValue) => ((xValue - minX) / (maxX - minX)) * canvas.width;
    const scaleY = (yValue) =>
      (1 - (yValue - minY) / (maxY - minY)) * canvas.height;

    const drawLine = () => {
      // 填充背景颜色为红色
      context.fillStyle = "red";
      context.fillRect(0, 0, canvas.width, canvas.height);
      if (data.length < 2) return; // 如果数据点少于两个则不绘图
      // 设置线条样式
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.lineJoin = "round";
      context.lineCap = "round";
      // 开始绘制路径
      context.beginPath();
      context.moveTo(scaleX(data[0][xFieldName]), scaleY(data[0][yFieldName]));
      if (smooth) {
        // 绘制平滑曲线
        for (let i = 0; i < data.length - 1; i++) {
          const x0 = scaleX(data[i][xFieldName]);
          const y0 = scaleY(data[i][yFieldName]);
          const x1 = scaleX(data[i + 1][xFieldName]);
          const y1 = scaleY(data[i + 1][yFieldName]);
          // 使用正弦波来平滑连接两个点
          for (let t = 0; t <= Math.PI; t += 0.05) {
            const xt = x0 + (x1 - x0) * (t / Math.PI);
            const yt = y0 + ((y1 - y0) * (1 - Math.cos(t))) / 2;
            context.lineTo(xt, yt);
          }
        }
      } else {
        // 绘制简单的折线连接
        for (let i = 1; i < data.length; i++) {
          context.lineTo(
            scaleX(data[i][xFieldName]),
            scaleY(data[i][yFieldName])
          );
        }
      }
      context.stroke(); // 完成绘制
    };
    const drawCircle = (xyPoint) => {
      // 在鼠标移动到最近的点处绘制一个白色圆点
      context.beginPath();
      context.arc(xyPoint.x, xyPoint.y, 2, 0, Math.PI * 2);
      context.fillStyle = "white";
      context.fill();
      context.closePath();
    };
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect(); // 获取 canvas 的边界
      const mouseX = event.clientX - rect.left; // 计算鼠标在 canvas 内的 x 坐标
      // 找到距离鼠标最近的点
      const closestPoint = data.reduce((prev, curr) => {
        const prevX = scaleX(prev[xFieldName]);
        const currX = scaleX(curr[xFieldName]);
        return Math.abs(mouseX - prevX) < Math.abs(mouseX - currX)
          ? prev
          : curr;
      });
      const scaledPoint = {
        x: scaleX(closestPoint[xFieldName]),
        y: scaleY(closestPoint[yFieldName]),
      };
      drawLine(); // 重新绘制图表
      drawCircle(scaledPoint); // 绘制高亮圆点
    };
    drawLine(); // 初始绘制图表
    canvas.addEventListener("mousemove", handleMouseMove); // 添加鼠标移动事件监听器

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove); // 清除事件监听器
    };
  }, [data, xFieldName, yFieldName, color, lineWidth, smooth]);

  // 渲染 canvas 元素，宽度和高度均设为 400
  return <canvas ref={canvasRef} width={400} height={400} />;
};

// 示例数据
const data = [
  { time: 0, price: 10 },
  { time: 1, price: 20 },
  { time: 2, price: 15 },
  { time: 3, price: 30 },
  { time: 4, price: 25 },
  { time: 5, price: 10 },
];

// 主应用组件
export function App(props) {
  return (
    <div className="App">
      <Line
        smooth
        data={data}
        xFieldName="time"
        yFieldName="price"
        color="blue" // 线条颜色
        lineWidth={3} // 线条宽度
      />
    </div>
  );
}
