"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "brutal-shimmer group/button relative overflow-hidden inline-flex shrink-0 items-center justify-center border-[3px] border-ink bg-background text-ink font-bold uppercase tracking-[0.08em] whitespace-nowrap [box-shadow:var(--shadow-brutal-sm)] transition-all duration-200 select-none hover:-translate-x-[2px] hover:-translate-y-[2px] hover:[box-shadow:var(--shadow-brutal-sm-hover)] active:translate-x-[5px] active:translate-y-[5px] active:[box-shadow:none] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-saffron focus-visible:outline-offset-[3px] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-ink text-background hover:bg-ink/90",
        outline: "bg-background text-ink",
        secondary: "bg-saffron text-ink border-ink hover:bg-saffron/90",
        ghost:
          "border-transparent bg-transparent shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none hover:underline underline-offset-4",
        destructive:
          "bg-[#b91c1c] text-background border-[#b91c1c]",
        link: "border-transparent bg-transparent shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none underline underline-offset-4",
      },
      size: {
        default: "h-11 px-5 text-[13px] gap-2",
        xs: "h-8 px-3 text-[11px] gap-1",
        sm: "h-9 px-4 text-[12px] gap-1.5",
        lg: "h-12 px-6 text-[14px] gap-2",
        icon: "size-11",
        "icon-xs": "size-8",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
