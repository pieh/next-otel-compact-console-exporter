import { relative } from "path";

function requireTimes(extensions?: any) {
  let times: any[] = [];
  let timesByName: Record<any, any> = {};
  const cwd = process.cwd();

  let startTime = Date.now();

  if (!extensions) {
    // eslint-disable-next-line no-param-reassign
    extensions = [".js"];
  }

  extensions.forEach(function wrap2(ext: any) {
    wrap(ext);
  });

  let counter = 0;

  return {
    start,
    end,
  };

  function wrap(extension: any) {
    const original = require.extensions[extension];
    if (!original) {
      return;
    }

    require.extensions[extension] = function patchedExtensions(
      module,
      filename
    ) {
      if (counter === 0) {
        start();
      }

      counter++;

      const myStart = Date.now();
      original(module, filename);
      const diff = Date.now() - myStart;

      const data = {
        time: diff,
        name: relative(cwd, module.filename),
        parent: module.parent
          ? relative(cwd, module.parent.filename)
          : undefined,
      };

      times.push(data);
      timesByName[data.name] = data;

      counter--;
      if (counter === 0) {
        console.log("end import cycle", filename);
        end();
      }
    };
  }

  function start() {
    times = [];
    timesByName = {};
    startTime = Date.now();
    // console.time('total')
  }

  function generateTree(parentFilename, prefix, threshold, stringBuilder = "") {
    times
      .filter(function filter(i) {
        return i.parent === parentFilename;
      })
      .sort(function byNum(a, b) {
        return b.time - a.time;
      })
      .forEach(function reduce(t) {
        if (t.time > threshold) {
          // eslint-disable-next-line no-param-reassign
          stringBuilder += `${prefix + t.time}ms ${t.name}\n`;
          // console.log(`${prefix + t.time}ms`, t.name)
        }

        // eslint-disable-next-line no-param-reassign
        stringBuilder += generateTree(t.name, `${prefix}  `, threshold);
      });

    return stringBuilder;
  }

  function end(thresholdArg?: number) {
    const total = Date.now() - startTime;
    // console.timeEnd('total')

    const threshold = thresholdArg || 0;

    let outputString = `total: ${total}ms\n`;
    times
      .filter((i) => {
        return timesByName[i.parent] === undefined;
      })
      .map((i) => {
        return i.parent;
      })
      .filter((i, pos, self) => {
        return self.indexOf(i) == pos;
      })
      .forEach((i) => {
        outputString += generateTree(i, "", threshold);
        // printTree(i, '', threshold)
      });
    return outputString;
  }
}

requireTimes();
