
/*
 * Sample for cloudfoundry uaa
 */

export const environment = {
    production: false,
    authentication: {
        authority: 'http://localhost:8080/uaa',
        client_id: 'app1',
        redirect_uri: 'http://localhost:8100/assets/callback.html',
        response_type: 'id_token',
        scope: 'openid',
        silent_redirect_uri: 'http://localhost:8100/assets/silentrefresh.html',
        metadata: {
            issuer: 'http://localhost:8080/uaa/oauth/token',
            authorization_endpoint: 'http://localhost:8080/uaa/oauth/authorize',
            end_session_endpoint:'http://localhost:8080/uaa/logout.do',
            jwks_uri:'http://localhost:8080/uaa/token_keys'
        },
        automaticSilentRenew: true,
        silentRequestTimeout: 1000,
        filterProtocolClaims: true,
        loadUserInfo: false,
        federationSigningUrl: 'http://localhost:8080/uaa/oauth/authorize?response_type=id_token&scope=openid&client_id=app1'
            + '&redirect_uri=http://localhost:8100/assets/callback.html',
        federationSignoutUrl: 'http://localhost:8080/uaa/logout.do'
        + '?redirect=http://localhost:8100/',
    }
};