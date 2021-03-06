'use strict';

var cx = require('classnames');
var React = require('react');
var ReactDOM = require('react-dom');

var Node = React.createClass({
  displayName: 'UITreeNode',

  renderCollapse: function renderCollapse(depth) {
    var index = this.props.index;
    var isRoot = !this.props.index.parent;

    if (!isRoot && index.children && index.children.length) {
      var collapsed = index.node.collapsed;

      return React.createElement('span', {
        className: cx('collapse', collapsed ? 'caret-right' : 'caret-down'),
        style: { left: (this.props.paddingLeft * (depth - 1)) - 10 },
        onMouseDown: function onMouseDown(e) {
          e.stopPropagation();
        },
        onClick: this.handleCollapse
      });
    }

    return null;
  },
  renderChildren: function renderChildren() {
    var _this = this;

    var index = this.props.index;
    var tree = this.props.tree;
    var dragging = this.props.dragging;

    if (index.children && index.children.length) {
      var childrenStyles = {};
      //childrenStyles['paddingLeft'] = this.props.paddingLeft + 'px';

      return React.createElement(
        'div',
        { className: 'children', style: childrenStyles },
        index.children.map(function (child) {
          var childIndex = tree.getIndex(child);
          return React.createElement(Node, {
            tree: tree,
            index: childIndex,
            key: childIndex.id,
            dragging: dragging,
            paddingLeft: _this.props.paddingLeft,
            onCollapse: _this.props.onCollapse,
            onDragStart: _this.props.onDragStart
          });
        })
      );
    }

    return null;
  },
  render: function render() {
    var tree = this.props.tree;
    var index = this.props.index;
    var depth = this.props.index.left;
    var dragging = this.props.dragging;
    var node = index.node;
    var styles = {};

    return React.createElement(
      'div',
      {
        className: cx('m-node', {
          'placeholder': index.id === dragging
        }), style: styles
      },
      React.createElement(
        'div',
        { className: 'inner', ref: 'inner', onMouseDown: this.handleMouseDown },
        this.renderCollapse(depth),
        tree.renderNode(node, depth)
      ),
      node.collapsed ? null : this.renderChildren()
    );
  },
  handleCollapse: function handleCollapse(e) {
    e.stopPropagation();
    var nodeId = this.props.index.id;
    if (this.props.onCollapse) this.props.onCollapse(nodeId);
  },
  handleMouseDown: function handleMouseDown(e) {
    var nodeId = this.props.index.id;
    var dom = this.refs.inner;
    var isRoot = !this.props.index.parent;

    if (!isRoot && this.props.onDragStart) {
      this.props.onDragStart(nodeId, dom, e);
    }
  }
});

module.exports = Node;