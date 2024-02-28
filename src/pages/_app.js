import Modal from 'react-modal';
import { ClientContextProvider } from '../context/ClientContext'; 
// import '../styles/globals.css';

if (process.browser) {
  Modal.setAppElement('#__next'); 
}

function MyApp({ Component, pageProps }) {
  return (
    <ClientContextProvider>
        <Component {...pageProps} />
    </ClientContextProvider>
  );
}

export default MyApp;
