MVC.Event = {};
MVC.Event.stop_observing = Event.stopObserving;
MVC.Event.observe = function(element, eventName, handler, capture) {
  var cache = Event.cache;

  function getEventID(element) {
    if (element._eventID) return element._eventID;
    arguments.callee.id = arguments.callee.id || 1;
    return element._eventID = ++arguments.callee.id;
  }

  function getDOMEventName(eventName) {
    if (eventName && eventName.include(':')) return "dataavailable";
    return eventName;
  }

  function getCacheForID(id) {
    return cache[id] = cache[id] || { };
  }

  function getWrappersForEventName(id, eventName) {
    var c = getCacheForID(id);
    return c[eventName] = c[eventName] || [];
  }

  function createWrapper(element, eventName, handler) {
    var id = getEventID(element);
    var c = getWrappersForEventName(id, eventName);
    if (c.pluck("handler").include(handler)) return false;

    var wrapper = function(event) {
      if (!Event || !Event.extend ||
        (event.eventName && event.eventName != eventName))
          return false;

      Event.extend(event);
      handler.call(element, event);
    };

    wrapper.handler = handler;
    c.push(wrapper);
    return wrapper;
  }

  function findWrapper(id, eventName, handler) {
    var c = getWrappersForEventName(id, eventName);
    return c.find(function(wrapper) { return wrapper.handler == handler });
  }

  function destroyWrapper(id, eventName, handler) {
    var c = getCacheForID(id);
    if (!c[eventName]) return false;
    c[eventName] = c[eventName].without(findWrapper(id, eventName, handler));
  }

  function destroyCache() {
    for (var id in cache)
      for (var eventName in cache[id])
        cache[id][eventName] = null;
  }
  
  element = $(element);
  var name = getDOMEventName(eventName);

  var wrapper = createWrapper(element, eventName, handler);
  if (!wrapper) return element;

  if (element.addEventListener) {
    element.addEventListener(name, wrapper, capture);
  } else {
    element.attachEvent("on" + name, wrapper);
  }

  return element;
}