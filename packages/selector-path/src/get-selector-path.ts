import trim from 'trim';
import { SelectorPathOptions } from './typings';
import { findChildWithSameTag } from './utils';

const classSelector = (className: string): string => {
  const selectors = className.split(/\s/g);
  const array: string[] = [];

  for (let i = 0; i < selectors.length; ++i) {
    if (selectors[i].length > 0) {
      array.push(`.${selectors[i]}`);
    }
  }

  return array.join('');
};

const nthChild = (elm): number | undefined => {
  let childNumber = 0;
  const childNodes = elm.parentNode.childNodes;
  let index = 0;

  for (; index < childNodes.length; ++index) {
    const child = childNodes[index];
    if (child.nodeType === 1) {
      ++childNumber;
    }

    if (child === elm) {
      return childNumber;
    }
  }

  return undefined;
};

const path = (
  elm: Element,
  options: SelectorPathOptions = {},
  list: string[] = [],
): string[] => {
  const tag = elm.tagName.toLowerCase();
  const selector = [tag];
  const className = elm.getAttribute('class');
  const id = elm.getAttribute('id');

  const { rootNode, useClassName, useNodeId } = options;

  if (id && useNodeId) {
    list.unshift(tag + '#' + trim(id));
    return list;
  }

  if (className && useClassName) selector.push(classSelector(className));

  if (
    tag !== 'html' &&
    tag !== 'body' &&
    elm.parentNode &&
    findChildWithSameTag(elm.parentNode, tag).length > 1
  ) {
    selector.push(':nth-child(' + nthChild(elm) + ')');
  }

  list.unshift(selector.join(''));

  if (
    elm.parentNode &&
    elm.parentNode !== rootNode &&
    (elm.parentNode as HTMLElement).tagName
  ) {
    path(elm.parentNode as HTMLElement, options, list);
  }

  return list;
};

export const getSelectorPath = (
  elm: Element,
  options: SelectorPathOptions = {},
): string => {
  if (options.minify) {
    return path(elm, options, []).join('>');
  }
  return path(elm, options, []).join(' > ');
};

export default getSelectorPath;
