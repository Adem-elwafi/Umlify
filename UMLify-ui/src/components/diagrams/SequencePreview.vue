<template>
  <svg
    viewBox="0 0 240 160"
    preserveAspectRatio="xMidYMid meet"
    class="w-full h-full text-text-primary transition-all duration-300"
  >
    <defs>
      <!-- Solid Arrowhead -->
      <marker
        id="seq-solid-arrow"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="5"
        markerHeight="5"
        orient="auto-start-reverse"
      >
        <path
          d="M 0 1 L 10 5 L 0 9 Z"
          class="fill-text-secondary group-hover:fill-interactive-accent transition-colors duration-300"
          stroke="none"
        />
      </marker>
      <!-- Open Arrowhead -->
      <marker
        id="seq-open-arrow"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="5"
        markerHeight="5"
        orient="auto-start-reverse"
      >
        <path
          d="M 2 1 L 10 5 L 2 9"
          fill="none"
          class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
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
    <!-- Controller Activation -->
    <rect
      x="117"
      y="48"
      width="6"
      height="77"
      rx="1"
      class="fill-bg-surface stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
      stroke-width="1"
    />
    <!-- Database Activation -->
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
    <line
      x1="45"
      y1="53"
      x2="117"
      y2="53"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
      marker-end="url(#seq-solid-arrow)"
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
    <line
      x1="123"
      y1="73"
      x2="192"
      y2="73"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
      marker-end="url(#seq-solid-arrow)"
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
    <line
      x1="192"
      y1="98"
      x2="123"
      y2="98"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
      stroke-dasharray="3 2"
      marker-end="url(#seq-open-arrow)"
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
    <line
      x1="117"
      y1="118"
      x2="45"
      y2="118"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
      stroke-dasharray="3 2"
      marker-end="url(#seq-open-arrow)"
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
