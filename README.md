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

### Output:

```tree
./src/components/<component-name>
├──index.js
└──<component-name>.js
```

<br>

## To specify a different directory, use `-d` or `--dir`

```bash
nrc <component-name> -d /path/to/dir
nrc <component-name> -dir /path/to/dir
```

### Output:

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

### Output:

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

### Output:

```tree
./src/components/<component-name>
├──index.js
├──<component-name>.js
└──<component-name>.module.css
```
