/** AddBatch.js
 *  front-end
 *
 *  admin only layout for adding  a batch
 *
 *  called by:
 *    1. Router.js
 */

import React from 'react';
import {Card, CardBody, Col, Row, Container, Button, ButtonToolbar, Input, FormGroup, Label, Form} from 'reactstrap';
import {connect} from "react-redux";
import {addBatch } from "Actions/admin";
import {loadTemplateList} from "Actions/templates";
import {bindActionCreators} from "redux";
import {Field, reduxForm, formValueSelector} from "redux-form";
import renderSelectField from 'Components/form/Select'
import SurveyForm from "./SurveyForm";
import {snackbar} from "../../actions/admin";


class AddLesson extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      options: [],
    }
  }

  async componentWillMount(){
    await Promise.all([
      this.props.loadTemplateList({full:true}),
    ])
    let batchOptions = this.props.batchList.map(x => {return {value: x._id, label: `${x.templateName}(${x.note}) ${x.createdAt}`}});
    batchOptions.unshift({value: false, label: "Don't load"})
    this.setState({
      singleTeamTemplateOptions: this.props.templateList.filter(x => x.teamFormat === 'single')
        .map(x => {return {value: x._id, label: x.name}}),
      multiTeamTemplateOptions: this.props.templateList.filter(x => x.teamFormat !== 'single')
        .map(x => {return {value: x._id, label: x.name}}),
      batchOptions: batchOptions,
      isReady: true
    })
  }


  handleSubmit(form) {
    console.log('form', form, 'tList', this.props.templateList);
    let batch = Object.assign(this.props.templateList.find(x => x.name === form.className));
    // batch parameters
    batch.note = form.note;
    batch.maskType = form.maskType;
    batch.withAvatar = form.withAvatar;
    batch.withRoster = form.teamFormat === 'single' ? true : form.withRoster;
    batch.withAutoStop = form.withAutoStop;
    batch.teamFormat = form.teamFormat;
    batch.rememberTeamOrder = form.rememberTeamOrder;
    batch.loadTeamOrder = form.loadTeamOrder;
    batch.bestRoundFunction = form.bestRoundFunction;
    batch.randomizeExpRound = form.randomizeExpRound;
    batch.reconveneWorstRound = form.reconveneWorstRound;
    batch.dynamicTeamSize = form.dynamicTeamSize;
    // filter parameters
    batch.gender = form.gender;
    batch.salary = form.salary;
    batch.userRace = form.userRace;
    batch.bornAfterYear = form.bornAfterYear;
    batch.bornBeforeYear = form.bornBeforeYear;
    batch.zoomLink = this.props.zoomLink;
    this.props.addBatch(batch)
  }

  render() {
    const {invalid, handleSubmit} = this.props;
    return (
      <Container>
        <Card>
          {this.state.isReady && <CardBody>
            <div className='card__title'>
              <h5 className='bold-text'>Добавить урок</h5>
            </div>
            <Form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
              <FormGroup>
                <Label for="name">Класс</Label>
                <Field
                  name='className'
                  component={renderSelectField}
                  options={this.props.templateList.map(t => {return {value: t.name, label: t.name}})}
                />
              </FormGroup>
              <FormGroup>
                <Label for="name">Название</Label>
                <Input />
              </FormGroup>
              <Button disabled={invalid}>Сохранить</Button>

            </Form>
          </CardBody>}
        </Card>
      </Container>
    )
  }
}

const validate = (values, props) => {
  const errors = {};
  if (!values.className) {
    errors.className = 'required';
  }
  return errors
};

AddLesson = reduxForm({
  form: 'SurveyForm',
  enableReinitialize: true,
  touchOnChange: true,
  validate,
})(AddLesson);

const selector = formValueSelector('SurveyForm');

function mapStateToProps(state) {
  return {
    templateList: state.template.templateList,
    batchList: state.admin.batchList,
    zoomLink: state.admin.zoomLink,
    captcha: state.admin.captcha,
    teamFormat: selector(state, 'teamFormat'),
    bestRoundFunction: selector(state, 'bestRoundFunction'),
    initialValues: {
      teamFormat: 'single',
      maskType: 'masked',
      withAvatar: true,
      withRoster: true,
      withAutoStop: true,
      rememberTeamOrder: false,
      loadTeamOrder: false,
      bestRoundFunction: 'do not reconvene',
      reconveneWorstRound: false,
      randomizeExpRound: false,
      dynamicTeamSize: false,
      gender: false,
      salary: false,
      userRace: false,
    }
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addBatch,
    loadTemplateList,
    snackbar,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddLesson);
