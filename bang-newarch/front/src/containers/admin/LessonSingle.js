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
  ListGroup, ListGroupItem, Media, Progress, UncontrolledTooltip, Spinner, CardImg, CardText, CardTitle, Alert
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
  scales: {
    xAxes: [{
      display: false,
    }],
    yAxes: [{
      gridLines: {
        display: false,
      },
      ticks: {
        suggestedMin: -3,    // minimum will be 0, unless there is a lower value.
        suggestedMax: 3,
        stepSize: 1,
        callback: function (value, index, values) {
          return EMOTIONS[value];
        },
        fontSize: 10,
        minRotation: 0,
        gridLines: {
          zeroLineWidth: 3,
          zeroLineColor: "#2C292E",
        },
      }
    }]
  },
}

class LessonSingle extends React.Component {
  TIMER_INT = 5
  state = {
    isReady: false,
    lesson: {
      id: 1,
      title: '4:20 LESSON',
    },
    activeNodeId: null,
    userList: [],
    cool_students: [],
    timer: this.TIMER_INT,
    best_student: {first_name: 'Загрузка..', last_name: 'Загрузка..'},
    worst_student: {first_name: 'Загрузка..', last_name: 'Загрузка..'},
    sad: 10,
    neutral: 20,
    happy: 30,
  }

  tick = () => {
    this.setState(state => ({
      timer: state.timer - 1
    }));
    if (this.state.timer <= 0) {
      console.log('loading users')
      this.props.loadUserList();
      this.state.timer = this.TIMER_INT;
    }
  }

