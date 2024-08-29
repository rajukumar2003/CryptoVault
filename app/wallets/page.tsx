'use client'

import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { useEffect, useState } from "react";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { toast } from "sonner";
import { Eye, EyeOff, Trash2, Copy } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { useSearchParams } from "next/navigation";
import { ethers } from "ethers";


interface Wallet {
    publicKey: string;
    privateKey: string;
    mnemonics: string;
}

export default function CreateWallet() {
    const [mnemonicsWords, setMnemonicsWords] = useState<string[]>(Array(12).fill(""));
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [showKeys, setShowKeys] = useState<{ [key: number]: boolean }>({});
    const searchParams = useSearchParams();
    const [coinType, setCoinType] = useState<number | null>(null);

    useEffect(() => {
        const solana = searchParams.get('solana');
        if (solana) {
            setCoinType(501);
        }
        const ethereum = searchParams.get('ethereum');
        if (ethereum) {
            setCoinType(60);
        }
        else {
            setCoinType(501);
        }
    }, []);


    const generateWallet = (mnemonics: string, accountNumber: number): Wallet | null => {
        console.log('path', coinType);
        try {
            const seed = mnemonicToSeedSync(mnemonics);
            const path = `m/44'/${coinType}'/0'/${accountNumber}'`; // BIP44 path
            const derivedSeed = derivePath(path, seed.toString("hex")).key;

            let publicKey: string;
            let privateKey: string;

            // solana
            if (coinType === 501) {
                const secretKey = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
                const keypair = Keypair.fromSecretKey(secretKey);
                publicKey = keypair.publicKey.toBase58();
                privateKey = bs58.encode(secretKey);
            }

            // ethereum
            else if (coinType === 60) {
                const bufferPrivateKey = Buffer.from(derivedSeed).toString("hex");
                privateKey = bufferPrivateKey;
                const wallet = new ethers.Wallet(bufferPrivateKey);
                publicKey = wallet.address;
            }
            else {
                toast.error("Path not supported");
                return null;
            }

            return {
                publicKey: publicKey,
                privateKey: privateKey,
                mnemonics,
            };
        } catch (error) {
            toast.error("Error generating wallet, please try again");
            return null;
        }
    };

    const handleGenerateWallet = () => {
        const mnemonics = generateMnemonic();
        setMnemonicsWords(mnemonics.split(" "));
        const wallet = generateWallet(mnemonics, wallets.length);

        if (wallet) {
            setWallets([...wallets, wallet]);
            toast.success("Wallet generated successfully");
        }
    };

    const handleAddWallet = () => {
        if (!mnemonicsWords) {
            toast.error("Please generate wallet first");
            return;
        }
        const wallet = generateWallet(mnemonicsWords.join(" "), wallets.length);
        if (wallet) {
            setWallets([...wallets, wallet]);
            toast.success("Wallet added successfully");
        }
    };

    const handleDeleteWallet = (index: number) => {
        const updatedWallet = wallets.filter((_, i) => i !== index);
        setWallets(updatedWallet);
        if (updatedWallet.length === 0) { 
            setMnemonicsWords(Array(12).fill(""));  //clear mnemonics
            toast.success("All wallets deleted, mnemonics cleared");
        }
        else {
            toast.success("Wallet deleted successfully");
        }
    };

    const toggleShowKeys = (index: number) => {
        setShowKeys((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f6f2ff] to-[#f6f2ff] text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center text-[#3c315b]">
                    Generate Your {coinType === 501 ? "Solana" : "Ethereum"} Wallet Now
                </h1>

                <div className="flex justify-center mb-8">
                    {mnemonicsWords.some(word => word !== "") ? (
                        <Button
                            className="bg-[#ab9ff2] text-[#222222] font-bold py-3 px-6 rounded-full"
                            onClick={handleAddWallet}
                        >
                            Add Wallet
                        </Button>
                    ) : (
                        <Button
                            className="bg-white text-[#222222] font-bold py-3 px-6 rounded-full"
                            onClick={handleGenerateWallet}
                        >
                            Generate Wallet
                        </Button>
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

                <div className="space-y-8">
                    {wallets.map((wallet, index) => (
                        <Card key={index} className="bg-black border-black shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-purple-400 flex justify-between items-center">
                                    <span>Wallet {index + 1}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteWallet(index)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-400/20"
                                    >
                                        <Trash2 size={20} />
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm text-purple-300 mb-1 block">Public Key:</label>
                                    <div className="flex items-center">
                                        <Input
                                            value={wallet.publicKey}
                                            readOnly
                                            className="bg-slate-700 border-slate-600 text-white"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => copyToClipboard(wallet.publicKey)}
                                            className="ml-2 text-purple-400 hover:text-purple-300 hover:bg-purple-400/20"
                                        >
                                            <Copy size={16} />
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-purple-300 mb-1 block">Private Key:</label>
                                    <div className="flex items-center">
                                        <Input
                                            type={showKeys[index] ? "text" : "password"}
                                            value={wallet.privateKey}
                                            readOnly
                                            className="bg-slate-700 border-slate-600 text-white"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => toggleShowKeys(index)}
                                            className="ml-2 text-purple-400 hover:text-purple-300 hover:bg-purple-400/20"
                                        >
                                            {showKeys[index] ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => copyToClipboard(wallet.privateKey)}
                                            className="ml-2 text-purple-400 hover:text-purple-300 hover:bg-purple-400/20"
                                        >
                                            <Copy size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
