import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { InjectedConnector, StarknetConfig } from "@starknet-react/core";
import { SequencerProvider } from "starknet";

function MyApp({ Component, pageProps }: AppProps) {
    // Don't need to connect wallet yet
    // const connectors = [
    //     new InjectedConnector({ options: { id: "argentX" } }),
    //     new InjectedConnector({ options: { id: "braavos" } }),
    // ];

    const provider = new SequencerProvider({ network: "goerli-alpha-2" })

    return (
        // Wrap app in Chakra
        <ChakraProvider>
            {/* Then wrap in StarknetConfig */}
            {/* Don't need connectors yet */}
            {/* <StarknetConfig connectors={connectors}> */}
            <StarknetConfig defaultProvider={provider}>
                <Component {...pageProps} />
            </StarknetConfig>
        </ChakraProvider>
    );
}

export default MyApp;
