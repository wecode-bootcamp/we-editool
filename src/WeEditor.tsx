import * as React from 'react';
import { NodeHtmlMarkdown } from 'node-html-markdown';

import { WE_EDITOR_ID } from './common/const';
import usePressKey from './hook/usePressKey';

import { WeToolbar } from './WeToolbar';

export interface WeEditorRef {
  getHTML: () => string;
  getMarkdown: () => string;
}

export interface WeEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  initialHTML?: string;
  initialMarkdown?: string;
}

export const WeEditor = React.forwardRef<WeEditorRef, WeEditorProps>(
  ({ initialHTML, initialMarkdown, ...divProps }, forwardedRef) => {
    const divRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (divRef.current && initialHTML) {
        divRef.current.innerHTML = initialHTML;
      }

      if (divRef.current && initialMarkdown) {
        divRef.current.innerHTML = initialMarkdown;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useImperativeHandle(forwardedRef, () => ({
      getHTML: () => divRef.current?.innerHTML ?? '',
      getMarkdown: () => NodeHtmlMarkdown.translate(divRef.current?.innerHTML ?? ''),
    }));

    usePressKey(divRef);

    return (
      <>
        <div {...divProps} contentEditable id={WE_EDITOR_ID} ref={divRef} />
        <WeToolbar editorRef={divRef} />
      </>
    );
  }
);
