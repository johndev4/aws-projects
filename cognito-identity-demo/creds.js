const crypto = require("crypto");

const fetchData = (fetchURL) => {
  fetch(fetchURL, {
    headers,
  })
    .then((response) => {
      console.log("Buckets:", response);
      const reader = response.body.getReader();
      let result = "";
      let done, value;

      (async () => {
        // console.log(await reader.read() );
        while (!done) {
          const data = await reader.read();
          done = data.done;
          value = data.value;
          result += new TextDecoder().decode(value);
        }
        console.log("Result:", result);
      })();
    })
    .catch((error) => {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    });
};

const createCURLCommand = (fetchURL, headers) => {
  const curlCommand = `curl -X GET '${fetchURL}' \\\n-H 'Authorization: ${headers["Authorization"]}' \\\n-H 'x-amz-date: ${headers["x-amz-date"]}' \\\n-H 'x-amz-security-token: ${headers["x-amz-security-token"]}' \\\n-H 'x-amz-content-sha256: ${headers["x-amz-content-sha256"]}'`;
  console.log("CURL command is:- \n\n\n", curlCommand);
};

const data = {};

const accessKeyId = data.AccessKeyId;
const secretAccessKey = data.SecretKey;
const sessionToken = data.SessionToken;
const region = "ap-southeast-1";
const service = "s3";

// Generate the current date and timestamp in the required formats
const date = new Date();
const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, ""); // Format: YYYYMMDD'T'HHMMSS'Z'
const dateStamp = date.toISOString().slice(0, 10).replace(/-/g, ""); // Format: YYYYMMDD

// Create a canonical request
const canonicalUri = "/";
const canonicalQuerystring = "max-buckets=10";
const canonicalHeaders = `host:s3.${region}.amazonaws.com\nx-amz-content-sha256:UNSIGNED-PAYLOAD\nx-amz-date:${amzDate}\nx-amz-security-token:${sessionToken}\n`;
const signedHeaders =
  "host;x-amz-content-sha256;x-amz-date;x-amz-security-token";
const payloadHash = "UNSIGNED-PAYLOAD";

const canonicalRequest = [
  "GET",
  canonicalUri,
  canonicalQuerystring,
  canonicalHeaders,
  signedHeaders,
  payloadHash,
].join("\n");

// Create the string to sign
const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
const stringToSign = [
  "AWS4-HMAC-SHA256",
  amzDate,
  credentialScope,
  crypto.createHash("sha256").update(canonicalRequest).digest("hex"),
].join("\n");

// Create the signing key
const kDate = crypto
  .createHmac("sha256", `AWS4${secretAccessKey}`)
  .update(dateStamp)
  .digest();
const kRegion = crypto.createHmac("sha256", kDate).update(region).digest();
const kService = crypto.createHmac("sha256", kRegion).update(service).digest();
const signingKey = crypto
  .createHmac("sha256", kService)
  .update("aws4_request")
  .digest();

// Create the signature
const signature = crypto
  .createHmac("sha256", signingKey)
  .update(stringToSign)
  .digest("hex");

// Create the authorization header
const authorizationHeader = [
  `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope},`,
  `SignedHeaders=${signedHeaders},`,
  `Signature=${signature}`,
].join(" ");

const headers = {
  Authorization: authorizationHeader,
  "x-amz-date": amzDate,
  "x-amz-security-token": sessionToken,
  "x-amz-content-sha256": payloadHash,
};

const fetchURL = `https://s3.${region}.amazonaws.com/?${canonicalQuerystring}`;

fetchData(fetchURL);

// createCURLCommand(fetchURL, headers);
