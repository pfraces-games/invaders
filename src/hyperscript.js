const hyperscript = (function () {
  const element = function (tagName, options = {}) {
    const node = document.createElement(tagName);

    if (options.props) {
      for (let prop in options.props) {
        node[prop] = options.props[prop];
      }
    }

    if (options.styles) {
      for (let style in options.styles) {
        node.style[style] = options.styles[style];
      }
    }

    if (options.classList) {
      node.classList.add(...options.classList);
    }

    if (options.eventListeners) {
      for (let event in options.eventListeners) {
        node.addEventListener(event, options.eventListeners[event]);
      }
    }

    if (options.childNodes) {
      options.childNodes.filter(Boolean).forEach(function (child) {
        node.appendChild(child);
      });
    }

    return node;
  };

  const text = function (content) {
    const node = document.createTextNode(content);
    return node;
  };

  return { element, text };
})();
