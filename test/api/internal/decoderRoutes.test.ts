import request from 'supertest'
import app from "../../../src/app";

const transactionNotDecodable = {
    value: "0x00",
    input: "0x54de19e200000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001e1957c9a1cbee056bfabac391fa3aa7a709a85c3604fb84242d4624a8e98e7ba",
    to: "0x448A4D98a8447812D3d55c854E2916241A04c2f8"
}

const transactionNotDecodableAbi = [{"inputs":[{"internalType":"address","name":"_logic","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"stateMutability":"payable","type":"receive"}]

const transactionWithLog = {
    input: "0x2e1a7d4d000000000000000000000000000000000000000000000000007493748ad2e7e2",
    value: "0x00",
    to: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    logs: [
        {
            "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            "topics": [
                "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
                "0x000000000000000000000000823fd49d0874ec707c3d8be04cacabc3e91f94c1",
                "0x0000000000000000000000001e0049783f008a0085193e00003d00cd54003c71"
            ],
            "data": "0x00000000000000000000000000000000000000000000000010a741a462780000"
        }
    ]
}

const transactionWithLogAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]

const transactionWithError = {
  to: "0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30",
  error: {
    data: '0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002645524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e63650000000000000000000000000000000000000000000000000000'
  },
}

const transactionWithErrorAbi = [{"inputs":[{"internalType":"address","name":"custodian","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]

const decodedTransactionWithLog = {
  transaction: {
    args: [{
      hex: "0x7493748ad2e7e2",
      type: "BigNumber",
    }],
    functionFragment: {
      type: 'function',
      name: 'withdraw',
      constant: false,
      inputs: [{
        "_isParamType": true,
        "arrayChildren": null,
        "arrayLength": null,
        "baseType": "uint256",
        "components": null,
        "indexed": null,
        "name": "wad",
        "type": "uint256"
      }],
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      gas: null,
      _isFragment: true,
    },
    name: 'withdraw',
    signature: 'withdraw(uint256)',
    sighash: '0x2e1a7d4d',
    value: { hex: '0x00', type: "BigNumber" }
  },
  logs: [
    {
      eventFragment: {
        name: 'Approval',
        anonymous: false,
        inputs: [{
          name: 'src',
          type: 'address',
          indexed: true,
          components: null,
          arrayLength: null,
          arrayChildren: null,
          baseType: 'address',
          _isParamType: true
        },{
          name: 'guy',
          type: 'address',
          indexed: true,
          components: null,
          arrayLength: null,
          arrayChildren: null,
          baseType: 'address',
          _isParamType: true
        },{
          name: 'wad',
          type: 'uint256',
          indexed: false,
          components: null,
          arrayLength: null,
          arrayChildren: null,
          baseType: 'uint256',
          _isParamType: true
        }],
        type: 'event',
        _isFragment: true
      },
      name: 'Approval',
      signature: 'Approval(address,address,uint256)',
      topic: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
      args: [
        '0x823fd49D0874ec707C3D8be04CAcAbC3e91F94c1',
        '0x1E0049783F008A0085193E00003D00cd54003c71',
        { hex: '0x10a741a462780000', type: "BigNumber" }
      ],
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
    }
  ],
}

const decodedTransactionWithError = {
  error: {
    args: [],
    errorFragment: null,
    name: "ERC20: transfer amount exceeds balance",
    sighash: "",
    "signature": "ERC20: transfer amount exceeds balance",
  }
}

describe('internal Endpoint', () => {

    it('Should return 401', (done) => {
        request(app)
            .post('/api/internal/transaction/decode')
            .expect(401)
            .end(done);
    });

    it('Should return 200 - unable to decode transaction', (done) => {
        request(app)
            .post('/api/internal/transaction/decode')
            .send({abis: {[transactionNotDecodable.to]: {contractAbi: transactionNotDecodableAbi}}, transaction: transactionNotDecodable})
            .auth(process.env.BASIC_AUTH_INTERNAL_USERNAME, process.env.BASIC_AUTH_INTERNAL_PASSWORD)
            .expect(500)
            .expect((res: any) => {
                expect(res.body).toEqual({error: 'Failed to decode transaction'})
            })
            .end(done);
    });

    it('Should return 200 - with logs', (done) => {
        request(app)
            .post('/api/internal/transaction/decode')
            .send({abis: {[transactionWithLog.to]: {contractAbi: transactionWithLogAbi}}, transaction: transactionWithLog})
            .auth(process.env.BASIC_AUTH_INTERNAL_USERNAME, process.env.BASIC_AUTH_INTERNAL_PASSWORD)
            .expect(200)
            .expect((res: any) => {
                expect(res.body).toEqual(decodedTransactionWithLog)
            })
            .end(done);
    });

    it('Should return 200 - with error', (done) => {
      request(app)
          .post('/api/internal/transaction/decode')
          .send({abis: {[transactionWithError.to]: {contractAbi: transactionWithErrorAbi}}, transaction: transactionWithError})
          .auth(process.env.BASIC_AUTH_INTERNAL_USERNAME, process.env.BASIC_AUTH_INTERNAL_PASSWORD)
          .expect(200)
          .expect((res: any) => {
              expect(res.body).toEqual(decodedTransactionWithError)
          })
          .end(done);
  });

    it('Should return 400 - missing to', (done) => {
        const txClone = Object.assign({}, transactionNotDecodable)
        delete txClone.to
        request(app)
            .post('/api/internal/transaction/decode')
            .send({abis: {[transactionNotDecodable.to]: {contractAbi: transactionNotDecodableAbi}}, transaction: txClone})
            .auth(process.env.BASIC_AUTH_INTERNAL_USERNAME, process.env.BASIC_AUTH_INTERNAL_PASSWORD)
            .expect(400)
            .expect((res: any) => {
                expect(res.text).toBe("{\"error\":\"\\\"transaction.to\\\" is required\"}")
            })
            .end(done);
    });
})
