
/*
 * Sample for Google
 */

export const environment = {
    production: false,
    authentication: {
        authority: 'https://accounts.google.com',
        client_id: '1078413334731-m53th1ptemc3046q1rg5d7gr0p6l6obm.apps.googleusercontent.com',
        redirect_uri: 'http://localhost:8100/assets/callback.html',
        response_type: 'id_token',
        scope: 'openid profile',
        silent_redirect_uri: 'http://localhost:8100/assets/silentrefresh.html',
        metadata: {
            issuer: 'https://accounts.google.com',
            authorization_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
            end_session_endpoint:'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout',
            jwks_uri:'https://www.googleapis.com/oauth2/v3/certs'
        },
        automaticSilentRenew: true,
        silentRequestTimeout: 1000,
        filterProtocolClaims: true,
        loadUserInfo: false,
        federationSigningUrl: 'https://accounts.google.com/o/oauth2/v2/auth?response_type=id_token&scope=openid&client_id=1078413334731-m53th1ptemc3046q1rg5d7gr0p6l6obm.apps.googleusercontent.com'
            + '&redirect_uri=http://localhost:8100/assets/callback.html&nonce=0394852-3190485-2490358',
        federationSignoutUrl: 'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:8100/',
    }
};

