"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { formatEther, parseEther } from "viem";
import { valoraWallet } from "@rainbow-me/rainbowkit/wallets";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const { data: precioTokenA } = useScaffoldReadContract({
    contractName: "SimpleDEX",
    functionName: "getPrice",
    args: ["0xfeb1a0bFaD2D54587D9AC52bd75798170509E9eF"], 
  });

  const { data: precioTokenB } = useScaffoldReadContract({
    contractName: "SimpleDEX",
    functionName: "getPrice",
    args: ["0x55Cf144895cA45ff0E3a8F3F1708DabA78Db786c"], 
  });

  const { writeContractAsync: writeSimpleDEXAsync } = useScaffoldWriteContract("SimpleDEX");

  return (
    <>

    <div>Precio Token A: {precioTokenA}</div>
    <br />
    <div>Precio Token A: {precioTokenB}</div>
      
      <input 
        type="text"
        className="input input-bordered w-full max-w-xs"
        placeholder="Cantidad"
        value={valor}
        onChange={(e) => setValor(e.target.value)} />

      
      <button
      className="btn btn-primary"
      onClick={async () => {
        try {
          await writeSimpleDEXAsync({
            functionName: "addLiquidity",
            args: [undefined, undefined],
            value: parseEther("1"), //convierte de ether a wei
          });
        } catch (e) {
          console.error("Error adding liquidity", e);
        }
      }}
    >
      Agregar Liquidez
    </button>
      
      
        </>
  );
};

export default Home;
