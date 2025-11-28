"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "./utils";

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ReactNode;
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-surface]:outline-hidden flex aspect-video justify-center text-xs",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, cfg]) => Boolean(cfg.theme) || Boolean(cfg.color)
  );

  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => {
            return `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, item]) => {
    const cfg = item as { theme?: Record<string, string>; color?: string };
    const color = cfg.theme?.[theme as keyof typeof THEMES] ?? cfg.color;
    return color ? `  --color-${key}: ${color};` : "";
  })
  .join("\n")}
}
`;
          })
          .join("\n"),
      }}
    />
  );
};


const ChartTooltip = RechartsPrimitive.Tooltip;

// -----------------------------
// typed payload item
// -----------------------------
interface RechartsPayloadItem extends Record<string, unknown> {
  name?: string;
  color?: string;
  value?: number | string;
  dataKey?: string;
  payload?: Record<string, unknown>;
  fill?: string;
}

/** Updated ChartTooltipContentProps */
interface ChartTooltipContentProps {
  active?: boolean;
  payload?: RechartsPayloadItem[];
  label?: string;
  className?: string;
  indicator?: "line" | "dot" | "dashed";
  hideLabel?: boolean;
  hideIndicator?: boolean;
  // allow ReactNode because config.labels can be nodes
  labelFormatter?: (
    value: React.ReactNode,
    payload?: RechartsPayloadItem[]
  ) => React.ReactNode;
  labelClassName?: string;
  formatter?: (
    value: React.ReactNode,
    name?: string,
    item?: RechartsPayloadItem,
    index?: number,
    payload?: RechartsPayloadItem[]
  ) => React.ReactNode;
  color?: string;
  nameKey?: string;
  labelKey?: string;
}

/* helpers */
function coerceStringColor(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function renderValueToString(v: unknown): string {
  if (typeof v === "number") return v.toLocaleString();
  if (typeof v === "string") return v;
  if (v === undefined || v === null) return "";
  // fallback for other React nodes etc.
  try {
    return String(v);
  } catch {
    return "";
  }
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) return null;
    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    if (labelFormatter)
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );

    return value ? (
      <div className={cn("font-medium", labelClassName)}>{value}</div>
    ) : null;
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !payload?.length) return null;

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          // derive indicator color safely
          const indicatorColor =
            coerceStringColor(color) ||
            coerceStringColor(item.payload?.["fill"]) ||
            coerceStringColor(item.color);

          return (
            <div
              key={item.dataKey || index}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicator === "dot" && "items-center"
              )}
            >
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value as React.ReactNode, item.name, item, index, payload)
              ) : (
                <>
                  {!hideIndicator && (
                    <div
                      className={cn(
                        "shrink-0 rounded-[2px]",
                        indicator === "dot" && "h-2.5 w-2.5",
                        indicator === "line" && "w-1 h-2.5",
                        indicator === "dashed" &&
                          "w-0 border-[1.5px] border-dashed bg-transparent"
                      )}
                      style={{
                        backgroundColor: indicatorColor,
                        borderColor: indicatorColor,
                      }}
                    />
                  )}
                  <div className="flex flex-1 justify-between items-center leading-none">
                    <span className="text-muted-foreground">
                      {itemConfig?.label || item.name}
                    </span>
                    {item.value !== undefined && (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {renderValueToString(item.value)}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

interface ChartLegendContentProps {
  className?: string;
  hideIcon?: boolean;
  payload?: {
    value?: string;
    color?: string;
    dataKey?: string;
  }[];
  verticalAlign?: "top" | "bottom";
  nameKey?: string;
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload = [],
  verticalAlign = "bottom",
  nameKey,
}: ChartLegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item, i) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);
        return (
          <div
            key={i}
            className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
          >
            {!hideIcon && (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
            )}
            {itemConfig?.label || item.value}
          </div>
        );
      })}
    </div>
  );
}

/** Updated helper function; accepts payload records or typed payload item */
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: RechartsPayloadItem | Record<string, unknown> | undefined,
  key: string
) {
  if (!payload) return undefined;

  const payloadPayload =
    (payload as RechartsPayloadItem)?.payload as Record<string, unknown> | undefined;

  const base = payload as Record<string, unknown>;

  const possibleKeyValue =
    typeof base[key] === "string"
      ? (base[key] as string)
      : typeof payloadPayload?.[key] === "string"
      ? (payloadPayload[key] as string)
      : key;

  const labelKey = possibleKeyValue;
  return config[labelKey] || config[key];
}


export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
