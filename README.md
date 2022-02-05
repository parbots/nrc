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

nrc looks for the `./components` directory by default

<br>

### Output:

```tree
./components/<component-name>
├──index.js
└──<comonent-name>.js
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
└──<comonent-name>.js
```

<br>

## Using CSS modules

```bash
nrc <component-name> -m
nrc <component-name> --module
```

### Output:

```tree
./components/<component-name>
├──index.js
├──<comonent-name>.js
└──<comonent-name>.module.css
```
