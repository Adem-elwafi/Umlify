<template>
  <svg
    viewBox="0 0 240 160"
    preserveAspectRatio="xMidYMid meet"
    class="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
  >
    <defs>
      <!-- Dependency Arrow -->
      <marker
        id="comp-dep-preview"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="5"
        markerHeight="5"
        orient="auto-start-reverse"
      >
        <path
          d="M 2 1 L 10 5 L 2 9"
          fill="none"
          stroke="#71717a"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </marker>
    </defs>

    <!-- Component 1: API Gateway -->
    <g class="transition-all duration-300">
      <!-- Outer Box -->
      <rect
        x="20"
        y="45"
        width="70"
        height="50"
        rx="3"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <!-- Left Edge Tab 1 -->
      <rect
        x="13"
        y="53"
        width="14"
        height="10"
        rx="1.5"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <!-- Left Edge Tab 2 -->
      <rect
        x="13"
        y="72"
        width="14"
        height="10"
        rx="1.5"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <!-- Title -->
      <text
        x="55"
        y="73"
        text-anchor="middle"
        class="fill-text-primary text-[7.5px] font-bold font-sans"
      >
        API Gateway
      </text>
    </g>

    <!-- Component 2: Auth Service -->
    <g class="transition-all duration-300">
      <rect
        x="150"
        y="15"
        width="75"
        height="45"
        rx="3"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <rect
        x="143"
        y="22"
        width="14"
        height="9"
        rx="1"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <rect
        x="143"
        y="38"
        width="14"
        height="9"
        rx="1"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <text
        x="187.5"
        y="41"
        text-anchor="middle"
        class="fill-text-primary text-[7.5px] font-bold font-sans"
      >
        Auth Service
      </text>
    </g>

    <!-- Component 3: Order Service -->
    <g class="transition-all duration-300">
      <rect
        x="150"
        y="85"
        width="75"
        height="45"
        rx="3"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <rect
        x="143"
        y="92"
        width="14"
        height="9"
        rx="1"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <rect
        x="143"
        y="108"
        width="14"
        height="9"
        rx="1"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <text
        x="187.5"
        y="111"
        text-anchor="middle"
        class="fill-text-primary text-[7.5px] font-bold font-sans"
      >
        Order Service
      </text>
    </g>

    <!-- Connectors -->
    <!-- API Gateway ---> Auth Service (dependency dashed arrow) -->
    <path
      d="M 90 60 L 115 60 L 115 37.5 L 143 37.5"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
      stroke-dasharray="3 3"
      marker-end="url(#comp-dep-preview)"
    />

    <!-- API Gateway ---> Order Service (Assembly joint: ball-and-socket) -->
    <!-- Ball / Socket vector details -->
    <!-- Socket (Crescent arc facing left) -->
    <path
      d="M 124 103 A 5 5 0 0 1 124 113"
      fill="none"
      class="stroke-zinc-400 dark:stroke-zinc-500 group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.5"
    />
    <!-- Line from Order Service to Socket -->
    <path
      d="M 143 108 L 128 108"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
    />
    <!-- Line from API Gateway to Ball -->
    <path
      d="M 90 80 L 118 80 L 118 108"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
    />
    <!-- Ball (Small circle sitting inside the socket) -->
    <circle
      cx="118"
      cy="108"
      r="2"
      class="fill-zinc-400 dark:fill-zinc-500 group-hover:fill-interactive-accent transition-colors duration-300"
    />
  </svg>
</template>
