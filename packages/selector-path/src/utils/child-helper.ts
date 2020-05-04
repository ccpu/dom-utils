export const findChildWithSameTag = (
  elm: Element | (Node & ParentNode),
  tagName: string,
): ChildNode[] => {
  const childs = Array.from(elm.childNodes);

  const elements = childs.filter(
    (x) =>
      (x as Element).tagName &&
      (x as Element).tagName.toLowerCase() === tagName,
  );
  return elements;
};
