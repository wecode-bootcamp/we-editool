import { Attribute } from '../common/type';

export default function getAttributes(element: Element): Attribute[] {
  const attributeNames = element.getAttributeNames();
  return attributeNames.map((attributeName) => ({
    name: attributeName,
    value: element.getAttribute(attributeName) ?? '',
  }));
}
