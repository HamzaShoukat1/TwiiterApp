import { mailtrapclient, sender } from "./email.config.js"
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./EmailTemplete.js"

export const sendVerificationEmail = async (email: any, emailverificationToken: any) => {
    const recipients = [{ email }]
    try {
        const response = await mailtrapclient.send({
            from: sender,
            to: recipients,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", emailverificationToken),
            category: "Email Verification"
        })

        console.log("Email sent successfully", response)
        return response

    } catch (error) {
        console.log("error sending email", error)
        throw new Error(`error sending email:${error}`)

    }

}
export const sendWelComeEmail = async (email: any, name: any) => {
    const recipients = [{ email }]
    try {
        const response = await mailtrapclient.send({
            from: sender,
            to: recipients,
            template_uuid: "e4d844da-7cdd-47ad-afe1-cbf407515e48",
            template_variables: {
                "name": name,
                "company_info_name": "Twitter INC",
            }
        })

        console.log("Welcome email sent successfully", response)
        return response


    } catch (error) {
        console.log("error sending email", error)
        throw new Error(`error sending email:${error}`)


    }


}
export const sendPasswordResetEmail = async (email:any, resetURL:any) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapclient.send({
			from: sender,
			to: recipient,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
			category: "Password Reset",
		});
        return response

	} catch (error) {
		console.error(`Error sending password reset email`, error);

		throw new Error(`Error sending password reset email: ${error}`);
	}
};

export const sendResetSuccessEmail = async (email:any) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapclient.send({
			from: sender,
			to: recipient,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});

		console.log("Password reset email sent successfully", response);
        return response
	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
	}
};