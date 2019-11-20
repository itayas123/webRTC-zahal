import "./login.css";
import React from "react";
import API from "../../../utils/API";
import { connect } from "react-redux";
import * as actionTypes from "../../../store/actions";
import { Redirect } from "react-router-dom";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    name: "",
    register: false,
    Redirect: false
  };
  onSubmit = e => {
    e.preventDefault();
    const { name, email, password } = this.state;
    if (this.state.register) {
      API.post("/users", { name, email, password })
        .then(res => {
          if (res.data.error) {
            alert(res.data.error);
          } else if (res.data.data) {
            this.props.onRegister(res.data.data);
            console.log(this.props.user);
            this.setState({ Redirect: true });
          }
        })
        .catch(res => {
          console.log(JSON.stringify(res));
        });
    } else {
      API.get(`/auth?email=${email}&password=${password}`)
        .then(res => {
          if (res.data.error) {
            alert(res.data.error);
          } else if (res.data.data) {
            this.props.onLogin(res.data.data);
            console.log(this.props.user);
            this.setState({ Redirect: true });
          }
        })
        .catch(res => {
          console.log(JSON.stringify(res));
        });
    }
  };

  render() {
    return (
      <div className="main">
        {this.state.Redirect && <Redirect to="/" />}
        <div className="buttons">
          <button
            className={this.state.register ? "" : "un-active"}
            onClick={() => {
              this.setState({ register: true });
            }}
          >
            Register
          </button>
          <button
            className={this.state.register ? "un-active" : ""}
            onClick={() => {
              this.setState({ register: false });
            }}
          >
            Login
          </button>
        </div>
        <form onSubmit={this.onSubmit} className="form">
          <input
            type="text"
            className={this.state.register ? "" : "hide"}
            required={this.state.register}
            placeholder="name"
            value={this.state.name}
            onChange={e => {
              this.setState({ name: e.target.value });
            }}
          />
          <input
            type="email"
            required
            placeholder="email"
            value={this.state.email}
            onChange={e => {
              this.setState({ email: e.target.value });
            }}
          />
          <input
            type="password"
            required
            placeholder="password"
            value={this.state.password}
            onChange={e => {
              this.setState({ password: e.target.value });
            }}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

const mapStateToProp = state => {
  return {
    user: state.user
  };
};

const mapDispatch = dispatch => {
  return {
    onRegister: user => dispatch({ type: actionTypes.REGISTER, user: user }),
    onLogin: user => dispatch({ type: actionTypes.LOGIN, user: user })
  };
};

export default connect(
  mapStateToProp,
  mapDispatch
)(Login);
