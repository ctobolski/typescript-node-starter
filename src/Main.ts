import { config } from './Config'
const v3 = require('node-hue-api').v3
  , discovery = v3.discovery
  , hueApi = v3.api
;

const USERNAME = 'Do9qiD-zVJfwtFd12vnSx9uzu3y36Tc-zziOo8LL';

async function discoverBridge() {
  const results = await v3.discovery.nupnpSearch();
  if (results.length === 0) {
    console.error('Failed to resolve any Hue Bridges');
    return null;
  } else {
    // Ignoring that you could have more than one Hue Bridge on a network as this is unlikely in 99.9% of users situations
    return results[0].ipaddress;
  }

}

async function discoverAndInit() {
  const ipAddress = await discoverBridge(); 

  try {
    const authenticatedApi = await hueApi.createLocal(ipAddress).connect(USERNAME); 
    // Do something with the authenticated user/api
    const bridgeConfig = await authenticatedApi.configuration.getConfiguration();
    console.log(`Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`);

  } catch(err) {
    if (err.getHueErrorType() === 101) {
      console.error('The Link button on the bridge was not pressed. Please press the Link button and try again.');
    } else {
      console.error(`Unexpected Error: ${err.message}`);
    }
  }
}

// Invoke the discovery and create user code
discoverAndInit();
