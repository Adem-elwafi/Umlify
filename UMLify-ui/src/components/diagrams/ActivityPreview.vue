<template>
  <svg
    viewBox="0 0 240 160"
    preserveAspectRatio="xMidYMid meet"
    class="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
  >
    <defs>
      <!-- Activity Direction Arrow -->
      <marker
        id="act-arrow-preview"
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

    <!-- Start Node -->
    <circle
      cx="35"
      cy="80"
      r="6"
      class="fill-text-primary group-hover:fill-interactive-accent transition-colors duration-300"
    />

    <!-- Transitions -->
    <!-- Start -> Validate -->
    <path
      d="M 41 80 L 55 80"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
      marker-end="url(#act-arrow-preview)"
    />

    <!-- Validate -> Decision -->
    <path
      d="M 120 80 L 135 80"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
      marker-end="url(#act-arrow-preview)"
    />

    <!-- Decision -> Process (True path) -->
    <path
      d="M 150 80 L 165 80"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
      marker-end="url(#act-arrow-preview)"
    />
    <text
      x="157"
      y="74"
      text-anchor="middle"
      class="fill-text-secondary text-[6.5px] font-sans"
    >
      [yes]
    </text>

    <!-- Decision -> Cancel (False path - orthogonal) -->
    <path
      d="M 142.5 72.5 L 142.5 35 L 165 35"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
      marker-end="url(#act-arrow-preview)"
    />
    <text
      x="134"
      y="50"
      text-anchor="middle"
      class="fill-text-secondary text-[6.5px] font-sans"
    >
      [no]
    </text>

    <!-- Activity Action 1: Validate -->
    <rect
      x="55"
      y="65"
      width="65"
      height="30"
      rx="15"
      class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
      stroke-width="1.5"
    />
    <text
      x="87.5"
      y="82.5"
      text-anchor="middle"
      class="fill-text-primary text-[7px] font-medium font-sans"
    >
      Validate Order
    </text>

    <!-- Decision Diamond -->
    <path
      d="M 142.5 65 L 150 72.5 L 142.5 80 L 135 72.5 Z"
      class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-all duration-300"
      stroke-width="1.5"
    />

    <!-- Activity Action 2: Process -->
    <rect
      x="165"
      y="65"
      width="60"
      height="30"
      rx="15"
      class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
      stroke-width="1.5"
    />
    <text
      x="195"
      y="82.5"
      text-anchor="middle"
      class="fill-text-primary text-[7px] font-medium font-sans"
    >
      Process
    </text>

    <!-- Activity Action 3: Cancel -->
    <rect
      x="165"
      y="20"
      width="60"
      height="30"
      rx="15"
      class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
      stroke-width="1.5"
    />
    <text
      x="195"
      y="37.5"
      text-anchor="middle"
      class="fill-text-primary text-[7px] font-medium font-sans"
    >
      Cancel Order
    </text>

    <!-- End Node (Bullseye) -->
    <!-- Validate/Process -> End Node transition -->
    <path
      d="M 195 50 L 195 65"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
      marker-end="url(#act-arrow-preview)"
    />

    <g class="transition-all duration-300">
      <circle
        cx="195"
        cy="125"
        r="7.5"
        class="fill-none stroke-text-primary group-hover:stroke-interactive-accent transition-colors duration-300"
        stroke-width="1.2"
      />
      <circle
        cx="195"
        cy="125"
        r="4"
        class="fill-text-primary group-hover:fill-interactive-accent transition-colors duration-300"
      />
    </g>
    <!-- Process -> End Node -->
    <path
      d="M 195 95 L 195 117.5"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
      marker-end="url(#act-arrow-preview)"
    />
  </svg>
</template>
