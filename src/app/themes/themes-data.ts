import {
  industrial, graphite, crimson, amethyst, cyber, espresso, ember, phosphor,
  midnight, sandstone, mint, tide, rosa, snow, solar, dracula, comfy, neon,
  temporal, latte, prism, meadow, forest, nebula, aurora, slate, scarlet,
  monsoon, pearl, chalk, split, riso, flare, abyss, cobalt, fjord, velvet, eclipse,
  mono, noir,
} from "@dateforge/react-calendar/themes";
import type { CustomTheme } from "@dateforge/react-calendar";

export type ThemePreset = {
  id: string;
  backdrop: string;
  highlight: string;
  type: "dark" | "light";
  mood: string;
  theme: CustomTheme;
};

export const THEMES: ThemePreset[] = [
  // dark (--c-b backdrop is dark)
  { id: "midnight",   backdrop: "#1a1e2b", highlight: "#3559e0", type: "dark",  mood: "Deep Blue",       theme: midnight   },
  { id: "aurora",     backdrop: "#0b0e24", highlight: "#3de0a0", type: "dark",  mood: "Northern Lights", theme: aurora     },
  { id: "cyber",      backdrop: "#07070b", highlight: "#00f3ff", type: "dark",  mood: "Cyberpunk",       theme: cyber      },
  { id: "abyss",      backdrop: "#060009", highlight: "#d400f0", type: "dark",  mood: "Void",            theme: abyss      },
  { id: "nebula",     backdrop: "#0b0a16", highlight: "#b388ff", type: "dark",  mood: "Cosmic",          theme: nebula     },
  { id: "phosphor",   backdrop: "#010401", highlight: "#76ff03", type: "dark",  mood: "Retro Terminal",  theme: phosphor   },
  { id: "temporal",   backdrop: "#14252e", highlight: "#27d1f4", type: "dark",  mood: "Sci-Fi",          theme: temporal   },
  { id: "forest",     backdrop: "#0f2016", highlight: "#4ade80", type: "dark",  mood: "Woodland",        theme: forest     },
  { id: "sandstone",  backdrop: "#1f1c18", highlight: "#e3ae5c", type: "dark",  mood: "Desert",          theme: sandstone  },
  { id: "dracula",    backdrop: "#1c1111", highlight: "#ff5e5e", type: "dark",  mood: "Gothic",          theme: dracula    },
  { id: "crimson",    backdrop: "#0d0909", highlight: "#f92f2f", type: "dark",  mood: "Intense",         theme: crimson    },
  { id: "flare",      backdrop: "#141417", highlight: "#8a8a92", type: "dark",  mood: "Matte",           theme: flare      },
  { id: "industrial", backdrop: "#111111", highlight: "#e85d00", type: "dark",  mood: "Factory",         theme: industrial },
  { id: "espresso",   backdrop: "#0c0608", highlight: "#a05878", type: "dark",  mood: "Café",            theme: espresso   },
  { id: "ember",      backdrop: "#0e0b04", highlight: "#c89020", type: "dark",  mood: "Golden Hour",     theme: ember      },
  { id: "cobalt",     backdrop: "#061323", highlight: "#2563eb", type: "dark",  mood: "Deep Sea",        theme: cobalt     },
  { id: "fjord",      backdrop: "#0e1416", highlight: "#2fa39b", type: "dark",  mood: "Nordic Night",    theme: fjord      },
  { id: "velvet",     backdrop: "#120711", highlight: "#ff4da6", type: "dark",  mood: "Velvet",          theme: velvet     },
  { id: "eclipse",    backdrop: "#080d09", highlight: "#b7e000", type: "dark",  mood: "Lime Glow",       theme: eclipse    },
  { id: "noir",       backdrop: "#111111", highlight: "#ffffff", type: "dark",  mood: "Pure Black",      theme: noir       },
  // light (--c-b backdrop is light)
  { id: "mint",       backdrop: "#f8f9fc", highlight: "#60d276", type: "light", mood: "Fresh",           theme: mint       },
  { id: "tide",       backdrop: "#f0fdff", highlight: "#14b8a6", type: "light", mood: "Ocean",           theme: tide       },
  { id: "prism",      backdrop: "#f0f9ff", highlight: "#0ea5e9", type: "light", mood: "Modern",          theme: prism      },
  { id: "meadow",     backdrop: "#f2faf7", highlight: "#059669", type: "light", mood: "Nature",          theme: meadow     },
  { id: "snow",       backdrop: "#e2e5e9", highlight: "#3a60d6", type: "light", mood: "Crisp",           theme: snow       },
  { id: "slate",      backdrop: "#f1f5f9", highlight: "#475569", type: "light", mood: "Minimal",         theme: slate      },
  { id: "chalk",      backdrop: "#f0f0f3", highlight: "#2a2e5c", type: "light", mood: "Classic",         theme: chalk      },
  { id: "amethyst",   backdrop: "#f5f3f7", highlight: "#681c9e", type: "light", mood: "Royal",           theme: amethyst   },
  { id: "pearl",      backdrop: "#ecebed", highlight: "#3a2a42", type: "light", mood: "Elegant",         theme: pearl      },
  { id: "rosa",       backdrop: "#fef0f4", highlight: "#d64c7f", type: "light", mood: "Blush",           theme: rosa       },
  { id: "neon",       backdrop: "#f7f8f9", highlight: "#80ec27", type: "light", mood: "Electric",        theme: neon       },
  { id: "scarlet",    backdrop: "#fff5f5", highlight: "#d92121", type: "light", mood: "Sharp",           theme: scarlet    },
  { id: "graphite",   backdrop: "#f7f8f9", highlight: "#f1a01d", type: "light", mood: "Warm Steel",      theme: graphite   },
  { id: "solar",      backdrop: "#fffbe8", highlight: "#e67e22", type: "light", mood: "Sunny",           theme: solar      },
  { id: "split",      backdrop: "#fafaf6", highlight: "#e8c43d", type: "light", mood: "Bold",            theme: split      },
  { id: "latte",      backdrop: "#faf8f4", highlight: "#6f3d18", type: "light", mood: "Coffee",          theme: latte      },
  { id: "comfy",      backdrop: "#f2e8e0", highlight: "#c04e2f", type: "light", mood: "Terracotta",      theme: comfy      },
  { id: "monsoon",    backdrop: "#d5ded9", highlight: "#244a3d", type: "light", mood: "Zen",             theme: monsoon    },
  { id: "riso",       backdrop: "#fef7e8", highlight: "#2b3fe0", type: "light", mood: "Vintage",         theme: riso       },
  { id: "mono",       backdrop: "#ffffff", highlight: "#111111", type: "light", mood: "Pure White",      theme: mono       },
];
