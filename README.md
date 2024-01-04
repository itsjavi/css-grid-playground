# CSS Grid Playground! 2024 [![Build Status](https://travis-ci.org/purplecones/css-grid-playground.svg?branch=master)](https://travis-ci.org/purplecones/css-grid-playground)

CSS Grid Playground! lets you visually play with the [CSS Grid Layout](https://www.w3.org/TR/css3-grid-layout/) elements in the browser to quickly sketch up a layout for your site.

The layout, which provides a basic way of editing a container and its direct children, renders changes instantly as you update the corresponding CSS giving you instant feedback.

![Demo](demo.gif)

## Tech Stack
- CSS Grid Layouts
- [Vite + React.js + SWC](https://github.com/vitejs/vite-plugin-react-swc)
- Bun as a JS runtime, bundler and package manager
- SCSS Modules
- Github Actions as CI/CD
- Github Pages for deployments


## Getting Started

First, you will need [Bun](https://bun.sh/) 1.0.20 or higher installed on your machine.
Then, you can run the following commands after cloning this repository, to get started:

```bash
bun install
bun run dev
```


## Background

Inspired in "CSS Grid Playground", the original work from [@purplecones](https://github.com/purplecones/css-grid-playground), this project aims to provide better maintainability with a more modern codebase, and also a richer user experience while keeping its simplicity.
