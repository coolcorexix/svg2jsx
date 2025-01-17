const prettier = require('prettier');
const template = require('lodash.template');

/**
 * React component templates.
 * @readonly
 * @type {Map<string, string>}
 */
const TEMPLATES = {
  class: `
    import React from "react";

    class Icon extends <%= parentComponent %> {
      render() {
        return <%= svg %>;
      }
    }

    export default Icon;
  `,
  functional: `
    import React from "react";
    
    function Icon(<%= customProps %>) {
      return <%= svg %>;
    }

    export default <%= exportComponent %>;
  `,
};

/**
 * Creates React component.
 * @param {string} svg Transformed SVG string.
 * @param {string="functional","class"} config.type Desired component type.
 * @return {string}
 */
function reactify(svg, { type = 'functional', memo }, customProps) {
  const data = {
    parentComponent: memo ? `React.PureComponent` : `React.Component`,
    exportComponent: memo ? `React.memo(Icon)` : `Icon`,
  };

  const compile = template(TEMPLATES[type]);
  const component = compile({
    ...data,
    customProps: `{ color="${customProps.defaultFillColor}", width = ${customProps.defaultSize.width}, height = ${customProps.defaultSize.height} }`,
    svg,
  });

  return component;
}

/**
 * Creates React component and formats with Prettier.
 * @param {string} svg Transformed SVG string.
 * @param {Object=} config Component type, SVGO and Prettier config.
 * @return {string}
 */
function format(svg, config, customProps) {
  const component = reactify(svg, config, customProps);
  const formatted = prettier.format(component, {
    ...config,
    parser: 'babel',
  });

  return formatted;
}

module.exports = format;
