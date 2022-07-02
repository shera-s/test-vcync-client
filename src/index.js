import React, {Suspense} from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import App from "./App"; 
import reportWebVitals from "./reportWebVitals";
import { ApolloProvider } from "@apollo/client";
import client from "./config/gql/client";
import { Provider } from "react-redux";
import { store, persistor } from "./config/store";
import { PersistGate } from "redux-persist/integration/react";
import i18n from "i18next";
import { initReactI18next} from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from 'i18next-http-backend'
import Preloader from "./components/Preloader";


i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs:['en','ar'],
    fallbackLng:"en",
    detection:{
      order:['cookie','htmlTag','localStorage','path','subdomain'],
      caches:['cookie']
    },

    interpolation: {
      escapeValue: false // react already safes from xss
    },
    backend:{
      loadPath:'/assets/locales/{{lng}}/translation.json',

    },
    react:{useSuspense:false}
  })

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Suspense fallback={Preloader}>
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
  </Suspense>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
