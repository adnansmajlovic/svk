// import amplify from '../stores/amplify';
import amplify from '$stores/amplify';

// import Lambda from 'aws-sdk/clients/lambda'; // npm install aws-sdk

let unsubscribeAmplify;
let unsubscribeAuth;
let unsubscribeAPI;

let Amplify, Auth, API;

import aws_exports from '../aws-exports';
const REGEX = /.*-(\w+)/;
const env = aws_exports.aws_content_delivery_bucket.match(REGEX)[1];

unsubscribeAmplify = amplify.subscribe(async (amp) => {
	if (amp) {
		Amplify = amp;
		console.log({ Amplify });
	}
});
unsubscribeAPI = amplify.subscribeAPI(async (amp) => {
	if (amp) {
		API = amp;
		console.log({ API });
	}
});

unsubscribeAuth = amplify.subscribeAuth(async (amp) => {
	if (amp) {
		Auth = amp;
		console.log({ Auth });
	}
});
// a.s.
export async function sendSNS(msg) {
	const apiName = 'marsconnectedSNS';
	const path = '/message';
	const myInit = {
		body: {},
		headers: {} // optional
	};

	// a.s. "destructure" msg object into body
	myInit.body = msg;

	console.log('function sendSNS:', { msg });

	const res = await API.post(apiName, path, myInit);
	console.log('sns message sent:', { res });
}

// export async function sendSnsDirect(msg) {
//   var AWS = require("aws-sdk");
//   var ctx = {
//     msg,
//     custom: { foo: "bar" },
//     client: { snap: ["crackle", "pop"] },
//     env: { fizz: "buzz" },
//   };

//   Auth.currentCredentials().then((credentials) => {
//     const lambda = new Lambda({
//       credentials: Auth.essentialCredentials(credentials),
//       region: "us-east-1",
//     });

//     console.log({ msg });

//     var params = {
//       FunctionName: `marsconnectedSNSApp-${env}`,
//       // ClientContext: "STRING_VALUE",
//       ClientContext: AWS.util.base64.encode(JSON.stringify(ctx)),
//       InvocationType: "RequestResponse", // "Event" for async
//       LogType: "Tail",
//       Payload: JSON.stringify({ baz: "quux" }),
//       // Payload: '{"pathParameters": { "id": "11-1011.00" }}'
//     };
//     lambda.invoke(params, function (err, data) {
//       if (err) console.log(err, err.stack);
//       // an error occurred
//       // else console.log("sns message sent 2:", { data }); // successful response
//       else return { data }; // successful response
//     });
//   });
// }
