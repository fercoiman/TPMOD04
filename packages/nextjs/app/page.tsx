"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { formatEther, parseEther } from "viem";
import { useState } from "react";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  // Leer precios de tokens
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

  // Escribir en el contrato
  const { writeContractAsync: writeSimpleDEXAsync } = useScaffoldWriteContract("SimpleDEX");

  // Estados para entradas del usuario
  const [liquidityAmount, setLiquidityAmount] = useState("");
  const [removeAmount, setRemoveAmount] = useState("");
  const [swapAmount, setSwapAmount] = useState("");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Interacción con SimpleDEX</h1>

      {/* Mostrar precios */}
      <div>
        <p>Precio Token A: {precioTokenA ? formatEther(precioTokenA) : "Cargando..."}</p>
        <p>Precio Token B: {precioTokenB ? formatEther(precioTokenB) : "Cargando..."}</p>
      </div>

      <hr className="my-6" />

      {/* Agregar Liquidez */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Agregar Liquidez</h2>
        <input
          type="text"
          className="input input-bordered w-full max-w-xs mb-2"
          placeholder="Cantidad"
          value={liquidityAmount}
          onChange={(e) => setLiquidityAmount(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={async () => {
            try {
              await writeSimpleDEXAsync({
                functionName: "addLiquidity",
                args: [],
                value: parseEther(liquidityAmount),
              });
            } catch (e) {
              console.error("Error agregando liquidez", e);
            }
          }}
        >
          Agregar Liquidez
        </button>
      </div>

      {/* Eliminar Liquidez */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Eliminar Liquidez</h2>
        <input
          type="text"
          className="input input-bordered w-full max-w-xs mb-2"
          placeholder="Cantidad"
          value={removeAmount}
          onChange={(e) => setRemoveAmount(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={async () => {
            try {
              await writeSimpleDEXAsync({
                functionName: "removeLiquidity",
                args: [parseEther(removeAmount)],
              });
            } catch (e) {
              console.error("Error eliminando liquidez", e);
            }
          }}
        >
          Eliminar Liquidez
        </button>
      </div>

      {/* Swap A por B */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Intercambiar Token A por B</h2>
        <input
          type="text"
          className="input input-bordered w-full max-w-xs mb-2"
          placeholder="Cantidad de Token A"
          value={swapAmount}
          onChange={(e) => setSwapAmount(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={async () => {
            try {
              await writeSimpleDEXAsync({
                functionName: "swapAforB",
                args: [parseEther(swapAmount)],
              });
            } catch (e) {
              console.error("Error intercambiando Token A por B", e);
            }
          }}
        >
          Intercambiar A por B
        </button>
      </div>

      {/* Swap B por A */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Intercambiar Token B por A</h2>
        <input
          type="text"
          className="input input-bordered w-full max-w-xs mb-2"
          placeholder="Cantidad de Token B"
          value={swapAmount}
          onChange={(e) => setSwapAmount(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={async () => {
            try {
              await writeSimpleDEXAsync({
                functionName: "swapBforA",
                args: [parseEther(swapAmount)],
              });
            } catch (e) {
              console.error("Error intercambiando Token B por A", e);
            }
          }}
        >
          Intercambiar B por A
        </button>
      </div>
    </div>
  );
};

export default Home;
