<template>
  <svg
    viewBox="0 0 240 160"
    preserveAspectRatio="xMidYMid meet"
    class="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
  >
    <defs>
      <!-- Solid Arrowhead -->
      <marker
        id="seq-solid-preview"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="5"
        markerHeight="5"
        orient="auto-start-reverse"
      >
        <path
          d="M 0 1 L 10 5 L 0 9 Z"
          fill="#71717a"
          stroke="none"
        />
      </marker>
      <!-- Open Arrowhead -->
      <marker
        id="seq-open-preview"
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

    <!-- Lifelines -->
    <line
      x1="45"
      y1="35"
      x2="45"
      y2="140"
      class="stroke-border-default group-hover:stroke-interactive-accent/30 transition-colors duration-300"
      stroke-width="1"
      stroke-dasharray="4 4"
    />
    <line
      x1="120"
      y1="35"
      x2="120"
      y2="140"
      class="stroke-border-default group-hover:stroke-interactive-accent/30 transition-colors duration-300"
      stroke-width="1"
      stroke-dasharray="4 4"
    />
    <line
      x1="195"
      y1="35"
      x2="195"
      y2="140"
      class="stroke-border-default group-hover:stroke-interactive-accent/30 transition-colors duration-300"
      stroke-width="1"
      stroke-dasharray="4 4"
    />

    <!-- Participant Boxes -->
    <g class="transition-all duration-300">
      <!-- User -->
      <rect
        x="15"
        y="15"
        width="60"
        height="20"
        rx="3"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <text
        x="45"
        y="27"
        text-anchor="middle"
        class="fill-text-primary text-[8px] font-bold font-sans"
      >
        :User
      </text>

      <!-- Controller -->
      <rect
        x="90"
        y="15"
        width="60"
        height="20"
        rx="3"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <text
        x="120"
        y="27"
        text-anchor="middle"
        class="fill-text-primary text-[8px] font-bold font-sans"
      >
        :Controller
      </text>

      <!-- Database -->
      <rect
        x="165"
        y="15"
        width="60"
        height="20"
        rx="3"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <text
        x="195"
        y="27"
        text-anchor="middle"
        class="fill-text-primary text-[8px] font-bold font-sans"
      >
        :Database
      </text>
    </g>

    <!-- Activation Bars -->
    <rect
      x="117"
      y="48"
      width="6"
      height="77"
      rx="1"
      class="fill-bg-surface stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
      stroke-width="1"
    />
    <rect
      x="192"
      y="68"
      width="6"
      height="37"
      rx="1"
      class="fill-bg-surface stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
      stroke-width="1"
    />

    <!-- Message Flows -->
    <!-- login() -->
    <path
      d="M 45 53 L 117 53"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
      marker-end="url(#seq-solid-preview)"
    />
    <text
      x="81"
      y="48"
      text-anchor="middle"
      class="fill-text-secondary text-[6.5px] font-mono"
    >
      login()
    </text>

    <!-- validate() -->
    <path
      d="M 123 73 L 192 73"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
      marker-end="url(#seq-solid-preview)"
    />
    <text
      x="157"
      y="68"
      text-anchor="middle"
      class="fill-text-secondary text-[6.5px] font-mono"
    >
      validate()
    </text>

    <!-- success (return) -->
    <path
      d="M 192 98 L 123 98"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
      stroke-dasharray="3 2"
      marker-end="url(#seq-open-preview)"
    />
    <text
      x="157"
      y="93"
      text-anchor="middle"
      class="fill-text-secondary text-[6.5px] font-mono"
    >
      success
    </text>

    <!-- token (return) -->
    <path
      d="M 117 118 L 45 118"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
      stroke-dasharray="3 2"
      marker-end="url(#seq-open-preview)"
    />
    <text
      x="81"
      y="113"
      text-anchor="middle"
      class="fill-text-secondary text-[6.5px] font-mono"
    >
      token
    </text>
  </svg>
</template>
