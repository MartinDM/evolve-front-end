console.log('Login');


function removeForgotPasswordLink() {
  var forgotPasswordLink = document.getElementsByClassName('forgotPassword')[0];
  forgotPasswordLink.parentElement.removeChild(forgotPasswordLink);
}