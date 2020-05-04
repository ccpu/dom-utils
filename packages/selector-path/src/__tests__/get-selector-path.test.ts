import { getSelectorPath } from '../get-selector-path';
import document from 'global/document';

describe('getSelectorPath', () => {
  it('the body element', () => {
    expect(getSelectorPath(document.body)).toBe('html > body');
  });

  it('elements not attached to the body', () => {
    const div = document.createElement('div'),
      span = document.createElement('span');

    expect(getSelectorPath(div)).toBe('div');

    div.appendChild(span);

    expect(getSelectorPath(span)).toBe('div > span');
  });

  it('should use classes', () => {
    const div = document.createElement('div');

    div.setAttribute('class', 'beep boop');

    expect(getSelectorPath(div, { useClassName: true })).toBe('div.beep.boop');
  });

  it('should use node id and not classes if present', () => {
    const div = document.createElement('div');

    div.setAttribute('class', 'beep boop');
    div.setAttribute('id', 'hello');

    expect(getSelectorPath(div, { useClassName: true, useNodeId: true })).toBe(
      'div#hello',
    );
  });

  it('should not have nth-child when parent has only one child', () => {
    const div = document.createElement('div');
    const span = document.createElement('span');
    div.appendChild(span);
    expect(getSelectorPath(span)).toBe('div > span');
  });

  it('should have nth-child when parent has multi child with same tag', () => {
    const div = document.createElement('div');
    const span = document.createElement('span');
    const span2 = document.createElement('span');
    div.appendChild(span);
    div.appendChild(span2);
    expect(getSelectorPath(span)).toBe('div > span:nth-child(1)');
  });

  it('should remove space', () => {
    const div = document.createElement('div');
    const span = document.createElement('span');
    div.appendChild(span);
    expect(getSelectorPath(span, { minify: true })).toBe('div>span');
  });

  it('should handle attributes with some whitespace', () => {
    const elm = document.createElement('div');

    elm.setAttribute('class', ' foo\tbar\n');
    expect(getSelectorPath(elm, { useClassName: true, useNodeId: true })).toBe(
      'div.foo.bar',
    );

    elm.setAttribute('class', '');
    expect(getSelectorPath(elm, { useClassName: true, useNodeId: true })).toBe(
      'div',
    );

    elm.setAttribute('id', ' bong ');
    expect(getSelectorPath(elm, { useClassName: true, useNodeId: true })).toBe(
      'div#bong',
    );
  });

  it('should handle elements attached to the body', () => {
    const div = document.createElement('div'),
      div2 = document.createElement('div'),
      text = document.createTextNode('hello, world!');
    const body = document.body;

    body.insertBefore(div, body.childNodes[0]);

    div.setAttribute('class', 'foo bar');

    expect(getSelectorPath(div, { useClassName: true, useNodeId: true })).toBe(
      'html > body > div.foo.bar',
    );

    body.insertBefore(text, body.childNodes[1]);
    body.insertBefore(div2, body.childNodes[2]);

    expect(getSelectorPath(div2)).toBe('html > body > div:nth-child(2)');

    expect(
      getSelectorPath(div2, {
        rootNode: document.documentElement,
        useClassName: true,
        useNodeId: true,
      }),
    ).toBe('body > div:nth-child(2)');

    expect(
      getSelectorPath(div2, {
        rootNode: body,
        useClassName: true,
        useNodeId: true,
      }),
    ).toBe('div:nth-child(2)');

    div.setAttribute('id', 'identifier');

    expect(
      getSelectorPath(div, {
        rootNode: body,
        useClassName: true,
        useNodeId: true,
      }),
    ).toBe('div#identifier');
  });
});
