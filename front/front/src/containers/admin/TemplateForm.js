/** TemplateForm.js
 *  front-end
 *
 *  admin only layout for adding / editing (validating) a template
 *
 *  called by:
 *    1. AddClass.js
 *    2. EditTemplate.js (empty, code scrap)
 *    3. TemplateInfo.js
 */

import React from 'react';
import {Col, Button, ButtonToolbar, Row, Container} from 'reactstrap';
import {connect} from 'react-redux'
import {Field, FieldArray, reduxForm, formValueSelector, change} from 'redux-form'
import {bindActionCreators} from "redux";
import {renderField, renderTextArea} from 'Components/form/Text'
import renderSelectField from 'Components/form/Select'
import renderCheckBoxField from 'Components/form/CheckBox'
import Select from "react-select";

const renderSurvey = ({fields, meta: {touched, error, warning}, task, surveyType, teamFormat, postSurvey, preSurvey}) => {
  const isSurvey = true;
  return (<div style={{width: '100%', marginTop: '20px', borderBottom: '1px solid grey'}}>
    {
      fields.map((question, index) => {
        let isSelect = false;
        if (surveyType === 'mid' && task && task.survey[index] && task.survey[index].type === 'select' ||
          surveyType === 'pre' && task && task.preSurvey[index] && task.preSurvey[index].type === 'select' ||
          surveyType === 'post' && postSurvey && postSurvey[index].type === 'select' ||
          surveyType === 'prepre' && preSurvey && preSurvey[index].type === 'select') {
          isSelect = true;
        }

        let isIntegerRank = false;
        if (surveyType === 'mid' && task && task.survey[index] && task.survey[index].type === 'integerRank' ||
          surveyType === 'pre' && task && task.preSurvey[index] && task.preSurvey[index].type === 'integerRank' ||
          surveyType === 'post' && postSurvey && postSurvey[index].type === 'integerRank' ||
          surveyType === 'prepre' && preSurvey && preSurvey[index].type === 'integerRank') {
          isIntegerRank = true;
        }

        return (
          <Row key={index} >
            <Col>
              <div className='form__form-group'>
                <label className='form__form-group-label'>question:</label>
                <div className='form__form-group-field'>
                  <Field
                    name={`${question}.question`}
                    component={renderField}
                    type='text'
                  />
                </div>
                <label className='form__form-group-label'>answer type:</label>
                <div className='form__form-group-field'>
                  <Field
                    name={`${question}.type`}
                    component={renderSelectField}
                    type='text'
                    options={[{value: 'text', label: 'text'}, {value: 'select', label: 'select'},
                      {value: 'instruction', label: 'instruction'}, {value: 'integerRank', label: 'integer rank'}]}
                  />
                </div>
                {isSurvey && <div>
                  <label className='form__form-group-label'>random order?</label>
                  <div className='form__form-group-field'>
                    <Field
                      name={`${question}.randomOrder`}
                      component={renderCheckBoxField}
                      // onChange={(e) => {deleteSurvey(e, i, 'survey')}}
                    />
                  </div>
                </div>
                }
              </div>
              {isSelect &&
              <FieldArray
                name={`${question}.options`}
                component={renderQuestionOptions}
                rerenderOnEveryChange
                withPoints={teamFormat === 'single' && surveyType === 'mid'}
                isSurvey={isSurvey}
              />
              }
              {isIntegerRank &&
              <div>
                <label className='form__form-group-label'>from: </label>
                <Field
                  name={`${question}.from`}
                  component={renderField}
                  type='number'/>
                <label className='form__form-group-label'>to: </label>
                <Field
                  name={`${question}.to`}
                  component={renderField}
                  type='number'/>
                <FieldArray
                  name={`${question}.options`}
                  component={renderQuestionOptions}
                  rerenderOnEveryChange
                  withPoints={false}
                  isSurvey={isSurvey}
                  isIntegerRank={true}
                />
                />
              </div>
              }
            </Col>
            <Col>
              <div className='centered-and-flexed'>
                <Button type="button" size="sm"
                        onClick={() => fields.splice(index, 1)}>delete question</Button>
              </div>
            </Col>
          </Row>)
      })}
     <Row className="centered-and-flexed" noGutters>
      <Button type="button" size="sm" onClick={() => fields.push({})}>
        <i className="fa fa-plus"/>add question
      </Button>
    </Row>
  </div>)
}

