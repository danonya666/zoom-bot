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
  ListGroup, ListGroupItem, Media, Progress, UncontrolledTooltip, Spinner
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
    isReady: false,
    lessons: [
      {
        id: 1,
        title: '03.05',
        nodes: [
          {
            id: 11,
            title: '4 "A" 9:00',
          },
          {
            id: 12,
            title: '4 "Б" 10:00',
          },
          {
            id: 13,
            title: '4 "В" 11:00',
          },
        ]
      },
      {
        id: 2,
        title: '04.05',
        nodes: [
          {
            id: 21,
            title: '4 "A" 9:00',
          },
          {
            id: 22,
            title: '4 "Б" 10:00',
          },
          {
            id: 23,
            title: '4 "В" 11:00',
          },
        ]
      },
      {
        id: 3,
        title: '05.05',
        nodes: [
          {
            id: 31,
            title: '4 "A" 9:00',
          },
        ]
      },
    ],
    activeNodeId: null,
    students: [
      {
        photo: 'http://via.placeholder.com/64/',
        fullName: 'Фамилия Имя Отчество',
        emotions: [
          {type:'angry',value:2},
          {type:'sad',value:6},
          {type:'scared',value:2},
          {type:'neutral',value:10},
          {type:'surprised',value:15},
          {type:'angry',value:3},
          {type:'scared',value:7},
          {type:'surprised',value:25},
          {type:'sad',value:40},
        ],
        time: '15m',
        id: 1,
      },
      {
        photo: 'http://via.placeholder.com/64/',
        fullName: 'Фамилия Имя Отчество2',
        emotions: [
          {type:'angry',value:2},
          {type:'sad',value:6},
          {type:'scared',value:2},
          {type:'neutral',value:10},
          {type:'surprised',value:15},
          {type:'angry',value:3},
          {type:'scared',value:7},
          {type:'surprised',value:25},
          {type:'sad',value:40},
        ],
        time: '15m',
        id: 2,
      },
    ]
  }

  get activeNode() {
    for(let i = 0; i < this.state.lessons.length;i++) {
      const lesson = this.state.lessons[i];
      for(let j = 0; j < lesson.nodes.length;j++) {
        const node = lesson.nodes[j];
        if(node.id === this.state.activeNodeId)
          return node;
      }
    }
  }

  colorByEmotion(emotion) {
    switch(emotion) {
      case 'angry':
      case 'sad':
        return 'danger';
      case 'happy':
      case 'surprised':
        return 'success';
      case 'disgust':
      case 'scared':
        return 'warning';
      case 'neutral':
        return 'info';
      default:
        return 'info';
    }
  }

  async getRandomUserImage() {
    const result = await fetch('https://randomuser.me/api/');
    const json = await result.json();
    return json.results[0].picture.thumbnail;
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isReady: true,
      })
    }, Math.random() * 2500)
    this.state.students.forEach(async student => {
      const img = await this.getRandomUserImage();
      this.setState({
        students: [
          ...this.state.students.filter(_=>_.id!==student.id),
          {...student, photo: img},
        ]
      })
    })
  }

  onSetActiveNode(id) {
    if(id === this.state.activeNode)
      return;
    this.setState({
      activeNodeId: id,
    })
    // Здесь фетчить юзеров группы по activeNodeId и в students класть
  }


  render() {
    return (
      <Container style={{maxWidth: '100%'}}>
        <Row>
          <Col md={12} lg={12} xl={12}>
            <Card>
              {this.state.isReady ?
                <CardBody>
                  <Row>
                    <Col md={12} lg={3}>
                      <div className='card__title'>
                        <h5 className='bold-text'>My lessons</h5>
                      </div>
                      <ButtonGroup vertical style={{width: '100%'}}>
                        {
                          this.state.lessons.map(lesson =>
                            <div style={{width: '100%'}} key={lesson.id}>
                              <Button block color="btn btn-noanim btn-lesson text-left" id={"toggler"+lesson.id}>
                                {lesson.title}
                              </Button>
                              <UncontrolledCollapse toggler={"#toggler"+lesson.id}>
                                <ListGroup>
                                  {
                                    lesson.nodes.map(node =>
                                      <ListGroupItem
                                        tag="a"
                                        href="#"
                                        action
                                        active={node.id === this.state.activeNodeId}
                                        onClick={() => this.onSetActiveNode(node.id)}
                                        key={node.id}
                                      >{node.title}</ListGroupItem>
                                    )
                                  }
                                </ListGroup>
                              </UncontrolledCollapse>
                            </div>
                          )
                        }


                      </ButtonGroup>
                    </Col>
                    <Col md={12} lg={9}>
                      <div className='card__title'>
                        <h5 className='bold-text'>My lessons</h5>
                      </div>
                      <Table borderless hover>
                        <thead>
                        <tr>
                          <th colSpan={3}>{(this.activeNode && this.activeNode.title) ||'Не выбрана'}</th>
                          <th>
                            <ClockIcon/>
                          </th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          this.state.students.map(student =>
                            <tr key={student.id}>
                              <td style={{width: '84px'}}>
                                <Media src={student.photo} width={64} height={64}/>
                              </td>
                              <td style={{width: '250px'}}>
                                <b>{student.fullName}</b>
                              </td>
                              <td>
                                <Progress multi>
                                  {
                                    student.emotions.map(emotion =>
                                      <Progress key={`${emotion.type}#${emotion.value}#${Math.random()*1000}`} bar color={this.colorByEmotion(emotion.type)} value={emotion.value}/>
                                    )
                                  }
                                </Progress>
                              </td>

                              <td style={{width: '84px'}}>
                                {student.time}
                              </td>
                            </tr>
                          )
                        }
                        </tbody>
                      </Table>
                    </Col>
                  </Row>

                </CardBody> :
                <Card>
                  <CardBody style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Spinner style={{width: '3rem', height: '3rem', background: '#387aff'}} type="grow"/>
                  </CardBody>
                </Card>
              }
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {

  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonSingle);
