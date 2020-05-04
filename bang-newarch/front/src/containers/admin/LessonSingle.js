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
    students: [
      {
        photo: 'http://via.placeholder.com/64/',
        fullName: 'Фамилия Имя Отчество',
        emotions: [
          {type: 'angry', value: 2},
          {type: 'sad', value: 6},
          {type: 'scared', value: 2},
          {type: 'neutral', value: 10},
          {type: 'surprised', value: 15},
          {type: 'angry', value: 3},
          {type: 'scared', value: 7},
          {type: 'surprised', value: 25},
          {type: 'sad', value: 40},
        ],
        time: '15m',
        id: 1,
      },
      {
        photo: 'http://via.placeholder.com/64/',
        fullName: 'Фамилия Имя Отчество2',
        emotions: [
          {type: 'angry', value: 2},
          {type: 'sad', value: 6},
          {type: 'scared', value: 2},
          {type: 'neutral', value: 10},
          {type: 'surprised', value: 15},
          {type: 'angry', value: 3},
          {type: 'scared', value: 7},
          {type: 'surprised', value: 25},
          {type: 'sad', value: 40},
        ],
        time: '15m',
        id: 2,
      },
    ]
  }

  colorByEmotion(emotion) {
    switch (emotion) {
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

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isReady: true,
      })
    }, Math.random() * 2500)

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
                              backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"]
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
                          <th colSpan={3}>{(this.activeNode && this.activeNode.title) || 'Не выбрана'}</th>
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
                                      <Progress key={`${emotion.type}#${emotion.value}#${Math.random() * 1000}`} bar
                                                color={this.colorByEmotion(emotion.type)} value={emotion.value}/>
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
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonSingle);
