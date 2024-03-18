// true for coding in production mode
// false for development mode
const isProduction = true;

const DEVURL = 'http://localhost:8080/api/';
const PRODURL = 'https://spring-marketplace-server.onrender.com/api/';

export const BASEURL = isProduction ? PRODURL : DEVURL;
