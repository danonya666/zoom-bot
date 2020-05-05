/** UserList.js
 *  front-end
 *
 *  admin only layout for viewing all users
 *
 *  called by:
 *    1. Router.js
 *
 *   this.props.userList contains all the users while
 *   this.state.userList contains only the filtered ones
 */

import React from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  Container,
  Button,
  Input,
  Table,
} from "reactstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  loadUserList,
} from "Actions/admin";
import Pagination from "Components/Pagination";
import {loadTemplateList} from "../../actions/templates";
import { history } from "../../app/history";

const pageSize = 10;

class UserList extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    isReady: false,
    page: 1,
    pageOfItems: [],
    userList: [],
    searchValue: "",
    bonusAmount: "",
    templateList: [],
  };

  componentWillMount() {
    this.props.loadUserList().then(() => {
      this.setState({ isReady: true, userList: this.props.userList });
    });
    this.props.loadTemplateList().then((resp) => {
      console.log('resp', resp);
      this.setState({templateList: this.props.templateList});
    })
  }

  onChangePage = (page) => {
    if (page) {
      const from = (parseInt(page) - 1) * pageSize;
      const to = from + pageSize;
      this.setState({
        page: page,
        pageOfItems: this.state.userList.filter(
          (x, index) => from <= index && index < to
        ),
      });
    }
    console.log('tList', this.state.templateList);
  };

  handleSearchChange = (s) => {
    this.setState({ searchValue: s.target.value });
    const lowerCasesdList = this.props.userList;
    lowerCasesdList.forEach(
      (x, ind) =>
        (lowerCasesdList[ind].mturkId = lowerCasesdList[
          ind
        ].mturkId.toLowerCase())
    );
    let userList = lowerCasesdList.filter(
      (x) => x.mturkId.toLowerCase().indexOf(s.target.value.toLowerCase()) > -1
    );
    this.setState({ userList: userList });
    this.onChangePage(1);
  };

  handleBonusChange = (s) => {
    if (parseFloat(s.target.value)) {
      this.setState({ bonusAmount: parseFloat(s.target.value) });
    } else {
      this.setState({ bonusAmount: 0 });
    }
  };

  handleBonus = (user) => {
    console.log(this.state.bonusAmount);
  };

  componentWillUnmount() {
    this.props.clearUsers();
  }

  render() {
    const { willbangLength } = this.props;
    const userList = this.state.userList;
    return (
      <Container style={{ maxWidth: "100%" }}>
        <Row>
          <Col md={12} lg={12} xl={12}>
            <Card>
              {this.state.isReady && (
                <CardBody>
                  <div className="card__title">
                    <Row>
                      <h5 className="bold-text">
                        Student list ({userList.length} users)
                      </h5>
                    </Row>
                    <Row>
                      <input
                        value={this.state.searchValue}
                        placeholder="Find user.."
                        onChange={this.handleSearchChange}
                      />
                    </Row>
                  </div>
                  <Table className="table table--bordered table--head-accent">
                    <thead>
                      <tr>
                        <th>#</th>
                        {/*<th>mturkId</th>*/}
                        <th>Name</th>
                        <th>Class name</th>
                        <th>Avg attention</th>
                        <th>Avg Happy Time</th>
                        <th>Student Overall status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.pageOfItems.map((user, index) => {
                        console.log('user', user);
                        user.id = 123; // mock
                        return (
                          <tr key={user._id}>
                            <td>
                              {(this.state.page - 1) * pageSize + index + 1}
                            </td>
                            {/*<td>{user.mturkId}</td>*/}
                            <td onClick={() => {history.push('/users/' + user.id)}}>{user.first_name + " " + user.last_name}</td>
                            <td onClick={() => {history.push('/users/' + user.id)}}>{user.klass.name}</td>
                            <td onClick={() => {history.push('/users/' + user.id)}}>{user.connected ? "yes" : "no"}</td>
                            <td onClick={() => {history.push('/users/' + user.id)}}>${user.totalBonuses}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  <Pagination
                    items={userList}
                    pageSize={pageSize}
                    onChangePage={this.onChangePage}
                  />
                </CardBody>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    userList: state.admin.userList,
    willbangLength: state.admin.willbangLength,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadUserList,
      loadTemplateList,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList);
