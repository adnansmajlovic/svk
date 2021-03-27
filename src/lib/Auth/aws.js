// Amplify.configure(aws_exports);

import amplify from '../../stores/amplify';

let unsubscribeAmplify, unsubscribeAuth;
let Amplify, Auth;

unsubscribeAmplify = amplify.subscribe(async (amp) => {
	if (amp) {
		Amplify = amp;
	}
});

unsubscribeAuth = amplify.subscribeAuth(async (amp) => {
	if (amp) {
		Auth = amp;
		console.log('Auth/aws.js:', { Auth });
	}
});

export async function checkUser() {
	const currentUser = await Auth.default.currentAuthenticatedUser({
		// a.s. bypassCache: true // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
	});

	console.log('checkUser', {
		currentUser
	});

	return currentUser;
}

export async function signOut() {
	try {
		await Auth.default.signOut();
	} catch (error) {
		console.log(error);
	}
}

// a.s. use email to signup
export async function SignUp(email, password) {
	try {
		const user = await Auth.default.signUp({
			username: email,
			password,
			attributes: {
				email // optional
				// phone_number, // optional - E.164 number convention
				// other custom attributes
			}
		});
		// console.log({ user });
	} catch (error) {
		console.log('error signing up:', error);
	}
}

export async function SignIn(username, password, newPassword = null) {
	try {
		const user = await Auth.default.signIn(username, password);
		// console.log({
		//   user,
		// });
		if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
			// You need to get the code from the UI inputs
			// and then trigger the following function with a button click
			const code = getCodeFromUserInput();
			// If MFA is enabled, sign-in should be confirmed with the confirmation code
			const loggedUser = await Auth.default.confirmSignIn(
				user, // Return object from Auth.signIn()
				code, // Confirmation code
				mfaType // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
			);
		} else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
			const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
			// You need to get the new password and required attributes from the UI inputs
			// and then trigger the following function with a button click
			// For example, the email and phone_number are required attributes
			// a.s. need to build this form... eventually, one day
			// const { username, email, phone_number } = getInfoFromUserInput();

			// console.log({
			//   newPassword,
			//   email: user.challengeParam.userAttributes.email,
			// });

			if (newPassword) {
				const loggedUser = await Auth.default.completeNewPassword(
					user, // the Cognito User Object
					newPassword, // the new password
					// OPTIONAL, the required attributes
					{
						email: user.challengeParam.userAttributes.email
						// phone_number,
					}
				);

				// console.log({ loggedUser });
				return loggedUser;
			} else {
				return { user, requiredAttributes };
			}
		} else if (user.challengeName === 'MFA_SETUP') {
			// This happens when the MFA method is TOTP
			// The user needs to setup the TOTP before using it
			// More info please check the Enabling MFA part
			Auth.default.setupTOTP(user);
		} else {
			// The user directly signs in

			return user;
		}
	} catch (err) {
		if (err.code === 'UserNotConfirmedException') {
			// The error happens if the user didn't finish the confirmation step when signing up
			// In this case you need to resend the code and confirm the user
			// About how to resend the code and confirm the user, please check the signUp part
			console.log(err.message);
			alert(err.message);
		} else if (err.code === 'PasswordResetRequiredException') {
			// The error happens when the password is reset in the Cognito console
			// In this case you need to call forgotPassword to reset the password
			// Please check the Forgot Password part.
			console.log(err.message);
			alert(err.message);
		} else if (err.code === 'NotAuthorizedException') {
			// The error happens when the incorrect password is provided
			console.log(err.message);
			alert(err.message);
		} else if (err.code === 'UserNotFoundException') {
			// The error happens when the supplied username/email does not exist in the Cognito user pool
			console.log(err.message);
			alert(err.message);
		} else {
			console.log(err.message);
			alert(err.message);
		}
	}
}

export async function ConfirmSignUp(email, confirmationCode) {
	try {
		return await Auth.default.confirmSignUp(email, confirmationCode);
	} catch (error) {
		console.log(error);
	}
}

// // For advanced usage
// // You can pass an object which has the username, password and validationData which is sent to a PreAuthentication Lambda trigger
// Auth.signIn({
//     username, // Required, the username
//     password, // Optional, the password
//     validationData, // Optional, a random key-value pair map which can contain any key and will be passed to your PreAuthentication Lambda trigger as-is. It can be used to implement additional validations around authentication
//   }).then(user => console.log(user))
//   .catch(err => console.log(err));
