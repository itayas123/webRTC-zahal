import { debounce } from "lodash";
import { observer } from "mobx-react";
import React from "react";
import stores from "../../../../stores";
import Modal from "../../Modal/modal";
import "./addSource.css";
import Button from "../../Button/button";

const { sourceStore, userStore } = stores;
@observer
class AddSource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayModal: false,
      name: "",
      uri: "",
      search: "",
      usersToDisplay: [],
      filterUsers: [],
      usersToSend: []
    };
  }

  renderUserItem = (email, index) => {
    return (
      <div className="item-list" key={`email${email}i${index}`}>
        {email}
        <input
          type="checkbox"
          checked={this.state.usersToSend.includes(email)}
          value={this.state.usersToSend.includes(email)}
          onChange={() => {
            const temp = [...this.state.usersToSend];
            const index = temp.indexOf(email);
            if (index > -1) {
              temp.splice(index, 1);
            } else {
              temp.push(email);
            }
            this.setState({ usersToSend: temp });
          }}
        />
      </div>
    );
  };

  openModal = () => {
    userStore
      .fetchAllUsers()
      .then(res => {
        const emails = res.map(user => user.email);
        this.setState({
          usersToDisplay: emails,
          filterUsers: emails,
          displayModal: true
        });
      })
      .catch(e => {
        alert(e);
      });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { name, uri, usersToSend } = this.state;
    sourceStore
      .addSource(name, uri, usersToSend)
      .then(res => {
        this.setState({ displayModal: false });
      })
      .catch(err => {
        alert(err);
      });
  };

  handleAutoComplete = debounce(() => {
    const filterUsers = this.state.usersToDisplay.filter(email =>
      email.includes(this.state.search)
    );
    this.setState({ filterUsers });
  }, 350);

  handleAllUsersCheckbox = () => {
    if (
      JSON.stringify(this.state.usersToSend) ===
      JSON.stringify(this.state.filterUsers)
    ) {
      this.setState({ usersToSend: [] });
    } else {
      this.setState({
        usersToSend: [...this.state.filterUsers]
      });
    }
  };

  render() {
    return (
      <div>
        <Button className="add-btn" onClick={this.openModal}>
          Add Source
        </Button>
        <Modal
          show={this.state.displayModal}
          handleClose={() => {
            this.setState({ displayModal: false });
          }}
        >
          <div className="add-modal">
            <form onSubmit={this.handleSubmit} className="form">
              <input
                type="text"
                required
                placeholder="name"
                value={this.state.name}
                onChange={e => {
                  this.setState({ name: e.target.value });
                }}
              />
              <input
                type="text"
                required
                placeholder="uri"
                value={this.state.uri}
                onChange={e => {
                  this.setState({ uri: e.target.value });
                }}
              />
              {this.state.usersToDisplay.length > 0 && (
                <div className="users-list">
                  <div className="search-div">
                    <input
                      type="text"
                      placeholder="email"
                      className="search"
                      value={this.state.search}
                      onChange={e => {
                        this.setState({ search: e.target.value });
                        this.handleAutoComplete();
                      }}
                    />
                    <div className="all-users-checkbox">
                      <input
                        type="checkbox"
                        checked={
                          JSON.stringify(this.state.usersToSend) ===
                          JSON.stringify(this.state.filterUsers)
                        }
                        value={
                          JSON.stringify(this.state.usersToSend) ===
                          JSON.stringify(this.state.filterUsers)
                        }
                        onChange={this.handleAllUsersCheckbox}
                      />
                      <div
                        className="pointer"
                        onClick={this.handleAllUsersCheckbox}
                      >
                        All
                      </div>
                    </div>
                  </div>
                  <div className="list">
                    {this.state.filterUsers.map((email, index) =>
                      this.renderUserItem(email, index)
                    )}
                  </div>
                </div>
              )}
              <Button type="submit">Submit</Button>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AddSource;