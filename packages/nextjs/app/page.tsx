"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  // Leer precios de tokens
  const { data: precioTokenA } = useScaffoldReadContract({
    contractName: "SimpleDEX",
    functionName: "getPrice",
    args: ["0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"],
  });

  const { data: precioTokenB } = useScaffoldReadContract({
    contractName: "SimpleDEX",
    functionName: "getPrice",
    args: ["0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"],
  });

  // Escribir en el contrato
  const { writeContractAsync: writeSimpleDEXAsync } = useScaffoldWriteContract("SimpleDEX");

  // Estados para entradas del usuario
  const [addAmountA, setAddAmountA] = useState("");
  const [addAmountB, setAddAmountB] = useState("");
  const [removeAmountA, setRemoveAmountA] = useState("");
  const [removeAmountB, setRemoveAmountB] = useState("");
  const [swapAmountA, setSwapAmountA] = useState("");
  const [swapAmountB, setSwapAmountB] = useState("");

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
          placeholder="Cantidad de Token A"
          value={addAmountA}
          onChange={e => setAddAmountA(e.target.value)}
        />
        <input
          type="text"
          className="input input-bordered w-full max-w-xs mb-2"
          placeholder="Cantidad de Token B"
          value={addAmountB}
          onChange={e => setAddAmountB(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={async () => {
            try {
              await writeSimpleDEXAsync({
                functionName: "addLiquidity",
                args: [parseEther(addAmountA), parseEther(addAmountB)],
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
          placeholder="Cantidad de Token A"
          value={removeAmountA}
          onChange={e => setRemoveAmountA(e.target.value)}
        />
        <input
          type="text"
          className="input input-bordered w-full max-w-xs mb-2"
          placeholder="Cantidad de Token B"
          value={removeAmountB}
          onChange={e => setRemoveAmountB(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={async () => {
            try {
              await writeSimpleDEXAsync({
                functionName: "removeLiquidity",
                args: [parseEther(removeAmountA), parseEther(removeAmountB)],
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
          value={swapAmountA}
          onChange={e => setSwapAmountA(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={async () => {
            try {
              await writeSimpleDEXAsync({
                functionName: "swapAforB",
                args: [parseEther(swapAmountA)],
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
          value={swapAmountB}
          onChange={e => setSwapAmountB(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={async () => {
            try {
              await writeSimpleDEXAsync({
                functionName: "swapBforA",
                args: [parseEther(swapAmountB)],
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
