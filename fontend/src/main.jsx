import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from "./utils/store";
import { StrictMode } from "react";
import { CookiesProvider } from 'react-cookie';
import PageLoader from "./Components/PageLoader.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Provider store={store}>
        <CookiesProvider>
        <PageLoader>
          <App />
        </PageLoader>
        </CookiesProvider>
      </Provider>
    </StrictMode>
)