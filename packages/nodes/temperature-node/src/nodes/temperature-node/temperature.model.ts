import { Node, NodeDef } from "@node-red/registry";

export interface TemperatureNodeConfig extends NodeDef {
  from: string;
  to: string;
}
export interface TemperatureNode extends Node {
  from: string;
  to: string;
}
