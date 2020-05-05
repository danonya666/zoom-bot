/** AddBatch.js
 *  front-end
 *
 *  admin only layout for adding  a batch
 *
 *  called by:
 *    1. Router.js
 */

import React, {PureComponent} from 'react';
import {Card, CardBody, Col, Row, Container, Button, ButtonToolbar, Input, FormGroup, Label, Form} from 'reactstrap';
import {connect} from "react-redux";
import {addBatch, loadBatchList, generateZoomLink} from "Actions/admin";
import {loadTemplateList} from "Actions/templates";
import {bindActionCreators} from "redux";
import {Field, reduxForm, formValueSelector} from "redux-form";
import {renderField, renderTextArea} from 'Components/form/Text'
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
      this.props.loadBatchList({remembered: true})
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

  componentDidMount() {
    this.props.generateZoomLink();
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
            <form className='form form--horizontal' style={{paddingBottom: '5vh'}} onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
              <h5>Filter users by:</h5>
              <div className='form__form-group'>
                <label className='form__form-group-label'>Class</label>
                <div className='form__form-group-field'>
                  <Field
                      name='className'
                      component={renderSelectField}
                      options={this.props.templateList.map(t => {return {value: t.name, label: t.name}})}
                  />
                </div>
              </div>
              <div className='form__form-group'>
                <label className='form__form-group-label'>Note</label>
                <div className='form__form-group-field'>
                  <Field
                    name='note'
                    component={renderTextArea}
                    type='text'
                  />
                </div>
              </div>
              <div className='form__form-group'>
                <label className='form__form-group-label'>Zoom Link</label>
              </div>
              <div className='form__form-group'>
                {<label>{this.props.zoomLink}</label>}

                <Button style={{marginLeft: "10px"}} onClick={() => {navigator.clipboard.writeText(this.props.zoomLink);}}>
                  Copy to clipboard
                </Button>

              </div>
              <div className='form__form-group'>

              </div>

            <ButtonToolbar className='mx-auto form__button-toolbar'>
                <Button type="submit" disabled={invalid} color='primary' size='sm'
                >Add lesson</Button>
              </ButtonToolbar>
            </form>
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
  // if (!props.captcha) {
  //   errors.className = 'load captcha';
  // }
  // if (!props.zoomLink || props.zoomLink === "") {
  //   console.log(!props.zoomLink, props.zoomLink === "")
  //   errors.className = 'generate zoom link please';
  // }
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
    loadBatchList,
    loadTemplateList,
    generateZoomLink,
    snackbar,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddLesson);