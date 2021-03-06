import React, { Component } from 'react';
import './App.css';
import { CognitoUserPool,CognitoUserAttribute,CognitoUser,AuthenticationDetails } from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';


class App extends Component {

    constructor(props){
      super(props);
      this.state = {
        UserPoolId : "ap-south-1_blf2ahffy",
        ClientId: "44l9p4rbt3i39tjtpldm8tktf8",
        IdentityPoolId: 'ap-south-1:7fe3ff0d-a05d-4906-9d9d-78dd71781f61',
        // email: "",
        // username: "",
        // phone: "",
        // password: "",
        // confirmCode: "",
      }
    }

  componentDidMount(){
    this.loadAuthenticatedUser()
  }
    
  doRegister = () => {
    console.log("resgister user")

    let poolData = {
      UserPoolId: this.state.UserPoolId, // Your user pool id here
      ClientId: this.state.ClientId, // Your client id here
    };
    let userPool = new CognitoUserPool(poolData); 
    let email = this.email.value;
    let username = this.username.value;
    let phone = this.phone.value;
    let password = this.password.value;

    console.log(`Register User ${email} ${username} ${phone} ${password}`)
    let attributeList = [];

    let dataEmail = {
      Name: 'email',
      Value: email,
    };
    
    let dataPhoneNumber = {
      Name: 'phone_number',
      Value: phone,
    };
    let attributeEmail = new CognitoUserAttribute(dataEmail);
    let attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);
    
    attributeList.push(attributeEmail);
    attributeList.push(attributePhoneNumber);

    userPool.signUp(username, password, attributeList, null, (err,result) => {
      if (err) {
        console.error(err);
      } else {
        let cognitoUser = result.user;
        console.log('user registered as is ' + cognitoUser.getUsername());
      }

    });

    console.debug(userPool)
  }
  
  // saajidtest@grr.la
  doConfirm = () => {
    let poolData = {
      UserPoolId: this.state.UserPoolId, // Your user pool id here
      ClientId: this.state.ClientId, // Your client id here
    };
    
    let userPool = new CognitoUserPool(poolData);
    let userData = {
      Username: this.username.value,
      Pool: userPool,
    };
    
    let cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(this.code.value, true, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        console.log('call result: ' + result);
      }

    });
  }

  doLogin = () => {
    let authenticationData = {
      Username: this.username.value,
      Password: this.password.value,
    };
    let authenticationDetails = new AuthenticationDetails(
      authenticationData
    );
    let poolData = {
      UserPoolId: this.state.UserPoolId, // Your user pool id here
      ClientId: this.state.ClientId, // Your client id here
    };
    let userPool = new CognitoUserPool(poolData);
    let userData = {
      Username: this.username.value,
      Pool: userPool,
    };
    let cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log("User Data" , result)
        let accessToken = result.getAccessToken().getJwtToken();
        console.log("Access Token", accessToken)

    // let creds = new.AWS.cognitoIdentityCredentials({


    // })
    
        //POTENTIAL: Region needs to be set if not already set previously elsewhere.
        // AWS.config.region = '<region>';
    
        // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        //   IdentityPoolId: '...', // your identity pool id here
        //   Logins: {
        //     // Change the key below according to the specific region your user pool is in.
        //     'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>': result
        //       .getIdToken()
        //       .getJwtToken(),
        //   },
        // });
    
        //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
        // AWS.config.credentials.refresh(error => {
        //   if (error) {
        //     console.error(error);
        //   } else {
        //     // Instantiate aws sdk service objects now that the credentials have been updated.
        //     // example: let s3 = new AWS.S3();
        //     console.log('Successfully logged!');
        //   }
        // });
      },
    
      onFailure: (err) => {
        console.error(err);
      },
    });
  }

  loadAuthenticatedUser = () => {
    // console.log("Loading Auth user")

    var poolData = {
      UserPoolId: this.state.UserPoolId, // Your user pool id here
      ClientId: this.state.ClientId, // Your client id here
    };
    var userPool = new CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
    
    if (cognitoUser != null) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        console.log('session validity: ' + session.isValid());
    
        let creds = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'ap-south-1:7fe3ff0d-a05d-4906-9d9d-78dd71781f61', // your identity pool id here
            Logins: {
              // Change the key below according to the specific region your user pool is in.
              'cognito-idp.ap-south-1.amazonaws.com/ap-south-1_blf2ahffy': session
                .getIdToken()
                .getJwtToken(),
            },
          },{
            region: "ap-south-1"
          });

        console.log(creds)
        creds.refresh = (err,data) => {
          if(err) console.log(err)
          else{
            console.log(creds)
          }
        }
    
        // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        //   IdentityPoolId: '...', // your identity pool id here
        //   Logins: {
        //     // Change the key below according to the specific region your user pool is in.
        //     'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>': session
        //       .getIdToken()
        //       .getJwtToken(),
        //   },
        // });
    
        // Instantiate aws sdk service objects now that the credentials have been updated.
        // example: var s3 = new AWS.S3();
      });
    }
  }

  

  render() {
    return (
      <div className="App"> 
        <div className="LoginBox">       
          <h2> Complete Registration Using Cognito </h2>
          <hr/>
          <br/>
          <input type="email" name="email" placeholder="Your Email" ref={(input) => {this.email = input}}/><br/>
          <input type="text" name="username" placeholder="Your Name" ref={(input) => {this.username = input}}/><br/>
          <input type="text" name="phone" placeholder="Your Phone Number" ref={(input) => {this.phone = input}}/><br/>
          <input type="password" name="password" placeholder="Password" ref={(input) => {this.password = input}}/><br/>
          <button onClick={(e) => this.doLogin(e)}> Login </button><br/>
          <p>Already Register?</p>
          <button onClick={(e) => this.doRegister(e)}> Sign up </button><br/><hr/>

          <input type="text" name="code" placeholder="Confirmation Code" ref={(input) => {this.code = input}}/><br/>
          <button onClick={(e) => this.doConfirm(e)}> Confirm </button>
        </div>
      </div>
    );
  }
}

export default App;