const renderPoll = ({fields, meta: {touched, error, warning}, task, steps}) => {
  const stepOptions = steps.map((x, ind) => {return {label: ind, value: ind}});
  return (<div style={{width: '100%', borderBottom: '1px solid grey'}}>
    {
      fields.map((step, index) => {
        const withOptions = task.polls[index] && task.polls[index].type === 'casual';
        return (
            <Row key={index}>
              <Col>
                <label className='form__form-group-label'>poll type:</label>
                  <Field
                      name={`${step}.type`}
                      component={renderSelectField}
                      type='text'
                      options={[{value: 'foreperson', label: 'foreperson'}, {value: 'casual', label: 'casual'}]}
                  />
                <div className='form__form-group'>
                  {withOptions === false ?
                    <React.Fragment>
                    <label className='form__form-group-label'>poll text:</label>
                      <Field
                        name={`${step}.text`}
                        component={renderTextArea}
                        type='text'
                        />
                        </React.Fragment> : <div />
                  }
                  <label className='form__form-group-label'>Threshold:</label>
                  <Field
                      name={`${step}.threshold`}
                      component={renderField}
                      type='number'
                  />
                  <label className='form__form-group-label'>Poll step:</label>
                  <Field
                    name={`${step}.step`}
                    component={renderSelectField}
                    options={stepOptions}
                  />
                  {withOptions && <div style={{width: '100%', marginTop: '20px'}}>
                    <FieldArray
                        name={`${step}.questions`}
                        component={renderQuestions}
                        rerenderOnEveryChange
                        withPoints={false}
                        poll ={task.polls[index]}
                    />
                  </div>}
                </div>
              </Col>
              <Col>
                <div className='centered-and-flexed'>
                  <Button type="button" size="sm"
                          onClick={() => fields.splice(index, 1)}>delete poll</Button>
                </div>
              </Col>
            </Row>)
      })}
    <Row className="centered-and-flexed" noGutters>
      <Button type="button" size="sm" onClick={() => fields.push({})}>
        <i className="fa fa-plus"/>add poll
      </Button>
    </Row>
  </div>)
}

const renderQuestions = ({fields, meta: {touched, error, warning}, poll}) => {
  return (<div style={{width: '100%'}}>
    {
      fields.map((step, index) => {
        let type = null;
        if (poll.questions[index]) {
          type = poll.questions[index].type ? poll.questions[index].type : 'text';
      }
        let questionOptions = [{value: 'primary', label: 'primary'}, {value: 'single', label: 'single answer'}, {value: 'text', label: 'text'},
          {value: 'checkbox', label: 'checkbox'}];
        poll.questions.forEach((q, _index)=>{
            if (q.type === 'primary'){
                if (index !== _index) {
                    questionOptions = questionOptions.filter(x=>x.value!=="primary");
                }
            }
        });
        return (
            <Row key={index}>
              <div className='form__form-group' style={{maxWidth: '300px', marginLeft: '50px'}}>
                <label className='form__form-group-label'>Question text:</label>
                  <Field
                      name={`${step}.text`}
                      component={renderTextArea}
                      type='text'
                  />
                <label className='form__form-group-label'>Type</label>
                <Field
                    name={`${step}.type`}
                    component={renderSelectField}
                    type='text'
                    options={questionOptions}
                    value = {type}
                />
                {
                  type === 'primary' | type === 'single' | type === 'checkbox' &&
                  <div style={{width: '100%', marginTop: '20px'}}>
                    <FieldArray
                        name={`${step}.options`}
                        component={renderQuestionOptions}
                        rerenderOnEveryChange
                        withPoints={false}
                    />
                  </div>
                }
              </div>
              <div className='centered-and-flexed'>
                <Button type="button" size="sm"
                        onClick={() => fields.splice(index, 1)}>delete question</Button>
              </div>
              {touched && error && <span className='form__form-group-error'>{error}</span>}
            </Row>
        )
      })
    }
    <Row className="centered-and-flexed" noGutters>
      <Button type="button" size="sm" onClick={() => fields.push({})}>
        <i className="fa fa-plus"/>add question
      </Button>
    </Row>
  </div>)

};

