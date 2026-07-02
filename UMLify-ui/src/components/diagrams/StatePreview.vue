<template>
  <svg
    viewBox="0 0 240 160"
    preserveAspectRatio="xMidYMid meet"
    class="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
  >
    <defs>
      <!-- State Directional Arrowhead -->
      <marker
        id="state-arrow-preview"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="5"
        markerHeight="5"
        orient="auto-start-reverse"
      >
        <path
          d="M 2 1.5 L 9 5 L 2 8.5"
          fill="none"
          stroke="#71717a"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </marker>
    </defs>

    <!-- Start State (Small black dot) -->
    <circle
      cx="25"
      cy="45"
      r="5"
      class="fill-text-primary group-hover:fill-interactive-accent transition-colors duration-300"
    />

    <!-- Transitions -->
    <!-- Start -> Idle -->
    <path
      d="M 30 45 L 45 45"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
      marker-end="url(#state-arrow-preview)"
    />

    <!-- Idle -> Loading (FETCH) -->
    <path
      d="M 105 45 L 135 45"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
      marker-end="url(#state-arrow-preview)"
    />
    <text
      x="120"
      y="39"
      text-anchor="middle"
      class="fill-text-secondary text-[6.5px] font-mono"
    >
      FETCH
    </text>

    <!-- Loading -> Success (RESOLVE) -->
    <path
      d="M 165 60 L 165 95"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
      marker-end="url(#state-arrow-preview)"
    />
    <text
      x="188"
      y="80"
      text-anchor="start"
      class="fill-text-secondary text-[6.5px] font-mono"
    >
      RESOLVE
    </text>

    <!-- Loading -> Error (REJECT - orthogonal) -->
    <path
      d="M 195 45 L 210 45 L 210 110 L 125 110"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
      marker-end="url(#state-arrow-preview)"
    />
    <text
      x="215"
      y="75"
      class="fill-text-secondary text-[6.5px] font-mono"
    >
      REJECT
    </text>

    <!-- State 1: Idle -->
    <rect
      x="45"
      y="30"
      width="60"
      height="30"
      rx="8"
      class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
      stroke-width="1.5"
    />
    <text
      x="75"
      y="48.5"
      text-anchor="middle"
      class="fill-text-primary text-[8px] font-bold font-sans"
    >
      Idle
    </text>

    <!-- State 2: Loading -->
    <rect
      x="135"
      y="30"
      width="60"
      height="30"
      rx="8"
      class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
      stroke-width="1.5"
    />
    <text
      x="165"
      y="48.5"
      text-anchor="middle"
      class="fill-text-primary text-[8px] font-bold font-sans"
    >
      Loading
    </text>

    <!-- State 3: Success -->
    <rect
      x="135"
      y="95"
      width="60"
      height="30"
      rx="8"
      class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
      stroke-width="1.5"
    />
    <text
      x="165"
      y="113.5"
      text-anchor="middle"
      class="fill-text-primary text-[8px] font-bold font-sans"
    >
      Success
    </text>

    <!-- State 4: Error -->
    <rect
      x="65"
      y="95"
      width="60"
      height="30"
      rx="8"
      class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
      stroke-width="1.5"
    />
    <text
      x="95"
      y="113.5"
      text-anchor="middle"
      class="fill-text-primary text-[8px] font-bold font-sans"
    >
      Error
    </text>

    <!-- End State (Double Circle) -->
    <!-- Success -> End State transition -->
    <path
      d="M 135 110 L 45 110"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
      marker-end="url(#state-arrow-preview)"
    />

    <g class="transition-all duration-300">
      <circle
        cx="25"
        cy="110"
        r="7.5"
        class="fill-none stroke-text-primary group-hover:stroke-interactive-accent transition-colors duration-300"
        stroke-width="1.2"
      />
      <circle
        cx="25"
        cy="110"
        r="4.5"
        class="fill-text-primary group-hover:fill-interactive-accent transition-colors duration-300"
      />
    </g>
  </svg>
</template>
