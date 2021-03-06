import React, { Component } from "react";
import CardArray from "../Components/CardArray/CardArray.js";
import Sidebar from "../Components/Sidebar/Sidebar.js";
import { JobOfferCard } from "../Components/JobOfferCard";
import Profile from "../Components/Profile/Profile";
import { Modal, Button } from "react-bootstrap";
import DashboardMap from "../Components/DashboardMap/DashboardMap.js";
import "./Dashboard.css";
import axios from "axios";
import AuthService from "../AuthService/AuthService";
import { Redirect } from "react-router-dom";

var perks = require("./test.json");

class Dashboard extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      profileSubmit: false,
      basketOfGoodsSumbit: true,
      show: false,
      isAuthed: true,
      spinner: true,
      companies: [],
      profile: {},
      user: {},
      items: [],
      profilePrefs: {}
    };
    this.Auth = new AuthService();
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  componentDidMount() {
    setTimeout(() => {
      if (this.Auth.getToken() === undefined || this.Auth.getToken() === null) {
        this.setState({ isAuthed: false });
      } else {
        this.getCards();
        this.getItems();
        this.getPrefrences();
        this.getUserInfo();
        this.setState({ spinner: false });
      }
    }, 800);
  }
  submitBasket = () => {
    this.setState({
      basketOfGoodsSumbit: true
    });
  };
  getUserInfo = () => {
    let config = {
      headers: {
        authorization: this.Auth.getToken(),
        "Content-Type": "application/json"
      }
    };
    axios
      .get(
        `http://ec2-18-217-169-247.us-east-2.compute.amazonaws.com:3000/users/${sessionStorage.getItem(
          "user"
        )}/profile`,
        config
      )
      .then(response => {
        if (response.data.status) {
          console.log("Failed");
          sessionStorage.clear();
          this.setState({ isAuthed: false });
        } else {
          //console.log("user", response.data.recordset[0]);
          this.setState({ user: response.data.recordset[0] });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  getItems = () => {
    let config = {
      headers: {
        authorization: this.Auth.getToken(),
        "Content-Type": "application/json"
      }
    };
    axios
      .get(
        `http://ec2-18-217-169-247.us-east-2.compute.amazonaws.com:3000/users/${sessionStorage.getItem(
          "user"
        )}/items`,
        config
      )
      .then(response => {
        let marketItems = response.data.recordset.filter(item => {
          return item.Category === "Markets";
        });
        let transportationItems = response.data.recordset.filter(item => {
          return item.Category === "Transportation";
        });
        let housingItems = response.data.recordset.filter(item => {
          return (
            item.Category === "Utilities (Monthly)" ||
            item.Category === "Rent Per Month" ||
            item.Category === "Buy Apartment Price"
          );
        });

        let restuartantItems = response.data.recordset.filter(item => {
          return item.Category === "Restaurants";
        });

        let entertainmentItems = response.data.recordset.filter(item => {
          return (
            item.Category === "Clothing And Shoes" ||
            item.Category === "Sports And Leisure"
          );
        });
        let items = {};

        items["MarketItems"] = marketItems;
        items["TransportationItems"] = transportationItems;
        items["HousingItems"] = housingItems;
        items["RestuartantItems"] = restuartantItems;
        items["EntertainmentItems"] = entertainmentItems;

        this.setState({
          items: items
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  getPrefrences = () => {
    let config = {
      headers: {
        authorization: this.Auth.getToken(),
        "Content-Type": "application/json"
      }
    };
    axios
      .get(
        `http://ec2-18-217-169-247.us-east-2.compute.amazonaws.com:3000/users/${sessionStorage.getItem(
          "user"
        )}/preferences`,
        config
      )
      .then(response => {
        //console.log("preferences", response.data.recordset.length);
        if (response.data.recordset.length === 0) {
          alert(
            "Enter your estimated expenses to get the full benefit of the app. If no expenses are entered, you will be prompted again"
          );
          this.setState({
            profilePrefs: response.data,
            basketOfGoodsSumbit: false
          });
        } else {
          this.setState({
            profilePrefs: response.data,
            basketOfGoodsSumbit: true
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  getCards = () => {
    let config = {
      headers: {
        authorization: this.Auth.getToken(),
        "Content-Type": "application/json"
      }
    };
    axios
      .get(
        `http://ec2-18-217-169-247.us-east-2.compute.amazonaws.com:3000/users/${sessionStorage.getItem(
          "user"
        )}/jocs`,
        config
      )
      .then(response => {
        let jocs = response.data.result;
        let temp = [];
        //console.log("jocs", jocs);
        if (jocs.length === 0) {
          this.setState({ profileSubmit: false, show: true });
        }
        jocs.forEach(company => {
          if (company.priority === 0) {
            this.setState({
              profile: company,
              profileSubmit: true
            });
            // console.log("Profile: ", this.state.profile);
          }
          company.selected = false;
          if (company.jocname === "Google") {
            company.perks = perks.Google;
          } else if (company.jocname === "Facebook") {
            company.perks = perks.Facebook;
          } else if (company.jocname === "Amazon") {
            company.perks = perks.Amazon;
          }
        });
        temp = jocs.filter(company => company.priority !== 0);

        this.setState({
          companies: temp
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    let cardType;
    if (this.state.profileSubmit === false) {
      cardType = <Modal.Title>Profile </Modal.Title>;
    } else {
      cardType = <Modal.Title>New Job Offer </Modal.Title>;
    }
    if (!this.state.isAuthed) {
      return <Redirect to="/" />;
    } else if (this.state.spinner) {
      return (
        <div className="lds-spinner ">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      );
    }
    return (
      <div>
        <Sidebar
          // className="Sidebar"
          getCards={this.getCards}
          items={this.state.items}
          profCity={this.state.profile.joccityid}
          profilePrefs={this.state.profilePrefs}
          user={this.state.user}
          hasBasket={this.state.basketOfGoodsSumbit}
          submitBasket={this.submitBasket}
        />
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton={false}>{cardType}</Modal.Header>
          <Modal.Body>
            <JobOfferCard
              handleClose={this.handleClose}
              profSubmit={this.state.profileSubmit}
              getCards={this.getCards}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
        <div id="container">
          <Profile
            profile={this.state.profile}
            user={this.state.user}
            handleShow={this.handleShow}
            getCards={this.getCards}
            getUser={this.getUserInfo}
          />

          <DashboardMap
            companies={this.state.companies}
            profile={this.state.profile}
            profilePrefs={this.state.profilePrefs}
          />

          <CardArray
            currentJob={this.state.profile}
            items={this.state.items}
            profilePrefs={this.state.profilePrefs}
            getCards={this.getCards}
            companies={this.state.companies}
            profile={this.state.profile}
            handleShow={this.handleShow}
          />
        </div>
      </div>
    );
  }
  handleShow() {
    this.setState({ show: true });
  }

  handleClose() {
    this.setState({ show: false });
  }
}
export default Dashboard;