const renderQuestionOptions = ({fields, meta: {touched, error, warning}, numRounds, withPoints, isSurvey, isIntegerRank}) => {
  if (fields === [] || !fields || (fields && !fields.length)) {
    fields.push({})
  }
  if (fields && fields.length > 1 && isIntegerRank) {
    fields = [fields[0]];
  }
  return (<div style={{width: '100%'}}>
    {
      fields.map((step, index) => {
        return (
          <Row key={index}>
            <div className='form__form-group' style={{maxWidth: '300px', marginLeft: '50px'}}>
              <label className='form__form-group-label' style={{maxWidth: '50px'}}>{isIntegerRank ? 'object' : 'option'}: </label>
              <div className='form__form-group-field'>
                <Field
                  name={`${step}.option`}
                  component={renderField}
                  type='text'
                />
              </div>
            </div>
            {!isIntegerRank && <div className='centered-and-flexed'>
              <Button type="button" size="sm"
                      onClick={() => fields.splice(index, 1)}>delete {isIntegerRank ? 'object' : 'option'}</Button>
            </div>}
            {withPoints &&
            <div>
              <h6>{index + 1} {index === 0 ? 'point' : 'points'}</h6>
            </div>}

          </Row>)
      })}
    <Row className="centered-and-flexed" noGutters>
      {!isIntegerRank && <Button type="button" size="sm" onClick={() => fields.push({})}>
        <i className="fa fa-plus"/>add option
      </Button>}
    </Row>
  </div>)
}

const renderSteps = ({fields, meta: {touched, error, warning}, numRounds}) => {
  return (<div style={{width: '100%', borderBottom: '1px solid grey'}}>
    {
      fields.map((step, index) => {
        return (
          <Row key={index}>
            <Col>
              <div className='form__form-group'>
                <label className='form__form-group-label'>step time:</label>
                <div className='form__form-group-field'>
                  <Field
                    name={`${step}.time`}
                    component={renderField}
                    type='number'
                  />
                </div>
                <label className='form__form-group-label'>step message:</label>
                <div className='form__form-group-field'>
                  <Field
                    name={`${step}.message`}
                    type="text"
                    component={renderTextArea}
                  />
                </div>
              </div>
            </Col>
            <Col>
              <div className='centered-and-flexed'>
                <Button type="button" size="sm"
                        onClick={() => fields.splice(index, 1)}>delete step</Button>
              </div>
            </Col>
          </Row>)
      })}
    <Row className="centered-and-flexed" noGutters>
      <Button type="button" size="sm" onClick={() => fields.push({})}>
        <i className="fa fa-plus"/>add step
      </Button>
    </Row>
  </div>)
}

const renderPinnedContent = ({fields, meta: {touched, error, warning}, numRounds}) => {
  return (<div style={{width: '100%', borderBottom: '1px solid grey'}}>
    {
      fields.map((field, index) => {
        return (
            <Row key={index}>
              <Col>
                <div className='form__form-group'>
                  <label className='form__form-group-label'>Label text:</label>
                  <div className='form__form-group-field'>
                    <Field
                        name={`${field}.text`}
                        component={renderField}
                        type='text'
                    />
                  </div>
                  <label className='form__form-group-label'>HTML content:</label>
                  <div className='form__form-group-field'>
                    <Field
                        name={`${field}.link`}
                        type="text"
                        component={renderTextArea}
                    />
                  </div>
                </div>
              </Col>
              <Col>
                <div className='centered-and-flexed'>
                  <Button type="button" size="sm"
                          onClick={() => fields.splice(index, 1)}>delete content</Button>
                </div>
              </Col>
            </Row>)
      })}
    <Row className="centered-and-flexed" noGutters>
      <Button type="button" size="sm" onClick={() => fields.push({})}>
        <i className="fa fa-plus"/>add content
      </Button>
    </Row>
  </div>)
}

const renderReadingPeriods = ({fields, meta: {touched, error, warning}, numRounds}) => {
  return (<div style={{width: '100%', borderBottom: '1px solid grey', marginTop: '20px'}}>
    <p>Reading periods</p>
    <br/>
    {
      fields.map((period, index) => {
        return (
            <Row key={index}>
              <Col>
                <div className='form__form-group'>
                  <label className='form__form-group-label'>period time:</label>
                  <div className='form__form-group-field'>
                    <Field
                        name={`${period}.time`}
                        component={renderField}
                        type='number'
                    />
                  </div>
                  <label className='form__form-group-label'>period HTML:</label>
                  <div className='form__form-group-field'>
                    <Field
                        name={`${period}.message`}
                        type="text"
                        component={renderTextArea}
                    />
                  </div>
                </div>
              </Col>
              <Col>
                <div className='centered-and-flexed'>
                  <Button type="button" size="sm"
                          onClick={() => fields.splice(index, 1)}>delete period</Button>
                </div>
              </Col>
            </Row>)
      })}
    <Row className="centered-and-flexed" noGutters>
      <Button type="button" size="sm" onClick={() => fields.push({})}>
        <i className="fa fa-plus"/>add reading period
      </Button>
    </Row>
  </div>)
}

