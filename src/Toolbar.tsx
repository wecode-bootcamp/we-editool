import React, { useState } from 'react';

interface ToolbarProps {
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

const Toolbar = ({ containerRef }: ToolbarProps) => {
  const openTitleMenu = () => {};

  const setBold = () => {};

  const setUnderLine = () => {};

  const setItalic = () => {};

  return <div>Toolbar</div>;
};

export default Toolbar;
