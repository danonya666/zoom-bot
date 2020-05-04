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
  ListGroup, ListGroupItem, Media, Progress, UncontrolledTooltip, Spinner, CardImg, CardText, CardTitle
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
import {Bar, Doughnut, Line} from "react-chartjs-2";
import {loadUserList} from "../../actions/admin";

const EMOTIONS = {
  '-3': 'Злость',
  '-2': 'Отвращение',
  '-1': 'Грусть',
  '0': 'Испуг',
  '1': 'Спокойствие',
  '2': 'Радость',
  '3': 'Восхищение',
}

const lineOptions = {
  legend: {
    display: false
  },
  layout: {
    padding: {
      bottom: 20
    }
  },
  tooltips: {
    enabled: false,
  },
  scales:{
    xAxes: [{
      display: false,
    }],
    yAxes: [{
      gridLines: {
        display:false,
      },
      ticks: {
        suggestedMin: -3,    // minimum will be 0, unless there is a lower value.
        suggestedMax: 3,
        stepSize: 1,
        callback: function(value, index, values) {
          return EMOTIONS[value];
        },
        fontSize: 10,
        minRotation : 0,
        gridLines: {
          zeroLineWidth: 3,
          zeroLineColor: "#2C292E",
        },
      }
    }]
  },
}

class LessonSingle extends React.Component {
  state = {
    isReady: false,
    lesson: {
      id: 1,
      title: '4:20 LESSON',
    },
    activeNodeId: null,
    userList: [

    ],
    cool_students: [],
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

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isReady: true,
      })
      this.props.loadUserList().then(t => this.setStudentsRandomPhotos().then(t => {}));
    }, Math.random() * 2500)
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

  async getRandomUserImage() {
    const result = await fetch('https://randomuser.me/api/');
    const json = await result.json();
    return json.results[0].picture.thumbnail;
  }

  dif(emotion) {
    const t1 = new Date(emotion.end_time)
    const t2 = new Date(emotion.start_time)
    return Math.abs((t1.getTime() - t2.getTime()) / 1000)
  }

  getChartDataset(data, color = 'rgba(75,192,192,{})') {
    const backgroundColor = color.replace('{}','0.4');
    const borderColor = color.replace('{}','1');
    const pointBorderColor = color.replace('{}','1');
    const pointHoverBorderColor = color.replace('{}','1');
    const pointHoverBackgroundColor = color.replace('{}','1');
    return {
      labels: [...new Array(data.length)].map((item,i)=>i),
        datasets: [
        {
          fill: false,
          lineTension: 0.1,
          backgroundColor,
          borderColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor,
          pointHoverBorderColor,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data,
        }
      ]
    };
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
    return (
      <Container style={{maxWidth: '100%'}}>
        <Row>
          <Col md={12} lg={12} xl={12}>
            <Card>
              {this.state.isReady ?
                <CardBody>
                  <div className='card__title'>
                    <h5 className='bold-text'>{this.state.lesson.title}</h5>
                  </div>
                  <Row>
                    <Col md={12} lg={4}>
                      <Card className='card-shadow'>
                        <CardBody>
                          <h5>
                            Общая статистика
                          </h5>
                          <CardTitle>По эмоциям</CardTitle>

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
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md={12} lg={4}>
                      <Card className='card-shadow'>
                        <CardBody>
                          <Card>
                            <CardBody style={{padding: '0'}}>
                              <h5>
                                Самый заинтересованный
                              </h5>
                              <CardTitle>Николай Иванович</CardTitle>
                                <Bar
                                  data={this.getChartDataset(
                                    [-1,-3,1,0,3,-1,0,2,1,0],
                                  )}
                                  options={lineOptions}
                                >
                                </Bar>
                            </CardBody>
                          </Card>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md={12} lg={4}>
                      <Card className='card-shadow'>
                        <CardBody>
                          <Card>
                            <CardBody style={{padding: '0'}}>
                              <h5>
                                Наименее заинтересованный
                              </h5>
                              <CardTitle>Николай Николаевич</CardTitle>
                                <Bar
                                  data={this.getChartDataset(
                                    [1,2,3,3,3,-1,0,2,1,0,],
                                    'rgba(255,100,100,{})',
                                  )}
                                  options={lineOptions}
                                >
                                </Bar>
                            </CardBody>
                          </Card>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                  <Row style={{marginTop: '2rem'}}>
                    <Col md={12} lg={12}>
                      <div className='card__title'>
                        <h5 className='bold-text'>Students</h5>
                      </div>
                      <Table borderless hover>
                        <thead>
                        <tr>
                          <th colSpan={3}>
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
                          this.state.cool_students.map(student =>
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
                                    <Progress
                                            key={`${emotion.emotion_type}#${emotion.start_time.toString()}#${Math.random()*1000}`}
                                            bar
                                            color={this.colorByEmotion(emotion.emotion_type)}
                                            value={this.dif(emotion) / fullLength * 100}
                                        />
                                    )
                                  }
                                </Progress>
                              </td>

                              <td style={{width: '84px'}}>
                                {student.time}
                              </td>
                            </tr>
                          }
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
export default connect(mapStateToProps, mapDispatchToProps)(LessonSingle);
