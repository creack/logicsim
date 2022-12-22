import React from "react";
import { Group, Rect } from "react-konva";

export const ScreenCtx = React.createContext({
  screenWidth: 0,
  screenHeight: 0,
});

export const PaneCtx = React.createContext({
  sidePaneWidth: 0,
  sidePaneHeight: 0,
  centerPaneX: 0,
  centerPaneY: 0,
  centerPaneWidth: 0,
  outerBorderWidth: 0,
  innerBorderWidth: 0,
});

export const UILayoutHeader: React.FC<{
  children: JSX.Element | JSX.Element[];
}> = ({ children }) => {
  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);

  return (
    <Group x={0} y={0} width={screenWidth} height={screenHeight * 0.07}>
      <Rect
        fill="rgb(35, 35, 35)"
        stroke="black"
        strokeWidth={1}
        x={0}
        y={0}
        width={screenWidth}
        height={screenHeight}
      />
      <Rect
        fill="rgb(53, 53, 53)"
        x={0}
        y={screenHeight * 0.07}
        width={screenWidth}
        height={screenHeight * 0.02}
      />
      {children}
    </Group>
  );
};

export const UILayoutFooter: React.FC<{
  children: JSX.Element | JSX.Element[];
}> = ({ children }) => {
  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);

  return (
    <>
      <Rect
        fill="rgb(53, 53, 53)"
        strokeWidth={20}
        x={0}
        y={screenHeight - screenHeight * 0.07 - screenHeight * 0.02}
        width={screenWidth}
        height={screenHeight * 0.02}
      />
      <Group
        x={0}
        y={screenHeight - screenHeight * 0.07}
        width={screenWidth}
        height={screenHeight * 0.07}
      >
        {children}
      </Group>
    </>
  );
};

export const UILayoutMain: React.FC<{
  children: JSX.Element | JSX.Element[];
}> = ({ children }) => {
  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);
  const sidePaneWidthRatio = 0.026;
  const outerBorderRatio = 0.015;
  const innerBorderRatio = 0.005;
  const headerHeightRatio = 0.07;
  const headerBorderRatio = 0.02;

  const outerBorderWidth = screenWidth * outerBorderRatio;
  const innerBorderWidth = screenHeight * innerBorderRatio;

  const sidePaneWidth = screenWidth * sidePaneWidthRatio;
  const sidePaneHeight =
    screenHeight -
    (screenHeight * headerHeightRatio +
      screenWidth * outerBorderRatio -
      (screenHeight * innerBorderRatio) / 2) *
      2;
  const headerHeight = screenHeight * headerHeightRatio;
  const centerPaneX = sidePaneWidth + outerBorderWidth;
  const centerPaneY = headerHeight + outerBorderWidth;
  const centerPaneWidth =
    screenWidth * (1 - sidePaneWidthRatio * 2 - outerBorderRatio * 2);

  return (
    <PaneCtx.Provider
      value={{
        sidePaneWidth,
        sidePaneHeight,
        centerPaneX,
        centerPaneY,
        centerPaneWidth,
        outerBorderWidth,
        innerBorderWidth,
      }}
    >
      <Rect
        fill="rgb(53, 53, 53)"
        x={sidePaneWidth}
        y={screenHeight * headerHeightRatio}
        width={screenWidth - sidePaneWidth * 2}
        height={screenHeight - screenHeight * headerHeightRatio * 2}
      />
      <Rect
        fill="rgb(50, 50, 50)"
        stroke="rgb(70, 70, 70)"
        strokeWidth={innerBorderWidth}
        x={centerPaneX}
        y={centerPaneY}
        width={centerPaneWidth}
        height={sidePaneHeight}
      />
      <Group
        x={0}
        y={
          screenHeight *
          (headerHeightRatio + headerBorderRatio + innerBorderRatio * 2)
        }
        width={0}
        height={0}
      >
        {children}
      </Group>
    </PaneCtx.Provider>
  );
};
