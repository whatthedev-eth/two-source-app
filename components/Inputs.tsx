import {
    background,
    Box,
    Button,
    Center,
    Heading,
    HStack,
    NumberInput,
    NumberInputField,
    StackDivider,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useContract, useStarknetCall } from "@starknet-react/core";
import { Abi } from "starknet";

import React, { useState } from "react";

import { BigNumber } from 'bignumber.js';
import intensityPlotAbi from '../lib/intensity_plot_abi.json';
import { intensityPlotAddress } from "../lib/constant";
import { Loader } from "./Loader";
// import { Colorscale } from 'react-colorscales';
// import ColorscalePicker from 'react-colorscales';

export default function Inputs() {

    const SCALE_FP = new BigNumber(10 ** 20)

    // Initialize inputs, and create function `set*` to update value of `*`
    const [num_pts, setnum_pts] = useState<string>('3');
    const [lambda, setlambda] = useState<string>('44');
    const [d, setd] = useState<string>('555');

    const { contract } = useContract({
        abi: intensityPlotAbi as Abi,
        address: intensityPlotAddress,
    });

    const { data, loading, error } = useStarknetCall({
        contract,
        method: "intensity_plot_arr",
        args: [num_pts, lambda, d]
    });

    console.log(">data:", data)

    const num_pts_number = Number(num_pts)
    const plot_size = 400
    const columnWidth = plot_size / num_pts_number
    const rowHeight = plot_size / num_pts_number

    // Create 1d array of intensity values (=intensity_fp/SCALE_FP), length num_pts^2
    const intensity_parsed = data ? data[0].map((x, _) => {
        let parsed_bn = new BigNumber(x).dividedBy(SCALE_FP)
        return parsed_bn.toNumber()
    }) : []
    console.log('>intensity_parsed:', intensity_parsed)

    // Convert to 2d array, num_pts x num_pts
    let intensity_parsed_2d = []
    while (intensity_parsed.length) intensity_parsed_2d.push(intensity_parsed.splice(0, num_pts_number));
    console.log('>intensity_parsed_2d:', intensity_parsed_2d)

    function computeBgColor(x, y) {
        if (!data) return '#FFFFFF' // all white cells when loading data from starknet

        // get data to be rendered at x,y
        const intensity: number = intensity_parsed_2d[x][y]

        // normalize intensity to [0,1] based on [MIN,MAX]=[0,4.0], with capping
        const MIN = 0
        const MAX = 4 // MAX intensity = (max total amplitude)^2 = (1+1)^2 
        let intensity_norm = intensity < MIN ? 0 : intensity > MAX ? 1 : (intensity - MIN) / (MAX - MIN)

        // interpolate to find hex value for each color channel
        // note: for simplicity we use gray scale - using the same value for all channels
        // Math.trunc returns integer part of the number
        const r_lo = 0
        const r_hi = 128
        const r_channel = Math.trunc((r_hi - r_lo) * intensity_norm + r_lo)

        const g_lo = 0
        const g_hi = 255
        const g_channel = Math.trunc((g_hi - g_lo) * intensity_norm + g_lo)

        const b_lo = 128
        const b_hi = 128
        const b_channel = Math.trunc((b_hi - b_lo) * intensity_norm + b_lo)

        const color_str = `rgb(${r_channel},${g_channel},${b_channel})`

        return color_str
    }
    const alternativePlot = () => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {
                Array.from({ length: num_pts_number }).map((_, y) => ( // i is y
                    <div key={`row-${y}`} style={{ display: 'flex', flexDirection: 'row', marginBottom: '0px' }}>
                        {
                            Array.from({ length: num_pts_number }).map((_, x) => (
                                <div key={`column-${x}`} style={{
                                    marginRight: '0px',
                                    width: columnWidth, height: rowHeight, textAlign: 'center', lineHeight: '10px',
                                    backgroundColor: computeBgColor(x, y)
                                }}>
                                    {/* {x.toString()},{y.toString()} */}
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    )

    return (
        <>
            <Box w="auto" mx="auto" p={8}>

                <VStack
                    spacing={4}
                    align='stretch'
                >
                    <Heading as='h2' size='lg'>
                        Inputs
                    </Heading>

                    <HStack
                        divider={<StackDivider borderColor='gray.200' />}
                        spacing={4}
                        align='stretch'
                    >
                        <VStack>
                            <Heading as='h3' size='md'>num_pts</Heading>
                            <NumberInput
                                value={num_pts}
                                onChange={setnum_pts}
                                min={2}
                                max={25}
                                precision={0}
                            >
                                <NumberInputField />
                            </NumberInput>
                            <Text> 2 &#60;&#61; num_pts &#60;&#61; 25 </Text>
                        </VStack>

                        <VStack>
                            <Heading as='h3' size='md'>lambda</Heading>
                            <NumberInput
                                value={lambda}
                                onChange={setlambda}
                                min={1}
                                precision={0}
                            >
                                <NumberInputField />
                            </NumberInput>
                            <Text> lambda &#62;&#61; 1 </Text>
                        </VStack>

                        <VStack>
                            <Heading as='h3' size='md'>d</Heading>
                            <NumberInput
                                value={d}
                                onChange={setd}
                                min={0}
                                precision={0}
                            >
                                <NumberInputField />
                            </NumberInput>
                            <Text> d &#62;&#61; 0 </Text>
                        </VStack>

                    </HStack>

                </VStack>

            </Box>
        </>
    );
}
