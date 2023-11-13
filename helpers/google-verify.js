const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();

const googleVerify = async (token) => {  
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  const {name, email, picture} = JSON.parse(jsonPayload);
  return  {name, email, picture}
}

module.exports = {
    googleVerify
}