import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from 'ethereum-multicall';
import Web3 from 'web3';

import * as ABI from './erc20.json'

const web3 = new Web3('https://rpc.ankr.com/scroll');

const multicall = new Multicall({ web3Instance: web3, tryAggregate: true, multicallCustomContractAddress: '0xcA11bde05977b3631167028862bE2a173976CA11' });

const userAddr = '0xb38A90f14b24ae81Ec0B8f1373694f5B59811D8A';
const WETH = '0x5300000000000000000000000000000000000004';
const USDT = '0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df';
const DAI = '0xcA77eB3fEFe3725Dc33bccB54eDEFc3D9f764f97';
const WBTC = '0x3C1BCa5a656e69edCD0D4E36BEbb3FcDAcA60Cf1';

const contractCallContext: ContractCallContext[] = [
  {
    reference: 'WETH',
    contractAddress: WETH,
    abi: ABI,
    calls: [{ reference: 'WETH', methodName: 'balanceOf(address)', methodParameters: [userAddr] }]
  },
  {
    reference: 'USDT',
    contractAddress: USDT,
    abi: ABI,
    calls: [{ reference: 'USDT', methodName: 'balanceOf(address)', methodParameters: [userAddr] }]
  },
  {
    reference: 'DAI',
    contractAddress: DAI,
    abi: ABI,
    calls: [{ reference: 'DAI', methodName: 'balanceOf(address)', methodParameters: [userAddr] }]
  },
  {
    reference: 'WBTC',
    contractAddress: WBTC,
    abi: ABI,
    calls: [{ reference: 'WBTC', methodName: 'balanceOf(address)', methodParameters: [userAddr] }]
  }
];

async function executeMulticall() {
  try {
    const results: ContractCallResults = await multicall.call(contractCallContext);
    console.log(parseInt(results.results.WETH.callsReturnContext[0].returnValues[0].hex, 16) / 1e18);
    console.log(parseInt(results.results.USDT.callsReturnContext[0].returnValues[0].hex, 16) / 1e6);
    console.log(parseInt(results.results.DAI.callsReturnContext[0].returnValues[0].hex, 16) / 1e18);
    console.log(parseInt(results.results.WBTC.callsReturnContext[0].returnValues[0].hex, 16) / 1e8);
  } catch (error) {
    console.error(error);
  }
}

executeMulticall();

// results:
// {
//   results: {
//     testContract: {
//       originalContractCallContext: {
//         reference: 'testContract',
//           contractAddress: '0x6795b15f3b16Cf8fB3E56499bbC07F6261e9b0C3',
//             abi: [{ name: 'foo', type: 'function', inputs: [{ name: 'example', type: 'uint256' }], outputs: [{ name: 'amounts', type: 'uint256' }] }],
//               calls: [{ reference: 'fooCall', methodName: 'foo', methodParameters: [42] }]
//       },
//       callsReturnContext: [{
//         returnValues: [{ amounts: BigNumber }],
//         decoded: true,
//         reference: 'fooCall',
//         methodName: 'foo',
//         methodParameters: [42],
//         success: true
//       }]
//     },
//     testContract2: {
//       originalContractCallContext: {
//         reference: 'testContract2',
//           contractAddress: '0x66BF8e2E890eA0392e158e77C6381b34E0771318',
//             abi: [{ name: 'fooTwo', type: 'function', inputs: [{ name: 'example', type: 'uint256' }], outputs: [{ name: 'amounts', type: 'uint256[]' ] }],
//               calls: [{ reference: 'fooTwoCall', methodName: 'fooTwo', methodParameters: [42] }]
//       },
//       callsReturnContext: [{
//         returnValues: [{ amounts: [BigNumber, BigNumber, BigNumber] }],
//         decoded: true,
//         reference: 'fooCall',
//         methodName: 'foo',
//         methodParameters: [42],
//         success: true
//       }]
//     }
//   },
//   blockNumber: 10994677
// }