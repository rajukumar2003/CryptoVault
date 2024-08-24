import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

const mnemonic = generateMnemonic();
const seed = mnemonicToSeedSync(mnemonic);

console.log('memorable phrase:', mnemonic);


for (let i = 0; i < 1; i++) {
    const path = `m/44'/501'/${i}'/0'`; // This is the derivation path - 501-solana wallets

    // const hdkey = require('ethereumjs-wallet/hdkey');
    // const hdwallet = hdkey.fromMasterSeed(seed);
    // const wallet = hdwallet.derivePath(path).getWallet();
    // const address = `0x${wallet.getAddress().toString('hex')}`;

    const derivedSeed = derivePath(path, seed.toString("hex")).key;

    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;

    const keypair = Keypair.fromSecretKey(secret);
    const publicKey = keypair.publicKey.toBase58();

    const privateKey = bs58.encode(secret);

    console.log('publicKey:', publicKey);
    console.log('privateKey:', privateKey);
}

