# `@dom-utils/selector-path`

Returns unique selector for given element

This project is cloned and modified version of [micnews/css-path](https://github.com/micnews/css-path) repository.

## Usage

```
import { getSelectorPath } from '@dom-utils/selector-path'

getSelectorPath(node);
```

## Options

- useClassName
- rootNode
- minify
- useNodeId

#### Option Usage

```
getSelectorPath(node, { useClassName: true, minify: true , useNodeId: true })
```
