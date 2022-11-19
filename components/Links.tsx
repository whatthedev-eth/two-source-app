import { Box, HStack } from "@chakra-ui/react";
import { contractLink, githubContractLink, githubAppLink } from "../lib/constant";

export default function LinksList() {

    return (
        <Box padding={4}>
            <HStack fontSize="sm" spacing={12}>
                <a
                    target='_blank'
                    href={contractLink}
                    rel="noreferrer">Starknet contract
                </a>
                <a
                    target='_blank'
                    href={githubContractLink}
                    rel="noreferrer">Github - contract
                </a>
                <a
                    target='_blank'
                    href={githubAppLink}
                    rel="noreferrer">Github - app
                </a>
            </HStack>
        </Box>

    );
};