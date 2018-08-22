import { render } from "react-dom";
import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import { Braintree, HostedField } from "react-braintree-fields";
const WebhooksApi = require("@octokit/webhooks");
const webhooks = new WebhooksApi({
  secret: "mysecret"
});

var dropin = require("braintree-web-drop-in");

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(dropin, "dropindropindropindropin");
    this.state = { instance: null };
  }

  componentDidMount() {
    webhooks.on("*", ({ id, name, payload }) => {
      alert();
      console.log(name, "event received");
    });
  }

  clickUI = () => {
    dropin.create(
      {
        authorization: "sandbox_k3zyhsxn_95csy7fyrgt8cy7c",
        container: "#dropin-container",
        paypal: {
          flow: "checkout",
          amount: "10.00",
          currency: "USD"
        },
        translations: {
          payingWith: "You are paying with {{paymentSource}}",
          chooseAnotherWayToPay: "My custom chooseAnotherWayToPay string"
          // Any other custom translation strings
        }
      },
      (createErr, instance) => {
        console.log(createErr, instance, "instanceinstance");
        this.setState({ instance });
        instance.requestPaymentMethod(function(
          requestPaymentMethodErr,
          payload
        ) {
          // Submit payload.nonce to your server
          console.log(requestPaymentMethodErr, payload);
        });
      }
      // (createErr, instance) => {
      //   instance.requestPaymentMethod(function(
      //     requestPaymentMethodErr,
      //     payload
      //   ) {
      //     // Submit payload.nonce to your server
      //     console.log(requestPaymentMethodErr, payload);
      //   });
      // }
    );
  };
  pay = () => {
    let instance = this.state.instance;
    instance.requestPaymentMethod(function(err, payload) {
      console.log(err, payload);
      if (err) {
        // Handle errors in requesting payment method
      }

      // Send payload.nonce to your server
    });
  };

  render() {
    return (
      <div>
        <h1>Braintree Payment</h1>
        <div className="footer">
          <button onClick={this.clickUI}>Drop IN</button>
          <button onClick={this.pay}>Pay</button>
        </div>
        <div id="dropin-container" />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));

export default App;
