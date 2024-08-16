const express = require("express");
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const bodyParser = require('body-parser');
const { ethers } = require("ethers");
const app = express();
const port = 4000;
const cors = require('cors');
const ChirpingContractABI = require("./ChirpingContractABI.json")

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjJmYzdmMWM0LWVmMTQtNGZhNS1hN2U1LTU5MTg5ZmFlYjFjYyIsIm9yZ0lkIjoiMzg0MjkxIiwidXNlcklkIjoiMzk0ODU5IiwidHlwZSI6IlBST0pFQ1QiLCJ0eXBlSWQiOiIxOWJmZTY3Ni0wNGE5LTQyYTUtYmEzOS00MWM5OTlhOWJlNTQiLCJpYXQiOjE3MjM0NDQwMDMsImV4cCI6NDg3OTIwNDAwM30.yBI0iiFcVEqcZGJtgpdiV41c3d0-YJrTJHv-KarSOnY";
const address = "0x0ae6352e1C411aE52B64e9F702244eC9bF6e44Ac";
const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
const privateKey = "f46e7f0936b479bba879c9f764259d1e5838aa015232f0018a1c07214e491812";
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(address, ChirpingContractABI, wallet);

app.post("/webhook", async (req, res) => {
    const { body } = req;

    try {
        console.log("Received webhook data:", body);
        res.status(200).json({ message: "Webhook received" });
    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(400).json({ error: error.message });
    }
});


app.post('/addChirping', async (req, res) => {
    try {
        const { numOfCharacters, chirpingText, chirpingImage, userAddress } = req.body;
        const options = {
            address: address,
            functionName: 'addChirping',
            abi: ChirpingContractABI,
            chain: EvmChain.BSC_TESTNET,
            params: {
                _numOfCharacters: numOfCharacters,
                _chirpingText: chirpingText,
                _chirpingImage: chirpingImage
            },
        };
        const transaction = await Moralis.EvmApi.utils.runContractFunction(options);
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/addUser', async (req, res) => {
    try {
        const { userAddress, displayPicture } = req.body;

        // Validate input
        if (!userAddress || !displayPicture) {
            return res.status(400).json({ error: 'userAddress and displayPicture are required' });
        }

        // Send the transaction
        const tx = await contract.addUser(userAddress, displayPicture);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        // Return the transaction receipt to the client
        res.json({ success: true, receipt });
    } catch (error) {
        console.error('Error in /addUser:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/getAllChirpings', async (req, res) => {
    try {
        const options = {
            address: address,
            functionName: 'getAllChirpings',
            abi: ChirpingContractABI,
            chain: EvmChain.BSC_TESTNET,
        };
        const chirpings = await Moralis.EvmApi.utils.runContractFunction(options);
        res.json(chirpings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/getMyChirpings', async (req, res) => {
    try {
        const { userAddress } = req.query;
        const options = {
            address: address,
            functionName: 'getMyChirpings',
            abi: ChirpingContractABI,
            chain: EvmChain.BSC_TESTNET,
            params: {
                user: userAddress
            },
        };
        const chirpings = await Moralis.EvmApi.utils.runContractFunction(options);
        res.json(chirpings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/getCagedChirpings', async (req, res) => {
    try {
        const { userAddress } = req.query;
        const options = {
            address: address,
            functionName: 'getCagedChirpings',
            abi: ChirpingContractABI,
            chain: EvmChain.BSC_TESTNET,
            params: {
                user: userAddress
            },
        };
        const chirpings = await Moralis.EvmApi.utils.runContractFunction(options);
        res.json(chirpings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/givingWings', async (req, res) => {
    try {
        const { chirpingId } = req.body;
        const options = {
            address: address,
            functionName: 'givingWings',
            abi: ChirpingContractABI,
            chain: EvmChain.BSC_TESTNET,
            params: {
                _chirpingId: chirpingId
            },
        };
        const transaction = await Moralis.EvmApi.utils.runContractFunction(options);
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/givingCage', async (req, res) => {
    try {
        const { chirpingId } = req.body;
        const options = {
            address: address,
            functionName: 'givingCage',
            abi: ChirpingContractABI,
            chain: EvmChain.BSC_TESTNET,
            params: {
                _chirpingId: chirpingId
            },
        };
        const transaction = await Moralis.EvmApi.utils.runContractFunction(options);
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/showUsers', async (req, res) => {
    try {
        const options = {
            address: address,
            functionName: 'showUsers',
            abi: ChirpingContractABI,
            chain: EvmChain.BSC_TESTNET,
        };
        const users = await Moralis.EvmApi.utils.runContractFunction(options);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/showCurrUser', async (req, res) => {
    try {
        const { userAddress } = req.query;
        const options = {
            address: address,
            functionName: 'showCurrUser',
            abi: ChirpingContractABI,
            chain: EvmChain.BSC_TESTNET,
            params: {
                user: userAddress
            },
        };
        const user = await Moralis.EvmApi.utils.runContractFunction(options);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/promoteLevel', async (req, res) => {
    try {
        const options = {
            address: address,
            functionName: 'promoteLevel',
            abi: ChirpingContractABI,
            chain: EvmChain.BSC_TESTNET,
        };
        const transaction = await Moralis.EvmApi.utils.runContractFunction(options);
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/wingsGivenCheck', async (req, res) => {
    try {
        const { chirpingId, userAddress } = req.body;
        const options = {
            address: address,
            functionName: 'wingsGivenCheck',
            abi: ChirpingContractABI,
            chain: EvmChain.BSC_TESTNET,
            params: {
                _chirpingId: chirpingId,
                _user: userAddress
            },
        };
        const result = await Moralis.EvmApi.utils.runContractFunction(options);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/cagesGivenCheck', async (req, res) => {
    try {
        const { chirpingId, userAddress } = req.body;
        const options = {
            address: address,
            functionName: 'cagesGivenCheck',
            abi: ChirpingContractABI,
            chain: EvmChain.BSC_TESTNET,
            params: {
                _chirpingId: chirpingId,
                _user: userAddress
            },
        };
        const result = await Moralis.EvmApi.utils.runContractFunction(options);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/addName', async (req, res) => {
    try {
        const { userName } = req.body;
        const options = {
            address: address,
            functionName: 'addName',
            abi: ChirpingContractABI,
            chain: EvmChain.BSC_TESTNET,
            params: {
                _name: userName
            },
        };
        const transaction = await Moralis.EvmApi.utils.runContractFunction(options);
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/changeDisplayPicture', async (req, res) => {
    try {
        const { imageURL } = req.body;
        const options = {
            address: address,
            functionName: 'changeDisplayPicture',
            abi: ChirpingContractABI,
            chain: EvmChain.BSC_TESTNET,
            params: {
                _imageURL: imageURL
            },
        };
        const transaction = await Moralis.EvmApi.utils.runContractFunction(options);
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.get("/balances", async (req, res) => {
    try {
        const [nativeBalance, tokenBalances] = await Promise.all([
            Moralis.EvmApi.balance.getNativeBalance({
                chain: EvmChain.BSC_TESTNET,
                address,
            }),
            Moralis.EvmApi.token.getWalletTokenBalances({
                chain: EvmChain.BSC_TESTNET,
                address,
            }),
        ]);

        res.status(200).json({
            address,
            nativeBalance: nativeBalance.result.balance.ether,
            tokenBalances: tokenBalances.result.map((token) => token.display()),
        });
    } catch (error) {
        console.error("Error fetching balances:", error);
        res.status(500).json({ error: error.message });
    }
});

const startServer = async () => {
    await Moralis.start({
        apiKey: MORALIS_API_KEY,
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
};

startServer();
