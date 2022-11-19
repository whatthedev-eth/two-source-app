import {
    Box,
    Button,
    Center,
    Heading,
    HStack,
    NumberInput,
    NumberInputField,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
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
import { intensityPlotAddress, plot_size, num_pts_0, lambda_0, d_0, r_lo_0, g_lo_0, b_lo_0, r_hi_0, g_hi_0, b_hi_0 } from "../lib/constant";
import { Loader } from "./Loader";
// import { CheckInputSizes } from "./CheckInputs";
// import SetSliders from "./Sliders";

export default function IntensityArrayValues() {

    const SCALE_FP = new BigNumber(10 ** 20)

    // Create function `set*` to update value of `*`; initialize values
    const [num_pts, setnum_pts] = useState<string>(num_pts_0);
    const [lambda, setlambda] = useState<string>(lambda_0);
    const [d, setd] = useState<string>(d_0);

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
    const lambda_number = Number(lambda)
    const d_number = Number(d)
    // const InputParams = [
    //     {
    //         num_pts_number: num_pts_number,
    //         lambda_number: lambda_number,
    //         d_number: d_number,
    //     },
    // ]

    const columnWidth = plot_size / num_pts_number
    const rowHeight = plot_size / num_pts_number

    // Create 1d array of intensity values (=intensity_fp/SCALE_FP), length num_pts^2
    const intensity_parsed = data ? data[0].map((x: BigNumber.Value, _: any) => {
        let parsed_bn = new BigNumber(x).dividedBy(SCALE_FP)
        return parsed_bn.toNumber()
    }) : []
    console.log('>intensity_parsed:', intensity_parsed)

    // Convert to 2d array, num_pts x num_pts
    let intensity_parsed_2d: any[] = []
    while (intensity_parsed.length) intensity_parsed_2d.push(intensity_parsed.splice(0, num_pts_number));
    console.log('>intensity_parsed_2d:', intensity_parsed_2d)

    // Initialize plot colors
    // Color channels for LOWEST intensity
    const [r_lo, setr_lo] = useState<number>(r_lo_0);
    const [g_lo, setg_lo] = useState<number>(g_lo_0);
    const [b_lo, setb_lo] = useState<number>(b_lo_0);
    // Color channels for HIGHEST intensity
    const [r_hi, setr_hi] = useState<number>(r_hi_0);
    const [g_hi, setg_hi] = useState<number>(g_hi_0);
    const [b_hi, setb_hi] = useState<number>(b_hi_0);

    // function resetColors() {
    //     // <SetSliders />
    //     setr_lo(r_lo_0);
    //     setg_lo(g_lo_0);
    //     setb_lo(b_lo_0);
    //     setr_hi(r_hi_0);
    //     setg_hi(g_hi_0);
    //     setb_hi(b_hi_0);
    //     return
    // }

    function computeBgColor(x: number, y: number) {
        if (!data) return '#FFFFFF' // All white cells when loading data from starknet

        // Get data to be rendered at x,y
        const intensity: number = intensity_parsed_2d[x][y]

        // Normalize intensity to [0,1] based on [MIN,MAX]=[0,4.0], with capping
        const MIN = 0
        const MAX = 4 // Max intensity = (max total amplitude)^2 = (1+1)^2 
        let intensity_norm = intensity < MIN ? 0 : intensity > MAX ? 1 : (intensity - MIN) / (MAX - MIN)

        // Interpolate linearly to find hex value for each color channel
        const r_channel = Math.trunc((r_hi - r_lo) * intensity_norm + r_lo)
        const g_channel = Math.trunc((g_hi - g_lo) * intensity_norm + g_lo)
        const b_channel = Math.trunc((b_hi - b_lo) * intensity_norm + b_lo)

        const color_str = `rgb(${r_channel},${g_channel},${b_channel})`

        return color_str
    }

    const intensityPlot = () => (
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
                                    {/* To see cell indices, uncomment below */}
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
        <Box w="auto" mx="auto" p={4}>
            <VStack
                spacing={4}
                align='auto'
            >
                <Heading as='h2' size='lg'>
                    Input integers
                </Heading>

                <HStack divider={<StackDivider borderColor='gray.200' />} spacing={4} align='auto'>
                    <VStack>
                        <Heading size='sm'>num_pts</Heading>
                        <NumberInput value={num_pts} onChange={setnum_pts} min={2} max={25} precision={0} clampValueOnBlur={false} >
                            <NumberInputField />
                        </NumberInput>
                        <Text fontSize='sm'> 2 &#60;&#61; num_pts &#60;&#61; 25 </Text>
                    </VStack>
                    <VStack>
                        <Heading size='sm'>lambda</Heading>
                        <NumberInput value={lambda} onChange={setlambda} min={1} precision={0} clampValueOnBlur={false} >
                            <NumberInputField />
                        </NumberInput>
                        <Text fontSize='sm'> lambda &#62;&#61; 1 </Text>
                    </VStack>
                    <VStack>
                        <Heading size='sm'>d</Heading>
                        <NumberInput value={d} onChange={setd} min={0} precision={0} clampValueOnBlur={false} >
                            <NumberInputField />
                        </NumberInput>
                        <Text fontSize='sm'> d &#62;&#61; 0 </Text>
                    </VStack>
                </HStack>
                <Text fontSize='sm' textAlign='center'>(For scale: plot side length = 1000)</Text>
            </VStack>
            <Box p={4}>
                {/* <CheckInputSizes InputParams={InputParams}/> */}

                {/* Check input sizes */}
                {num_pts_number < 2 &&
                    <Text color='red'>
                        Check that your inputs are in the given allowable ranges.
                    </Text>
                }
                {num_pts_number > 25 &&
                    <Text color='red'>
                        Check that your inputs are in the given allowable ranges.
                    </Text>
                }
                {lambda_number < 1 &&
                    <Text color='red'>
                        Check that your inputs are in the given allowable ranges.
                    </Text>
                }
                {d_number < 0 &&
                    <Text color='red'>
                        Check that your inputs are in the given allowable ranges.
                    </Text>
                }
            </Box>
            <VStack
                spacing={4}
                align='auto'
            >
                <Heading as='h2' size='lg'>
                    Output
                </Heading>

                <Tabs
                    isFitted variant='enclosed'
                    defaultIndex={0}
                >
                    <TabList mb='1em'>
                        <Tab fontSize='sm' fontWeight='bold' >Intensity Plot</Tab>
                        <Tab fontSize='sm' fontWeight='bold' >Intensity Values</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <VStack spacing={4} align='auto'>

                                {/* Shows loading circle if waiting for Starknet call */}
                                <Loader isLoading={loading} error={error} data={data}>
                                    {(data) => data[0].map}
                                </Loader>
                                <Center>
                                    {intensityPlot()}
                                </Center>
                                <Box padding={2}></Box>
                                <Center>
                                    {/* <SetSliders /> */}
                                    <HStack spacing={12}>
                                        <VStack>
                                            <Text textAlign='left' fontSize='small'>Color for LOWEST intensity</Text>
                                            <Slider colorScheme='red' min={0} max={255} defaultValue={r_lo_0} onChange={(val) => setr_lo(val)}>
                                                <SliderTrack bg='red.100'>
                                                    <SliderFilledTrack />
                                                </SliderTrack>
                                                <SliderThumb boxSize={6} >
                                                    <Text textColor={'red'} height={7}>r</Text>
                                                </SliderThumb>
                                            </Slider>
                                            <Slider colorScheme='green' min={0} max={255} defaultValue={g_lo_0} onChange={(val) => setg_lo(val)}>
                                                <SliderTrack bg='green.100'>
                                                    <SliderFilledTrack />
                                                </SliderTrack>
                                                <SliderThumb boxSize={6} >
                                                    <Text textColor={'green'} height={7}>g</Text>
                                                </SliderThumb>
                                            </Slider>                                    <Slider colorScheme='blue' min={0} max={255} defaultValue={b_lo_0} onChange={(val) => setb_lo(val)}>
                                                <SliderTrack bg='blue.100'>
                                                    <SliderFilledTrack />
                                                </SliderTrack>
                                                <SliderThumb boxSize={6} >
                                                    <Text textColor={'blue'} height={7}>b</Text>
                                                </SliderThumb>
                                            </Slider>
                                        </VStack>

                                        <VStack>
                                            <Text textAlign='left' fontSize='small'>Color for HIGHEST intensity</Text>
                                            <Slider colorScheme='red' min={0} max={255} defaultValue={r_hi_0} onChange={(val) => setr_hi(val)}>
                                                <SliderTrack bg='red.100'>
                                                    <SliderFilledTrack />
                                                </SliderTrack>
                                                <SliderThumb boxSize={6} >
                                                    <Text textColor={'red'} height={7}>r</Text>
                                                </SliderThumb>
                                            </Slider>
                                            <Slider colorScheme='green' min={0} max={255} defaultValue={g_hi_0} onChange={(val) => setg_hi(val)}>
                                                <SliderTrack bg='green.100'>
                                                    <SliderFilledTrack />
                                                </SliderTrack>
                                                <SliderThumb boxSize={6} >
                                                    <Text textColor={'green'} height={7}>g</Text>
                                                </SliderThumb>
                                            </Slider>                                    <Slider colorScheme='blue' min={0} max={255} defaultValue={b_hi_0} onChange={(val) => setb_hi(val)}>
                                                <SliderTrack bg='blue.100'>
                                                    <SliderFilledTrack />
                                                </SliderTrack>
                                                <SliderThumb boxSize={6} >
                                                    <Text textColor={'blue'} height={7}>b</Text>
                                                </SliderThumb>
                                            </Slider>
                                        </VStack>
                                    </HStack>

                                </Center>
                                {/* <Center>
                                    <Button size='sm' width='24' fontSize='small' onClick={resetColors}>
                                        Reset colors
                                    </Button>
                                </Center> */}
                            </VStack>
                        </TabPanel>
                        <TabPanel>
                            {/* Shows loading circle if waiting for Starknet call */}
                            <Loader isLoading={loading} error={error} data={data}>
                                {(data) => data[0].map(
                                    (e: number, index: number) => {
                                        let parsed = new BigNumber(e).dividedBy(SCALE_FP);
                                        return <Center key={index}>
                                            <Box key={index}>
                                                {parsed.toString()}
                                            </Box>
                                        </Center>
                                    }
                                )}
                            </Loader>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </VStack>
        </Box>
    );
}


