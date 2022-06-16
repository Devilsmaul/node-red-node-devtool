import { NodeAPI } from "@node-red/registry";

import { TemperatureConverter, TemperatureFormat } from "./temperature.lib";
import { getProperty } from "../../common-lib";
import { TemperatureNode, TemperatureNodeConfig } from "./temperature.model";

export = function (RED: NodeAPI) {
  "use strict";

  // to have code completion we overwrite the this keyword in the function to the appropriate interface
  // becaus typescript only allows one export = we have to split the type definitions into a separate file (in this case temperature.model.ts)
  function TemperatureNode(this: TemperatureNode, config: TemperatureNodeConfig) {
    RED.nodes.createNode(this, config);

    const node = this; // eslint-disable-line
    node.debug("onConstruct of temperatureNode: " + node.id);
    node.name = config.name;
    node.from = config.from;
    node.to = config.to;

    const temperatureConverter = new TemperatureConverter();
    try {
      // do initial startup routines here

      // if you want to state it below your node
      node.status({ fill: "blue", shape: "dot", text: "ready" });
    } catch (e) {
      node.status({ fill: "red", shape: "dot", text: "error: " + e.message });
    }

    /**
     * do something with incoming messages. Multiple sends possible (async progress). calling done() afterwards.
     */
    node.on("input", function (msg, send, done) {
      node.debug("onInput of temperatureNode: " + node.id);
      try {
        const from = getProperty(node, msg, "from", node.from);
        const to = getProperty(node, msg, "to", node.to);
        const value = msg.payload;

        if (from == TemperatureFormat.Celcius && to == TemperatureFormat.Kelvin) {
          msg.payload = temperatureConverter.celciusToKelvin(value);
          send(msg);
          node.status({ fill: "green", shape: "dot", text: msg.payload + " K" });
        } else if (from == TemperatureFormat.Kelvin && to == TemperatureFormat.Celcius) {
          msg.payload = temperatureConverter.kelvinToCelcius(value);
          node.status({ fill: "green", shape: "dot", text: msg.payload + " C" });
          send(msg);
        } else {
          throw new Error(`Unknown Format. From: ${from} to: ${to}`);
        }
        done();
      } catch (e) {
        node.error(e);
        node.status({ fill: "red", shape: "dot", text: e.message });
        done(e.message);
      }
    });

    /**
     * cleanup resources.
     * This routine is also called when deploy (save and test) is pressed.
     */
    node.on("close", function (done) {
      node.debug("onClose of temperatureNode: " + node.id);
      // nothing to do here
      done();
    });
  }

  RED.nodes.registerType("Temperature", TemperatureNode);
};
