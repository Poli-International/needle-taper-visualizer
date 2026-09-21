/**
 * Needle Taper Visualizer - Database V2
 * Conical taper dimensional specifications and qualitative dermal dynamics.
 * Taper lengths represent standard industry manufacturing references.
 */

window.TAPER_DATABASE = {
    short: {
        id: "short",
        name_key: "controls.short_taper",
        length_mm: 1.5,
        trauma_level: "high", // 'high' | 'medium' | 'low'
        trauma_level_key: "analysis.trauma_level_high",
        trauma_desc_key: "analysis.trauma_desc_high",
        ink_level: "high",    // 'high' | 'medium' | 'low'
        ink_level_key: "analysis.ink_level_high",
        ink_desc_key: "analysis.ink_desc_high",
        tendency_key: "analysis.tendency_short"
    },
    medium: {
        id: "medium",
        name_key: "controls.medium_taper",
        length_mm: 2.5,
        trauma_level: "medium",
        trauma_level_key: "analysis.trauma_level_medium",
        trauma_desc_key: "analysis.trauma_desc_medium",
        ink_level: "medium",
        ink_level_key: "analysis.ink_level_medium",
        ink_desc_key: "analysis.ink_desc_medium",
        tendency_key: "analysis.tendency_medium"
    },
    long: {
        id: "long",
        name_key: "controls.long_taper",
        length_mm: 6.0,
        trauma_level: "low",
        trauma_level_key: "analysis.trauma_level_low",
        trauma_desc_key: "analysis.trauma_desc_low",
        ink_level: "low",
        ink_level_key: "analysis.ink_level_low",
        ink_desc_key: "analysis.ink_desc_low",
        tendency_key: "analysis.tendency_long"
    },
    extra: {
        id: "extra",
        name_key: "controls.extra_taper",
        length_mm: 8.0,
        trauma_level: "low",
        trauma_level_key: "analysis.trauma_level_low",
        trauma_desc_key: "analysis.trauma_desc_low",
        ink_level: "low",
        ink_level_key: "analysis.ink_level_low",
        ink_desc_key: "analysis.ink_desc_low",
        tendency_key: "analysis.tendency_extra"
    }
};
