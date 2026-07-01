<template>
  <svg
    viewBox="0 0 240 160"
    preserveAspectRatio="xMidYMid meet"
    class="w-full h-full text-text-primary transition-all duration-300"
  >
    <!-- Frontend Component -->
    <g class="transition-all duration-300">
      <rect
        x="25"
        y="25"
        width="70"
        height="36"
        rx="2"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <!-- Component Symbol Tabs (left edge) -->
      <rect
        x="20"
        y="31"
        width="10"
        height="6"
        rx="1"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.2"
      />
      <rect
        x="20"
        y="43"
        width="10"
        height="6"
        rx="1"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.2"
      />
      <text
        x="63"
        y="46"
        text-anchor="middle"
        class="fill-text-primary text-[7.5px] font-bold font-sans"
      >
        Frontend
      </text>
    </g>

    <!-- API Gateway Component -->
    <g class="transition-all duration-300">
      <rect
        x="145"
        y="25"
        width="70"
        height="36"
        rx="2"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <rect
        x="140"
        y="31"
        width="10"
        height="6"
        rx="1"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.2"
      />
      <rect
        x="140"
        y="43"
        width="10"
        height="6"
        rx="1"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.2"
      />
      <text
        x="183"
        y="46"
        text-anchor="middle"
        class="fill-text-primary text-[7.5px] font-bold font-sans"
      >
        API Gateway
      </text>
    </g>

    <!-- Database Component -->
    <g class="transition-all duration-300">
      <rect
        x="145"
        y="95"
        width="70"
        height="36"
        rx="2"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <rect
        x="140"
        y="101"
        width="10"
        height="6"
        rx="1"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.2"
      />
      <rect
        x="140"
        y="113"
        width="10"
        height="6"
        rx="1"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.2"
      />
      <text
        x="183"
        y="116"
        text-anchor="middle"
        class="fill-text-primary text-[7.5px] font-bold font-sans"
      >
        Database
      </text>
    </g>

    <!-- Auth Service Component -->
    <g class="transition-all duration-300">
      <rect
        x="25"
        y="95"
        width="70"
        height="36"
        rx="2"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <rect
        x="20"
        y="101"
        width="10"
        height="6"
        rx="1"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.2"
      />
      <rect
        x="20"
        y="113"
        width="10"
        height="6"
        rx="1"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.2"
      />
      <text
        x="63"
        y="116"
        text-anchor="middle"
        class="fill-text-primary text-[7.5px] font-bold font-sans"
      >
        Auth Service
      </text>
    </g>

    <!-- Assembly Connectors (Ball-and-Socket) -->
    <!-- Frontend ---> API Gateway -->
    <line
      x1="95"
      y1="43"
      x2="110"
      y2="43"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
    />
    <path
      d="M 115 39 A 4 4 0 0 1 115 47"
      fill="none"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
    />
    <circle
      cx="114"
      cy="43"
      r="2.2"
      class="fill-text-secondary group-hover:fill-interactive-accent transition-colors duration-300"
    />
    <line
      x1="117"
      y1="43"
      x2="140"
      y2="43"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
    />

    <!-- API Gateway ---> Database -->
    <line
      x1="180"
      y1="61"
      x2="180"
      y2="73"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
    />
    <path
      d="M 176 77 A 4 4 0 0 0 184 77"
      fill="none"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
    />
    <circle
      cx="180"
      cy="78.5"
      r="2.2"
      class="fill-text-secondary group-hover:fill-interactive-accent transition-colors duration-300"
    />
    <line
      x1="180"
      y1="82"
      x2="180"
      y2="95"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
    />

    <!-- API Gateway ---> Auth Service (dependency dashed arrow) -->
    <path
      d="M 145 43 L 115 43 L 115 113 L 95 113"
      fill="none"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-all duration-300"
      stroke-width="1.2"
      stroke-dasharray="3 3"
    />
    <path
      d="M 100 109 L 95 113 L 100 117"
      fill="none"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
