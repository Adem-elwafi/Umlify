<template>
  <svg
    viewBox="0 0 240 160"
    preserveAspectRatio="xMidYMid meet"
    class="w-full h-full text-text-primary transition-all duration-300"
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
        y="58"
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
    <line
      x1="48"
      y1="75"
      x2="115"
      y2="50"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
    />
    <!-- Actor ---> Checkout -->
    <line
      x1="48"
      y1="78"
      x2="115"
      y2="82"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
    />
    <!-- Actor ---> Make Payment -->
    <line
      x1="48"
      y1="82"
      x2="115"
      y2="114"
      class="stroke-text-secondary group-hover:stroke-interactive-accent transition-colors duration-300"
      stroke-width="1.2"
    />
  </svg>
</template>