const renderCases = ({fields, meta: {touched, error, warning}, numRounds}) => {
  return (<div style={{width: '100%', borderBottom: '1px solid grey', marginTop: '20px'}}>
    <h3>Students</h3>
    <br/>
    {
      fields.map((case_, index) => {
        return (
            <div key={index}>
              <Col>
                    {/*<div className='form__form-group'>*/}
                    <Row>
                        <p>Name</p>
                    </Row>
                      <Row style={{marginTop: '5px'}}>
                          <Field
                              name={`cases[${index}].name`}
                              type="text"
                              component={renderField}
                          />
                      </Row>
                    <Row style={{marginTop: '5px'}}>
                      <p>Last Name</p>
                      <Field
                          name={`cases[${index}].lastName`}
                          type="text"
                          component={renderField}
                      />
                    </Row>
                      <Row style={{marginTop: '5px'}}>
                        <p>email</p>
                        <Field
                            name={`cases[${index}].email`}
                            type="text"
                            component={renderField}
                        />
                      </Row>
                    {/*</div>*/}
              <Row>
                <div className='centered-and-flexed'>
                  <Button type="button" size="sm"
                          onClick={() => fields.splice(index, 1)}
                          style={{marginTop: '5px'}}>
                    delete student
                  </Button>
                </div>
              </Row>
              </Col>
            </div>)
      })}
    <Row className="centered-and-flexed" noGutters>
      <Button type="button" size="sm" onClick={() => fields.push({})}>
        <i className="fa fa-plus"/>add student
      </Button>
    </Row>
  </div>)
}

