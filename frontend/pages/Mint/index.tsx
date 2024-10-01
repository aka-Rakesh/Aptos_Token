import React from 'react';
import { HeroSection } from "./components/HeroSection";
import { StatsSection } from "./components/StatsSection";
import { OurStorySection } from "./components/OurStorySection";
import { useGetAssetData } from "../../hooks/useGetAssetData";
import { Socials } from "./components/Socials";
import { ConnectWalletAlert } from "./components/ConnectWalletAlert";
import { Header } from "@/components/Header";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function Mint() {
  const { data, isLoading } = useGetAssetData();

  const queryClient = useQueryClient();
  const { account } = useWallet();
  useEffect(() => {
    queryClient.invalidateQueries();
  }, [account, queryClient]);

  if (isLoading) {
    return (
      <div className="text-center p-8 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <h1 className="text-3xl font-bold text-white">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white font-sans">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <main className="flex flex-col gap-12 md:gap-20">
          <ConnectWalletAlert />
          <HeroSection />
          <StatsSection />
          <OurStorySection />
        </main>

        <footer className="mt-12 md:mt-24 flex flex-col md:flex-row items-center justify-between border-t border-white pt-6">
          <p className="text-lg mb-4 md:mb-0">{data?.asset.name}</p>
          <Socials />
        </footer>
      </div>
    </div>
  );
}