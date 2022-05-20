import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';

interface WeEditorProps {
  htmlString?: string;
  setHTMLString?: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  placeholder?: string;
  autofocus?: boolean;
  disabled?: boolean;
  maxLength?: number;
}

const WeEditor: React.FC<WeEditorProps> = ({
  htmlString = '',
  setHTMLString = undefined,
  className = '',
  placeholder = '',
  autofocus = false,
  disabled = false,
  maxLength,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getHTMLString = () => containerRef.current && containerRef.current.innerHTML;

  return (
    <Container
      contentEditable
      ref={containerRef}
      onInput={(event) => {
        if (setHTMLString) {
          setHTMLString(event.currentTarget.innerHTML);
        }
      }}
    />
  );
};

export default WeEditor;

const Container = styled.div``;
