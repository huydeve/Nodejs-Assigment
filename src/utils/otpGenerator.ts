import randomstring from "randomstring"



export function otp() {
  return randomstring.generate({
    length: 6,
    charset: 'numeric'
  });
}