  colorByEmotion(emotion) {
    switch (emotion) {
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

    this.props.loadUserList().then(t => this.setStudentsRandomPhotos().then(t => {
      this.setState({
        isReady: true,
      })
    }));
    setInterval(this.tick, 1000)
    setInterval(() => {this.bestStudent(this.state.cool_students)}, 10000)
    setInterval(() => {this.worstStudent(this.state.cool_students)}, 10000)
    setInterval(() => {this.updateCircleChart(this.state.cool_students)}, 10000)
  }

  async setStudentsRandomPhotos() {
    let newStudents = [];
    for (const student of this.props.userList) {
      const img = await this.getRandomUserImage();
      Math.random() > 0.2 ?
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
    const backgroundColor = color.replace('{}', '0.4');
    const borderColor = color.replace('{}', '1');
    const pointBorderColor = color.replace('{}', '1');
    const pointHoverBorderColor = color.replace('{}', '1');
    const pointHoverBackgroundColor = color.replace('{}', '1');
    return {
      labels: [...new Array(data.length)].map((item, i) => i),
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

   typeToScore = (type) => {
    switch (type) {
      case "DG":
        return -3;
      case "SC":
        return -2;
      case "SD":
        return -1;
      case "AY":
        return 0;
      case "NT":
        return 1;
      case "HP":
        return 2;
      case "SP":
        return 3;
      default:
        return 0;

    }
  }
  bestStudent(students) {
    let bestScore = -158;
    let bestStudent;
    try {
      bestStudent = students[0];
    }
    catch (e) {

    }
    students.forEach((x, ind) => {
      let currentScore = 0
      x.lessons[0].emotions.forEach(y => {
          currentScore += this.typeToScore(y.emotion_type)
      })
      if (currentScore > bestScore) {
        bestScore = currentScore
        bestStudent = students[ind];
      }
    })
    if (!bestStudent) {
      bestStudent = {first_name: "test", last_name: "test"}
    }
    this.setState({best_student: bestStudent})
  }

  worstStudent(students) {
    let bestScore = 123321;
    let bestStudent = students[0];
    students.forEach((x, ind) => {
      let currentScore = 0
      x.lessons[0].emotions.forEach(y => {
        currentScore += this.typeToScore(y.emotion_type)
      })
      if (currentScore < bestScore) {
        bestScore = currentScore
        bestStudent = students[ind];
      }
    })
    this.setState({worst_student: bestStudent})
  }

  updateCircleChart(students) {
    let emoCount = 0;
    let sadCount = 0;
    let happyCount = 0;
    let ntCount = 0;

    students.forEach(x => {
      emoCount += x.lessons[0].emotions.length
      x.lessons[0].emotions.forEach(y => {
        if (y.emotion_type === 'HP') {
          happyCount++
        } else if (y.emotion_type === 'NT') {
          ntCount++
        } else {
          sadCount++;
        }
      })
    })
    console.log('circle', sadCount, happyCount, ntCount)
    this.setState({sad: sadCount, happy: happyCount, neutral: ntCount});
  }

  getEmotionByColor(color) {
    switch (color) {
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
    let worstStats = []
    let bestStats = [];
    try {
      console.log('worst student', this.state.worst_student);
      worstStats = this.state.worst_student.lessons[0].emotions.map(em => this.typeToScore(em.emotion_type));
    }
    catch (e) {
      worstStats = [];
    };

    try {
      console.log('best student', this.state.best_student);
      bestStats = this.state.best_student.lessons[0].emotions.map(em => this.typeToScore(em.emotion_type));
    }
    catch (e) {
      bestStats = [];
    };
    if (!bestStats) {
      bestStats = [];
    }
    console.log('beststats', bestStats)

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
                  <Button color="primary" id="toggler">
                    ZOOM трансляция
                  </Button>
                  <UncontrolledCollapse toggler="#toggler">
                    <Alert color="success">
                      <p className="mb-0">
                        Join Zoom Meeting<br />
                        <a href="https://us02web.zoom.us/j/85314443993?pwd=WVB4TGorRm95amZDVmZBWERQaVhGUT09">https://us02web.zoom.us/j/85314443993?pwd=WVB4TGorRm95amZDVmZBWERQaVhGUT09</a><br />
                        Meeting ID: 853 1444 3993<br />
                        Password: 891048<br />
                        One tap mobile<br />
                        +13017158592,,85314443993#,,1#,891048# US (Germantown)<br />
                        +13126266799,,85314443993#,,1#,891048# US (Chicago)<br />
                        Dial by your location<br />
                        +1 301 715 8592 US (Germantown)<br />
                        +1 312 626 6799 US (Chicago)<br />
                        +1 346 248 7799 US (Houston)<br />
                        +1 669 900 6833 US (San Jose)<br />
                        +1 929 205 6099 US (New York)<br />
                        +1 253 215 8782 US (Tacoma)<br />
                        Meeting ID: 853 1444 3993<br />
                        Password: 891048<br />
                        Find your local number: <a href="https://us02web.zoom.us/u/kbiyqt6cci">https://us02web.zoom.us/u/kbiyqt6cci</a>
                      </p>
                    </Alert>
                  </UncontrolledCollapse>
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
                              data: [this.state.sad, this.state.neutral, this.state.happy],
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
                              <CardTitle>{this.state.best_student.first_name ? this.state.best_student.first_name : "" + " " + this.state.best_student.last_name ? this.state.best_student.last_name: ""}</CardTitle>
                                <Bar
                                  data={this.getChartDataset(
                                      [...bestStats],
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
                              <CardTitle>{this.state.worst_student.last_name}</CardTitle>
                                <Bar
                                  data={this.getChartDataset(
                                    [...worstStats],
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
                                ['danger', 'warning', 'success', 'info'].map(color =>
                                  <div className="color-definition">
                                    <div className={color}></div>
                                    <span>- {this.getEmotionByColor(color)}</span>
                                  </div>
                                )
                              }
                            </div>
                          </th>
                          <th style={{width: '100px'}}>
                            <ClockIcon color="#DC3545" id="clock-tooltip"/>
                            <UncontrolledTooltip placement="top" target="clock-tooltip">
                              Время отсутствия в кадре
                            </UncontrolledTooltip>
                          </th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          this.state.cool_students.map(student => {
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
                                          key={`${emotion.emotion_type}#${emotion.start_time.toString()}#${Math.random() * 1000}`}
                                          bar
                                          color={this.colorByEmotion(emotion.emotion_type)}
                                          value={this.dif(emotion) / fullLength * 100}
                                        />
                                      )
                                    }
                                  </Progress>
                                </td>

                                <td>
                                  {student.lessons[0].actions && student.lessons[0].actions.length ?
                                    (student.lessons[0].actions.map(x => this.dif(x)).reduce((a, b) => a + b) / 60).toFixed(0) : 0}
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
