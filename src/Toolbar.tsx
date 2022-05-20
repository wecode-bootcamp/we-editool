import React from 'react';

interface ToolbarProps {
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

const Toolbar = ({ containerRef }: ToolbarProps) => {
  return <div>Toolbar</div>;
};

export default Toolbar;
