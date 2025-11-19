'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface FaqProps {
    onNavigateToContent: () => void
    onSectionChange: () => void
}

// FAQ data (mapped)
const faqData = [
    {
        q: "Is there a free trial available?",
        a: "Yes. New users can enjoy a free trial to explore the core writing and originality features before upgrading. This trial helps you experience how effortlessly the platform generates plagiarism-free, human-quality content."
    },
    {
        q: "Can I customise the writing tone or style?",
        a: "Yes. You can choose from various tones such as professional, conversational, persuasive, or academic. The platform allows you to tailor every piece to your brand’s voice or target audience seamlessly."
    },
    {
        q: "What types of content can I create?",
        a: "You can create blog articles, website copy, emails, ad scripts, academic content, and long-form reports—each written with natural flow and human-sounding rhythm."
    },
    {
        q: "How is this platform different from regular AI writing tools?",
        a: "Unlike conventional AI writers, our system uses advanced content reconstruction algorithms. This ensures every output is unique, authentic, and capable of passing both plagiarism and AI detection checks."
    },
    {
        q: "Can the generated content pass AI detectors?",
        a: "Yes. The tool uses deep natural language models designed to produce content indistinguishable from human writing. It performs strongly on major AI detection tools used by publishers and institutions."
    },
    {
        q: "Is the content plagiarism-free?",
        a: "Absolutely. Every output is scanned against billions of online sources to ensure 100% originality and safety to publish."
    },
    {
        q: "Does it support SEO content writing?",
        a: "Yes, but this feature is available only in paid plans. Premium users can access advanced SEO optimization tools—ensuring ideal keyword density, readability, and ranking performance across major search engines."
    }
];

const Faq = ({ }: FaqProps) => {
    return (
        <div className="h-full w-full lg:p-12">
            <h2 className="text-[24px] md:text-[30px] lg:text-[40px] xl:text-[50px] font-medium">FAQ</h2>

            <Accordion type="single" collapsible className="w-full space-y-6 mt-6 lg:mt-8">
                {faqData.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="">
                        <AccordionTrigger className="text-left text-[16px] md:text-[24px] no-underline lg:text-[26px] font-medium">
                            {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-[14px] md:text-[16px] lg:text-[18px] text-gray-600 pb-4">
                            {item.a}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default Faq
