"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "./utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px] flex",
        className
      )}
      style={{
        backgroundColor: "var(--card)",
        color: "var(--muted-foreground)",
      }}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex flex-col items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-3 text-sm font-medium whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50",
        // 🟢 Selected state highlight
        "data-[state=active]:shadow-md data-[state=active]:bg-[color:var(--card)] data-[state=active]:text-[color:var(--primary)]",
        // Hover / focus for better interaction
        "hover:bg-[color:var(--muted)] focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2",
        className
      )}
      style={{
        color: "var(--foreground)",
        backgroundColor: "transparent",
      }}
      {...props}
    >
      {props.children}

      {/* 🔵 Bottom indicator line */}
      <span
        className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full opacity-0 transition-all duration-300 data-[state=active]:opacity-100"
        style={{
          backgroundColor: "var(--primary)",
        }}
      />
    </TabsPrimitive.Trigger>
  );
}


function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      style={{
        backgroundColor: "var(--card)",
        color: "var(--card-foreground)",
      }}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
