# Marko Playground

This project was created specifically to allow you to quickly evaluate the syntax and capabilities of Marko. It contains all the necessary configurations and modules for fast and optimized builds.

You can open the project immediately and start working with it in Visual Studio Code. Both JavaScript and TypeScript are supported.

The source code is in the **src** directory, after building the result site is in the **dist** directory.

You can use this project on any system where **Node.js** (16+) is installed. You may wish to follow the [instructions](https://nodejs.org/en) on how to install Node to your computer.

Before you start working with this project, don't forget to run the command below in order to install all required NPM modules:

```
npm install
```

Two modes of build are available:

1. Development mode (less optimizations, faster build time)

```
npm run build-dev
```

2. Production mode (more optimizations, slower build time)

```
npm run build-production
```

When finished, navigate to **dist/index.html** to display the results.