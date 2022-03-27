const path = require('path')
module.exports = function firebase() {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    name: 'firebase',
    getClientModules() {
      return isProd ? [path.resolve(__dirname, './analytics')] : [];
    },
    injectHtmlTags() {
      if (!isProd) {
        return {};
      }

      return {
        headTags: [
          {
            tagName: 'script',
            attributes: {
              type: 'module'
            },
            innerHTML: `
              // Import the functions you need from the SDKs you need
              import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
              import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-analytics.js";
              // TODO: Add SDKs for Firebase products that you want to use
              // https://firebase.google.com/docs/web/setup#available-libraries
            
              // Your web app's Firebase configuration
              // For Firebase JS SDK v7.20.0 and later, measurementId is optional
              const firebaseConfig = {
                apiKey: "AIzaSyCuw0MrUtwWXK_wWn3PI6k81x-9DiZM8_Q",
                authDomain: "cellularjs-f7b9d.firebaseapp.com",
                projectId: "cellularjs-f7b9d",
                storageBucket: "cellularjs-f7b9d.appspot.com",
                messagingSenderId: "981578037522",
                appId: "1:981578037522:web:e21b3011b4881550501bcb",
                measurementId: "G-HSYN90GRE0"
              };
            
              // Initialize Firebase
              const app = initializeApp(firebaseConfig);
              getAnalytics(app);
            `,
          },
        ]
      };
    }
  };
}