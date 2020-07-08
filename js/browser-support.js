var supportedBrowsers = {
  'Chrome': 'version-chrome',
  'IE': 'version-ie',
  'Edge': 'version-edge',
  'Firefox': 'version-firefox',
  'Safari': 'version-safari',
  'M. Safari': 'version-safari-mobile'
};

var selectors = {
  splashPage: 'splashPage',
  browserSupport: 'browserSupport',
  version: 'version',
  action: 'action',
  continueBtn: 'continue'
};

var originalBodyClass = '';

// method taken from: http://stackoverflow.com/a/16938481
function getBrowserInfo() {
  var userAgent = navigator.userAgent;
  var temporary;
  var userAgentMatches = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+(.\d+(.\d+)?)?)/i) || [];

  if (/trident/i.test(userAgentMatches[1])) {
      temporary = /\brv[ :]+(\d+)/g.exec(userAgent) || [];

      return {
          name: 'IE',
          version: (temporary[1]||'')
      };
  }

  if (userAgentMatches[1] === 'Chrome') {
      temporary = userAgent.match(/\bOPR|Edge\/(\d+(.\d+(.\d+)?)?)/);

      if(temporary != null) {
          return {
              name: temporary[0] === 'OPR' ? 'Opera' : 'Edge',
              version: temporary[1]
          };
      }
  }

  userAgentMatches = userAgentMatches[2] ? [userAgentMatches[1], userAgentMatches[2]]: [navigator.appName, navigator.appVersion, '-?'];

  if ((temporary = userAgent.match(/version\/(\d+(.\d+(.\d+)?)?)/i)) != null) {
      userAgentMatches.splice(1,1,temporary[1]);
  }

  return {
      name: userAgentMatches[0],
      version: userAgentMatches[1]
  };
}

function compareVersions(version1, version2) {
  var version1Parts = version1.split('.');
  var version2Parts = version2.split('.');

  var shorterVersionLength = Math.min(version1Parts.length, version2Parts.length);

  for (var i = 0; i < shorterVersionLength; i++) {
      var diff = parseInt(version1Parts[i]) - parseInt(version2Parts[i]);

      if (diff) {
          return diff;
      }
  }

  return version1Parts.length - version2Parts.length;
}

function blockAngular() {
  document.getElementsByTagName('html')[0].removeAttribute('ng-app');
}

function restartAngularAndShowLoadingIndicator() {
  document.getElementById(selectors.splashPage).style.display = 'initial';

  angular.element(function() {
      angular.bootstrap(document, ['app']);
  });
}

function setVersionInfoMessage(browser) {
  var div = document.getElementById(selectors.version);
  div.innerHTML = 'You are using ' + browser.name + ' ' + browser.version + '. This browser is not supported because the manufacturer' +
      ' no longer provides support or security updates.';
}

function setupContinueButton() {
  var button = document.getElementById(selectors.continueBtn);

  button.onclick = function() {
      restartAngularAndShowLoadingIndicator();
      resetTheme();
      hideBrowserSupportView();
  };
}

function showBrowserSupportView(browser) {
  document.getElementById(selectors.browserSupport).style.display = 'block';
  document.getElementById(selectors.splashPage).style.display = 'none';

  setVersionInfoMessage(browser);
  setupContinueButton();
}

function hideBrowserSupportView() {
  document.getElementById(selectors.browserSupport).style.display = 'none';
}

function setThemeClass(value) {
  originalBodyClass = document.body.className;
  document.body.className = value;
}

function resetTheme() {
  document.body.className = originalBodyClass;
}

function getSupportedBrowserVersion(browserName) {
  return document.getElementById(supportedBrowsers[browserName]).innerHTML.replace('+','');
}

function checkSupport() {
  var browser = getBrowserInfo();

  var isBrowserSupported = supportedBrowsers[browser.name] !== undefined &&
      compareVersions(browser.version, getSupportedBrowserVersion(browser.name)) >= 0;

  if (!isBrowserSupported) {
      setThemeClass('skin-blue');
      showBrowserSupportView(browser);
      blockAngular();
  }
}

checkSupport();
