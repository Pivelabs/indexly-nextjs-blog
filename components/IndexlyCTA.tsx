import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function IndexlyCTA() {
  return (
    <div className="rounded-md border border-olive-100 bg-gradient-to-b from-olive-50 to-olive-100 ring-1 ring-olive-200/70 p-6 not-prose">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 p-1 overflow-hidden" style={{ borderRadius: '100%'}}>
          <img
            src="https://indexly.ai/favicon.ico"
            alt="Indexly logo"
            width={40}
            height={40}
            className="h-8 w-8 object-contain rounded-full" 
            style={{ borderRadius: '100%'}}
          />
        </span>
        <span className="font-display text-lg font-medium text-olive-950">
          indexly
        </span>
      </div>
      <h3 className="font-display text-2xl font-semibold tracking-tight text-olive-950 leading-tight">
        Boost your AI Visibility
      </h3>
      <p className="mt-3 text-sm/6 text-olive-600">
        Set up in minutes. No credit card required.
      </p>
      <div className="mt-5 flex flex-col gap-2">
        <Link
          href="https://app.indexly.ai/register"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1 rounded-lg bg-olive-950 hover:bg-olive-800 px-4 py-2.5 text-sm font-medium !text-white hover:!text-white !no-underline !decoration-transparent transition-colors"
        >
          Try for free
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          href="https://indexly.ai/book-a-demo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-lg bg-white ring-1 ring-olive-200 px-4 py-2.5 text-sm font-medium !text-olive-950 hover:!text-olive-950 hover:ring-olive-300 !no-underline !decoration-transparent transition-colors"
        >
          Book a demo
        </Link>
      </div>
    </div>
  );
}
