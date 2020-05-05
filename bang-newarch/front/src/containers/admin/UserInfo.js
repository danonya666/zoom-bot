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
  Media,
  Jumbotron
} from 'reactstrap';
import {connect} from "react-redux";
import {loadTemplate, updateTemplate} from "Actions/templates";
import {loadSurveyList} from "Actions/surveys";
import {bindActionCreators} from "redux";
import TemplateForm from './TemplateForm'
import moment from 'moment'
import {loadUserList} from "../../actions/admin";
import {Doughnut, Pie} from "react-chartjs-2";

class TemplateInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      userId: 123,
      studentImage: null,
      attendance: {
        today: 60,
        allTime: 80,
      }
    };
  }

  async getRandomUserImage() {
    const result = await fetch('https://randomuser.me/api/');
    const json = await result.json();
    this.setState({userPhoto: json.results[0].picture.large})
  }


  componentWillMount() {
    const userId = this.props.match.params.id;
    Promise.all([
      this.props.loadUserList(),
      this.getRandomUserImage(),
    ])
      .then(() => {
        this.setState({
          isReady: true,
          userId: userId,
          user: this.props.userList[0] || {
            first_name: 'Alexandr',
            last_name: 'Pashkevich',
            klass: {
              name: 'ClassName'
            }
          }
        })
      })
  };

  render() {

    const {template, updateTemplate} = this.props;
    const {user} = this.state;
    console.log('uesr', user);
    return (
      <Container style={{maxWidth: '100%'}}>
        <Card>
          <CardBody>
            <div className='card__title'>
              <h5 className='bold-text'>Информация о студенте</h5>
            </div>
            {this.state.isReady &&

            <Row>
              <Col md={12} lg={2}>

                <Media src={this.state.userPhoto} width={30}/>
              </Col>
              <Col lg={10} md={12}>
                <Jumbotron fluid style={{paddingTop: '1rem'}}>
                  <Container fluid>
                    <h1 className="display-5">{user.first_name} {user.last_name}</h1>
                    <p className="lead">{user.klass.name}</p>
                    <Row>
                      <Col md={12} lg={6} style={{textAlign: 'center'}}>
                        <h4 className='text-center'>
                          <b>Присутствие:
                            <Badge className='ml-2' color={this.state.attendance.today>75?'success':'warning'} style={{color:'white'}}>
                              {this.state.attendance.today}%
                            </Badge>
                          </b>
                        </h4>
                        <Doughnut data={{
                          datasets: [{
                            data: [10, 20, 30],
                            backgroundColor: ["#DC3545", "#3BA745", "#F7C10A", "#3FA2B8"]
                          }],

                          // These labels appear in the legend and in the tooltips when hovering different arcs
                          labels: [
                            'Грусть',
                            'Печаль',
                            'Радость'
                          ]
                        }}>

                        </Doughnut>
                        <Badge color="dark" className='mt-4' style={{fontSize: '1.4rem'}}>
                          За сегодня
                        </Badge>
                      </Col>
                      <Col md={12} lg={6} style={{textAlign: 'center'}}>
                        <h4 className='text-center'>
                          <b>Присутствие:
                            <Badge className='ml-2' color={this.state.attendance.allTime>75?'success':'warning'} style={{color:'white'}}>
                              {this.state.attendance.allTime}%
                            </Badge>
                          </b>
                        </h4>
                        <Doughnut data={{
                          datasets: [{
                            data: [10, 20, 30],
                            backgroundColor: ["#DC3545", "#3BA745", "#F7C10A", "#3FA2B8"]
                          }],

                          // These labels appear in the legend and in the tooltips when hovering different arcs
                          labels: [
                            'Грусть',
                            'Печаль',
                            'Радость'
                          ]
                        }}>

                        </Doughnut>
                        <Badge color="dark" className='mt-4' style={{fontSize: '1.4rem'}}>
                          За всё время
                        </Badge>
                      </Col>
                    </Row>
                  </Container>
                </Jumbotron>
              </Col>
            </Row>}
          </CardBody>
        </Card>
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
