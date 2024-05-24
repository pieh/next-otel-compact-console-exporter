import { registerOTel } from "@vercel/otel";

process.env.NEXT_OTEL_VERBOSE = "1";

class CompactConsoleExporter {
  export(spans, resultCallback) {
    return this._sendSpans(spans, resultCallback);
  }

  shutdown() {
    this._sendSpans([]);
    return this.forceFlush();
  }

  forceFlush() {
    return Promise.resolve();
  }

  _sendSpans(spans, done = undefined) {
    console.log("_sendSpans", spans.length);
    for (const span of spans) {
      const startDate = new Date(
        span.startTime[0] * Math.pow(10, 3) +
          span.startTime[1] / Math.pow(10, 6)
      );

      const durationS = span.duration[0] + span.duration[1] / Math.pow(10, 9);

      console.log(
        `[Trace ${span.spanContext().traceId}] ${`"${span.name}"`.padEnd(
          60,
          " "
        )} start=${startDate.toISOString()} dur=${durationS.toFixed(3)}s`
      );
    }
    if (done) {
      return done({ code: 0 });
    }
  }
}

console.log("hi", process.pid);

registerOTel({
  serviceName: "next-test-app",
  traceExporter: new CompactConsoleExporter(),
  traceSampler: "always_on",
});
