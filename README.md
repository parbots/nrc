# `nrc`

Simple CLI to create a functional react component

<br>

## Quickstart

```bash
npm i -g @pbots/nrc
```

<br>

## Usage

```bash
nrc <component-name>
```

nrc looks for the `src/components` and `components` directories by default

<br>

#### Output:

```tree
./src/components/<component-name>
├──index.js
└──<component-name>.js
```

<br>

## Importing

The `index.js` file allows the component to be imported by its directory name.

### Example

1.  Create the component:

    ```bash
    nrc Button
    ```

2.  Import the component into another component:

    ```js
    // OtherComponent.js

    import Button from '../Button';
    ```

    Or if using **absolute imports**:

    ```js
    // OtherComponent.js

    import Button from 'components/Button';
    ```

<br>

## To specify a different directory, use `-d` or `--dir`

```bash
nrc <component-name> -d /path/to/dir
nrc <component-name> -dir /path/to/dir
```

#### Output:

```tree
./path/to/dir/<component-name>
├──index.js
└──<component-name>.js
```

<br>

## Using Typescript

```bash
nrc <component-name> -t
nrc <component-name> --typescript
```

Creates `.tsx` files instead of `.js`.

<br>

#### Output:

```tree
./src/components/<component-name>
├──index.tsx
└──<component-name>.tsx
```

<br>

## Using CSS modules

```bash
nrc <component-name> -m
nrc <component-name> --module
```

Creates a `<component-name>.module.css` file and imports it into `<component-name>.js`.

<br>

#### Output:

```tree
./src/components/<component-name>
├──index.js
├──<component-name>.js
└──<component-name>.module.css
```

<br>

## Example Usage

```bash
nrc Button -m -t
```

#### Output

```tsx
// Button.tsx

import styles from './Button.module.css';
import React from 'react';

const Button = () => {
    return (
        <div>
            <h1>Button</h1>
        </div>
    );
};

export default Button;
```

```tsx
// index.tsx
export { default } from './Button.tsx';
```

```css
/* Button.module.css */
/* This file is left blank so you can add your own styles */
```

Inspired by [joshwcomeau/new-component](https://github.com/joshwcomeau/new-component).
