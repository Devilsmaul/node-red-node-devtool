import { NodeTestHelper } from "node-red-node-test-helper";
import temperatureNode from "../nodes/temperature-node/temperature-node";

const helper = new NodeTestHelper();

describe("Temperature Node", function () {
  afterEach(function () {
    helper.unload();
  });

  it("should be loaded", function (done) {
    const flow = [{ id: "n1", type: "Temperature", name: "test name" }];
    helper.load(temperatureNode, flow, function () {
      const n1 = helper.getNode("n1");
      expect(n1).toHaveProperty("name", "test name");
      done();
    });
  });

  it("should convert payload from celcius to kelvin", function (done) {
    const flow = [
      { id: "n1", type: "Temperature", name: "test name", from: "celcius", to: "kelvin", wires: [["n2"]] },
      { id: "n2", type: "helper" },
    ];
    helper.load(temperatureNode, flow, function () {
      const n2 = helper.getNode("n2");
      const n1 = helper.getNode("n1");
      n2.on("input", function (msg) {
        expect(msg).toHaveProperty("payload", 273.15);
        done();
      });
      n1.receive({ payload: 0 });
    });
  });
});
