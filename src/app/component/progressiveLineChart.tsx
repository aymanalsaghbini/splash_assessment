"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { io } from "socket.io-client";

Chart.register(...registerables);

const ProgressiveLineChart: React.FC = ({ data }: any) => {
  const [chartDatabyAction, setChartData] = useState<[]>([]);
  var socket: any;
  socket = io(process.env.NEXT_PUBLIC_SERVER_URL);

  useEffect(() => {
    socket.on("getUpdateChart", (newData: any) => {
      setChartData(newData);
    });
  }, [socket]);

  const totalDuration = 700;
  const delayBetweenPoints = totalDuration / chartDatabyAction.length;

  const previousY = (ctx: any) =>
    ctx.index === 0
      ? ctx.chart.scales.y.getPixelForValue(100)
      : ctx.chart
          .getDatasetMeta(ctx.datasetIndex)
          .data[ctx.index - 1].getProps(["y"], true).y;

  const animation = {
    x: {
      type: "number",
      easing: "linear",
      duration: delayBetweenPoints,
      from: NaN,
      delay(ctx: any) {
        if (ctx.type !== "data" || ctx.xStarted) {
          return 0;
        }
        ctx.xStarted = true;
        return ctx.index * delayBetweenPoints;
      },
    },
    y: {
      type: "number",
      easing: "linear",
      duration: delayBetweenPoints,
      from: previousY,
      delay(ctx: any) {
        if (ctx.type !== "data" || ctx.yStarted) {
          return 0;
        }
        ctx.yStarted = true;
        return ctx.index * delayBetweenPoints;
      },
    },
  };

  const handleAnimationComplete = () => {
    // we can add additional logic here, such as updating state or triggering other actions
  };

  const chartData = {
    datasets: [
      {
        borderColor: "blue",
        borderWidth: 1,
        radius: 0,
        data: chartDatabyAction,
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    animation,
    interaction: {
      intersect: false,
    },
    plugins: {
      legend: false,
    },
    scales: {
      x: {
        type: "linear",
      },
    },
  };

  return (
    <div>
      <Line
        data={chartData}
        options={
          {
            ...options,
            animation: {
              ...options.animation,
              ontransitionend: handleAnimationComplete,
            },
          } as any
        }
      />
    </div>
  );
};

export default ProgressiveLineChart;
