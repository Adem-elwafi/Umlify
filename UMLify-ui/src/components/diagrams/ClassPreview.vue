<template>
  <svg
    viewBox="0 0 240 160"
    preserveAspectRatio="xMidYMid meet"
    class="w-full h-full text-text-primary transition-all duration-300"
  >
    <defs>
      <!-- Composition (Filled diamond) -->
      <marker
        id="class-composition"
        viewBox="0 0 12 10"
        refX="0"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path
          d="M 0 5 L 6 1 L 12 5 L 6 9 Z"
          class="fill-text-secondary group-hover:fill-interactive-accent transition-colors duration-300"
          stroke="none"
        />
      </marker>
      <!-- Association (Open arrowhead) -->
      <marker
        id="class-association"
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

    <!-- Connectors -->
    <!-- Customer [Composition] ---> Order -->
    <line
      x1="102"
      y1="40"
      x2="140"
      y2="40"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.5"
      marker-start="url(#class-composition)"
    />
    <!-- Order ---> Product (Association) -->
    <line
      x1="180"
      y1="70"
      x2="180"
      y2="95"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.5"
      marker-end="url(#class-association)"
    />

    <!-- Customer Class Box -->
    <g class="transition-all duration-300">
      <rect
        x="15"
        y="15"
        width="80"
        height="50"
        rx="4"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <line
        x1="15"
        y1="31"
        x2="95"
        y2="31"
        class="stroke-border-default group-hover:stroke-interactive-accent/30 transition-colors duration-300"
        stroke-width="1.2"
      />
      <text
        x="55"
        y="26"
        text-anchor="middle"
        class="fill-text-primary text-[8px] font-bold font-sans"
      >
        Customer
      </text>
      <text
        x="20"
        y="41"
        class="fill-text-secondary text-[6.5px] font-mono"
      >
        + name: String
      </text>
      <text
        x="20"
        y="50"
        class="fill-text-secondary text-[6.5px] font-mono"
      >
        + email: String
      </text>
    </g>

    <!-- Order Class Box -->
    <g class="transition-all duration-300">
      <rect
        x="140"
        y="15"
        width="85"
        height="55"
        rx="4"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <line
        x1="140"
        y1="31"
        x2="225"
        y2="31"
        class="stroke-border-default group-hover:stroke-interactive-accent/30 transition-colors duration-300"
        stroke-width="1.2"
      />
      <line
        x1="140"
        y1="49"
        x2="225"
        y2="49"
        class="stroke-border-default group-hover:stroke-interactive-accent/30 transition-colors duration-300"
        stroke-width="1.2"
      />
      <text
        x="182"
        y="26"
        text-anchor="middle"
        class="fill-text-primary text-[8px] font-bold font-sans"
      >
        Order
      </text>
      <text
        x="145"
        y="41"
        class="fill-text-secondary text-[6.5px] font-mono"
      >
        + date: Date
      </text>
      <text
        x="145"
        y="59"
        class="fill-text-secondary text-[6.5px] font-mono"
      >
        + checkout()
      </text>
    </g>

    <!-- Product Class Box -->
    <g class="transition-all duration-300">
      <rect
        x="140"
        y="95"
        width="85"
        height="50"
        rx="4"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <line
        x1="140"
        y1="111"
        x2="225"
        y2="111"
        class="stroke-border-default group-hover:stroke-interactive-accent/30 transition-colors duration-300"
        stroke-width="1.2"
      />
      <text
        x="182"
        y="106"
        text-anchor="middle"
        class="fill-text-primary text-[8px] font-bold font-sans"
      >
        Product
      </text>
      <text
        x="145"
        y="121"
        class="fill-text-secondary text-[6.5px] font-mono"
      >
        + SKU: String
      </text>
      <text
        x="145"
        y="130"
        class="fill-text-secondary text-[6.5px] font-mono"
      >
        + price: Float
      </text>
    </g>
  </svg>
</template>
