import * as React from 'react';
import styled from '@emotion/styled';
import { IconType } from 'react-icons';
import { changeSelectionTag, checkEverySegmentsHaveThisTag } from '../common/function';
import { AttributeInfo } from '../common/type';

interface ToolButtonProps {
  divRef: React.MutableRefObject<HTMLDivElement | null>;
  changeTagName: keyof HTMLElementTagNameMap;
  Icon: IconType;
  Attributes?: AttributeInfo[];
  InputAttributeName?: string;
}

function ToolButton({ divRef, changeTagName, Icon, Attributes, InputAttributeName }: ToolButtonProps) {
  const onClickCallBack = () => {
    if (!InputAttributeName) {
      if (Attributes) changeSelectionTag(divRef, changeTagName, Attributes);
      else changeSelectionTag(divRef, changeTagName);
      return;
    }

    if (checkEverySegmentsHaveThisTag(changeTagName, [], divRef)) {
      changeSelectionTag(divRef, changeTagName);
    } else {
      const newValue = prompt('URL을 입력하세요', '');
      if (!newValue) return;
      if (Attributes)
        changeSelectionTag(divRef, changeTagName, [...Attributes, { name: InputAttributeName, value: newValue }]);
      else changeSelectionTag(divRef, changeTagName, [{ name: InputAttributeName, value: newValue }]);
    }
  };

  return (
    <Button onClick={onClickCallBack}>
      <Icon size="20" />
    </Button>
  );
}

export default ToolButton;

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
