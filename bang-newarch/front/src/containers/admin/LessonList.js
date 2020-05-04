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
import { loadBatchResult, loadUserList } from 'Actions/admin'
import Select from "react-select";
import Chat from '../Chat'
import moment from "moment";
import PostSurveyForm from "../PostSurveyForm";
import RoundSurveyForm from "../RoundSurveyForm";
import TreeView from "treeview-react-bootstrap";
import ClockOutlineIcon from "mdi-react/ClockOutlineIcon";
import ClockIcon from "mdi-react/ClockIcon";
import {loadTemplateList} from "../../actions/templates";
import { history } from "../../app/history";
import PlusIcon from "mdi-react/PlusIcon";

class LessonList extends React.Component {
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
    ],
    cool_students: [],
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

  dif(emotion) {
    const t1 = new Date(emotion.end_time)
    const t2 = new Date(emotion.start_time)
    return Math.abs((t1.getTime() - t2.getTime()) / 1000)
  }

  colorByEmotion(emotion) {
    switch(emotion) {
      case 'AY':
      case 'SD':
        return 'danger';
      case 'HP':
      case 'SP':
        return 'success';
      case 'DG':
      case 'SC':
        return 'warning';
      case 'NT':
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
    this.props.loadUserList().then(() => {
      this.setStudentsRandomPhotos().then(r => {});
    });
  }

  async setStudentsRandomPhotos() {
    console.log('aaa')
    let newStudents = [];
    for(const student of this.props.userList) {
      const img = await this.getRandomUserImage();
      Math.random() > 0.5 ?
      newStudents.push({
        ...student,
        photo: img,
      }) : 1;
    }
    this.setState({
      cool_students: newStudents,
    })
    return newStudents
  }

  onSetActiveNode(id) {
    if(id === this.state.activeNode)
      return;
    console.log('new active node', id)
    this.setState({
      activeNodeId: id,
    })
    const updatedCoolStudents = this.setStudentsRandomPhotos();
    console.log('uCS', updatedCoolStudents);
    this.setState({ cool_students: updatedCoolStudents });
  }

  getEmotionByColor(color) {
    switch(color) {
      case 'danger':
        return 'Злость';
      case 'warning':
        return 'Испуг';
      case 'success':
        return 'Радость';
      case 'info':
        return 'Спокойствие';
    }
  }


  render() {
    console.log('usreList', this.state.cool_students, 'active nide', this.activeNode);
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
                        <div className='text-right'>
                          <Button className="btn btn-primary" onClick={() => history.push('/batches-add')}>
                            <PlusIcon size={24} />
                          </Button>

                        </div>
                      </div>
                      <Table borderless hover>
                        <thead>
                        <tr>
                          <th colSpan={3}>
                            {this.activeNode?
                              <div className='color-definitions'>
                                <a style={{marginRight: '2rem'}} href="#" onClick={() => {history.push('/lessons/' + this.activeNodeId)}}>
                                  {this.activeNode.title}
                                </a>
                                <div className='color-definitions'>
                                {
                                  ['danger','warning','success','info'].map(color =>
                                    <div className="color-definition">
                                      <div className={color}></div>
                                      <span>- {this.getEmotionByColor(color)}</span>
                                    </div>
                                  )
                                }
                                </div>
                              </div>:
                              <p>
                                Выберите урок
                              </p>
                            }

                          </th>
                          <th>
                            <ClockIcon color="#DC3545" id="clock-tooltip" />
                            <UncontrolledTooltip placement="top" target="clock-tooltip">
                              Время отсутствия в кадре
                            </UncontrolledTooltip>
                          </th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          (this.state.cool_students && this.state.cool_students.length > 0
                              // && this.state.activeNodeId
                          )
                            ?this.state.cool_students.map(student =>
                              {
                                const fullLength = student.lessons[0].emotions.map(x => this.dif(x)).reduce((a, b) => a + b)
                                return <tr key={student.id}>
                                  <td style={{width: '84px'}}>
                                    <Media src={student.photo} width={64} height={64}/>
                                  </td>
                                  <td style={{width: '250px'}}>
                                    <b>{student.first_name + " " + student.last_name}</b>
                                  </td>
                                  <td>
                                    <Progress multi>
                                      {
                                        student.lessons[0].emotions.map(emotion =>
                                        {
                                          const value = this.dif(emotion) / fullLength * 100
                                          return <Progress
                                              key={`${emotion.emotion_type}#${emotion.start_time.toString()}#${Math.random()*1000}`}
                                              bar
                                              color={this.colorByEmotion(emotion.emotion_type)}
                                              value={value}
                                          />
                                        }

                                        )
                                      }
                                    </Progress>
                                  </td>

                                  <td style={{width: '84px'}}>
                                    {student.time}
                                  </td>
                                </tr>
                              }

                          ):<p className="text-center my-4">Нет студентов</p>
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
    userList: state.admin.userList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
      {
        loadUserList,
      },
      dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonList);
