/**
 * common lib used for util functions
 *
 */

/**
 * extracting the first existing property from msg object in the following order:
 * msg[paramName]
 * msg.req.params[paramName]
 * msg.req.query[paramName]
 * msg.req.body[paramName]
 * msg.req.body // takes the body, but only if the paramName is 'body'
 * node[paramName]
 * defaultValue
 * @param {*} node
 * @param {*} msg
 * @param {*} propertyName
 * @param {*} defaultValue
 * @return {*} property or defaultvalue
 */
export function getProperty(node: any, msg: any, propertyName: string, defaultValue: any) {
  if (msg[propertyName] !== undefined) {
    return msg[propertyName];
  }
  if (msg.params) {
    if (msg.params[propertyName] !== undefined) {
      return msg.params[propertyName];
    }
  }
  if (msg.params) {
    if (msg.params[propertyName] !== undefined) {
      return msg.params[propertyName];
    }
  }
  if (msg.req) {
    if (msg.req.params) {
      if (msg.req.params[propertyName] !== undefined) {
        return msg.req.params[propertyName];
      }
    }
    if (msg.req.query) {
      if (msg.req.query[propertyName] !== undefined) {
        return msg.req.query[propertyName];
      }
    }
    if (msg.req.body) {
      if (msg.req.body[propertyName] !== undefined) {
        return msg.req.body[propertyName];
      }
      if (propertyName === "body") {
        return msg.req.body;
      }
    }
  }

  if (node[propertyName] !== undefined) {
    return node[propertyName];
  }

  return defaultValue;
}

/**
 * extracting the path array from object.
 * usage: resolve("part.0.size", someObject)
 * @param {*} pathArray e.G.: part.0.size
 * @param {*} obj someObject e.G.: {part:[{size:7}]}
 * @return {*} null if the path is non existing, otherwise the property
 */
export function resolveObject(pathArray, obj) {
  return pathArray.reduce(function (prev, curr) {
    return prev ? prev[curr] : null;
  }, obj || self);
}

export class StopWatch {
  measurements = new Map();

  constructor() {}

  /**
   * Starts a measurement for a specific id
   * @param {*} id
   */
  start(id) {
    this.measurements.set(id, { started: new Date().getTime(), stopped: undefined, diff: undefined });
  }

  /**
   * stops a measurement for a specific id
   * @param {*} id
   */
  stop(id) {
    const entry = this.measurements.get(id);
    entry.stopped = new Date().getTime();
    entry.diff = entry.stopped - entry.started;
    // console.log('Execution time for ' + id + ': ' + entry.diff + " ms");
  }

  /**
   * getting the measurement of an id. A stopped measurement is represented in ms
   * @param {*} id
   * @return {*} measurement
   */
  get(id) {
    return this.measurements.get(id);
  }
}
