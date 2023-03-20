import twilio from "twilio";

const accountSid = "ACd5fb6f00dc32f68feaf0124bad32ae86";
const authToken = "bba8c8d0b0eba4f1ceec5ad3a668d950";
const verifySid = "VAa865b66be370a85509aa33b0e7772c64";
const client = twilio(accountSid, authToken);



export function sendToPhone(phone: string) {
    console.log(phone);
    
    return client.verify.v2.services(verifySid)
        .verifications.create({ to: phone, channel: "sms" })

}

export function checkOtpPhone(otp: string, phone: string) {
    return client.verify.v2.services(verifySid)
        .verificationChecks.create({ to: phone, code: otp })
}