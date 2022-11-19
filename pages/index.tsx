import { Box, Center, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";

import IntensityArrayValues from "../components/IntensityArray";
import LinksList from "../components/Links";

const Home: NextPage = () => {

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

                    </VStack>
                </Box>
                <IntensityArrayValues />
                <LinksList />
            </VStack>
        </Box>
    );
};

export default Home;