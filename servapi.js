const express = require('express');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');
const https = require('https');
// const debug = require('debug')('app');
// debug('Démarrage du serveur sur le port 3002');
const cors = require('cors');
const fs = require('fs');
const crypto = require('crypto');




// const options = [
  // {
  //   key: fs.readFileSync('/etc/letsencrypt/live/alternativeadapt.com-0002/privkey.pem'),
  //   cert: fs.readFileSync('/etc/letsencrypt/live/alternativeadapt.com-0002/cert.pem'),
  //   secureOptions: crypto.constants.SSL_OP_NO_TLSv1 | crypto.constants.SSL_OP_NO_TLSv1_1, // Désactive les protocoles SSL/TLS obsolètes
  //   minVersion: crypto.constants.TLSv1_2, // Utilisez au moins TLS 1.2
  //   ciphers: 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384', // Exemple de suites de chiffrement sécurisées

  // },
  // {
  //   key: fs.readFileSync('/etc/letsencrypt/live/agv.alternativeadapt.com/privkey.pem'),
  //   cert: fs.readFileSync('/etc/letsencrypt/live/agv.alternativeadapt.com/cert.pem'),
  //   secureOptions: crypto.constants.SSL_OP_NO_TLSv1 | crypto.constants.SSL_OP_NO_TLSv1_1, // Désactive les protocoles SSL/TLS obsolètes
  //   minVersion: crypto.constants.TLSv1_2, // Utilisez au moins TLS 1.2
  //   ciphers: 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384', // Exemple de suites de chiffrement sécurisées

  // },
  // {
  //   key: fs.readFileSync('/etc/letsencrypt/live/alternativeadapt.com/privkey.pem'),
  //   cert: fs.readFileSync('/etc/letsencrypt/live/alternativeadapt.com/cert.pem'),
  //   secureOptions: crypto.constants.SSL_OP_NO_TLSv1 | crypto.constants.SSL_OP_NO_TLSv1_1, // Désactive les protocoles SSL/TLS obsolètes
  //   minVersion: crypto.constants.TLSv1_2, // Utilisez au moins TLS 1.2
  //   ciphers: 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384', // Exemple de suites de chiffrement sécurisées

  // }
// ];





const options={ 
  key: fs.readFileSync('/etc/letsencrypt/live/alternativeadapt.com-0002/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/alternativeadapt.com-0002/cert.pem'),
}





// const options = {
//   key: fs.readFileSync('/home/debian/clefapi/privkey.pem'),
//   cert: fs.readFileSync('/home/debian/clefapi/cert.pem')
// };

//=======

const subdomain = require('express-subdomain');





const apiRouter = express.Router();
// Router pour le sous-domaine 'api'
apiRouter.use('/admin',(req, res, next) => {
  createProxyMiddleware({
    target: 'http://0.0.0.0:1337/admin',
    changeOrigin: true,
  })
  next();
});
apiRouter.use('*', createProxyMiddleware({
  target: 'http://0.0.0.0:1337/',
  changeOrigin: true,
}));
app.use(subdomain('api', apiRouter));





const agvRouter = express.Router();
agvRouter.use('*', createProxyMiddleware({
  target: 'http://0.0.0.0:1001/',
  changeOrigin: true,
}));
app.use(subdomain('agv', agvRouter));



// Utilisez le routeur pour le sous-domaine 'api'


//+



app.use('*', createProxyMiddleware({
  target: 'http://0.0.0.0:8080/',
  changeOrigin: true,
}));


//=


app.use(cors());
app.use(cors({
  origin: 'https://api.alternativeadapt.com',
  origin: 'http://localhost:*'
}));


// app.use(function (req, res, next) {
//   res.status(404).send("Désolé, nous ne pouvons pas trouver cette ressource!");
// });


// app.use((req, res, next) => {
//   // const crypto = require('crypto');
//   // const nonce = crypto.randomBytes(16).toString('base64');

//   res.setHeader(
//     "Content-Security-Policy",
//     "script-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:* https://*"
//   );
//   next();
// });



//open the door!
// app.listen(80, () => {
//   console.log('Express server listening on port 80');
// });
const serv= https.createServer(options, app);

serv.listen(443, () => {
  console.log('Express server listening on port 443');
});