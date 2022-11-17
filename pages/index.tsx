import { Box, Center, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";

import { intensityPlotAddress } from "../lib/constant";
import IntensityArrayValues from "../components/IntensityArray";

const Home: NextPage = () => {

    // const contractLink = `https://testnet.starkscan.co/contract/${intensityPlotAddress}#read-contract`;
    const contractLink = `https://testnet-2.starkscan.co/contract/${intensityPlotAddress}#read-contract`;

    return (
        <Box>
            <Head>
                <title>Makin&#39; Waves in Cairo</title>
            </Head>

            <VStack>
                <Box>
                    <VStack spacing={0}>
                        <Heading as='h1' size='2xl'>
                            Makin&#39; Waves in Cairo
                        </Heading>
                        <Text fontSize='18px'>with two-source wave interference patterns</Text>
                        <Box padding={4}>
                            <HStack fontSize='12px' spacing={6}>
                                <a
                                    target='_blank'
                                    href={contractLink}
                                    rel="noreferrer">Starknet contract
                                </a>
                                <a
                                    target='_blank'
                                    href='https://github.com/whatthedev-eth/two-source-app'
                                    rel="noreferrer">Github for app
                                </a>
                                <a
                                    target='_blank'
                                    href='https://github.com/whatthedev-eth/two-source-interference'
                                    rel="noreferrer">Github for contract
                                </a>
                            </HStack>


                        </Box>
                    </VStack>
                    <Center>

                    </Center>
                </Box>

                <IntensityArrayValues />

            </VStack>
        </Box>
    );
};

export default Home;