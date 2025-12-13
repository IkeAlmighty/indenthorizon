const RAW_MATERIAL_CATEGORIES = ["metals", "crystals", "organics", "exotics"];

const REFINED_MATERIAL_CATEGORIES = [
  "alloys",
  "compounds",
  "polymers",
  "rareMaterials",
];

const COMPOSITE_MATERIAL_CATEGORIES = ["alloys", "compounds", "polymers"];

const ADVANCED_MATERIAL_CATEGORIES = ["voidMatter", "quantumFoam"];

const MYTHOLOGICAL_MATERIAL_CATEGORIES = ["darkMatter", "exoticParticles"];

export const MATERIAL_CATEGORIES = [
  ...RAW_MATERIAL_CATEGORIES,
  ...REFINED_MATERIAL_CATEGORIES,
];

export const MATERIALS = {
  // Raw Materials
  iron: { category: "metals" },
  copper: { category: "metals" },
  silver: { category: "metals" },
  gold: { category: "metals" },
  diamond: { category: "crystals" },
  quartz: { category: "crystals" },
  silicon: { category: "crystals" },
  ice: { category: "organics" },
  water: { category: "organics" },
  methane: { category: "organics" },
  antimatter: { category: "exotics" },

  // Refined Materials
  steel: { category: "alloys", components: { iron: 2, carbon: 1 } },
  bronze: { category: "alloys", components: { copper: 3, tin: 1 } },
  aluminumAlloy: { category: "alloys", components: { aluminum: 4, copper: 1 } },
  plastic: { category: "polymers", components: { oil: 2, chemicals: 1 } },
  glass: { category: "compounds", components: { sand: 3, sodaAsh: 1 } },
  syntheticCrystal: {
    category: "rareMaterials",
    components: { quartz: 2, chemicals: 2 },
  },
};
