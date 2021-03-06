'use strict'

var React  = require('react');
var Router = require('react-router');
var ReactAdmin = require('react-admin');

var Form = require('./Form.jsx');
var List = require('./List.jsx');

var NotificationElement = require('component/NotificationElement.jsx');


// adding some fake data

var roles = [
    "EDITOR",
    "VISITOR",
    "SUPER_ADMIN"
];

ReactAdmin.Roles.Add(roles);

// add fake notification
ReactAdmin.Notification.Action(NotificationElement, {
    name: "The first notification",
    action: "create",
    icon: 'fa-futbol-o fa-spin',
    id: 1
});

ReactAdmin.Notification.Action(NotificationElement, {
    name: "The second notification",
    action: "update",
    icon: 'fa-coffee',
    id: 2
});

/**
 * This is used to build the nested view required by React Router
 */
var View = React.createClass({
    render() {
        return <Router.RouteHandler {...this.props} />
    }
});

/**
 * Define the routes required to list or edit the node
 */
export function getRoutes() {
   return <Router.Route name="app1" handler={View} >

      <Router.Route name="app1.list"  path="list" handler={List} />
      <Router.Route name="app1.edit"  path="edit/:id" handler={Form} />

      <Router.DefaultRoute handler={List} />
   </Router.Route>
}