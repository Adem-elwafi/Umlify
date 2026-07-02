<template>
  <svg
    viewBox="0 0 240 160"
    preserveAspectRatio="xMidYMid meet"
    class="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
  >
    <!-- System Boundary -->
    <rect
      x="90"
      y="15"
      width="135"
      height="130"
      rx="6"
      class="fill-bg-surface/10 stroke-border-default group-hover:stroke-interactive-accent/30 transition-colors duration-300"
      stroke-width="1.2"
    />
    <text
      x="157"
      y="28"
      text-anchor="middle"
      class="fill-text-secondary text-[7.5px] font-bold uppercase tracking-wider font-sans"
    >
      Store App
    </text>

    <!-- Actor (Customer) -->
    <g class="transition-all duration-300">
      <!-- Head -->
      <circle
        cx="35"
        cy="58"
        r="7.5"
        class="fill-bg-base stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
        stroke-width="1.8"
      />
      <!-- Spine -->
      <line
        x1="35"
        y1="65.5"
        x2="35"
        y2="92"
        class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
        stroke-width="1.8"
      />
      <!-- Arms -->
      <line
        x1="22"
        y1="75"
        x2="48"
        y2="75"
        class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
        stroke-width="1.8"
      />
      <!-- Left Leg -->
      <line
        x1="35"
        y1="92"
        x2="24"
        y2="112"
        class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
        stroke-width="1.8"
      />
      <!-- Right Leg -->
      <line
        x1="35"
        y1="92"
        x2="46"
        y2="112"
        class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
        stroke-width="1.8"
      />
      <!-- Label -->
      <text
        x="35"
        y="126"
        text-anchor="middle"
        class="fill-text-primary text-[8px] font-bold font-sans"
      >
        Customer
      </text>
    </g>

    <!-- Use Cases (Ellipses) -->
    <!-- Use Case 1: Search Items -->
    <g>
      <ellipse
        cx="157"
        cy="50"
        rx="42"
        ry="13"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <text
        x="157"
        y="53"
        text-anchor="middle"
        class="fill-text-primary text-[7px] font-medium font-sans"
      >
        Search Items
      </text>
    </g>

    <!-- Use Case 2: Checkout -->
    <g>
      <ellipse
        cx="157"
        cy="82"
        rx="42"
        ry="13"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <text
        x="157"
        y="85"
        text-anchor="middle"
        class="fill-text-primary text-[7px] font-medium font-sans"
      >
        Checkout
      </text>
    </g>

    <!-- Use Case 3: Make Payment -->
    <g>
      <ellipse
        cx="157"
        cy="114"
        rx="42"
        ry="13"
        class="fill-bg-base stroke-border-default group-hover:stroke-interactive-accent/50 transition-colors duration-300"
        stroke-width="1.5"
      />
      <text
        x="157"
        y="117"
        text-anchor="middle"
        class="fill-text-primary text-[7px] font-medium font-sans"
      >
        Make Payment
      </text>
    </g>

    <!-- Associations -->
    <!-- Actor ---> Search Items -->
    <path
      d="M 48 75 L 115 50"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
    />
    <!-- Actor ---> Checkout -->
    <path
      d="M 48 78 L 115 82"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
    />
    <!-- Actor ---> Make Payment -->
    <path
      d="M 48 82 L 115 114"
      class="stroke-zinc-400 dark:stroke-zinc-500 fill-none stroke-[1.5px] group-hover:stroke-interactive-accent group-hover:stroke-[2.5px] transition-colors duration-300"
    />
  </svg>
</template>