const renderTasks = ({fields, meta: {touched, error, warning}, numRounds, cloneTask, surveyTemplatesOptions, taskArray,
                       fillSurvey, deleteSurvey, numExpRounds, teamFormat, hasPostSurvey, postSurvey, hasPreSurvey, preSurvey}) => {
  let tasks = [], options = [];
  for (let i = 0; i < numRounds; i++) {
    options.push({value: i, label: 'task ' + (i + 1)})
  }
  const taskNumber = taskArray && taskArray.length && taskArray.length > numRounds ? taskArray.length : numRounds

  for (let i = 0; i < taskNumber; i++) {
    let taskLabel = '';
    if (teamFormat !== 'single') {
      taskLabel = 'TASK FOR NON-EXPERIMENT ROUND';
      if (i < numExpRounds) {
        taskLabel = 'TASK FOR EXPERIMENT ROUND ' + (i + 1);
      }
    } else {
      taskLabel = `TASK FOR ROUND ${i + 1} ${i === numRounds - 1 ? '(BEST)' : ''}${i === numRounds - 2 ? '(WORST)' : ''}`
    }
    const steps = taskArray[i].steps;
    tasks.push(
      <div key={'task' + i} className='form__form-group' style={{ borderBottom: '3px solid grey'}}>
        <Row style={{width: '80%'}}>
          <Col style={{width: '100%'}}>
            <p>{taskLabel}</p>
          </Col>
          <Col>
            <Select
              onChange={(e) => cloneTask(i, e.value)}
              options={options.filter(x => x.value !== i)}
              clearable={false}
              multi={false}
              className='form__form-group-select'
              placeholder="clone task"
            />
          </Col>
          <Col>
            <p>Has pre-survey?</p>
          </Col>
          <Col>
            <Field
              name={`tasks[${i}].hasPreSurvey`}
              component={renderCheckBoxField}
              onChange={(e) => {deleteSurvey(e, i, 'preSurvey')}}
            />
          </Col>
          <Col>
            <p>Has mid-survey?</p>
          </Col>
          <Col>
            <Field
              name={`tasks[${i}].hasMidSurvey`}
              component={renderCheckBoxField}
              onChange={(e) => {deleteSurvey(e, i, 'survey')}}
            />
          </Col>
          <Col>
            <p>Has pinned content?</p>
          </Col>
          <Col>
            <Field
              name={`tasks[${i}].hasPinnedContent`}
              component={renderCheckBoxField}
              onChange={(e) => {deleteSurvey(e, i, 'pinnedContent')}}
            />
          </Col>
          <Col>
            <p>Selective-masking?</p>
          </Col>
          <Col>
            <Field
              name={`tasks[${i}].selectiveMasking`}
              component={renderCheckBoxField}
            />
          </Col>
        </Row>
        <div className='form__form-group-field' style={{marginBottom: '25px'}}>
          <Field
            name={`tasks[${i}].message`}
            component={renderTextArea}
            type="text"
          />
        </div>
        <FieldArray
          name={`tasks[${i}].steps`}
          component={renderSteps}
          rerenderOnEveryChange
        />
        <FieldArray
            name={`tasks[${i}].readingPeriods`}
            component={renderReadingPeriods}
            rerenderonEveryChange
        />
        <FieldArray
            name={`tasks[${i}].polls`}
            component={renderPoll}
            task={taskArray[i]}
            rerenderonEveryChange
            steps={steps}
        />
        {taskArray && taskArray[i] && taskArray[i].hasPinnedContent && <div style={{width: '100%'}}>
          <p>Pinned content</p>
          <FieldArray
          name={`tasks[${i}].pinnedContent`}
          component={renderPinnedContent}
          rerenderOnEveryChange
          />
        </div>}
        {taskArray && taskArray[i] && taskArray[i].hasPreSurvey && <div style={{width: '100%'}}>
          <p>pre - survey</p>
          <Select
            onChange={(e) => fillSurvey(i, e.value, 'preSurvey')}
            options={surveyTemplatesOptions}
            clearable={true}
            multi={false}
            className='form__form-group-select'
            placeholder="select pre-survey"
          />
          <FieldArray
            name={`tasks[${i}].preSurvey`}
            component={renderSurvey}
            surveyType="pre"
            rerenderOnEveryChange
            task={taskArray && taskArray[i]}
          />
        </div>}
        {taskArray && taskArray[i] && taskArray[i].hasMidSurvey && <div style={{width: '100%'}}>
          <p>mid - survey</p>
          <Select
            onChange={(e) => fillSurvey(i, e.value, 'survey')}
            options={surveyTemplatesOptions}
            clearable={true}
            multi={false}
            className='form__form-group-select'
            placeholder="select mid-survey"
          />
          <FieldArray
            name={`tasks[${i}].survey`}
            component={renderSurvey}
            surveyType="mid"
            rerenderOnEveryChange
            task={taskArray && taskArray[i]}
            teamFormat={teamFormat}
          />
        </div>}
        {i === numRounds - 1 && hasPostSurvey && <div style={{width: '100%'}}>
          <p>post - survey</p>
          <Select
              onChange={(e) => fillSurvey(numRounds - 1, e.value, 'post')}
              options={surveyTemplatesOptions}
              clearable={true}
              multi={false}
              className='form__form-group-select'
              placeholder="select post-survey"
          />
          <FieldArray
              name={`postSurvey`}
              component={renderSurvey}
              surveyType="post"
              rerenderOnEveryChange
              task={taskArray && taskArray[i]}
              teamFormat={teamFormat}
              postSurvey={postSurvey}
          />
        </div>}
        {i === 0 && hasPreSurvey && <div style={{width: '100%'}}>
          <p>pre-pre - survey</p>
          <Select
              onChange={(e) => fillSurvey(numRounds - 1, e.value, 'prepre')}
              options={surveyTemplatesOptions}
              clearable={true}
              multi={false}
              className='form__form-group-select'
              placeholder="select pre-pre-survey"
          />
          <FieldArray
              name={`preSurvey`}
              component={renderSurvey}
              surveyType="prepre"
              rerenderOnEveryChange
              task={taskArray && taskArray[i]}
              teamFormat={teamFormat}
              preSurvey={preSurvey}
          />
        </div>}
      </div>
    )
  }
  return (<div style={{marginTop: '20px'}}>
    {tasks}
  </div>)
};


class TemplateForm extends React.Component {

  constructor() {
    super();
    this.state = {

    };
  }

  cloneTask = (from, to) => {
    this.props.dispatch(change('TemplateForm', 'tasks[' + from + ']', this.props.tasks[to]))
  }

  fillSurvey = (taskNumber, surveyIndex, fieldName) => {
    let field;
    if (fieldName === 'prepre') {
      field = 'preSurvey';
    } else {
      field = fieldName === 'post' ? 'postSurvey' :  'tasks[' + taskNumber + '].' + fieldName;
    }
    this.props.dispatch(change('TemplateForm', field, this.props.surveyList[surveyIndex].questions))
  }

