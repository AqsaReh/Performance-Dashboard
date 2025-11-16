"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const FilDilPageView = () => {
  const strengths = [
    {
      mg: "20mg",
      img: "/images/launch/fildil/20mg.webp",
    },
    {
      mg: "10mg",
      img: "/images/launch/fildil/10mg.webp",
    },
    {
      mg: "5mg",
      img: "/images/launch/fildil/5mg.webp",
    },
    {
      mg: "2.5mg",
      img: "/images/launch/fildil/2.5mg.webp",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100 flex flex-col items-center justify-center text-center px-4 py-12 overflow-hidden">
      {/* Glow and Blur Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[600px] h-[600px] bg-primary-300 opacity-20 blur-[160px] rounded-full top-[-200px] left-[-200px]" />
        <div className="absolute w-[400px] h-[400px] bg-primary-400 opacity-20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />
      </div>

      <Image
        src="/images/launch/fildil/logo.webp"
        alt="Fildil Logo"
        width={120}
        height={100}
        className="mb-6 drop-shadow-md absolute top-6 sm:top-10 left-4 sm:left-10"
      />

      <div className="max-w-7xl md:max-w-full w-full flex flex-col items-center pb-16 sm:pb-0">
        <h1 className="text-2xl mt-16 sm:mt-0 sm:text-5xl font-bold text-primary-900 tracking-tight uppercase">
          Experience the Freedom:{" "}
          <span className="text-muted-foreground ml-2 block sm:inline">ED & Beyond</span>
        </h1>

        <p className="mt-6 text-sm sm:text-lg text-primary-800 bg-gradient-to-tr from-primary-foreground/50 to-muted-foreground/20 px-2 sm:px-4 py-2 rounded-xl backdrop-blur-md shadow-sm">
          Available in 4 tailored strengths for precision and personalized care.
        </p>

        {/* CTA */}
        <div className="mt-8">
          <Link href="./fildil/launch">
            <Button
              size="lg"
              className="text-xs sm:text-sm rounded-xl shadow-lg backdrop-blur-xl bg-gradient-to-r from-muted-foreground/50 to-primary-600 text-accent hover:bg-primary-700 hover:scale-105 transition-all ease-in-out duration-300"
            >
              Click to Start <ArrowRight className="w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* SKUs */}
        <div className="mt-12 flex flex-wrap justify-center gap-10 w-full">
          {strengths.map((sku) => (
            <div
              key={sku.mg}
              className="flex flex-col items-center backdrop-blur-xl shadow-xl rounded-2xl py-6 px-2 transition-transform duration-300 hover:scale-105 bg-gradient-to-br from-primary-100/50 via-white/30 to-white"
            >
              <Image
                src={sku.img}
                alt={`Fildil ${sku.mg}`}
                width={300}
                height={300}
                className="rounded-xl drop-shadow-lg"
              />
              <h3 className="text-lg font-semibold text-blue-900 mt-3">
                Fildil™ {sku.mg}
              </h3>
              <p className="text-sm text-gray-700">10 Film-coated Tablets</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Image
        src="/images/launch/fildil/company_logo.webp"
        alt="Highnoon"
        width={120}
        height={50}
        className="absolute bottom-10 right-10"
      />
    </div>
  );
};

export default FilDilPageView;
