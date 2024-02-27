import { ClientContextProvider } from '../context/ClientContext'; 
// import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ClientContextProvider>
        <Component {...pageProps} />
    </ClientContextProvider>
  );
}

export default MyApp;
