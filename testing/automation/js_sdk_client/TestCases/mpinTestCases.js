//import from cms-client.js
const { CmsClient } = require("../UnityCardSDK/cms-client");
const Cache = {
  CMS_AUTH_TOKEN: "",
};

async function runTests() {
  const cmsClient = new CmsClient({
    baseURL: "https://cmsdevapi.saven.in",
    virtual: false,
  });

  try {
    // Positive Test Scenarios
    let result = await cmsClient.authenticate("+919700000001", "1234");
    Cache.CMS_AUTH_TOKEN = result.data.token;
    console.log("Status : PASS || TestCase : Valid Credentials Test Passed  ",);

    // Negative Test Scenarios
    try {
      // Invalid Mobile Number: Ensure proper handling of non-existent mobile numbers
      let result = await cmsClient.authenticate("1234567890", "1234");
      console.error(
        "Status : PASS || TestCase : Invalid Mobile Number Test Failed || Error : ",
        result.error.message
      );
    } catch (error) {
      console.log("Invalid Mobile Number Test Passed");
    }

    try {
      // Incorrect PIN: Ensure proper handling of incorrect PINs
      let result = await cmsClient.authenticate("+919700000000", "1604");
      console.error(
        "Status : PASS || TestCase : Incorrect PIN Test Failed || Error :",
        result.error.message
      );
    } catch (error) {
      console.log("Incorrect PIN Test Passed");
    }

    try {
      // PIN with More Than 4 Digits: Ensure proper validation of PIN length
      let result = await cmsClient.authenticate("+919700000000", "12345");
      console.error(
        "Status : PASS || TestCase : PIN with More Than 4 Digits Test Failed || Error :",
        result.error.message
      );
    } catch (error) {
      console.log("PIN with More Than 4 Digits Test Passed");
    }

    try {
      // PIN with Less Than 4 Digits: Ensure proper validation of PIN length
      let result = await cmsClient.authenticate("+919700000000", "123");
      console.error(
        "Status : PASS || TestCase : PIN with Less Than 4 Digits Test Failed || Error :",
        result.error.message
      );
    } catch (error) {
      console.log("PIN with Less Than 4 Digits Test Passed");
    }

    try {
      // PIN with Symbols: Ensure proper validation of PIN characters
      let result = await cmsClient.authenticate("+919700000000", "1@#6");
      console.error(
        "Status : PASS || TestCase : PIN with Symbols Test Failed || Error :",
        result.error.message
      );
    } catch (error) {
      console.log("PIN with Symbols Test Passed");
    }

    try {
      // Null PIN: Ensure proper validation of PIN
      let result = await cmsClient.authenticate("+919700000000", null);
      console.error(
        "Status : PASS || TestCase : Null PIN Test Failed || Error :",
        result.error.message
      );
    } catch (error) {
      console.log("Null PIN Test Passed");
    }

    try {
      // Both Mobile Number and MPIN are null
      let result = await cmsClient.authenticate(null, null);
      console.log(
        "Status : PASS || TestCase : Both Mobile Number and MPIN are null Test Passed || Error :",
        result.error.message
      );
    } catch (error) {
      console.error(
        "FAIL, Both Mobile Number and MPIN are null Test Failed:",
        error.message
      );
    }

    try {
      // Both Mobile Number and MPIN are wrong
      let result = await cmsClient.authenticate("0000000000", "0000");
      console.log(
        "Status : PASS || TestCase : Both Mobile Number and MPIN are wrong Test Passed || Error :",
        result.error.message
      );
    } catch (error) {
      console.error(
        "FAIL, Both Mobile Number and MPIN are wrong Test Failed:",
        error.message
      );
    }

    try {
      // MPIN contains alphabet
      let result = await cmsClient.authenticate("+919700000000", "12A4");
      console.log(
        "Status : PASS || TestCase : MPIN contains alphabet Test Passed || Error :",
        result.error.message
      );
    } catch (error) {
      console.error("FAIL, MPIN contains alphabet Test Failed:", error.message);
    }

    try {
      // Mobile Number does not contain '+91'
      let result = await cmsClient.authenticate("9700000000", "1234");
      console.log(
        'Status : PASS || TestCase : Mobile Number does not contain "+91" Test Passed || Error :',
        result.error.message
      );
    } catch (error) {
      console.error(
        'FAIL, Mobile Number does not contain "+91" Test Failed:',
        error.message
      );
    }

    try {
      // Mobile Number with less than 10 digits
      let result = await cmsClient.authenticate("+9197000000", "1234");
      console.log(
        "Status : PASS || TestCase : Mobile Number with less than 10 digits Test Passed || Error :",
        result.error.message
      );
    } catch (error) {
      console.error(
        "FAIL, Mobile Number with less than 10 digits Test Failed:",
        error.message
      );
    }
  } catch (error) {
    console.error("FAIL , An error occurred:", error);
  }
}
 
runTests();

// In mpinTestCases.js
module.exports = {
  CMS_AUTH_TOKEN: Cache.CMS_AUTH_TOKEN
};

