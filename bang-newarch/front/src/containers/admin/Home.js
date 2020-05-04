/** Notify.js
 *  front-end
 *
 *  admin only layout for adding  a batch
 *
 *  called by:
 *    1. Router.js
 */

import React, { PureComponent } from "react";
import {
    Card,
    CardBody,
    Col,
    Row,
    Container,
    Button,
    ButtonToolbar, CardImg,
} from "reactstrap";
import { connect } from "react-redux";
import { notifyUsers } from "Actions/admin";
import { bindActionCreators } from "redux";
import { hourlyWage } from "../../utils";
import {history} from 'App/history';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            note: "",
            notifyLimit: 0,
            notifyPass: 200,
        };
    }

    handleSubmitMessage = () => {
        this.props.notifyUsers({
            start: false,
            message: this.state.note,
            limit: this.state.notifyLimit,
            pass: this.state.notifyPass,
        });
    };

    handleSubmitStart = () => {
        this.props.notifyUsers({
            start: true,
            limit: this.state.notifyLimit,
            pass: this.state.notifyPass,
        });
    };

    handleNoteChange = (e) => {
        this.setState({ note: e.target.value });
    };

    handleLimitChange = (e) => {
        this.setState({ notifyLimit: e.target.value });
    };

    handlePassChange = (e) => {
        this.setState({ notifyPass: e.target.value });
    };

    render() {
        return (
            <Container>
                <Card>
                    <CardBody>
                            <div
                                className="form__form-group-input-wrap"
                                style={{ marginTop: "10px" }}
                            >
                                <Button onClick={() => {history.push('/users/')}} > Students </Button>
                            </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                                <Button onClick={() => {history.push('/batches/')}} > Lessons </Button>
                                <Button onClick={() => {history.push('/templates/')}} > Classes </Button>


                    </CardBody>
                </Card>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            notifyUsers,
        },
        dispatch
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
