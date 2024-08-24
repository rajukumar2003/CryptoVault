'use client'

import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { useState } from "react";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { toast } from "sonner";
import { Eye, EyeOff, Trash2 } from 'lucide-react';

interface Wallet {
    publicKey: string;
    privateKey: string;
    mnemonics: string;
}

export default function CreateWallet() {
    const [mnemonicsWords, setMnemonicsWords] = useState<string[]>(Array(12).fill(""));
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [showKeys, setShowKeys] = useState<{ [key: number]: boolean }>({});


    const generateWallet = (
        mnemonics: string,
        accountNumber: number
    ): Wallet | null => {
        try {
            const seed = mnemonicToSeedSync(mnemonics);

            const path = `m/44'/501'/0'/${accountNumber}'`;  // BIP44 for Solana

            const derivedSeed = derivePath(path, seed.toString("hex")).key;
            const secretKey = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;

            const keypair = Keypair.fromSecretKey(secretKey);

            const publicKey = keypair.publicKey.toBase58();
            const privateKey = bs58.encode(secretKey);

            return {
                publicKey,
                privateKey,
                mnemonics,
            }
        } catch (error) {
            toast.error("Error generating wallet, please try again");
            return null;
        }
    }


    const handleGenerateWallet = () => {
        const mnemonics = generateMnemonic();
        const mnemonicsWords = mnemonics.split(" ");
        setMnemonicsWords(mnemonicsWords);

        const wallet = generateWallet(
            mnemonics,
            wallets.length,
        );

        if (wallet) {
            const newWallets = [...wallets, wallet];
            setWallets(newWallets);
            toast.success("Wallet generated successfully");
        }
        console.log(wallets);
    }

    const handleAddWallet = () => {
        if (!mnemonicsWords) {
            toast.error("Please generate wallet first");
            return;
        }

        const wallet = generateWallet(
            mnemonicsWords.join(" "),
            wallets.length,
        );

        if (wallet) {
            const newWallets = [...wallets, wallet];
            setWallets(newWallets);
            toast.success("Wallet generated successfully");
        }
    }


    const handleDeleteWallet = (index: number) => {
        const newWallets = wallets.filter((_, i) => i !== index);
        setWallets(newWallets);
        toast.success("Wallet deleted successfully");
    }


    const toggleShowKeys = (index: number) => {
        setShowKeys(prev => ({ ...prev, [index]: !prev[index] }));
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#ab9ff2] to-[#ab9ff2] text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center text-[#222222]">Crypto Wallet Generator</h1>

                <div className="flex justify-center mb-8">
                    
                    {mnemonicsWords.some(word => word !== "") ? (
                        <button
                            className="bg-white hover:bg-white text-[#222222] font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 mr-4"
                            onClick={handleAddWallet}
                        >
                            Add Wallet
                        </button>
                    ) : (
                        <button
                            className="bg-white hover:bg-white text-[#222222] font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 mr-4"
                            onClick={handleGenerateWallet}
                        >
                            Generate Wallet
                        </button>
                    )}

                </div>

                {mnemonicsWords.some(word => word !== "") && (
                    <div className="bg-white rounded-lg p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Mnemonic Phrase</h2>
                        <div className="grid grid-cols-3 gap-4 group">
                            {mnemonicsWords.map((word, index) => (
                                <div
                                    key={index}
                                    className="bg-[#222222] p-3 rounded-md transition-all duration-300 ease-in-out blur-sm group-hover:blur-none"
                                >
                                    <span className="text-gray-400 mr-2">{index + 1}.</span>
                                    {word}
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-sm text-gray-400">Hover over the phrase to reveal</p>
                    </div>
                )}

                <div className="space-y-6">
                    {wallets.map((wallet, index) => (
                        <div key={index} className="bg-[#222222] rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">Wallet {index + 1}</h3>
                                <button
                                    onClick={() => handleDeleteWallet(index)}
                                    className="text-red-500 hover:text-red-400"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Public Key:</span>
                                    <span className="font-mono">{wallet.publicKey}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Private Key:</span>
                                    <div className="flex items-center">
                                        <span className="font-mono mr-2">
                                            {showKeys[index] ? wallet.privateKey : '••••••••••••••••••••'}
                                        </span>
                                        <button onClick={() => toggleShowKeys(index)}>
                                            {showKeys[index] ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}