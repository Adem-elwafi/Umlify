<template>
  <svg
    viewBox="0 0 240 160"
    preserveAspectRatio="xMidYMid meet"
    class="w-full h-full text-text-primary transition-all duration-300"
  >
    <defs>
      <!-- State Transition Arrowhead -->
      <marker
        id="state-arrow"
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

    <!-- Initial State -->
    <circle
      cx="25"
      cy="45"
      r="5"
      class="fill-text-primary group-hover:fill-interactive-accent transition-colors duration-300"
    />

    <!-- Initial -> Idle -->
    <line
      x1="30"
      y1="45"
      x2="50"
      y2="45"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
      marker-end="url(#state-arrow)"
    />

    <!-- Idle State -->
    <g class="transition-all duration-300">
      <rect
        x="50"
        y="30"
        width="55"
        height="30"
        rx="6"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <text
        x="77.5"
        y="48"
        text-anchor="middle"
        class="fill-text-primary text-[8px] font-bold font-sans"
      >
        Idle
      </text>
    </g>

    <!-- Idle -> Loading -->
    <line
      x1="105"
      y1="45"
      x2="140"
      y2="45"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
      marker-end="url(#state-arrow)"
    />
    <text
      x="122.5"
      y="38"
      text-anchor="middle"
      class="fill-text-secondary text-[6px] font-mono"
    >
      FETCH
    </text>

    <!-- Loading State -->
    <g class="transition-all duration-300">
      <rect
        x="140"
        y="30"
        width="55"
        height="30"
        rx="6"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <text
        x="167.5"
        y="48"
        text-anchor="middle"
        class="fill-text-primary text-[8px] font-bold font-sans"
      >
        Loading
      </text>
    </g>

    <!-- Loading -> Success -->
    <line
      x1="167.5"
      y1="60"
      x2="167.5"
      y2="95"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
      marker-end="url(#state-arrow)"
    />
    <text
      x="173"
      y="80"
      class="fill-text-secondary text-[6px] font-mono"
    >
      SUCCESS
    </text>

    <!-- Success State -->
    <g class="transition-all duration-300">
      <rect
        x="140"
        y="95"
        width="55"
        height="30"
        rx="6"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <text
        x="167.5"
        y="113"
        text-anchor="middle"
        class="fill-text-primary text-[8px] font-bold font-sans"
      >
        Success
      </text>
    </g>

    <!-- Loading -> Error -->
    <line
      x1="140"
      y1="55"
      x2="105"
      y2="100"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
      marker-end="url(#state-arrow)"
    />
    <text
      x="126"
      y="75"
      class="fill-text-secondary text-[6px] font-mono"
    >
      FAILURE
    </text>

    <!-- Error State -->
    <g class="transition-all duration-300">
      <rect
        x="50"
        y="95"
        width="55"
        height="30"
        rx="6"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <text
        x="77.5"
        y="113"
        text-anchor="middle"
        class="fill-text-primary text-[8px] font-bold font-sans"
      >
        Error
      </text>
    </g>

    <!-- Error -> Idle -->
    <line
      x1="77.5"
      y1="95"
      x2="77.5"
      y2="60"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
      marker-end="url(#state-arrow)"
    />
    <text
      x="69"
      y="80"
      class="fill-text-secondary text-[6px] font-mono"
    >
      RESET
    </text>

    <!-- Success -> Final -->
    <line
      x1="195"
      y1="110"
      x2="207"
      y2="110"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
      marker-end="url(#state-arrow)"
    />

    <!-- Final State -->
    <g class="transition-colors duration-300">
      <circle
        cx="215"
        cy="110"
        r="7"
        fill="none"
        class="stroke-text-primary group-hover:stroke-interactive-accent transition-colors duration-300"
        stroke-width="1.2"
      />
      <circle
        cx="215"
        cy="110"
        r="4"
        class="fill-text-primary group-hover:fill-interactive-accent transition-colors duration-300"
      />
    </g>
  </svg>
</template>
