import React, { useState } from "react";
import { Layer, Line, Stage, Text } from "react-konva";
import LineToolImage from "../../assets/line_tool.png";

const CanvasComponent = () => {
  const [points, setPoints] = useState([]);
  const [pointBTemp, setPointBTemp] = useState(null);
  const [pointCTemp, setPointCTemp] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [closerPoint, setCloserPoint] = useState(null);
  const [distanceAB, setDistanceAB] = useState(null);
  const [distanceBC, setDistanceBC] = useState(null);
  const [distanceAC, setDistanceAC] = useState(null);

  const drawGrid = () => {
    const lines = [];
    const width = window.innerWidth;
    const height = window.innerHeight;
    const gridSize = 10;

    for (let x = gridSize; x < width; x += gridSize) {
      lines.push(
        <Line
          key={`vertical-${x}`}
          points={[x, 0, x, height]}
          stroke="#ddd" // Adjust the grid line color as per your preference
          strokeWidth={1}
        />
      );
    }

    for (let y = gridSize; y < height; y += gridSize) {
      lines.push(
        <Line
          key={`horizontal-${y}`}
          points={[0, y, width, y]}
          stroke="#ddd" // Adjust the grid line color as per your preference
          strokeWidth={1}
        />
      );
    }

    return lines;
  };

  const handleDrawingComplete = (event) => {
    if (selectedTool !== "line" || points.length === 3) {
      return;
    }
    const { x, y } = event.target.getStage().getPointerPosition();
    if (pointBTemp !== null) {
      setPoints([...points, { label: "B", x: x, y: y }]);
      setPointBTemp(null);
    }
    if (pointCTemp !== null) {
      setPoints([...points, { label: "C", x: x, y: y }]);
      setPointCTemp(null);
      setDistanceBC(calculateDistance(points[1], { label: "C", x: x, y: y }));
      setDistanceAC(calculateDistance(points[0], { label: "C", x: x, y: y }));
    }
  };

  const handleDrawing = (event) => {
    if (selectedTool !== "line" || points.length === 3) {
      return;
    }
    const { x, y } = event.target.getStage().getPointerPosition();
    if (points.length === 0) {
      setPoints([{ label: "A", x: x, y: y }]);
      return;
    }
    if (points.length === 2) {
      setDistanceAB(calculateDistance(points[0], points[1]));
      setPointCTemp({ label: "C", x: x, y: y });
      let pointCDistanceFromA = calculateDistance(points[0], { x: x, y: y });
      let pointCDistanceFromB = calculateDistance(points[1], { x: x, y: y });
      if (pointCDistanceFromA < pointCDistanceFromB) {
        setCloserPoint(points[0]);
      } else {
        setCloserPoint(points[1]);
      }
    }
  };

  function calculateDistance(point1, point2) {
    const deltaX = point1.x - point2.x;
    const deltaY = point1.y - point2.y;
    return (Math.sqrt(deltaX ** 2 + deltaY ** 2) / 40).toFixed(2);
  }

  const handleTouchMove = (event) => {
    if (selectedTool !== "line" || points.length === 3) {
      return;
    }
    const { x, y } = event.target.getStage().getPointerPosition();
    if (points.length === 1) {
      setDistanceAB(calculateDistance(points[0], { label: "B", x: x, y: y }));
      setPointBTemp({ label: "B", x: x, y: y });
    }
    if (points.length === 2) {
      if (closerPoint.label === "A") {
        setDistanceAC(calculateDistance(points[0], { label: "C", x: x, y: y }));
      } else {
        setDistanceBC(calculateDistance(points[1], { label: "C", x: x, y: y }));
      }
      setPointCTemp({ label: "C", x: x, y: y });
    }
  };

  return (
    <>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleDrawing}
        onTouchStart={handleDrawing}
        onMouseMove={handleTouchMove}
        onTouchMove={handleTouchMove}
        onMouseUp={handleDrawingComplete}
        onTouchEnd={handleDrawingComplete}
      >
        <Layer>
          {drawGrid()}
          {points.length === 1 && pointBTemp && (
            <Line
              points={(function () {
                let linePoints = [];
                linePoints.push(points[0].x);
                linePoints.push(points[0].y);
                linePoints.push(pointBTemp.x);
                linePoints.push(pointBTemp.y);
                return linePoints;
              })()}
              stroke="black"
              strokeWidth={2}
              tension={0}
              lineCap="round"
            />
          )}
          {points.length === 2 && pointCTemp && (
            <Line
              points={(function () {
                let linePoints = [];
                linePoints.push(closerPoint.x);
                linePoints.push(closerPoint.y);
                linePoints.push(pointCTemp.x);
                linePoints.push(pointCTemp.y);
                return linePoints;
              })()}
              stroke="black"
              strokeWidth={2}
              tension={0}
              lineCap="round"
            />
          )}
          {points.length === 2 && (
            <>
              <Line
                points={(function () {
                  return [points[0].x, points[0].y, points[1].x, points[1].y];
                })()}
                stroke="black"
                strokeWidth={2}
                tension={0}
                lineCap="round"
              />
              {points.map((point, index) => {
                return (
                  <Text
                    key={index}
                    x={point.x - 10}
                    y={point.y - 15}
                    text={point.label}
                    fontSize={15}
                    fontFamily="Calibri"
                    fill="black"
                    align="center"
                    verticalAlign="middle"
                  />
                );
              })}
            </>
          )}
          {points.length === 3 && (
            <>
              <Line
                points={(function () {
                  return [points[0].x, points[0].y, points[2].x, points[2].y];
                })()}
                stroke="black"
                strokeWidth={2}
                tension={0}
                lineCap="round"
              />
              <Line
                points={(function () {
                  return [points[0].x, points[0].y, points[1].x, points[1].y];
                })()}
                stroke="black"
                strokeWidth={2}
                tension={0}
                lineCap="round"
              />
              <Line
                points={(function () {
                  return [points[1].x, points[1].y, points[2].x, points[2].y];
                })()}
                stroke="black"
                strokeWidth={2}
                tension={0}
                lineCap="round"
              />
              {points.map((point, index) => {
                return (
                  <Text
                    key={index}
                    x={point.x - 10}
                    y={point.y - 15}
                    text={point.label}
                    fontSize={15}
                    fontFamily="Calibri"
                    fill="black"
                    align="center"
                    verticalAlign="middle"
                  />
                );
              })}
            </>
          )}
        </Layer>
      </Stage>
      <div className="bottom_navbar">
        <div
          className={`line_tool_container ${
            selectedTool === "line" ? "selected" : undefined
          }`}
          onClick={() => {
            if (selectedTool !== null) {
              setSelectedTool(null);
            } else {
              setSelectedTool("line");
            }
          }}
        >
          <img src={LineToolImage} alt="line_tool" />
        </div>
      </div>
      <button
        className="clear_button"
        onClick={() => {
          setPointBTemp(null);
          setPointCTemp(null);
          setPoints([]);
          setDistanceAB(null);
          setDistanceBC(null);
          setDistanceAC(null);
        }}
      >
        Clear
      </button>
      <div className="triangle_information">
        <span>Scale: 4 Gridpoint = 1 unit</span>
        {distanceAB && <span>Distance AB: {distanceAB}</span>}
        {distanceBC && <span>Distance BC: {distanceBC}</span>}
        {distanceAC && <span>Distance AC: {distanceAC}</span>}
      </div>
    </>
  );
};

export default CanvasComponent;
