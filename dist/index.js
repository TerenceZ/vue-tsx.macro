'use strict';

var _require = require('babel-plugin-macros'),
    createMacro = _require.createMacro,
    MacroError = _require.MacroError;

module.exports = createMacro(transformJSXComponent);

function transformJSXComponent(_ref) {
  var references = _ref.references,
      t = _ref.babel.types;
  var transformers = {
    component: transformComponent,
    functional: transformFunctional,
    type: transformType,
    EVENTS: removeTypes('EVENTS'),
    STATES: removeTypes('STATES'),
    SCOPED_SLOTS: removeTypes('SCOPED_SLOTS'),
    INJECTIONS: transformInjections
  };
  var typeAlias = references['type'] && references['type'].length && references['type'][0].node.name;

  for (var _i = 0, _Object$keys = Object.keys(references); _i < _Object$keys.length; _i++) {
    var key = _Object$keys[_i];
    var transformer = transformers[key];

    if (transformer) {
      transformer(references[key]);
    }
  }

  function transformComponent(paths) {
    paths.forEach(function (path) {
      var defPath = replaceWithDefinition(path); // resolve name for DEBUG purpose.

      resolveComponentNameForDebug(defPath); // handle props.

      transformProps(defPath);
    });
  }

  function transformFunctional(paths) {
    paths.forEach(function (path) {
      var defPath = path.parentPath.get('arguments.0'); // If argument is function, we should transform it to functional definition object.

      if (defPath.isFunction()) {
        // replace the function with object def.
        defPath.replaceWith(t.objectExpression([t.objectProperty(t.identifier('render'), defPath.node)]));
      } // Because we've omitted the createElement argument.
      // we should inject it as param 'h'.
      // And Vue will always transform JSX with h as createElement,
      // so we should check if h has been defined.


      var renderPath = defPath.get('properties').find(function (path) {
        return !path.node.computed && path.node.key.name === 'render';
      });

      if (!renderPath) {
        throw new MacroError("render(context) function must be defined for functional component.");
      }

      if (renderPath.isObjectProperty()) {
        renderPath = renderPath.get('value');
      }

      if (renderPath.isFunction()) {
        var renderScope = renderPath.get('body').scope;

        if (renderScope.hasBinding('h') && !renderPath.get('params.0').isIdentifier({
          name: 'h'
        })) {
          throw new MacroError("Vue will inject 'h' identifier when parsing JSX, don't define local var'h'.");
        } // insert the param 'h'.


        renderPath.get('params.0').insertBefore(t.identifier('h'));
      } // Well, check the argument.0 for functional is object expression
      // and replace functional(def) to def.


      replaceWithDefinition(path); // resolve name for DEBUG purpose.

      resolveComponentNameForDebug(defPath); // insert the property functional=true to hint Vue this is functional component.

      defPath.get('properties.0').insertBefore(t.objectProperty(t.identifier('functional'), t.booleanLiteral(true))); // handle props.

      transformProps(defPath);
    });
  }

  function transformType(paths) {
    paths.forEach(function (path) {
      // we simply transform them undefined (and we would omit Vue's type check).
      path.parentPath.replaceWith(t.unaryExpression('void', t.numericLiteral(0)));
    });
  }

  function removeTypes(key) {
    return function (paths) {
      paths.forEach(function (path) {
        if (!path.parentPath.isObjectProperty()) {
          throw new MacroError("[".concat(key, "] can be only used as object property key."));
        }

        path.parentPath.remove();
      });
    };
  }

  function replaceWithDefinition(path) {
    var parentPath = path.parentPath;
    var defPath = parentPath.get('arguments.0');

    if (!defPath.isObjectExpression()) {
      throw new MacroError("".concat(path.node.name, " can only accept object expression to define vue component"));
    } // replace component(def) with def


    parentPath.replaceWith(defPath);
    return defPath;
  }

  function resolveComponentNameForDebug(defPath) {
    if (process.env.NODE_ENV !== 'production') {
      var defName = getComponentNameInDefinition(defPath);

      if (defName == null) {
        defName = getComponentNameByParentVarName(defPath);

        if (defName) {
          defPath.get('properties.0').insertBefore(t.objectProperty(t.identifier('name'), t.stringLiteral(defName)));
        }
      }
    }
  }

  function getComponentNameInDefinition(defPath) {
    var nameProperty = defPath.node.properties.find(function (p) {
      return !p.computed && p.key.name === 'name';
    });
    return nameProperty && nameProperty.key.name;
  }

  function getComponentNameByParentVarName(path) {
    var name;
    path.findParent(function (parentPath) {
      if (parentPath.isVariableDeclarator()) {
        if (parentPath.node.init === path.parentPath.node) {
          name = parentPath.node.id.name;
        }

        return true;
      }

      if (parentPath.isAssignmentExpression()) {
        if (parentPath.node.right === path.parentPath.node) {
          name = parentPath.node.left.name;
        }

        return true;
      }

      return false;
    });
    return name;
  }

  function transformProps(defPath) {
    var propsPath = defPath.get('properties').find(function (path) {
      return !path.node.computed && path.node.key.name === 'props';
    });

    if (!propsPath || !propsPath.get('value').isObjectExpression()) {
      return;
    } // we only handle with object expression.


    var propsDefPath = propsPath.get('value');

    if (propsDefPath.isObjectExpression()) {
      if (process.env.NODE_ENV !== 'production') {
        if (typeAlias) {
          propsDefPath.traverse({
            CallExpression: function CallExpression(path) {
              var calleePath = path.get('callee'); // check if the type macro.

              if (calleePath.node.name === typeAlias) {
                var index = references['type'].findIndex(function (p) {
                  return p.node === calleePath.node;
                });

                if (index >= 0) {
                  references['type'].splice(index, 1);

                  if (path.node.typeParameters) {
                    var typePath = path.get('typeParameters.params.0');
                    path.replaceWith(transformTSTypeToVueAllowedType(typePath));
                  } else {
                    path.replaceWith(t.unaryExpression('void', t.numericLiteral(0)));
                  }
                }
              }
            }
          });
        }
      } else {
        // In production mode, we extract props to name list.
        var propNames = [];
        propsDefPath.get('properties').forEach(function (path) {
          if (path.node.computed) {
            propNames.push(t.identifier(path.node.key.name));
          } else {
            propNames.push(t.stringLiteral(path.node.key.name));
          }
        });
        propsDefPath.replaceWith(t.arrayExpression(propNames));
      }
    }
  }

  function transformTSTypeToVueAllowedType(typePath) {
    switch (true) {
      case typePath.isTSNumberKeyword():
        return t.identifier('Number');

      case typePath.isTSBooleanKeyword():
        return t.identifier('Boolean');

      case typePath.isTSStringKeyword():
        return t.identifier('String');

      case typePath.isTSFunctionType():
        return t.identifier('Function');

      case typePath.isTSObjectKeyword():
      case typePath.isTSTypeLiteral():
        return t.identifier('Object');

      case typePath.isTSSymbolKeyword():
        return t.identifier('Symbol');

      case typePath.isTSTupleType():
      case typePath.isTSArrayType():
        return t.identifier('Array');

      case typePath.isTSNullKeyword():
        return t.identifier('null');

      case typePath.isTSUnionType():
        return t.arrayExpression(typePath.get('types').map(transformTSTypeToVueAllowedType));

      default:
        return t.unaryExpression('void', t.numericLiteral(0));
    }
  }

  function transformInjections(paths) {
    paths.forEach(function (defPath) {
      var parentPath = defPath.parentPath;

      if (!parentPath.isObjectProperty()) {
        throw new MacroError('"INJECTIONS: ObjectExpression" is expected, but no object properties found.');
      }

      if (parentPath.get('value').isObjectExpression()) {
        parentPath.get('value.properties').forEach(function (p) {
          if (p.get('value').isObjectExpression()) {
            var type = p.get('value.properties').find(function (p) {
              return !p.node.computed && p.node.key.name === 'type';
            });

            if (type) {
              type.remove();
            }
          }
        });
      }

      if (parentPath.parentPath.get('properties').find(function (p) {
        return !p.computed && p.node.key.name === 'inject';
      })) {
        throw new MacroError('[INJECTION] cannot be used with inject.');
      } else {
        parentPath.replaceWith(t.objectProperty(t.identifier('inject'), parentPath.node.value));
      }
    });
  }
}
