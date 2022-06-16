import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { IconType } from 'react-icons';
import { BiBold, BiUnderline, BiItalic, BiLink } from 'react-icons/bi';

import useSelection from './hook/useSelection';
import { Attribute, ToolbarPostion } from './common/type';
import { changeSelectionTag, checkEverySegmentsHaveThisTag } from './function';

export interface WeToolbarProps {
  editorRef: React.RefObject<HTMLDivElement>;
}

export function WeToolbar({ editorRef }: WeToolbarProps) {
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const { toolbarPosition, showToolbar } = useToolbar(editorRef);

  return (
    <ToolbarWrapper toolbarRef={toolbarRef} showToolbar={showToolbar} toolbarPosition={toolbarPosition}>
      <ButtonWrapper>
        <ToolbarButton divRef={editorRef} changeTagName="b" Icon={BiBold} />
        <ToolbarButton divRef={editorRef} changeTagName="u" Icon={BiUnderline} />
        <ToolbarButton divRef={editorRef} changeTagName="i" Icon={BiItalic} />
        <ToolbarButton divRef={editorRef} changeTagName="a" Icon={BiLink} InputAttributeName="href" />
      </ButtonWrapper>
    </ToolbarWrapper>
  );
}

type ToolbarWrapperProps = {
  toolbarRef: React.RefObject<HTMLDivElement>;
  toolbarPosition: [number, number];
  showToolbar: boolean;
};

const ToolbarWrapper = styled.div`
  ${(props: ToolbarWrapperProps) =>
    props.showToolbar
      ? css`
          opacity: 1;
          visibility: visible;
          margin-top: 10px;
        `
      : css`
          opacity: 0;
          visibility: hidden;
          margin-top: 0px;
        `}
  transition: opacity 0.5s, margin-top 0.2s;

  background-color: white;
  border-top: 2px black solid;
  border-left: 1px rgb(230, 230, 230) solid;
  border-right: 1px rgb(230, 230, 230) solid;

  position: absolute;
  left: ${(props: ToolbarWrapperProps) => props.toolbarPosition && `${props.toolbarPosition[0]}px`};
  top: ${(props: ToolbarWrapperProps) => props.toolbarPosition && `${props.toolbarPosition[1]}px`};

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const ButtonWrapper = styled.div`
  background-color: white;
  border-bottom: 1px rgb(230, 230, 230) solid;
  display: flex;
`;

function useToolbar(toolbarRef: React.RefObject<HTMLDivElement>) {
  const { range, isSelectRange, rect } = useSelection();
  const [toolbarPosition, setToolbarPosition] = React.useState<ToolbarPostion>([0, 0]);
  const [showToolbar, setShowToolbar] = React.useState(false);

  React.useEffect(() => {
    if (
      !range ||
      !isSelectRange ||
      !rect ||
      !toolbarRef.current ||
      (range.commonAncestorContainer && !toolbarRef.current.contains(range.commonAncestorContainer))
    ) {
      setToolbarPosition([0, 0]);
      setShowToolbar(false);
      return;
    }

    setToolbarPosition([rect.left, window.scrollY + rect.bottom]);
    setShowToolbar(true);
  }, [range, isSelectRange, toolbarRef, rect]);

  return { toolbarPosition, showToolbar };
}

interface ToolbarButtonProps {
  divRef: React.RefObject<HTMLDivElement>;
  changeTagName: keyof HTMLElementTagNameMap;
  Icon: IconType;
  Attributes?: Attribute[];
  InputAttributeName?: string;
}

function ToolbarButton({ divRef, changeTagName, Icon, Attributes, InputAttributeName }: ToolbarButtonProps) {
  const onClickCallBack = () => {
    const selection = window?.getSelection();

    if (!selection) {
      return;
    }

    if (!InputAttributeName) {
      if (Attributes) changeSelectionTag(selection, divRef, changeTagName, Attributes);
      else changeSelectionTag(selection, divRef, changeTagName);
      return;
    }

    if (checkEverySegmentsHaveThisTag(changeTagName, [], divRef)) {
      changeSelectionTag(selection, divRef, changeTagName);
    } else {
      const newValue = prompt('URL을 입력하세요', '');
      if (!newValue) return;
      if (Attributes)
        changeSelectionTag(selection, divRef, changeTagName, [
          ...Attributes,
          { name: InputAttributeName, value: newValue },
        ]);
      else changeSelectionTag(selection, divRef, changeTagName, [{ name: InputAttributeName, value: newValue }]);
    }
  };

  return (
    <Button onClick={onClickCallBack}>
      <Icon size="20" />
    </Button>
  );
}

const Button = styled.button`
  padding: 10px 10px 6px 10px;
  box-sizing: border-box;
  vertical-align: center;
  border: 0px rgb(230, 230, 230) solid;
  color: #757575;
  background-color: rgba(255, 255, 255, 0);
  &:hover {
    color: rgb(95, 205, 196);
    cursor: pointer;
  }
`;
