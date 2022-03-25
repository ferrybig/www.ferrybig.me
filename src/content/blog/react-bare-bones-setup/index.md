---
date: "2022-03-23"
tags: ["blog", "react", "webpack"]
extraTags: ["bare-bones"]
---
# React bare bones setup

When you start with React, it is common that you just start a project with the
CRA tool. While this quickly makes a project, it also does lots of magic in the
background to make it work. For learning purposes, it can be better to write
your own configuration to build a react application.

## Very simple setup

It is possible to use the ReactJS framework without using any transpilers. For
this, make a new directory for our project and make a `index.html` file
containing the following content:

```html
<!DOCTYPE html>
<html>
    <head>
        <title>My React app</title>
    </head>
    <body>
        <script src="react.development.js"></script>
        <script type="module" src="/main.js"></script>
    </body>
</html>
```

You can get the react development file by going to
[the React releases overview](https://github.com/facebook/react/releases) and
then following [the link to the version of react that is the latest](https://unpkg.com/react@17.0.2/umd).

We can now start working on a main.js file. Since we are working without
transpilers, we need to use plain JavaScript modules or plain code only,
*without JSX*.

We make `App.js`

```javascript
const e = React.createElement;

export default function App() {
    return e('h1', { className: 'my-class'}, [
        "Hello world"
    ]);
}
```

And then `main.js`

```javascript
const e = React.createElement;

import App from './App.js';

const domContainer = document.createElement('div');
document.body.appendChild(domContainer);
ReactDOM.render(e(App), domContainer);
```

If we now start a live web server on the folder containing these 3 files, we see
that it first loads `index.html`, then `react.js`, then `main.js`, and then `App.js`.

We only have a small application, and we are already loading many files. This is
not good for fast loading times... We need to look into different solutions.

## Building with webpack

Webpack is a tool designed to bundle files. Instead of having to manually
download dependencies, we are now using npm for dependency management.

Inside our folder, run `npm init` to create `package.json` file. Accepting the
defaults is fine. We then need to install react, webpack and an html generation
plugin for webpack with npm, via the following command

```sh
npm install react react-dom webpack html-webpack-plugin  webpack-cli webpack-dev-server`.
```

Lets clean up our folder, it is becoming a mess already. Make a new folder
called `src`, and move the files `main.js` and `App.js` into this
folder. We can also delete `index.html` now. We can then delete our old script
file for React, since it comes from npm now.

```ls
my-project/
+ src/
| + main.js
| + App.js
+ node_modules/
| + (many directories filled with dependencies)
+ package.json
+ package-lock.json
```

Node modules contains the downloaded dependencies, we want to add this to a
`.gitignore` file so it gets ignored. Lets make this file.

```gitignore
/node_modules
```

We now setup webpack, create a `webpack.config.js` file containing:

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: "development",
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new HtmlWebpackPlugin(),
    ],
}
```

We are almost there yt, we have to change the first file of our script files to:

```javascript
import { createElement as e } from 'react';
import ReactDOM from 'react-dom';

... rest
```

This allows our script to find react. now that it comes frm npm, rather than
being loaded globally.

Now run `npx webpack serve` in a terminal and it build the project. It then
opens a webserver for you to be abl to view the project.

<a download href="./react-bare-bones.zip">
    Download the files up to this point
</a>

## Further steps

From this point, it depends on your goals what you do.

* Most people like to use JSX instead of manually calling createElement, for this
  you need a webpack loader like `jsx-loader`.
* If you want to transpile javascript syntax to support older browsers, you would need 
* If you want to use TypeScript, use `typescript-loader`. (This loader can also
  convert JSX)
* Most people like to use import their css files in the components, so use
  `style-loader`, followed by a `css-loader`.
* Using images and other assets is typically done with WebPack 5 by using the
  `const pathToImage = new URL('image.jpg', import.meta.url))`, This does not
  require any extra config since WebPack 5.
* Make a config for production, which minifies the text, extract the css into
  a separate file and compresses the images.
* Instead of remembering the commands to start the app, edit `package.json` to
 include a scripts section with the commands.
