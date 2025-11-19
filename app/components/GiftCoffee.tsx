'use client'

import { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GiftCoffeeProps {
    onNavigateToContent: () => void
    onSectionChange: () => void
}

const cupOptions = [
    { cups: 1, price: 50 },
    { cups: 2, price: 100 },
    { cups: 5, price: 250 },
    { cups: 10, price: 1000 },
]

const GiftCoffee = ({ onNavigateToContent, onSectionChange }: GiftCoffeeProps) => {

    const [selected, setSelected] = useState<number | null>(null)

    const baseStyle =
        "h-[70px] w-[70px] bg-[#E3E8FE] rounded-xl flex flex-col items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.15)] transition border cursor-pointer"

    return (
        <div className="w-full lg:pl-12">
            <div className="flex flex-col lg:flex-row items-center gap-10 h-screen">

                {/* LEFT SECTION */}
                <div className="flex-1">

                    <CardHeader className="px-0">
                        <CardTitle className="text-[24px] md:text-[30px] lg:text-[40px] xl:text-[50px]">
                            Gift a cup of Coffee
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6 px-0">

                        <p className="text-[14px] md:text-[16px] lg:text-[18px] text-[#333333]">
                            Our team works hard to provide you with important things by making things easier for you.
                            You can support us by buying us a coffee.
                        </p>

                        <p className="text-sm text-[#737373]">
                            How many cups would you like to donate?
                        </p>

                        {/* COFFEE BUTTONS */}
                        <div className="flex gap-4">
                            {cupOptions.map((item) => (
                                <button
                                    key={item.cups}
                                    onClick={() => setSelected(item.cups)}
                                    className={`${baseStyle} ${selected === item.cups ? "border-black" : "border-transparent"
                                        }`}
                                >
                                    <span className="text-xl font-semibold">{item.cups}</span>
                                    <span className="text-xs">Rs.{item.price}</span>
                                </button>
                            ))}
                        </div>

                        {/* INPUT BOX */}
                        <input
                            type="text"
                            className="w-[300px] h-[50px] rounded-md border border-black px-4 text-black"
                        />

                        <br />

                        {/* DONATE BUTTON */}
                        <button className="px-6 py-2 bg-[#1A1F35] text-white rounded-md shadow-md">
                            Donate
                        </button>

                    </CardContent>
                </div>

                {/* RIGHT IMAGE SECTION */}
                <div className="flex-1 flex justify-center lg:justify-center">
                    <img
                        src="/coffee.png"
                        alt="Coffee Cup"
                        className="rounded-2xl max-w-[420px] w-full"
                    />
                </div>
            </div>
        </div>
    )
}

export default GiftCoffee
