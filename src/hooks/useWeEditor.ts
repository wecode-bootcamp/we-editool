import { useEffect } from 'react';

interface UseWeEditorProps {
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  htmlString: string;
}

const useWeEditor = ({ containerRef, htmlString }: UseWeEditorProps) => {
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = htmlString;
    }
  }, [containerRef, htmlString]);

  useEffect(() => {}, []);
};

export default useWeEditor;
