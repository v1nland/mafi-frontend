'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var PropTypes = require('prop-types');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ReactUtils = require('../util/ReactUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /**
                                                                                                                                                                                                                              * @fileOverview Surface
                                                                                                                                                                                                                              */


var propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  viewBox: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number
  }),
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};
function Surface(props) {
  var children = props.children;
  var width = props.width;
  var height = props.height;
  var viewBox = props.viewBox;
  var className = props.className;
  var style = props.style;

  var others = _objectWithoutProperties(props, ['children', 'width', 'height', 'viewBox', 'className', 'style']);

  var svgView = viewBox || { width: width, height: height, x: 0, y: 0 };
  var layerClass = (0, _classnames2.default)('recharts-surface', className);
  var attrs = (0, _ReactUtils.getPresentationAttributes)(others);

  return _react2.default.createElement(
    'svg',
    _extends({}, attrs, {
      className: layerClass,
      width: width,
      height: height,
      style: style,
      viewBox: svgView.x + ' ' + svgView.y + ' ' + svgView.width + ' ' + svgView.height,
      version: '1.1'
    }),
    children
  );
}

Surface.propTypes = propTypes;

exports.default = Surface;
