<template>
  <svg
    viewBox="0 0 240 160"
    preserveAspectRatio="xMidYMid meet"
    class="w-full h-full text-text-primary transition-all duration-300"
  >
    <defs>
      <!-- Activity Flow Arrowhead -->
      <marker
        id="act-arrow"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="5"
        markerHeight="5"
        orient="auto-start-reverse"
      >
        <path
          d="M 0 1.5 L 9 5 L 0 8.5"
          fill="none"
          class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </marker>
    </defs>

    <!-- Initial Node (Start State) -->
    <circle
      cx="120"
      cy="20"
      r="6"
      class="fill-text-primary group-hover:fill-interactive-accent transition-colors duration-300"
    />

    <!-- Start to Action 1 -->
    <line
      x1="120"
      y1="26"
      x2="120"
      y2="38"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
      marker-end="url(#act-arrow)"
    />

    <!-- Action 1: Validate Order -->
    <g>
      <rect
        x="75"
        y="38"
        width="90"
        height="20"
        rx="10"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <text
        x="120"
        y="50"
        text-anchor="middle"
        class="fill-text-primary text-[7.5px] font-medium font-sans"
      >
        Validate Order
      </text>
    </g>

    <!-- Action 1 to Decision -->
    <line
      x1="120"
      y1="58"
      x2="120"
      y2="72"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
      marker-end="url(#act-arrow)"
    />

    <!-- Decision Diamond -->
    <path
      d="M 120 72 L 132 84 L 120 96 L 108 84 Z"
      class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
      stroke-width="1.5"
    />

    <!-- Decision (Invalid) -> Action 2 -->
    <path
      d="M 108 84 L 55 84 L 55 100"
      fill="none"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
      marker-end="url(#act-arrow)"
    />
    <text
      x="78"
      y="79"
      text-anchor="middle"
      class="fill-text-secondary text-[6px] font-mono"
    >
      [Invalid]
    </text>

    <!-- Action 2: Cancel Order -->
    <g>
      <rect
        x="15"
        y="100"
        width="80"
        height="20"
        rx="10"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <text
        x="55"
        y="112"
        text-anchor="middle"
        class="fill-text-primary text-[7.5px] font-medium font-sans"
      >
        Cancel Order
      </text>
    </g>

    <!-- Decision (Valid) -> Action 3 -->
    <line
      x1="120"
      y1="96"
      x2="120"
      y2="110"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
      marker-end="url(#act-arrow)"
    />
    <text
      x="136"
      y="105"
      text-anchor="middle"
      class="fill-text-secondary text-[6px] font-mono"
    >
      [Valid]
    </text>

    <!-- Action 3: Process Order -->
    <g>
      <rect
        x="95"
        y="110"
        width="80"
        height="20"
        rx="10"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <text
        x="135"
        y="122"
        text-anchor="middle"
        class="fill-text-primary text-[7.5px] font-medium font-sans"
      >
        Process Order
      </text>
    </g>

    <!-- Action 3 -> Final Node -->
    <line
      x1="175"
      y1="120"
      x2="197"
      y2="120"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
      marker-end="url(#act-arrow)"
    />

    <!-- Action 2 -> Final Node (routed underneath) -->
    <path
      d="M 55 120 L 55 140 L 207 140 L 207 128"
      fill="none"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
      marker-end="url(#act-arrow)"
    />

    <!-- Final Node (End State) -->
    <g class="transition-colors duration-300">
      <circle
        cx="207"
        cy="120"
        r="8"
        fill="none"
        class="stroke-text-primary group-hover:stroke-interactive-accent transition-colors duration-300"
        stroke-width="1.2"
      />
      <circle
        cx="207"
        cy="120"
        r="4.5"
        class="fill-text-primary group-hover:fill-interactive-accent transition-colors duration-300"
      />
    </g>
  </svg>
</template>
