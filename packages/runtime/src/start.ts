import http from "http";
import express from "express";
import RED from "node-red";
import { mkdirSync, readdirSync, writeFileSync } from "fs";
import path from "path";
import { execSync } from "child_process";
import * as runtime from "@node-red/runtime";

export class NodeRed {
  private readonly settings: runtime.LocalSettings = {
    flowFile: "flows.json",
    uiHost: "localhost",
    uiPort: 1880,
    httpAdminRoot: "/",
    httpNodeRoot: "/api",
    userDir: ".node-red",
    functionGlobalContext: {}, // enables global context
    logging: {
      console: {
        level: "debug",
        metrics: false,
        audit: false,
      },
    },
  };

  start() {
    this.prepareFiles();
    const server = this.prepareRuntime();
    this.startRuntime(server);
  }

  private prepareFiles() {
    mkdirSync(path.resolve(path.join(".node-red")), { recursive: true });
    const destination = path.resolve(path.join(this.settings.userDir, "package.json"));
    console.log(destination);
    this.createPackageJson(destination);

    execSync(`cd ${path.dirname(destination)} && npm install --unsafe-perm`);
  }

  private createPackageJson(destination: string) {
    const packageJson = {
      name: "node-red-project",
      description: "A Node-RED Project",
      version: "0.0.1",
      private: true,
      dependencies: {},
      devDependencies: {
        "node-red": "^1.3.0",
      },
    };

    // install nodes
    const nodes: string[] = readdirSync(path.resolve(path.join("..", "nodes")));
    console.log(nodes);

    nodes.forEach((value: string, index: number, array: string[]) => {
      const nodePath = path.resolve(path.join("..", "nodes", value));
      //execSync(`cd ${path.dirname(destination)} && npm install ${nodePath}`);
      packageJson.dependencies[`@debug/${value}`] = `file:../../nodes/${value}`;
    });
    writeFileSync(destination, JSON.stringify(packageJson, null, 2), { encoding: "utf8" });

    return packageJson;
  }

  private prepareRuntime(): http.Server {
    const app = express();

    // Add a simple route for static content served from 'public'
    app.use("/", express.static("public"));
    // Create a server
    const server = http.createServer(app);

    // Initialise the runtime with a server and settings
    RED.init(server, this.settings);

    // Serve the editor UI from /red
    app.use(<string>this.settings.httpAdminRoot, RED.httpAdmin);

    // Serve the http nodes UI from /api
    app.use(<string>this.settings.httpNodeRoot, RED.httpNode);

    return server;
  }

  private startRuntime(server: http.Server) {
    server.listen(this.settings.uiPort);
    RED.log.info("http://localhost:" + this.settings.uiPort);
    // Start the runtime
    RED.start();
  }
}

new NodeRed().start();
