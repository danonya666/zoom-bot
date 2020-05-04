/** batchresult.js
 *  front-end
 *
 *  admin view of a batch's results
 *
 *  renders:
 *    1. when admin is looking at batch
 *
 *  called by:
 *    1. router.js
 */

import React from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Container,
  Table,
  UncontrolledCollapse,
  Button,
  ButtonGroup,
  ListGroup, ListGroupItem, Media, Progress, UncontrolledTooltip
} from 'reactstrap';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {loadBatchResult} from 'Actions/admin'
import Select from "react-select";
import Chat from '../Chat'
import moment from "moment";
import PostSurveyForm from "../PostSurveyForm";
import RoundSurveyForm from "../RoundSurveyForm";
import TreeView from "treeview-react-bootstrap";
import ClockOutlineIcon from "mdi-react/ClockOutlineIcon";
import ClockIcon from "mdi-react/ClockIcon";

class LessonSingle extends React.Component {
  state = {
    user: '',
    round: '',
    userOptions: [],
    roundOptions: [],
    chat: {},
    members: [],
    preSurvey: {},
    midSurvey: {},
    finalSurvey: null,
    isReady: false,
    downloadLink: ''
  }

  componentWillMount() {
    this.props.loadBatchResult(this.props.match.params.id).then(() => {
      const batch = this.props.batch;
      let userOptions = batch.users.map((x) => {
        return {value: x.user._id, label: x.nickname + ' (' + x.user.mturkId + ')'};
      });
      let roundOptions = batch.rounds.map((x, index) => {
        return {value: index + 1, label: index + 1};
      });
      const blob = new Blob([JSON.stringify(batch)], {type: 'application/json'});
      this.setState({
        isReady: true,
        userOptions: userOptions,
        roundOptions: roundOptions,
        downloadLink: URL.createObjectURL(blob)
      });
    });
  }

  handleChangeUser = (e) => {
    const user = e.value;
    let chat = {}, members = [], preSurvey = {}, midSurvey = {};
    if (!!this.state.round && user) {
      const batch = this.props.batch;
      const team = batch.rounds[this.state.round - 1].teams[batch.rounds[this.state.round - 1].teams
        .findIndex(x => x.users.some(y => y.user === user))]
      chat = team.chat;
      preSurvey = team.users.find(x => x.user === user).preSurvey;
      midSurvey = team.users.find(x => x.user === user).midSurvey;
      members = team.users.map(user => {
        let newUser = JSON.parse(JSON.stringify(user))
        newUser.nickname = user.nickname + ' | ' + this.state.userOptions.find(x => x.value === user.user).label
        return newUser;
      });
    }
    this.setState({
      user: user, chat: chat, members: members, midSurvey: midSurvey, preSurvey: preSurvey,
      finalSurvey: this.props.batch.users.find(x => x.user._id === user).survey
    });
  }

  handleChangeRound = (e) => {
    const round = e.value;
    let chat = {}, members = [], preSurvey = {}, midSurvey = {};
    if (!!this.state.user && round) {
      const batch = this.props.batch;
      const team = batch.rounds[round - 1].teams[batch.rounds[round - 1].teams
        .findIndex(x => x.users.some(y => y.user === this.state.user))]
      chat = team.chat;
      members = team.users.map(user => {
        let newUser = JSON.parse(JSON.stringify(user))
        newUser.nickname = user.nickname + ' | ' + this.state.userOptions.find(x => x.value === user.user).label
        return newUser;
      });
      preSurvey = team.users.find(x => x.user === this.state.user).preSurvey;
      midSurvey = team.users.find(x => x.user === this.state.user).midSurvey;
    }
    this.setState({round: round, chat: chat, members: members, preSurvey: preSurvey, midSurvey: midSurvey})
  }

