/** TemplateInfo.js
 *  front-end
 *
 *  admin only layout for viewing user
 *  note: the actual file called edittemplate is a code scrap
 *
 *  called by:
 *    1. Router.js
 */

import React, {PureComponent} from 'react';
import {
    Card,
    CardBody,
    Col,
    Badge,
    Row,
    Container,
    Button,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Media
} from 'reactstrap';
import {connect} from "react-redux";
import {loadTemplate, updateTemplate} from "Actions/templates";
import {loadSurveyList} from "Actions/surveys";
import {bindActionCreators} from "redux";
import TemplateForm from './TemplateForm'
import moment from 'moment'
import {loadUserList} from "../../actions/admin";

class TemplateInfo extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            userId: 123,
            studentImage: null,
        };
    }
    async getRandomUserImage() {
        const result = await fetch('https://randomuser.me/api/');
        const json = await result.json();
        this.setState({userPhoto: json.results[0].picture.thumbnail})
    }


    componentWillMount(){
        const userId = this.props.match.params.id;
        Promise.all([
            this.props.loadUserList(),
            this.getRandomUserImage(),
        ])
            .then(()=> {
                this.setState({
                    isReady: true,
                    userId: userId,
                    user: this.props.userList[0]
                })
            })
    };

    render() {

        const {template, updateTemplate} = this.props;
        const {user} = this.state;
        console.log('uesr', user);
        return (
            <Container style={{maxWidth: '100%'}}>
                <Row>
                    <Col md={12} lg={12} xl={12}>
                        <Card>

                            {this.state.isReady && <CardBody>
                                <div className='card__title'>
                                    <h5 className='bold-text'>Student Info</h5>
                                </div>
                                <Media src={this.state.userPhoto} style={{maxWidth: "128px", maxHeight:"128px", marginTop: '-5px'}} width={30}/>

                                <Col>
                                    <label>Name: </label>
                                    <label style={{marginLeft: '5px', marginTop: '5px'}}>{user.name}</label>
                                </Col>
                                <Col>
                                    <label>Last Name: </label>
                                    <label style={{marginLeft: '5px'}}>{user.lastName}</label>
                                </Col>
                                <Col>
                                    <label>Class Name: </label>
                                    <label style={{marginLeft: '5px'}}>{user.className}</label>
                                </Col>

                                <Col>
                                </Col>
                            </CardBody>}
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        template: state.template.template,
        userList: state.admin.userList,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loadTemplate,
        updateTemplate,
        loadSurveyList,
        loadUserList,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplateInfo);
