# node-red-node-devtool
This monorepo can be used to develop node-red nodes in typescript with VSCode

###prerequisites
install node >= 16.10
install yarn https://yarnpkg.com/getting-started/install
install yarn workspace tools plugin https://yarnpkg.com/api/modules/plugin_workspace_tools.html

i also recommend to update to the latest version of yarn: ```yarn set version stable```


### setup
at the root directory do:
1. use ```yarn install``` to setup everything.
2. perform ```yarn build```
3. ```yarn test``` to see if the node tests run successfully

### create a node
1. create your nodes in ```packages/nodes/yourNodeName```
2. make sure you copy the ```tsconfig.json``` and ```tsconfig.dist.json``` from the root into that folder.
3. create the following package.json inside and replace ```$YOUR_NICK``` and ```$YOUR_NODE```
```
{
  "name": "@$YOUR_NICK/$YOUR_NODE",
  "version": "0.1.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "clean": "rimraf dist",
    "build": "yarn build:tsc && yarn build:copy-html",
    "build:tsc": "tsc -p tsconfig.dist.json",
    "build:copy-html": "node -r ts-node/register ./../../../build-scripts/copy-html.ts",
    "build:watch": "tsc -p tsconfig.dist.json --watch",
    "test": "yarn jest --verbose"
  },
  "node-red": {
    "version": ">=1.3.7",
    "nodes": {
      "$YOUR_NODE": "dist/nodes/$YOUR_NODE/$YOUR_NODE.js",      
    }
  },
  "engines": {
    "node": ">=v12.0.0"
  },
  "keywords": [
    "node-red"
  ],
  "devDependencies": {
    "@types/node-red": "^1.2.1",
    "@types/node-red-node-test-helper": "^0.2.2",
    "node-red-node-test-helper": "^0.2.7"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/$YOUR_NICK/$YOUR_NODE.git"
  },
  "bugs": {
    "url": "https://github.com/$YOUR_NICK/$YOUR_NODE/issues"
  },
  "homepage": "https://github.com/$YOUR_NICK/$YOUR_NODE#readme",
  "author": "$YOUR_NICK",
  "license": "MIT"
}
```

### start debugging
1. open your custom node project set breakpoints and use vscode debugger (F5) to start the runtime (node-red) with your nodes.
2. navigate to your node-red instance (default: http://localhost:1880)
3. create your flow with your nodes.
4. inject messages in your flow.
5. you can debug your code with your breakpoints

The runtime will not delete the ```flows.json```.