  render() {
    const {batch, defaultMidQuestions} = this.props;
    return (
      <Container style={{maxWidth: '100%'}}>
        <Row>
          <Col md={12} lg={12} xl={12}>
            <Card>
              {this.state.isReady &&
              <CardBody>
                <Row>
                  <Col md={12} lg={4}>
                    <div className='card__title'>
                      <h5 className='bold-text'>My lessons</h5>
                    </div>
                    <ButtonGroup vertical style={{width: '100%'}}>
                      <Button block color="btn btn-noanim btn-lesson text-left" id="toggler1">
                        03.05
                      </Button>
                      <UncontrolledCollapse toggler="#toggler1">
                        <ListGroup>
                          <ListGroupItem tag="a" href="#" action>4 "А" 9:00</ListGroupItem>
                          <ListGroupItem tag="a" href="#" action active>4 "А" 10:00</ListGroupItem>
                          <ListGroupItem tag="a" href="#" action>4 "А" 11:00</ListGroupItem>
                        </ListGroup>
                      </UncontrolledCollapse>
                      <Button block color="btn btn-noanim btn-lesson text-left" id="toggler2">
                        05.05
                      </Button>
                      <UncontrolledCollapse toggler="#toggler2">
                        <ListGroup>
                          <ListGroupItem tag="a" href="#" action>4 "А" 9:00</ListGroupItem>
                          <ListGroupItem tag="a" href="#" action>4 "А" 10:00</ListGroupItem>
                          <ListGroupItem tag="a" href="#" action>4 "А" 11:00</ListGroupItem>
                        </ListGroup>
                      </UncontrolledCollapse>
                      <Button block color="btn btn-noanim btn-lesson text-left" id="toggler3">
                        05.05
                      </Button>
                      <UncontrolledCollapse toggler="#toggler3">
                        <ListGroup>
                          <ListGroupItem tag="a" href="#" action>4 "А" 9:00</ListGroupItem>
                          <ListGroupItem tag="a" href="#" action>4 "А" 10:00</ListGroupItem>
                          <ListGroupItem tag="a" href="#" action>4 "А" 11:00</ListGroupItem>
                        </ListGroup>
                      </UncontrolledCollapse>

                    </ButtonGroup>
                  </Col>
                  <Col md={12} lg={8}>
                    <div className='card__title'>
                      <h5 className='bold-text'>My lessons</h5>
                    </div>
                    <Table borderless hover>
                      <thead>
                        <tr>
                          <th colSpan={3}>4 "А" 10:00</th>
                          <th>
                            <ClockIcon outline />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{width:'84px'}}>
                            <Media src="http://via.placeholder.com/64/" width={64} height={64}/>
                          </td>
                          <td  style={{width:'250px'}}>
                            <b>Петров Петр Николаевич</b>
                          </td>
                          <td>
                            <Progress multi>
                              <Progress bar value="10" id="UncontrolledTooltipExample"/>
                              <Progress bar color="success" value="30" />
                              <Progress bar color="info" value="25" />
                              <Progress bar color="warning" value="20" />
                              <Progress bar color="danger" value="15" />
                            </Progress>
                          </td>

                          <td style={{width:'84px'}}>
                            15m
                          </td>
                        </tr>
                        <tr>
                          <td style={{width:'84px'}}>
                            <Media src="http://via.placeholder.com/64/" width={64} height={64}/>
                          </td>
                          <td  style={{width:'250px'}}>
                            <b>Петров Петр Николаевич</b>
                          </td>
                          <td>
                            <Progress multi>
                              <Progress bar value="50" />
                              <Progress bar color="success" value="10" />
                              <Progress bar color="info" value="15" />
                              <Progress bar color="warning" value="25" />
                              <Progress bar color="danger" value="10" />
                            </Progress>
                          </td>
                          <td style={{width:'84px'}}>
                            15m
                          </td>
                        </tr>
                        <tr>
                          <td style={{width:'84px'}}>
                            <Media src="http://via.placeholder.com/64/" width={64} height={64}/>
                          </td>
                          <td  style={{width:'250px'}}>
                            <b>Петров Петр Николаевич</b>
                          </td>
                          <td>
                            <Progress multi>
                              <Progress bar value="15" />
                              <Progress bar color="info" value="10" />
                              <Progress bar color="success" value="50" />
                              <Progress bar color="warning" value="20" />
                              <Progress bar color="danger" value="20" />
                            </Progress>
                          </td>
                          <td style={{width:'84px'}}>
                            15m
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>

              </CardBody>}
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  let defaultMidQuestions = !state.admin.batch
    ? []
    : state.admin.batch.midQuestions.map((q) => {
      let question = {};
      question.type = 'select';
      question.question = q;
      question.selectOptions = [
        {value: 1, label: 'Strongly Disagree'},
        {value: 2, label: 'Disagree'},
        {value: 3, label: 'Neutral'},
        {value: 4, label: 'Agree'},
        {value: 5, label: 'Strongly Agree'}
      ];
      return question;
    });

  return {
    batch: state.admin.batch,
    defaultMidQuestions: defaultMidQuestions
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadBatchResult
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonSingle);
