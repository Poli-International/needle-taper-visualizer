const TAPER_DATABASE = {
    short: {
        name: "Short Taper (ST)",
        length_mm: 1.5,
        description: "Large impact surface area. High trauma but high pigment delivery.",
        trauma: 85,
        saturation: 95,
        best_use: "Solid Color / Bold Traditional",
        grind: "Short conical grind"
    },
    medium: {
        name: "Medium Taper (MT)",
        length_mm: 2.5,
        description: "Versatile standard. Balanced trauma and pigment retention.",
        trauma: 55,
        saturation: 80,
        best_use: "Linework / General Shading",
        grind: "Standard industrial grind"
    },
    long: {
        name: "Long Taper (LT)",
        length_mm: 6.0,
        description: "Small impact surface. Low trauma, precise pigment placement.",
        trauma: 25,
        saturation: 65,
        best_use: "Fine Line / Realism",
        grind: "Long precision grind"
    },
    extra: {
        name: "Extra Long (ELT)",
        length_mm: 8.0,
        description: "Surgical precision. Minimal trauma, ideal for delicate layers.",
        trauma: 15,
        saturation: 50,
        best_use: "Hyper-Realism / Soft Wash",
        grind: "Extreme conical taper"
    }
};
