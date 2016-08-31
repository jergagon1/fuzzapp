var Helpers = {
  getTitleReport: function (report) {
    var type = this.getAnimalTypeReport(report);
    var str = report.report_type + ' ' + type;
    if (report.pet_name) {
      str += ' ' + report.pet_name;
    }
    return this.camelize(str);
  },
  getAnimalTypeReport: function (report) {
    var type = report.animal_type && report.animal_type.toLowerCase().replace(/(\s+)/gm, ' ');
    if (!type || type === 'pet type') {
      type = 'pet'
    }
    return type;
  },
  camelize: function (str) {
    return str.replace(/(^[a-z])/, function (p) {
      return p.toUpperCase();
    })
  },
  fireEvent: function (node, eventName) {
    // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
    var doc;
    if (node.ownerDocument) {
      doc = node.ownerDocument;
    } else if (node.nodeType == 9) {
      // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
      doc = node;
    } else {
      throw new Error("Invalid node passed to fireEvent: " + node.id);
    }

    if (node.dispatchEvent) {
      // Gecko-style approach (now the standard) takes more work
      var eventClass = "";

      // Different events have different event classes.
      // If this switch statement can't map an eventName to an eventClass,
      // the event firing is going to fail.
      switch (eventName) {
        case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
        case "mousedown":
        case "mouseup":
          eventClass = "MouseEvents";
          break;

        case "focus":
        case "change":
        case "blur":
        case "select":
          eventClass = "HTMLEvents";
          break;

        default:
          throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
          break;
      }
      var event = doc.createEvent(eventClass);
      event.initEvent(eventName, true, true); // All events created as bubbling and cancelable.

      event.synthetic = true; // allow detection of synthetic events
      // The second parameter says go ahead with the default action
      node.dispatchEvent(event, true);
    } else if (node.fireEvent) {
      // IE-old school style
      var event = doc.createEventObject();
      event.synthetic = true; // allow detection of synthetic events
      node.fireEvent("on" + eventName, event);
    }
  }
};