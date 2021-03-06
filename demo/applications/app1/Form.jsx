'use strict';

var React = require('react');
var B = require('react-bootstrap');
var Router = require('react-router');
var Reflux = require('reflux');
var _ = require('lodash');

var ReactAdmin = require('react-admin');

var Store = require('./Store.jsx');

var NotificationElement = require('component/NotificationElement.jsx');

export default React.createClass({
    mixins: [Reflux.ListenerMixin],

    contextTypes: {
      router: React.PropTypes.func
    },

    getInitialState() {
        // define default values
        return {
            object: {
                name: "loading node ..."
            },
            errors: {}
        };
    },

    componentDidMount() {
        this.loadData();
    },

    refreshView() {
        this.setState({
            object: Store.objectsStore.objects.get(parseInt(this.context.router.getCurrentParams().id, 10))
        });
    },

    componentWillReceiveProps() {
        this.loadData();
    },

    submit() {
        // Of course you need to post those data to a remote server
        var errors = {};
        if (!(!isNaN(parseFloat(this.state.object.account)) && isFinite(this.state.object.account))) {
            errors['object.account'] = ["Please provide a valid account number"];
        }

        if (this.state.object.name.length == 0) {
            errors['object.name'] = ["Name cannot be emtpy"];
        }

        if (Object.keys(errors).length > 0) {
            ReactAdmin.Status.Action('danger', "Errors occurs while saving", 4000);
        } else {
            ReactAdmin.Status.Action('success', "The object has been saved", 2000);

            ReactAdmin.Notification.Action(NotificationElement, {
                name: this.state.object.name,
                action: "Save",
                id: this.state.object.id
            });
        }

        this.setState({
            'errors': errors
        });

        Store.saveAction(this.state.object);
    },

    loadData() {

        this.setState({
            object: Store.objectsStore.objects.get(parseInt(this.context.router.getCurrentParams().id, 10))
        });
    },

    render() {
        return (
            <div className="col-sm-12 col-md-12 main">
                <h2 className="sub-header">Edit {this.state.object.name} </h2>

                <div className="well">
                    This is a test form, no data are sent, you can try to clear the name or account fields to
                    see validation errors.
                </div>

                <form>
                    <div className="row">
                        <div className="col-sm-6">
                            <ReactAdmin.TextInput form={this} property="object.name" label="Name" help="The name"/>

                            <ReactAdmin.TextAreaInput form={this} property="object.bio" label="Biography" />

                            <ReactAdmin.TextInput form={this} property="object.account" label="account" help="Account reference"/>
                        </div>
                        <div className="col-sm-6">

                            <ReactAdmin.BooleanSelect form={this} property="object.superAdmin" label="Is Super Admin" roles={["SUPER_ADMIN"]}>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </ReactAdmin.BooleanSelect>

                            <ReactAdmin.BooleanRadio form={this} value={1} property="object.enabled" label="Enabled" />
                            <ReactAdmin.BooleanRadio form={this} value="0" property="object.enabled" label="Disabled" />

                            <ReactAdmin.NumberSelect form={this} property="object.status" label="Status">
                                <option value="0">New</option>
                                <option value="1">Draft</option>
                                <option value="2">Completed</option>
                                <option value="3">Validated</option>
                            </ReactAdmin.NumberSelect>

                        </div>
                    </div>
                </form>

                <B.Button bsStyle="primary" onClick={this.submit}>Save</B.Button>
                <Router.Link to="app1.list">Return list</Router.Link>

                <B.Button bsStyle="link" onClick={ReactAdmin.Roles.Store.toggleRole.bind(null, "SUPER_ADMIN")}>Toggle role SUPER_ADMIN</B.Button>

            </div>
        );
    }
});
