import React, { Component } from "react";
import { Form, Button, ButtonToolbar } from "react-bootstrap";

class ProfileDetails extends Component {
  //   constructor(props) {
  //     super(props);
  //     this.state = {
  //       profileInfo: this.props.profileInfo,
  //     };
  //   }

  render() {
    return (
      <Form>
        <Form.Group controlId="Prof">
          <Form.Label>Profile 1</Form.Label>
          <Form.Control
            type="text"
            placeholder="Prof"
            onChange={this.props.handleChange("firstName")}
          />
        </Form.Group>

        <Form.Group controlId="Prof">
          <Form.Label>Profile Info</Form.Label>
          <Form.Control
            type="text"
            placeholder="Prof"
            onChange={this.props.handleChange("lastName")}
          />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            onChange={this.props.handleChange("email")}
          />
        </Form.Group>
        <ButtonToolbar>
          <Button variant="secondary" onClick={this.prev}>
            Previous
          </Button>
          <Button variant="primary" onClick={this.next}>
            Next
          </Button>
        </ButtonToolbar>
      </Form>
    );
  }

  next = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  prev = e => {
    e.preventDefault();
    this.props.prevStep();
  };
}

export default ProfileDetails;