  numRoundsChange = (e) => {
    const num = parseInt(e.target.value);
    if (isNaN(num)) return;
    let tasks = this.props.tasks.filter((x, index) => index < num);
    while (tasks.length < num) {
      tasks.push({steps: []})
    }
    this.props.dispatch(change('TemplateForm', 'tasks', tasks))
  }

  deleteSurvey = (newValue, taskNumber, fieldName) => {
    if (newValue.target) {
      if (!newValue.target.checked) {
        this.props.dispatch(change('TemplateForm', 'tasks[' + taskNumber + '].' + fieldName, null))
      }
    }
  }

  dispatchJsonData = (data) => {
    const template = JSON.parse(data.target.result)
    for (let i in template) {
      this.props.dispatch(change('TemplateForm', i, template[i]))
    }
  }

  handleFileUpload = event => {
    const file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onloadend = this.dispatchJsonData
    fileReader.readAsText(file);
  }

  render() {
    const {invalid, numRounds, surveyTemplatesOptions, pristine, isAdd, tasks, numExpRounds, teamFormat, hasPostSurvey, postSurvey,
    hasPreSurvey, preSurvey} = this.props;
    return (<div>
        <form className='form form--horizontal' style={{paddingBottom: '5vh'}} onSubmit={this.props.handleSubmit}>
          <Row>
            <Col><div className='form__panel'>
            <div className='form__panel-body' style={{borderBottom: '3px solid grey'}}>
              <Row>
                <Col className='form__form-group'>
                  <label className='form__form-group-label'>Name:</label>
                  <div className='form__form-group-field'>
                    <Field
                      name='name'
                      component={renderField}
                      type='text'
                    />
                  </div>
                </Col>
              </Row>
              <FieldArray
                  name="cases"
                  component={renderCases}
                  rerenderOnEveryChange
                  numRounds={numRounds}
                  cloneTask={this.cloneTask}
                  fillSurvey={this.fillSurvey}
                  deleteSurvey={this.deleteSurvey}
                  taskArray={tasks}
                  numExpRounds={numExpRounds}
                  surveyTemplatesOptions={surveyTemplatesOptions}
                  teamFormat={teamFormat}
                  hasPostSurvey={hasPostSurvey}
                  postSurvey={postSurvey}
                  hasPreSurvey={hasPreSurvey}
                  preSurvey={preSurvey}
              />
            </div>
            <FieldArray
              name="tasks"
              component={renderTasks}
              rerenderOnEveryChange
              numRounds={numRounds}
              cloneTask={this.cloneTask}
              fillSurvey={this.fillSurvey}
              deleteSurvey={this.deleteSurvey}
              taskArray={tasks}
              numExpRounds={numExpRounds}
              surveyTemplatesOptions={surveyTemplatesOptions}
              teamFormat={teamFormat}
              hasPostSurvey={hasPostSurvey}
              postSurvey={postSurvey}
              hasPreSurvey={hasPreSurvey}
              preSurvey={preSurvey}
            />
          </div></Col>
          </Row>
          <Row>
            <Col>
              <ButtonToolbar className='mx-auto form__button-toolbar'>
                <Button color='primary' size='sm' type='submit' disabled={invalid || (!isAdd && pristine)}>Submit</Button>
              </ButtonToolbar>
            </Col>
          </Row>
        </form>
      </div>
    )
  }
}
const validate = (values, props) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'name is required';
  }
  return errors
};

TemplateForm = reduxForm({
  form: 'TemplateForm',
  enableReinitialize: true,
  touchOnChange: true,
  validate,
})(TemplateForm);

const selector = formValueSelector('TemplateForm');

function mapStateToProps(state) {
  return {
    numRounds: selector(state, 'numRounds'),
    teamSize: selector(state, 'teamSize'),
    numExpRounds: selector(state, 'numExpRounds'),
    roundGen: selector(state, 'roundGen'),
    tasks: selector(state, 'tasks'),
    surveyList: state.survey.surveyList,
    // state.users.userList,
    surveyTemplatesOptions: state.survey.surveyList.map((x, index) => {return {value: index, label: x.name}}),
    teamFormat: selector(state, 'teamFormat'),
    hasPostSurvey: selector(state, 'hasPostSurvey'),
    postSurvey: selector(state, 'postSurvey'),
    hasPreSurvey: selector(state, 'hasPreSurvey'),
    preSurvey: selector(state, 'preSurvey'),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplateForm);