import '../styles/globals.css'
import '../styles/style.scss'


function MyApp({ Component, pageProps: { session, ...pageProps } }) {

  

  return (
    <>
      {/* <SessionProvider session={pageProps.session}>
        <StateContextProvider>
          <SWRConfig value={{ provider: () => new Map() }}> */}
            <Component {...pageProps} />
          {/* </SWRConfig>
        </StateContextProvider>
      </SessionProvider> */}
    </>
  )
}


export default MyApp