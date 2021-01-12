module.exports = function() {
  return {
    name: 'eventType',
    transforms(doc, tag, value) {
      const EVENTTYPE_REGEX = /^([^\s]*)\s+on\s+([\S\s]*)/;
      const match = EVENTTYPE_REGEX.exec(value);
      // Attach the target to the doc
      doc.eventTarget = match[2];
      // And return the type
      return match[1];
    }
  };
};