console.log('Common');
function sendGETRequest(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.send();

  request.onload = function(ev) {
      if (request.readyState === 4 && request.status === 200) {
          var parsedResponse = JSON.parse(ev.target.response);
          callback(parsedResponse.data);
      }
      console.log('oops');

      // Hide loading screen even if Preference settings come back with error
      window.setTimeout(function(){
        console.warn('Hiding loading screen');
        document.getElementById('splashPage').style.display = 'none';
      }, 500)
      
  }

  request.onerror = function (e) { 
      console.error(request.statusText);
  };
}

function getPreferences(callback) {
  var preferencesPath = '/preferences/settings/apps/idcr';

  sendGETRequest(preferencesPath, callback);
}

function setAppTitle(value) {
  document.title = value;

  if (getParameterByName('client_id') === 'idcr-admin') {
      document.getElementById('appTitle').innerHTML = 'Admin';
  }
}

function setLoginLogo(value) {
  document.getElementById('logo').src = value;
}

function setThemeClass(value) {
  document.body.className = value;
}

var preferencesHandlers = {
  'appTitle' : setAppTitle,
  'loginLogoUrl' : setLoginLogo,
  'themeClass' : setThemeClass
};

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function handleErrors(error) {
  document.getElementById('errorMessage').innerText = error;
}

function setSessionExpiredMessage() {
  document.getElementById('session-expired-message').innerText = 'YOU HAVE BEEN LOGGED OUT.';
  document.getElementById('session-expired-alert').style.display = 'block';
}

function isOnTenantLevel() {
  return !!document.getElementsByTagName('body')[0].getAttribute('data-tenant');
}


function run() {
  var clientId = getParameterByName('client_id');

  //document.getElementById('client-id').value = clientId;
  //document.getElementById('form').action = '/uaa/ssoLogin?client_id=' + clientId;

/*   if (!isOnTenantLevel()) {
      removeForgotPasswordLink();
  } */

  getPreferences(function(data) {
      data.forEach(function(preference) {
          var handler = preferencesHandlers[preference.key];

          if (handler != undefined) {
              handler(preference.value);
          }
      });
      document.getElementById('splashPage').style.display = 'none';

  });

  var errorMessage = getParameterByName('error');

  if (errorMessage) {
      handleErrors(errorMessage);
  }

  var sessionExpiredMessage = getParameterByName('logout_reason');
  if (sessionExpiredMessage && sessionExpiredMessage === 'session_expired') {
      setSessionExpiredMessage();
  }
}

run();