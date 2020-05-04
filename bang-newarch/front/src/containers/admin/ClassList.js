/** ClassList.js
 *  front-end
 *
 *  admin only layout for viewing all templates
 *
 *  called by:
 *    1. Router.js
 */

import React from 'react';
import {Card, CardBody, Col, Row, Container, Button, Table} from 'reactstrap';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {loadTemplateList, cloneTemplate, deleteTemplate} from 'Actions/templates'
import {history} from 'App/history';
import AccountMultiplePlusIcon from "mdi-react/AccountMultiplePlusIcon";
import PlusIcon from "mdi-react/PlusIcon";

class ClassList extends React.Component {

  constructor(props) {
    super(props);

  }

  componentWillMount() {
    this.props.loadTemplateList();
  }

  render() {
    const {templateList} = this.props;
    return (
      <Container style={{maxWidth: '100%'}}>
        <Row>
          <Col md={12} lg={12} xl={12}>
            <Card>
              <CardBody>
                <div className='card__title'>
                  <Container fluid className="justify-content-md-between flex ai-bottom no-padding">
                    <h5 className='bold-text'>Class list</h5>
                    <Button className="btn btn-primary" onClick={() => history.push('/templates-add')}>
                      <PlusIcon size={24} />
                    </Button>
                  </Container>
                </div>
                <Table className='table table--bordered table--head-accent table-hover'>
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>name</th>
                    <th>size</th>
                    {/*<th>team format</th>*/}
                    <th>clone</th>
                    <th>delete</th>
                  </tr>
                  </thead>
                  <tbody>
                  {templateList.map((template, index) => {
                    console.log(template);
                    return <tr key={template._id}>
                      <td onClick={() => history.push('/templates/' + template._id)}>{index + 1}</td>
                      <td onClick={() => history.push('/templates/' + template._id)}>{template.name}</td>
                      <td onClick={() => history.push('/templates/' + template._id)}> {template.cases.length}</td>
                      {/*<td onClick={() => history.push('/templates/' + template._id)}>{template.teamFormat ? template.teamFormat : 'multi'}</td>*/}
                      <td>
                        <Button className="btn btn-primary"
                                style={{padding: '2px 10px', marginBottom: '0px'}}
                                onClick={() => this.props.cloneTemplate(template._id)}>
                          clone
                        </Button>
                      </td>
                      <td>
                        <Button className="btn btn-danger"
                                style={{padding: '2px 10px', marginBottom: '0px'}}
                                onClick={() => this.props.deleteTemplate(template._id)}>
                          delete
                        </Button>
                      </td>
                    </tr>
                  })}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}


function mapStateToProps(state) {
  return {
    templateList: state.template.templateList
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadTemplateList,
    cloneTemplate,
    deleteTemplate
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassList);