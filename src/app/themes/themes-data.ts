import {
  industrial, graphite, crimson, cyber, espresso,
  sandstone, mint, snow, solar, dracula, neon,
  temporal, prism, meadow, nebula, aurora, slate,
  monsoon, pearl, chalk, split, riso, abyss, fjord,
  velvet, eclipse, noir, bauhaus,
} from "@dateforge/react-calendar/themes";
import type { ThemeFamily } from "@dateforge/react-calendar";

export type ThemePreset = {
  id: string;
  backdrop: string;
  accent: string;
  mood: string;
  theme: ThemeFamily;
};

export const THEMES: ThemePreset[] = [
  { id: "nebula",     backdrop: "#0b0a16", accent: "#b388ff", mood: "Cosmic",       theme: nebula     },
  { id: "aurora",     backdrop: "#0b0e24", accent: "#3de0a0", mood: "N. Lights",    theme: aurora     },
  { id: "cyber",      backdrop: "#07070b", accent: "#00f3ff", mood: "Cyberpunk",    theme: cyber      },
  { id: "abyss",      backdrop: "#060009", accent: "#d400f0", mood: "Void",         theme: abyss      },
  { id: "temporal",   backdrop: "#14252e", accent: "#27d1f4", mood: "Sci-Fi",       theme: temporal   },
  { id: "industrial", backdrop: "#111111", accent: "#e85d00", mood: "Factory",      theme: industrial },
  { id: "espresso",   backdrop: "#0c0608", accent: "#a05878", mood: "Café",         theme: espresso   },
  { id: "crimson",    backdrop: "#0d0909", accent: "#f92f2f", mood: "Intense",      theme: crimson    },
  { id: "dracula",    backdrop: "#1c1111", accent: "#ff5e5e", mood: "Gothic",       theme: dracula    },
  { id: "fjord",      backdrop: "#0e1416", accent: "#2fa39b", mood: "Nordic",       theme: fjord      },
  { id: "velvet",     backdrop: "#120711", accent: "#ff4da6", mood: "Velvet",       theme: velvet     },
  { id: "eclipse",    backdrop: "#080d09", accent: "#b7e000", mood: "Lime Glow",    theme: eclipse    },
  { id: "noir",       backdrop: "#111111", accent: "#ffffff", mood: "Pure Black",   theme: noir       },
  { id: "bauhaus",    backdrop: "#161420", accent: "#d8d1b8", mood: "Modernist",    theme: bauhaus    },
  { id: "sandstone",  backdrop: "#1f1c18", accent: "#e3ae5c", mood: "Desert",       theme: sandstone  },
  { id: "graphite",   backdrop: "#f7f8f9", accent: "#f1a01d", mood: "Warm Steel",   theme: graphite   },
  { id: "mint",       backdrop: "#f8f9fc", accent: "#60d276", mood: "Fresh",        theme: mint       },
  { id: "prism",      backdrop: "#f0f9ff", accent: "#0ea5e9", mood: "Modern",       theme: prism      },
  { id: "meadow",     backdrop: "#f2faf7", accent: "#059669", mood: "Nature",       theme: meadow     },
  { id: "snow",       backdrop: "#e2e5e9", accent: "#3a60d6", mood: "Crisp",        theme: snow       },
  { id: "slate",      backdrop: "#f1f5f9", accent: "#475569", mood: "Minimal",      theme: slate      },
  { id: "chalk",      backdrop: "#f0f0f3", accent: "#2a2e5c", mood: "Classic",      theme: chalk      },
  { id: "pearl",      backdrop: "#ecebed", accent: "#3a2a42", mood: "Elegant",      theme: pearl      },
  { id: "neon",       backdrop: "#f7f8f9", accent: "#80ec27", mood: "Electric",     theme: neon       },
  { id: "solar",      backdrop: "#fffbe8", accent: "#e67e22", mood: "Sunny",        theme: solar      },
  { id: "split",      backdrop: "#fafaf6", accent: "#e8c43d", mood: "Bold",         theme: split      },
  { id: "monsoon",    backdrop: "#d5ded9", accent: "#244a3d", mood: "Zen",          theme: monsoon    },
  { id: "riso",       backdrop: "#fef7e8", accent: "#2b3fe0", mood: "Vintage",      theme: riso       },
];
