/** AddClass.js
 *  front-end
 *
 *  admin only layout for adding a template
 *
 *  called by:
 *    1. Router.js
 */

 import React, {PureComponent} from 'react';
import {Card, CardBody, Form, FormGroup, Input, Label, Col, Badge, Row, Container, Button, Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import {connect} from "react-redux";
import {addTemplate} from "Actions/templates";
import {loadSurveyList} from "Actions/surveys";
import {bindActionCreators} from "redux";
import TemplateForm from './TemplateForm'
import moment from 'moment'

class AddClass extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  async sendForm() {
    console.error('not implemented yet :(');
  }

  render() {
    return (
      <Container style={{maxWidth: '100%'}}>
            <Card>
              <CardBody>
                <div className='card__title'>
                  <h5 className='bold-text'>Добавить класс</h5>
                </div>
                <Form>
                  <FormGroup>
                    <Label for="name">Название</Label>
                    <Input type="text" name="name" id='name' placeholder="Введите название" />
                  </FormGroup>
                  <Button onClick={this.sendForm}>Сохранить</Button>

                </Form>
              </CardBody>
            </Card>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddClass);
