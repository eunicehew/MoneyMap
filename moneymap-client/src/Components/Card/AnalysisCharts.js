import React, { Component } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import AuthService from "../../AuthService/AuthService";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";

class Charts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      optionsDonut: {
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ],
        seriesCompany: [],
        labels: ["Net Income", "Federal Tax", "State Tax", "FICA Tax"]
      },
      options: {
        plotOptions: {
          bar: {
            horizontal: false,
            //columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: [
            "Income",
            "Mandatory Costs",
            "Consumable Costs",
            "Entertainment Expenses"
          ]
        },
        yaxis: {
          title: {
            text: "$"
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              // return "$ " + val + " thousands";
              return val;
            }
          }
        }
      },
      items: [],
      MandatoryItems: [],
      ConsumableItems: [],
      EntertainmentItems: [],
      showMandatory: false,
      showConsumable: false,
      showEntertainment: false
    };
    this.Auth = new AuthService();
  }
  toggleMandatoryChart = () => {
    this.setState({ showMandatory: !this.state.showMandatory });
  };
  toggleConsumableChart = () => {
    this.setState({ showConsumable: !this.state.showConsumable });
  };
  toggleEntertainmentChart = () => {
    this.setState({ showEntertainment: !this.state.showEntertainment });
  };
  componentDidMount() {
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
        )}/preferences/city/${this.props.company.joccityid}`,
        config
      )
      .then(response => {
        let temp = response.data.recordset;
        //console.log(temp);
        let MandatoryItems = temp.filter(item => {
          return item.ComponentTypeID === 2;
        });
        let ConsumableItems = temp.filter(item => {
          return item.ComponentTypeID === 3;
        });
        let EntertainmentItems = temp.filter(item => {
          return item.ComponentTypeID === 4;
        });
        this.setState({
          items: temp,
          MandatoryItems: MandatoryItems,
          ConsumableItems: ConsumableItems,
          EntertainmentItems: EntertainmentItems
        });
      });
    this.setState({
      optionsDonut: {
        ...this.state.optionsDonut,
        seriesCompany: [
          this.props.company.components[0].ComponentAmount,
          this.props.company.components[5].ComponentAmount,
          this.props.company.components[6].ComponentAmount,
          this.props.company.components[7].ComponentAmount
        ]
      }
    });
  }
  render() {
    
    const threeBar = [
      {
        name: "User Profile Values", //from profile
        data: [
          (this.props.profile.components[0].ComponentAmount / 12).toFixed(2),
          this.props.profile.components[1].ComponentAmount.toFixed(2),
          this.props.profile.components[2].ComponentAmount.toFixed(2),
          this.props.profile.components[3].ComponentAmount.toFixed(2)
          //this.props.profile.components[4].ComponentAmount.toFixed(2)
        ]
      },
      {
        name: "City Average Values",
        data: [
          this.props.cityAverages[0][3].Amount.toFixed(2),
          this.props.cityAverages[0][0].Amount.toFixed(2),
          this.props.cityAverages[0][1].Amount.toFixed(2),
          this.props.cityAverages[0][2].Amount.toFixed(2)
          //0
        ]
      },
      {
        name: "Job Offer Values",
        data: [
          (this.props.company.components[0].ComponentAmount / 12).toFixed(2),
          this.props.company.components[1].ComponentAmount.toFixed(2),
          this.props.company.components[2].ComponentAmount.toFixed(2),
          this.props.company.components[3].ComponentAmount.toFixed(2)
          //this.props.company.components[4].ComponentAmount.toFixed(2)
        ]
      }
    ];
    const twoBar = [
      {
        name: "User Profile Values", //from profile
        data: [
          (this.props.profile.components[0].ComponentAmount / 12).toFixed(2),
          this.props.profile.components[1].ComponentAmount.toFixed(2),
          this.props.profile.components[2].ComponentAmount.toFixed(2),
          this.props.profile.components[3].ComponentAmount.toFixed(2)
          //this.props.profile.components[4].ComponentAmount.toFixed(2)
        ]
      },

      {
        name: "Job Offer Values",
        data: [
          this.props.company.components[0].ComponentAmount.toFixed(2) / 12,
          this.props.company.components[1].ComponentAmount.toFixed(2),
          this.props.company.components[2].ComponentAmount.toFixed(2),
          this.props.company.components[3].ComponentAmount.toFixed(2)
          //this.props.company.components[4].ComponentAmount.toFixed(2)
        ]
      }
    ];
    const profileAnalysis = [
      {
        name: "User Profile Values", //from profile
        data: [
          (this.props.profile.components[0].ComponentAmount / 12).toFixed(2),
          this.props.profile.components[1].ComponentAmount.toFixed(2),
          this.props.profile.components[2].ComponentAmount.toFixed(2),
          this.props.profile.components[3].ComponentAmount.toFixed(2)
          //this.props.profile.components[4].ComponentAmount.toFixed(2)
        ]
      },
      {
        name: "City Average Values",
        data: [
          this.props.cityAverages[0][3].Amount.toFixed(2),
          this.props.cityAverages[0][0].Amount.toFixed(2),
          this.props.cityAverages[0][1].Amount.toFixed(2),
          this.props.cityAverages[0][2].Amount.toFixed(2)
          //0
        ]
      }
    ];
    let seriesOption;
    if (
      this.props.cityAverages[0][0].Amount === 0 &&
      this.props.cityAverages[0][1].Amount === 0 &&
      this.props.cityAverages[0][2].Amount === 0 &&
      this.props.cityAverages[0][3].Amount === 0
    ) {
      seriesOption = twoBar;
    } else if (this.props.fromProfile) {
      seriesOption = profileAnalysis;
    } else {
      seriesOption = threeBar;
    }
    return (
      <div id="chart">
        <Chart
          options={this.state.options}
          series={seriesOption}
          type="bar"
          height="350"
        />

        <Chart
          options={this.state.optionsDonut} //{this.state.optionsRadial}
          series={this.state.optionsDonut.seriesCompany}
          type="donut"
          height="400"
        />
        <h3>
          Gross Income: ${this.props.company.components[4].ComponentAmount}
        </h3>
        <h3>
          After Tax Income: ${this.props.company.components[0].ComponentAmount}
        </h3>

        <h3>
          Tax Rate:{" "}
          {(
            Math.abs(
              this.props.company.components[0].ComponentAmount /
                this.props.company.components[4].ComponentAmount -
                1
            ) * 100
          ).toFixed(2)}
          %
        </h3>
        <br />
        <h2>
          Mandatory Expenses: $
          {this.props.company.components[1].ComponentAmount.toFixed(2)}
          <Button
            className="divider"
            onClick={() => this.toggleMandatoryChart()}
          >
            {this.state.showMandatory ? "Hide" : "Show"}
          </Button>
        </h2>
        <br />
        <Table
          hidden={!this.state.showMandatory}
          striped
          bordered
          hover
          responsive
        >
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Lowest Price</th>
              <th>Average Price</th>
              <th>Highest Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {this.state.MandatoryItems.map((item, index) => (
              <tr key={index}>
                <td>
                  <strong>{`${item.Name}`}</strong>
                </td>
                <td>{item.Quantity}</td>
                <td>
                  {item.LowestPrice === 0 ? "N/A" : item.LowestPrice.toFixed(2)}
                </td>
                <td>
                  {item.AveragePrice === 0
                    ? "N/A"
                    : item.AveragePrice.toFixed(2)}
                </td>
                <td>
                  {item.HighestPrice === 0
                    ? "N/A"
                    : item.HighestPrice.toFixed(2)}
                </td>
                <td>{item.Price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <h2>
          Consumables: $
          {this.props.company.components[2].ComponentAmount.toFixed(2)}
          <Button
            className="divider"
            onClick={() => this.toggleConsumableChart()}
          >
            {this.state.showConsumable ? "Hide" : "Show"}
          </Button>
        </h2>
        <br />
        <div>
          <Table
            hidden={!this.state.showConsumable}
            striped
            bordered
            hover
            responsive
          >
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Lowest Price</th>
                <th>Average Price</th>
                <th>Highest Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {this.state.ConsumableItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <strong>{`${item.Name}`}</strong>
                  </td>
                  <td>{item.Quantity}</td>
                  <td>
                    {item.LowestPrice === 0
                      ? "N/A"
                      : item.LowestPrice.toFixed(2)}
                  </td>
                  <td>
                    {item.AveragePrice === 0
                      ? "N/A"
                      : item.AveragePrice.toFixed(2)}
                  </td>
                  <td>
                    {item.HighestPrice === 0
                      ? "N/A"
                      : item.HighestPrice.toFixed(2)}
                  </td>
                  <td>{item.Price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <h2>
          Entertainment: $
          {this.props.company.components[3].ComponentAmount.toFixed(2)}
          <Button
            className="divider"
            onClick={() => this.toggleEntertainmentChart()}
          >
            {this.state.showEntertainment ? "Hide" : "Show"}
          </Button>
        </h2>
        <br />
        <Table
          hidden={!this.state.showEntertainment}
          striped
          bordered
          hover
          responsive
        >
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Lowest Price</th>
              <th>Average Price</th>
              <th>Highest Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {this.state.EntertainmentItems.map((item, index) => (
              <tr key={index}>
                <td>
                  <strong>{`${item.Name}`}</strong>
                </td>
                <td>{item.Quantity}</td>
                <td>
                  {item.LowestPrice === 0 ? "N/A" : item.LowestPrice.toFixed(2)}
                </td>
                <td>
                  {item.AveragePrice === 0
                    ? "N/A"
                    : item.AveragePrice.toFixed(2)}
                </td>
                <td>
                  {item.HighestPrice === 0
                    ? "N/A"
                    : item.HighestPrice.toFixed(2)}
                </td>
                <td>{item.Price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <h2>Monthly Savings: ${this.props.company.savings.toFixed(2)}</h2>
        <br />
      </div>
    );
  }
}

export default Charts;
