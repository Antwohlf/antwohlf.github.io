window.__BACKGROUND_APPROVAL__ = {
  "version": 1,
  "generated_at": "2026-03-16T04:45:20.118Z",
  "policy": {
    "winter_default_status": "approved",
    "nonwinter_default_status": "fallback_only",
    "nonwinter_rendering_policy": "blocked_pairs_fall_back_to_winter",
    "promotion_policy": "manual_approved_remote_assets_only"
  },
  "summary": {
    "approved_assets": 128,
    "fallback_only_assets": 160,
    "validator_failure_count": 0,
    "validator_status": "pass",
    "validator_exit_code": 0,
    "reason_counts": {
      "deterministic_nonwinter_fallback_only": 192,
      "manual_curated_candidate_approved": 16,
      "manual_curated_candidate_promoted": 8,
      "manual_curated_gemini_candidate": 64,
      "too_similar_to_winter_reference": 80
    },
    "location_season_counts": {
      "annarbor:fall": {
        "approved": 16
      },
      "annarbor:spring": {
        "fallback_only": 16
      },
      "annarbor:summer": {
        "fallback_only": 16
      },
      "detroit:fall": {
        "approved": 16
      },
      "detroit:spring": {
        "approved": 16
      },
      "detroit:summer": {
        "fallback_only": 16
      },
      "losangeles:fall": {
        "fallback_only": 16
      },
      "losangeles:spring": {
        "fallback_only": 16
      },
      "losangeles:summer": {
        "fallback_only": 16
      },
      "nyc:fall": {
        "approved": 16
      },
      "nyc:spring": {
        "approved": 16
      },
      "nyc:summer": {
        "fallback_only": 16
      },
      "sansebastian:fall": {
        "fallback_only": 16
      },
      "sansebastian:spring": {
        "fallback_only": 16
      },
      "sansebastian:summer": {
        "fallback_only": 16
      },
      "tokyo:fall": {
        "approved": 16
      },
      "tokyo:spring": {
        "fallback_only": 16
      },
      "tokyo:summer": {
        "fallback_only": 16
      }
    }
  },
  "assets": {
    "tokyo_spring_morning_clear.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "spring",
        "segment": "morning",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 10.855,
        "winter_mean_abs_rgb_channels": [
          11.7598,
          6.3934,
          14.4118
        ],
        "snow_ratio": 0.031496,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "tokyo_spring_morning_partly.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "spring",
        "segment": "morning",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 14.0376,
        "winter_mean_abs_rgb_channels": [
          17.7294,
          9.5507,
          14.8326
        ],
        "snow_ratio": 0.031496,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "tokyo_spring_morning_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "spring",
        "segment": "morning",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 14.5547,
        "winter_mean_abs_rgb_channels": [
          17.9324,
          8.5698,
          17.162
        ],
        "snow_ratio": 0.031496,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "tokyo_spring_morning_dark.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "spring",
        "segment": "morning",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 23.7322,
        "winter_mean_abs_rgb_channels": [
          20.716,
          19.3373,
          31.1432
        ],
        "snow_ratio": 0.031496,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "tokyo_summer_morning_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "tokyo",
        "season": "summer",
        "segment": "morning",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 13.6301,
        "winter_mean_abs_rgb_channels": [
          13.8065,
          8.966,
          18.1177
        ],
        "snow_ratio": 0.031373,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "tokyo_summer_morning_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "tokyo",
        "season": "summer",
        "segment": "morning",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 16.5651,
        "winter_mean_abs_rgb_channels": [
          20.2833,
          11.9533,
          17.4587
        ],
        "snow_ratio": 0.031373,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "tokyo_summer_morning_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "tokyo",
        "season": "summer",
        "segment": "morning",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 16.7405,
        "winter_mean_abs_rgb_channels": [
          20.1337,
          10.6286,
          19.4592
        ],
        "snow_ratio": 0.031373,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "tokyo_summer_morning_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "tokyo",
        "season": "summer",
        "segment": "morning",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 25.7671,
        "winter_mean_abs_rgb_channels": [
          22.5712,
          21.2216,
          33.5084
        ],
        "snow_ratio": 0.031373,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "tokyo_fall_morning_clear.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "fall",
        "segment": "morning",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 13.958,
        "winter_mean_abs_rgb_channels": [
          14.1842,
          9.3986,
          18.2912
        ],
        "snow_ratio": 0.03132,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/tokyo-fall-candidates"
    },
    "tokyo_fall_morning_partly.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "fall",
        "segment": "morning",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 16.5561,
        "winter_mean_abs_rgb_channels": [
          19.1291,
          12.1186,
          18.4205
        ],
        "snow_ratio": 0.03132,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/tokyo-fall-candidates"
    },
    "tokyo_fall_morning_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "fall",
        "segment": "morning",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 17.4223,
        "winter_mean_abs_rgb_channels": [
          20.0153,
          11.6835,
          20.568
        ],
        "snow_ratio": 0.03132,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/tokyo-fall-candidates"
    },
    "tokyo_fall_morning_dark.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "fall",
        "segment": "morning",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 26.4128,
        "winter_mean_abs_rgb_channels": [
          22.5684,
          22.1553,
          34.5148
        ],
        "snow_ratio": 0.03132,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/tokyo-fall-candidates"
    },
    "tokyo_spring_day_clear.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "spring",
        "segment": "day",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 16.867,
        "winter_mean_abs_rgb_channels": [
          15.7819,
          10.6396,
          24.1796
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "tokyo_spring_day_partly.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "spring",
        "segment": "day",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 25.4877,
        "winter_mean_abs_rgb_channels": [
          33.9807,
          17.9908,
          24.4916
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "tokyo_spring_day_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "spring",
        "segment": "day",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 29.348,
        "winter_mean_abs_rgb_channels": [
          40.3006,
          17.1463,
          30.597
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "tokyo_spring_day_dark.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "spring",
        "segment": "day",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 41.6472,
        "winter_mean_abs_rgb_channels": [
          25.191,
          36.3065,
          63.4441
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "tokyo_summer_day_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "tokyo",
        "season": "summer",
        "segment": "day",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 21.5572,
        "winter_mean_abs_rgb_channels": [
          19.3075,
          14.6579,
          30.7062
        ],
        "snow_ratio": 0.000003,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "tokyo_summer_day_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "tokyo",
        "season": "summer",
        "segment": "day",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 28.5978,
        "winter_mean_abs_rgb_channels": [
          35.5117,
          21.3277,
          28.954
        ],
        "snow_ratio": 0.000003,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "tokyo_summer_day_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "tokyo",
        "season": "summer",
        "segment": "day",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 31.7917,
        "winter_mean_abs_rgb_channels": [
          41.8365,
          19.6709,
          33.8676
        ],
        "snow_ratio": 0.000003,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "tokyo_summer_day_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "tokyo",
        "season": "summer",
        "segment": "day",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 44.2309,
        "winter_mean_abs_rgb_channels": [
          26.5595,
          39.0629,
          67.0703
        ],
        "snow_ratio": 0.000003,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "tokyo_fall_day_clear.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "fall",
        "segment": "day",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 23.0043,
        "winter_mean_abs_rgb_channels": [
          20.8989,
          16.9834,
          31.1305
        ],
        "snow_ratio": 0.000004,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/tokyo-fall-candidates"
    },
    "tokyo_fall_day_partly.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "fall",
        "segment": "day",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 30.504,
        "winter_mean_abs_rgb_channels": [
          36.8674,
          23.4247,
          31.22
        ],
        "snow_ratio": 0.000004,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/tokyo-fall-candidates"
    },
    "tokyo_fall_day_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "fall",
        "segment": "day",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 34.5972,
        "winter_mean_abs_rgb_channels": [
          43.6561,
          22.8355,
          37.2998
        ],
        "snow_ratio": 0.000004,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/tokyo-fall-candidates"
    },
    "tokyo_fall_day_dark.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "fall",
        "segment": "day",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 46.6039,
        "winter_mean_abs_rgb_channels": [
          28.2556,
          41.9056,
          69.6505
        ],
        "snow_ratio": 0.000004,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/tokyo-fall-candidates"
    },
    "tokyo_spring_evening_clear.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "spring",
        "segment": "evening",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 0.5836,
        "winter_mean_abs_rgb_channels": [
          0.3805,
          0.6504,
          0.7199
        ],
        "snow_ratio": 0.000003,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "tokyo_spring_evening_partly.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "spring",
        "segment": "evening",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 7.9556,
        "winter_mean_abs_rgb_channels": [
          5.2561,
          9.2326,
          9.3783
        ],
        "snow_ratio": 0.000003,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "tokyo_spring_evening_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "spring",
        "segment": "evening",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 12.5182,
        "winter_mean_abs_rgb_channels": [
          6.8176,
          15.2401,
          15.497
        ],
        "snow_ratio": 0.000003,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "tokyo_spring_evening_dark.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "spring",
        "segment": "evening",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 5.0334,
        "winter_mean_abs_rgb_channels": [
          9.7103,
          2.9739,
          2.4161
        ],
        "snow_ratio": 0.000003,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "tokyo_summer_evening_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "tokyo",
        "season": "summer",
        "segment": "evening",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 4.9311,
        "winter_mean_abs_rgb_channels": [
          5.8453,
          5.9957,
          2.9523
        ],
        "snow_ratio": 0.000003,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "tokyo_summer_evening_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "tokyo",
        "season": "summer",
        "segment": "evening",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 13.466,
        "winter_mean_abs_rgb_channels": [
          11.1174,
          16.1833,
          13.0974
        ],
        "snow_ratio": 0.000003,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "tokyo_summer_evening_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "tokyo",
        "season": "summer",
        "segment": "evening",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 16.2883,
        "winter_mean_abs_rgb_channels": [
          11.0812,
          20.3709,
          17.4129
        ],
        "snow_ratio": 0.000003,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "tokyo_summer_evening_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "tokyo",
        "season": "summer",
        "segment": "evening",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 8.894,
        "winter_mean_abs_rgb_channels": [
          14.0637,
          8.1981,
          4.4201
        ],
        "snow_ratio": 0.000003,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "tokyo_fall_evening_clear.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "fall",
        "segment": "evening",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 5.8407,
        "winter_mean_abs_rgb_channels": [
          8.3535,
          5.8824,
          3.2862
        ],
        "snow_ratio": 0.000003,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/tokyo-fall-candidates"
    },
    "tokyo_fall_evening_partly.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "fall",
        "segment": "evening",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 13.3713,
        "winter_mean_abs_rgb_channels": [
          12.9594,
          14.8179,
          12.3365
        ],
        "snow_ratio": 0.000003,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/tokyo-fall-candidates"
    },
    "tokyo_fall_evening_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "fall",
        "segment": "evening",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 17.5686,
        "winter_mean_abs_rgb_channels": [
          14.5363,
          20.3212,
          17.8482
        ],
        "snow_ratio": 0.000003,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/tokyo-fall-candidates"
    },
    "tokyo_fall_evening_dark.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "fall",
        "segment": "evening",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 9.9244,
        "winter_mean_abs_rgb_channels": [
          17.285,
          7.9213,
          4.5669
        ],
        "snow_ratio": 0.000003,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/tokyo-fall-candidates"
    },
    "tokyo_spring_night_clear.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "spring",
        "segment": "night",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 0.6126,
        "winter_mean_abs_rgb_channels": [
          1.0674,
          0.2339,
          0.5365
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "tokyo_spring_night_partly.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "spring",
        "segment": "night",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 26.3248,
        "winter_mean_abs_rgb_channels": [
          30.2225,
          26.3829,
          22.3691
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "tokyo_spring_night_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "spring",
        "segment": "night",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 35.5513,
        "winter_mean_abs_rgb_channels": [
          41.7376,
          35.778,
          29.1383
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "tokyo_spring_night_dark.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "spring",
        "segment": "night",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 12.6944,
        "winter_mean_abs_rgb_channels": [
          17.8131,
          12.5882,
          7.682
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "tokyo_summer_night_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "tokyo",
        "season": "summer",
        "segment": "night",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 6.3321,
        "winter_mean_abs_rgb_channels": [
          6.4698,
          7.7563,
          4.7701
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "tokyo_summer_night_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "tokyo",
        "season": "summer",
        "segment": "night",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 31.3722,
        "winter_mean_abs_rgb_channels": [
          34.7816,
          33.4489,
          25.8861
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "tokyo_summer_night_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "tokyo",
        "season": "summer",
        "segment": "night",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 40.0106,
        "winter_mean_abs_rgb_channels": [
          45.7256,
          42.2278,
          32.0784
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "tokyo_summer_night_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "tokyo",
        "season": "summer",
        "segment": "night",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 17.8377,
        "winter_mean_abs_rgb_channels": [
          22.7255,
          19.5834,
          11.2043
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "tokyo_fall_night_clear.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "fall",
        "segment": "night",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 8.3858,
        "winter_mean_abs_rgb_channels": [
          13.3495,
          7.4057,
          4.4021
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/tokyo-fall-candidates"
    },
    "tokyo_fall_night_partly.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "fall",
        "segment": "night",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 32.4651,
        "winter_mean_abs_rgb_channels": [
          40.4418,
          32.1432,
          24.8103
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/tokyo-fall-candidates"
    },
    "tokyo_fall_night_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "fall",
        "segment": "night",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 43.5492,
        "winter_mean_abs_rgb_channels": [
          54.0989,
          43.4018,
          33.147
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/tokyo-fall-candidates"
    },
    "tokyo_fall_night_dark.png": {
      "status": "approved",
      "requested": {
        "location": "tokyo",
        "season": "fall",
        "segment": "night",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 19.755,
        "winter_mean_abs_rgb_channels": [
          28.9214,
          19.1477,
          11.1958
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/tokyo-fall-candidates"
    },
    "losangeles_spring_morning_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "spring",
        "segment": "morning",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 2.2142,
        "winter_mean_abs_rgb_channels": [
          2.5057,
          1.1626,
          2.9743
        ],
        "snow_ratio": 0.000173,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_spring_morning_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "spring",
        "segment": "morning",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 3.9285,
        "winter_mean_abs_rgb_channels": [
          5.0554,
          2.9157,
          3.8145
        ],
        "snow_ratio": 0.000173,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_spring_morning_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "spring",
        "segment": "morning",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 5.1729,
        "winter_mean_abs_rgb_channels": [
          6.3065,
          4.4042,
          4.8081
        ],
        "snow_ratio": 0.000173,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_spring_morning_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "spring",
        "segment": "morning",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 17.8732,
        "winter_mean_abs_rgb_channels": [
          19.3471,
          17.2102,
          17.0625
        ],
        "snow_ratio": 0.000173,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_summer_morning_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "summer",
        "segment": "morning",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 7.3332,
        "winter_mean_abs_rgb_channels": [
          7.9954,
          7.5865,
          6.4178
        ],
        "snow_ratio": 0.000177,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_summer_morning_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "summer",
        "segment": "morning",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 8.2856,
        "winter_mean_abs_rgb_channels": [
          9.7352,
          8.4907,
          6.6309
        ],
        "snow_ratio": 0.000177,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_summer_morning_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "summer",
        "segment": "morning",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 9.9185,
        "winter_mean_abs_rgb_channels": [
          11.3114,
          10.4802,
          7.9639
        ],
        "snow_ratio": 0.000177,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_summer_morning_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "summer",
        "segment": "morning",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 22.4615,
        "winter_mean_abs_rgb_channels": [
          24.2975,
          23.0952,
          19.9918
        ],
        "snow_ratio": 0.000177,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_fall_morning_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "fall",
        "segment": "morning",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 7.2987,
        "winter_mean_abs_rgb_channels": [
          9.1538,
          6.2218,
          6.5205
        ],
        "snow_ratio": 0.000168,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_fall_morning_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "fall",
        "segment": "morning",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 8.7276,
        "winter_mean_abs_rgb_channels": [
          11.2855,
          7.8223,
          7.075
        ],
        "snow_ratio": 0.000168,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_fall_morning_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "fall",
        "segment": "morning",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 10.0149,
        "winter_mean_abs_rgb_channels": [
          12.7387,
          9.2749,
          8.031
        ],
        "snow_ratio": 0.000168,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_fall_morning_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "fall",
        "segment": "morning",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 22.7724,
        "winter_mean_abs_rgb_channels": [
          25.8365,
          22.1325,
          20.3481
        ],
        "snow_ratio": 0.000168,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_spring_day_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "spring",
        "segment": "day",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 5.2501,
        "winter_mean_abs_rgb_channels": [
          5.4163,
          2.8223,
          7.5117
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_spring_day_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "spring",
        "segment": "day",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 11.0547,
        "winter_mean_abs_rgb_channels": [
          16.9948,
          5.4995,
          10.6698
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_spring_day_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "spring",
        "segment": "day",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 14.7547,
        "winter_mean_abs_rgb_channels": [
          18.6567,
          6.8446,
          18.7629
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_spring_day_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "spring",
        "segment": "day",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 38.3359,
        "winter_mean_abs_rgb_channels": [
          22.7585,
          39.2566,
          52.9926
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_summer_day_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "summer",
        "segment": "day",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 12.3464,
        "winter_mean_abs_rgb_channels": [
          12.7475,
          10.1588,
          14.1328
        ],
        "snow_ratio": 0.000013,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_summer_day_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "summer",
        "segment": "day",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 16.2807,
        "winter_mean_abs_rgb_channels": [
          22.2179,
          11.5582,
          15.0659
        ],
        "snow_ratio": 0.000013,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_summer_day_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "summer",
        "segment": "day",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 20.1711,
        "winter_mean_abs_rgb_channels": [
          24.6719,
          12.6295,
          23.2121
        ],
        "snow_ratio": 0.000013,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_summer_day_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "summer",
        "segment": "day",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 43.8871,
        "winter_mean_abs_rgb_channels": [
          29.0556,
          44.9427,
          57.663
        ],
        "snow_ratio": 0.000013,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_fall_day_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "fall",
        "segment": "day",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 15.5892,
        "winter_mean_abs_rgb_channels": [
          15.9669,
          13.4447,
          17.356
        ],
        "snow_ratio": 0.000059,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_fall_day_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "fall",
        "segment": "day",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 19.4955,
        "winter_mean_abs_rgb_channels": [
          23.6765,
          14.8481,
          19.9618
        ],
        "snow_ratio": 0.000059,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_fall_day_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "fall",
        "segment": "day",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 23.9393,
        "winter_mean_abs_rgb_channels": [
          27.741,
          16.2142,
          27.8627
        ],
        "snow_ratio": 0.000059,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_fall_day_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "fall",
        "segment": "day",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 46.9146,
        "winter_mean_abs_rgb_channels": [
          31.1166,
          48.2123,
          61.4148
        ],
        "snow_ratio": 0.000059,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_spring_evening_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "spring",
        "segment": "evening",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 0.817,
        "winter_mean_abs_rgb_channels": [
          0.7055,
          0.6914,
          1.054
        ],
        "snow_ratio": 0.003053,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_spring_evening_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "spring",
        "segment": "evening",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 8.0364,
        "winter_mean_abs_rgb_channels": [
          7.3903,
          9.1371,
          7.5818
        ],
        "snow_ratio": 0.003053,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_spring_evening_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "spring",
        "segment": "evening",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 9.4748,
        "winter_mean_abs_rgb_channels": [
          8.9455,
          11.1921,
          8.2868
        ],
        "snow_ratio": 0.003053,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_spring_evening_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "spring",
        "segment": "evening",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 4.7666,
        "winter_mean_abs_rgb_channels": [
          6.0256,
          2.5215,
          5.7527
        ],
        "snow_ratio": 0.003053,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_summer_evening_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "summer",
        "segment": "evening",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 6.9681,
        "winter_mean_abs_rgb_channels": [
          7.2048,
          7.8397,
          5.8598
        ],
        "snow_ratio": 0.003053,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_summer_evening_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "summer",
        "segment": "evening",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 14.7316,
        "winter_mean_abs_rgb_channels": [
          14.5519,
          17.1728,
          12.4702
        ],
        "snow_ratio": 0.003053,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_summer_evening_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "summer",
        "segment": "evening",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 15.4738,
        "winter_mean_abs_rgb_channels": [
          15.1686,
          18.568,
          12.6849
        ],
        "snow_ratio": 0.003053,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_summer_evening_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "summer",
        "segment": "evening",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 10.731,
        "winter_mean_abs_rgb_channels": [
          12.301,
          9.9317,
          9.9602
        ],
        "snow_ratio": 0.003053,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_fall_evening_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "fall",
        "segment": "evening",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 7.0721,
        "winter_mean_abs_rgb_channels": [
          9.0149,
          7.2146,
          4.9869
        ],
        "snow_ratio": 0.003054,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_fall_evening_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "fall",
        "segment": "evening",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 14.463,
        "winter_mean_abs_rgb_channels": [
          16.4583,
          15.7184,
          11.2124
        ],
        "snow_ratio": 0.003054,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_fall_evening_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "fall",
        "segment": "evening",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 15.7382,
        "winter_mean_abs_rgb_channels": [
          17.3758,
          17.6804,
          12.1582
        ],
        "snow_ratio": 0.003054,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_fall_evening_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "fall",
        "segment": "evening",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 10.787,
        "winter_mean_abs_rgb_channels": [
          14.1736,
          8.8653,
          9.322
        ],
        "snow_ratio": 0.003054,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_spring_night_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "spring",
        "segment": "night",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 0.7681,
        "winter_mean_abs_rgb_channels": [
          0.881,
          0.8515,
          0.5719
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_spring_night_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "spring",
        "segment": "night",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 24.2767,
        "winter_mean_abs_rgb_channels": [
          25.4845,
          24.8293,
          22.5165
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_spring_night_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "spring",
        "segment": "night",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 39.235,
        "winter_mean_abs_rgb_channels": [
          41.5687,
          40.2992,
          35.8371
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_spring_night_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "spring",
        "segment": "night",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 17.9743,
        "winter_mean_abs_rgb_channels": [
          19.7933,
          19.0066,
          15.1231
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_summer_night_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "summer",
        "segment": "night",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 10.098,
        "winter_mean_abs_rgb_channels": [
          10.6369,
          12.4488,
          7.2083
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_summer_night_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "summer",
        "segment": "night",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 32.5112,
        "winter_mean_abs_rgb_channels": [
          34.0934,
          35.3476,
          28.0926
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_summer_night_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "summer",
        "segment": "night",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 48.4967,
        "winter_mean_abs_rgb_channels": [
          51.3863,
          51.8766,
          42.2271
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_summer_night_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "summer",
        "segment": "night",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 26.2819,
        "winter_mean_abs_rgb_channels": [
          28.6365,
          29.5357,
          20.6734
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_fall_night_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "fall",
        "segment": "night",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 11.3043,
        "winter_mean_abs_rgb_channels": [
          16.3426,
          11.3972,
          6.1732
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_fall_night_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "fall",
        "segment": "night",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 38.2305,
        "winter_mean_abs_rgb_channels": [
          44.4682,
          38.9555,
          31.2676
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_fall_night_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "fall",
        "segment": "night",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 49.008,
        "winter_mean_abs_rgb_channels": [
          56.0651,
          50.1947,
          40.7642
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "losangeles_fall_night_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "losangeles",
        "season": "fall",
        "segment": "night",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 27.6455,
        "winter_mean_abs_rgb_channels": [
          33.9632,
          28.8734,
          20.1
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.015
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "annarbor_spring_morning_clear.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "spring",
        "segment": "morning",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 6.5166,
        "winter_mean_abs_rgb_channels": [
          6.8763,
          3.8575,
          8.8161
        ],
        "snow_ratio": 0.005425,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "annarbor_spring_morning_partly.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "spring",
        "segment": "morning",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 13.0532,
        "winter_mean_abs_rgb_channels": [
          15.3549,
          10.7785,
          13.0264
        ],
        "snow_ratio": 0.005425,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "annarbor_spring_morning_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "spring",
        "segment": "morning",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 14.2804,
        "winter_mean_abs_rgb_channels": [
          18.0213,
          12.0642,
          12.7556
        ],
        "snow_ratio": 0.005425,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "annarbor_spring_morning_dark.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "spring",
        "segment": "morning",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 12.6406,
        "winter_mean_abs_rgb_channels": [
          11.0082,
          8.9716,
          17.942
        ],
        "snow_ratio": 0.005425,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "annarbor_summer_morning_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "annarbor",
        "season": "summer",
        "segment": "morning",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 9.5117,
        "winter_mean_abs_rgb_channels": [
          9.5651,
          6.793,
          12.1769
        ],
        "snow_ratio": 0.005382,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "annarbor_summer_morning_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "annarbor",
        "season": "summer",
        "segment": "morning",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 15.8674,
        "winter_mean_abs_rgb_channels": [
          18.3779,
          13.7593,
          15.465
        ],
        "snow_ratio": 0.005382,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "annarbor_summer_morning_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "annarbor",
        "season": "summer",
        "segment": "morning",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 16.7206,
        "winter_mean_abs_rgb_channels": [
          20.3949,
          14.6216,
          15.1452
        ],
        "snow_ratio": 0.005382,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "annarbor_summer_morning_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "annarbor",
        "season": "summer",
        "segment": "morning",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 15.0642,
        "winter_mean_abs_rgb_channels": [
          13.3153,
          11.6767,
          20.2007
        ],
        "snow_ratio": 0.005382,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "annarbor_fall_morning_clear.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "fall",
        "segment": "morning",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 10.0423,
        "winter_mean_abs_rgb_channels": [
          10.7907,
          6.808,
          12.5283
        ],
        "snow_ratio": 0.005282,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/annarbor-fall-candidates"
    },
    "annarbor_fall_morning_partly.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "fall",
        "segment": "morning",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 16.5873,
        "winter_mean_abs_rgb_channels": [
          19.1996,
          14.0002,
          16.5622
        ],
        "snow_ratio": 0.005282,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/annarbor-fall-candidates"
    },
    "annarbor_fall_morning_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "fall",
        "segment": "morning",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 17.6611,
        "winter_mean_abs_rgb_channels": [
          21.7905,
          15.0774,
          16.1153
        ],
        "snow_ratio": 0.005282,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/annarbor-fall-candidates"
    },
    "annarbor_fall_morning_dark.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "fall",
        "segment": "morning",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 15.9163,
        "winter_mean_abs_rgb_channels": [
          14.6005,
          11.9869,
          21.1616
        ],
        "snow_ratio": 0.005282,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/annarbor-fall-candidates"
    },
    "annarbor_spring_day_clear.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "spring",
        "segment": "day",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 9.8296,
        "winter_mean_abs_rgb_channels": [
          9.3949,
          6.1009,
          13.9931
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "annarbor_spring_day_partly.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "spring",
        "segment": "day",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 16.392,
        "winter_mean_abs_rgb_channels": [
          19.9754,
          11.6057,
          17.5949
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "annarbor_spring_day_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "spring",
        "segment": "day",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 20.4931,
        "winter_mean_abs_rgb_channels": [
          25.4058,
          12.1081,
          23.9655
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "annarbor_spring_day_dark.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "spring",
        "segment": "day",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 32.6249,
        "winter_mean_abs_rgb_channels": [
          20.5969,
          30.2809,
          46.9969
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "annarbor_summer_day_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "annarbor",
        "season": "summer",
        "segment": "day",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 14.2789,
        "winter_mean_abs_rgb_channels": [
          12.6712,
          10.6851,
          19.4803
        ],
        "snow_ratio": 0.000029,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "annarbor_summer_day_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "annarbor",
        "season": "summer",
        "segment": "day",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 20.8318,
        "winter_mean_abs_rgb_channels": [
          24.6633,
          16.6362,
          21.1959
        ],
        "snow_ratio": 0.000029,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "annarbor_summer_day_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "annarbor",
        "season": "summer",
        "segment": "day",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 23.7584,
        "winter_mean_abs_rgb_channels": [
          28.0246,
          16.034,
          27.2166
        ],
        "snow_ratio": 0.000029,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "annarbor_summer_day_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "annarbor",
        "season": "summer",
        "segment": "day",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 35.2892,
        "winter_mean_abs_rgb_channels": [
          22.6592,
          33.3942,
          49.814
        ],
        "snow_ratio": 0.000029,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "annarbor_fall_day_clear.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "fall",
        "segment": "day",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 16.0273,
        "winter_mean_abs_rgb_channels": [
          15.7059,
          11.9988,
          20.3771
        ],
        "snow_ratio": 0.000004,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/annarbor-fall-candidates"
    },
    "annarbor_fall_day_partly.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "fall",
        "segment": "day",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 22.8332,
        "winter_mean_abs_rgb_channels": [
          26.7488,
          17.6158,
          24.135
        ],
        "snow_ratio": 0.000004,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/annarbor-fall-candidates"
    },
    "annarbor_fall_day_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "fall",
        "segment": "day",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 25.8192,
        "winter_mean_abs_rgb_channels": [
          30.2238,
          17.0211,
          30.2128
        ],
        "snow_ratio": 0.000004,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/annarbor-fall-candidates"
    },
    "annarbor_fall_day_dark.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "fall",
        "segment": "day",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 37.5894,
        "winter_mean_abs_rgb_channels": [
          25.2815,
          35.002,
          52.4847
        ],
        "snow_ratio": 0.000004,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/annarbor-fall-candidates"
    },
    "annarbor_spring_evening_clear.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "spring",
        "segment": "evening",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 2.0844,
        "winter_mean_abs_rgb_channels": [
          2.3024,
          1.4053,
          2.5456
        ],
        "snow_ratio": 0.000651,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "annarbor_spring_evening_partly.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "spring",
        "segment": "evening",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 10.971,
        "winter_mean_abs_rgb_channels": [
          11.1638,
          11.1121,
          10.637
        ],
        "snow_ratio": 0.000651,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "annarbor_spring_evening_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "spring",
        "segment": "evening",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 16.1007,
        "winter_mean_abs_rgb_channels": [
          16.4789,
          16.9688,
          14.8543
        ],
        "snow_ratio": 0.000651,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "annarbor_spring_evening_dark.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "spring",
        "segment": "evening",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 5.748,
        "winter_mean_abs_rgb_channels": [
          6.7848,
          5.3399,
          5.1193
        ],
        "snow_ratio": 0.000651,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "annarbor_summer_evening_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "annarbor",
        "season": "summer",
        "segment": "evening",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 5.8682,
        "winter_mean_abs_rgb_channels": [
          6.3937,
          5.4629,
          5.7479
        ],
        "snow_ratio": 0.000652,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "annarbor_summer_evening_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "annarbor",
        "season": "summer",
        "segment": "evening",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 14.8832,
        "winter_mean_abs_rgb_channels": [
          15.6809,
          15.4267,
          13.5421
        ],
        "snow_ratio": 0.000652,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "annarbor_summer_evening_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "annarbor",
        "season": "summer",
        "segment": "evening",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 19.8697,
        "winter_mean_abs_rgb_channels": [
          20.6295,
          21.3173,
          17.6624
        ],
        "snow_ratio": 0.000652,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "annarbor_summer_evening_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "annarbor",
        "season": "summer",
        "segment": "evening",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 9.3474,
        "winter_mean_abs_rgb_channels": [
          10.7486,
          9.6694,
          7.6242
        ],
        "snow_ratio": 0.000652,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "annarbor_fall_evening_clear.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "fall",
        "segment": "evening",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 6.6853,
        "winter_mean_abs_rgb_channels": [
          8.4812,
          5.7635,
          5.8112
        ],
        "snow_ratio": 0.000651,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/annarbor-fall-candidates"
    },
    "annarbor_fall_evening_partly.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "fall",
        "segment": "evening",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 17.4694,
        "winter_mean_abs_rgb_channels": [
          19.4268,
          17.461,
          15.5203
        ],
        "snow_ratio": 0.000651,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/annarbor-fall-candidates"
    },
    "annarbor_fall_evening_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "fall",
        "segment": "evening",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 20.1108,
        "winter_mean_abs_rgb_channels": [
          22.1433,
          20.6614,
          17.5277
        ],
        "snow_ratio": 0.000651,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/annarbor-fall-candidates"
    },
    "annarbor_fall_evening_dark.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "fall",
        "segment": "evening",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 10.3582,
        "winter_mean_abs_rgb_channels": [
          13.1032,
          9.9819,
          7.9897
        ],
        "snow_ratio": 0.000651,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/annarbor-fall-candidates"
    },
    "annarbor_spring_night_clear.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "spring",
        "segment": "night",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 32.3314,
        "winter_mean_abs_rgb_channels": [
          29.7264,
          30.6112,
          36.6566
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "annarbor_spring_night_partly.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "spring",
        "segment": "night",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 43.9354,
        "winter_mean_abs_rgb_channels": [
          44.3252,
          42.6866,
          44.7943
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "annarbor_spring_night_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "spring",
        "segment": "night",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 51.166,
        "winter_mean_abs_rgb_channels": [
          53.2666,
          50.0903,
          50.141
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "annarbor_spring_night_dark.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "spring",
        "segment": "night",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 36.3008,
        "winter_mean_abs_rgb_channels": [
          37.2329,
          35.0698,
          36.5996
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "annarbor_summer_night_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "annarbor",
        "season": "summer",
        "segment": "night",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 31.7329,
        "winter_mean_abs_rgb_channels": [
          29.7534,
          28.4436,
          37.0018
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "annarbor_summer_night_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "annarbor",
        "season": "summer",
        "segment": "night",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 43.0242,
        "winter_mean_abs_rgb_channels": [
          43.9639,
          40.2465,
          44.8621
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "annarbor_summer_night_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "annarbor",
        "season": "summer",
        "segment": "night",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 50.8986,
        "winter_mean_abs_rgb_channels": [
          53.317,
          48.3136,
          51.0652
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "annarbor_summer_night_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "annarbor",
        "season": "summer",
        "segment": "night",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 35.7557,
        "winter_mean_abs_rgb_channels": [
          37.1354,
          33.0371,
          37.0946
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "annarbor_fall_night_clear.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "fall",
        "segment": "night",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 31.5984,
        "winter_mean_abs_rgb_channels": [
          26.6673,
          29.8211,
          38.3069
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/annarbor-fall-candidates"
    },
    "annarbor_fall_night_partly.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "fall",
        "segment": "night",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 43.0907,
        "winter_mean_abs_rgb_channels": [
          41.3214,
          41.8169,
          46.1339
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/annarbor-fall-candidates"
    },
    "annarbor_fall_night_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "fall",
        "segment": "night",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 50.5303,
        "winter_mean_abs_rgb_channels": [
          50.0532,
          49.4117,
          52.1261
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/annarbor-fall-candidates"
    },
    "annarbor_fall_night_dark.png": {
      "status": "approved",
      "requested": {
        "location": "annarbor",
        "season": "fall",
        "segment": "night",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 35.5211,
        "winter_mean_abs_rgb_channels": [
          34.0736,
          34.1052,
          38.3846
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/annarbor-fall-candidates"
    },
    "detroit_spring_morning_clear.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "spring",
        "segment": "morning",
        "sky": "clear"
      },
      "reasons": [
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 5.2015,
        "winter_mean_abs_rgb_channels": [
          4.9141,
          2.7459,
          7.9445
        ],
        "snow_ratio": 0.001982,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "detroit_spring_morning_partly.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "spring",
        "segment": "morning",
        "sky": "partly"
      },
      "reasons": [
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 9.0127,
        "winter_mean_abs_rgb_channels": [
          10.0832,
          6.5041,
          10.4507
        ],
        "snow_ratio": 0.001982,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "detroit_spring_morning_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "spring",
        "segment": "morning",
        "sky": "cloudy"
      },
      "reasons": [
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 9.0348,
        "winter_mean_abs_rgb_channels": [
          11.1289,
          5.6533,
          10.3222
        ],
        "snow_ratio": 0.001982,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "detroit_spring_morning_dark.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "spring",
        "segment": "morning",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 15.075,
        "winter_mean_abs_rgb_channels": [
          14.5809,
          12.0766,
          18.5676
        ],
        "snow_ratio": 0.001982,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "detroit_summer_morning_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "detroit",
        "season": "summer",
        "segment": "morning",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 8.5169,
        "winter_mean_abs_rgb_channels": [
          8.3693,
          5.9791,
          11.2022
        ],
        "snow_ratio": 0.001982,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "detroit_summer_morning_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "detroit",
        "season": "summer",
        "segment": "morning",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 11.8104,
        "winter_mean_abs_rgb_channels": [
          13.0307,
          9.432,
          12.9686
        ],
        "snow_ratio": 0.001982,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "detroit_summer_morning_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "detroit",
        "season": "summer",
        "segment": "morning",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 12.084,
        "winter_mean_abs_rgb_channels": [
          14.6229,
          8.7618,
          12.8672
        ],
        "snow_ratio": 0.001982,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "detroit_summer_morning_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "detroit",
        "season": "summer",
        "segment": "morning",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 18.0223,
        "winter_mean_abs_rgb_channels": [
          17.7156,
          15.1586,
          21.1927
        ],
        "snow_ratio": 0.001982,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "detroit_fall_morning_clear.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "fall",
        "segment": "morning",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 9.1142,
        "winter_mean_abs_rgb_channels": [
          9.5282,
          6.1136,
          11.7009
        ],
        "snow_ratio": 0.00199,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/detroit-fall-candidates"
    },
    "detroit_fall_morning_partly.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "fall",
        "segment": "morning",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 12.6861,
        "winter_mean_abs_rgb_channels": [
          14.4135,
          9.7567,
          13.8882
        ],
        "snow_ratio": 0.00199,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/detroit-fall-candidates"
    },
    "detroit_fall_morning_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "fall",
        "segment": "morning",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 12.924,
        "winter_mean_abs_rgb_channels": [
          15.8732,
          9.1658,
          13.733
        ],
        "snow_ratio": 0.00199,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/detroit-fall-candidates"
    },
    "detroit_fall_morning_dark.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "fall",
        "segment": "morning",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 18.9024,
        "winter_mean_abs_rgb_channels": [
          19.1038,
          15.551,
          22.0526
        ],
        "snow_ratio": 0.00199,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/detroit-fall-candidates"
    },
    "detroit_spring_day_clear.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "spring",
        "segment": "day",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 14.8923,
        "winter_mean_abs_rgb_channels": [
          12.9601,
          9.7265,
          21.9903
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "detroit_spring_day_partly.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "spring",
        "segment": "day",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 17.6092,
        "winter_mean_abs_rgb_channels": [
          16.6726,
          11.7022,
          24.4528
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "detroit_spring_day_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "spring",
        "segment": "day",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 21.0326,
        "winter_mean_abs_rgb_channels": [
          17.5456,
          15.4349,
          30.1174
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "detroit_spring_day_dark.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "spring",
        "segment": "day",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 46.8528,
        "winter_mean_abs_rgb_channels": [
          40.7067,
          42.7757,
          57.0759
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "detroit_summer_day_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "detroit",
        "season": "summer",
        "segment": "day",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 17.7807,
        "winter_mean_abs_rgb_channels": [
          14.0925,
          12.6996,
          26.5501
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "detroit_summer_day_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "detroit",
        "season": "summer",
        "segment": "day",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 19.9431,
        "winter_mean_abs_rgb_channels": [
          18.433,
          13.9562,
          27.4401
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "detroit_summer_day_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "detroit",
        "season": "summer",
        "segment": "day",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 22.8444,
        "winter_mean_abs_rgb_channels": [
          18.2344,
          17.2416,
          33.057
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "detroit_summer_day_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "detroit",
        "season": "summer",
        "segment": "day",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 48.545,
        "winter_mean_abs_rgb_channels": [
          41.5581,
          44.2789,
          59.7979
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "detroit_fall_day_clear.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "fall",
        "segment": "day",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 21.1012,
        "winter_mean_abs_rgb_channels": [
          16.5947,
          16.3334,
          30.3754
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/detroit-fall-candidates"
    },
    "detroit_fall_day_partly.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "fall",
        "segment": "day",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 22.9182,
        "winter_mean_abs_rgb_channels": [
          19.1963,
          17.3555,
          32.2028
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/detroit-fall-candidates"
    },
    "detroit_fall_day_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "fall",
        "segment": "day",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 25.8717,
        "winter_mean_abs_rgb_channels": [
          19.3539,
          20.6983,
          37.563
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/detroit-fall-candidates"
    },
    "detroit_fall_day_dark.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "fall",
        "segment": "day",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 51.3562,
        "winter_mean_abs_rgb_channels": [
          42.5719,
          47.5525,
          63.9443
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/detroit-fall-candidates"
    },
    "detroit_spring_evening_clear.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "spring",
        "segment": "evening",
        "sky": "clear"
      },
      "reasons": [
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 0.7818,
        "winter_mean_abs_rgb_channels": [
          0.7147,
          0.7023,
          0.9285
        ],
        "snow_ratio": 0.000217,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "detroit_spring_evening_partly.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "spring",
        "segment": "evening",
        "sky": "partly"
      },
      "reasons": [
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 8.2639,
        "winter_mean_abs_rgb_channels": [
          6.6158,
          8.7606,
          9.4153
        ],
        "snow_ratio": 0.000217,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "detroit_spring_evening_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "spring",
        "segment": "evening",
        "sky": "cloudy"
      },
      "reasons": [
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 10.2766,
        "winter_mean_abs_rgb_channels": [
          9.0118,
          10.6472,
          11.171
        ],
        "snow_ratio": 0.000217,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "detroit_spring_evening_dark.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "spring",
        "segment": "evening",
        "sky": "dark"
      },
      "reasons": [
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 5.8996,
        "winter_mean_abs_rgb_channels": [
          9.8151,
          4.2081,
          3.6757
        ],
        "snow_ratio": 0.000217,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "detroit_summer_evening_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "detroit",
        "season": "summer",
        "segment": "evening",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 4.3864,
        "winter_mean_abs_rgb_channels": [
          4.5465,
          5.026,
          3.5867
        ],
        "snow_ratio": 0.000217,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "detroit_summer_evening_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "detroit",
        "season": "summer",
        "segment": "evening",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 10.6339,
        "winter_mean_abs_rgb_channels": [
          9.3764,
          12.1689,
          10.3565
        ],
        "snow_ratio": 0.000217,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "detroit_summer_evening_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "detroit",
        "season": "summer",
        "segment": "evening",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 13.2955,
        "winter_mean_abs_rgb_channels": [
          11.95,
          14.877,
          13.0596
        ],
        "snow_ratio": 0.000217,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "detroit_summer_evening_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "detroit",
        "season": "summer",
        "segment": "evening",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 8.9574,
        "winter_mean_abs_rgb_channels": [
          12.8441,
          8.5235,
          5.5046
        ],
        "snow_ratio": 0.000217,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "detroit_fall_evening_clear.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "fall",
        "segment": "evening",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 5.1735,
        "winter_mean_abs_rgb_channels": [
          7.3877,
          4.4612,
          3.6715
        ],
        "snow_ratio": 0.000217,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/detroit-fall-candidates"
    },
    "detroit_fall_evening_partly.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "fall",
        "segment": "evening",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 10.8333,
        "winter_mean_abs_rgb_channels": [
          11.5321,
          10.6473,
          10.3206
        ],
        "snow_ratio": 0.000217,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/detroit-fall-candidates"
    },
    "detroit_fall_evening_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "fall",
        "segment": "evening",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 14.383,
        "winter_mean_abs_rgb_channels": [
          15.2471,
          14.3571,
          13.5447
        ],
        "snow_ratio": 0.000217,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/detroit-fall-candidates"
    },
    "detroit_fall_evening_dark.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "fall",
        "segment": "evening",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 9.9034,
        "winter_mean_abs_rgb_channels": [
          16.0284,
          7.8128,
          5.8691
        ],
        "snow_ratio": 0.000217,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/detroit-fall-candidates"
    },
    "detroit_spring_night_clear.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "spring",
        "segment": "night",
        "sky": "clear"
      },
      "reasons": [
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 1.0101,
        "winter_mean_abs_rgb_channels": [
          1.2161,
          0.7651,
          1.0491
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "detroit_spring_night_partly.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "spring",
        "segment": "night",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 25.5472,
        "winter_mean_abs_rgb_channels": [
          26.8998,
          25.7341,
          24.0077
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "detroit_spring_night_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "spring",
        "segment": "night",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 35.2358,
        "winter_mean_abs_rgb_channels": [
          37.3626,
          35.6692,
          32.6756
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "detroit_spring_night_dark.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "spring",
        "segment": "night",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_candidate_promoted"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 14.599,
        "winter_mean_abs_rgb_channels": [
          16.2802,
          15.0579,
          12.4587
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_curated_candidate_promoted"
    },
    "detroit_summer_night_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "detroit",
        "season": "summer",
        "segment": "night",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 5.8483,
        "winter_mean_abs_rgb_channels": [
          5.7996,
          7.261,
          4.4844
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "detroit_summer_night_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "detroit",
        "season": "summer",
        "segment": "night",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 28.0384,
        "winter_mean_abs_rgb_channels": [
          29.0199,
          29.8921,
          25.2032
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "detroit_summer_night_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "detroit",
        "season": "summer",
        "segment": "night",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 40.2575,
        "winter_mean_abs_rgb_channels": [
          42.193,
          42.4124,
          36.1672
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "detroit_summer_night_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "detroit",
        "season": "summer",
        "segment": "night",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 18.6122,
        "winter_mean_abs_rgb_channels": [
          20.1098,
          20.7023,
          15.0244
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "detroit_fall_night_clear.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "fall",
        "segment": "night",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 7.8875,
        "winter_mean_abs_rgb_channels": [
          12.3065,
          6.8355,
          4.5206
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/detroit-fall-candidates"
    },
    "detroit_fall_night_partly.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "fall",
        "segment": "night",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 31.1681,
        "winter_mean_abs_rgb_channels": [
          36.5182,
          30.5908,
          26.3955
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/detroit-fall-candidates"
    },
    "detroit_fall_night_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "fall",
        "segment": "night",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 41.0859,
        "winter_mean_abs_rgb_channels": [
          47.2236,
          40.7984,
          35.2357
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/detroit-fall-candidates"
    },
    "detroit_fall_night_dark.png": {
      "status": "approved",
      "requested": {
        "location": "detroit",
        "season": "fall",
        "segment": "night",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 21.0165,
        "winter_mean_abs_rgb_channels": [
          26.485,
          20.7764,
          15.7881
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/detroit-fall-candidates"
    },
    "nyc_spring_morning_clear.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "spring",
        "segment": "morning",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_candidate_approved"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 6.743,
        "winter_mean_abs_rgb_channels": [
          8.1094,
          3.5569,
          8.5628
        ],
        "snow_ratio": 0.005626,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_curated_candidate"
    },
    "nyc_spring_morning_partly.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "spring",
        "segment": "morning",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_candidate_approved"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 7.9713,
        "winter_mean_abs_rgb_channels": [
          9.9386,
          4.7052,
          9.27
        ],
        "snow_ratio": 0.005626,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_curated_candidate"
    },
    "nyc_spring_morning_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "spring",
        "segment": "morning",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_candidate_approved"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 13.9599,
        "winter_mean_abs_rgb_channels": [
          14.5695,
          10.2752,
          17.0349
        ],
        "snow_ratio": 0.005626,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_curated_candidate"
    },
    "nyc_spring_morning_dark.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "spring",
        "segment": "morning",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_candidate_approved"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 19.2569,
        "winter_mean_abs_rgb_channels": [
          20.0803,
          15.7126,
          21.9778
        ],
        "snow_ratio": 0.005626,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_curated_candidate"
    },
    "nyc_summer_morning_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "nyc",
        "season": "summer",
        "segment": "morning",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 9.5508,
        "winter_mean_abs_rgb_channels": [
          10.9,
          5.9776,
          11.7749
        ],
        "snow_ratio": 0.005494,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "nyc_summer_morning_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "nyc",
        "season": "summer",
        "segment": "morning",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 10.473,
        "winter_mean_abs_rgb_channels": [
          12.6575,
          6.9447,
          11.8169
        ],
        "snow_ratio": 0.005494,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "nyc_summer_morning_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "nyc",
        "season": "summer",
        "segment": "morning",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 16.3208,
        "winter_mean_abs_rgb_channels": [
          17.1441,
          12.3191,
          19.4994
        ],
        "snow_ratio": 0.005494,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "nyc_summer_morning_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "nyc",
        "season": "summer",
        "segment": "morning",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 21.6605,
        "winter_mean_abs_rgb_channels": [
          22.6828,
          17.8169,
          24.4817
        ],
        "snow_ratio": 0.005494,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "nyc_fall_morning_clear.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "fall",
        "segment": "morning",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 10.1456,
        "winter_mean_abs_rgb_channels": [
          11.2941,
          6.5305,
          12.6121
        ],
        "snow_ratio": 0.005476,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/nyc-fall-candidates"
    },
    "nyc_fall_morning_partly.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "fall",
        "segment": "morning",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 11.1788,
        "winter_mean_abs_rgb_channels": [
          12.9252,
          7.5177,
          13.0934
        ],
        "snow_ratio": 0.005476,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/nyc-fall-candidates"
    },
    "nyc_fall_morning_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "fall",
        "segment": "morning",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 17.311,
        "winter_mean_abs_rgb_channels": [
          17.8604,
          13.2881,
          20.7845
        ],
        "snow_ratio": 0.005476,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/nyc-fall-candidates"
    },
    "nyc_fall_morning_dark.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "fall",
        "segment": "morning",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 22.5945,
        "winter_mean_abs_rgb_channels": [
          23.1925,
          18.6911,
          25.8998
        ],
        "snow_ratio": 0.005476,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/nyc-fall-candidates"
    },
    "nyc_spring_day_clear.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "spring",
        "segment": "day",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_candidate_approved"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 22.4611,
        "winter_mean_abs_rgb_channels": [
          20.7201,
          15.3683,
          31.2949
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_curated_candidate"
    },
    "nyc_spring_day_partly.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "spring",
        "segment": "day",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_candidate_approved"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 27.2319,
        "winter_mean_abs_rgb_channels": [
          29.2722,
          18.1568,
          34.2668
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_curated_candidate"
    },
    "nyc_spring_day_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "spring",
        "segment": "day",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_candidate_approved"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 32.0239,
        "winter_mean_abs_rgb_channels": [
          33.5661,
          21.0796,
          41.4259
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_curated_candidate"
    },
    "nyc_spring_day_dark.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "spring",
        "segment": "day",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_candidate_approved"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 51.1485,
        "winter_mean_abs_rgb_channels": [
          37.9417,
          45.918,
          69.5857
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_curated_candidate"
    },
    "nyc_summer_day_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "nyc",
        "season": "summer",
        "segment": "day",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 26.046,
        "winter_mean_abs_rgb_channels": [
          23.1824,
          18.651,
          36.3047
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "nyc_summer_day_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "nyc",
        "season": "summer",
        "segment": "day",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 29.5398,
        "winter_mean_abs_rgb_channels": [
          30.8473,
          20.6334,
          37.1388
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "nyc_summer_day_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "nyc",
        "season": "summer",
        "segment": "day",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 34.3369,
        "winter_mean_abs_rgb_channels": [
          35.4441,
          22.8667,
          44.7
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "nyc_summer_day_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "nyc",
        "season": "summer",
        "segment": "day",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 53.0464,
        "winter_mean_abs_rgb_channels": [
          39.1808,
          47.4275,
          72.5311
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "nyc_fall_day_clear.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "fall",
        "segment": "day",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 28.2954,
        "winter_mean_abs_rgb_channels": [
          24.8338,
          21.6283,
          38.4242
        ],
        "snow_ratio": 0.000056,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/nyc-fall-candidates"
    },
    "nyc_fall_day_partly.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "fall",
        "segment": "day",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 32.262,
        "winter_mean_abs_rgb_channels": [
          31.9442,
          23.7925,
          41.0494
        ],
        "snow_ratio": 0.000056,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/nyc-fall-candidates"
    },
    "nyc_fall_day_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "fall",
        "segment": "day",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 37.1067,
        "winter_mean_abs_rgb_channels": [
          36.4362,
          26.6714,
          48.2126
        ],
        "snow_ratio": 0.000056,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/nyc-fall-candidates"
    },
    "nyc_fall_day_dark.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "fall",
        "segment": "day",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 55.6638,
        "winter_mean_abs_rgb_channels": [
          39.9043,
          51.0754,
          76.0118
        ],
        "snow_ratio": 0.000056,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/nyc-fall-candidates"
    },
    "nyc_spring_evening_clear.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "spring",
        "segment": "evening",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_candidate_approved"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 3.1301,
        "winter_mean_abs_rgb_channels": [
          3.9303,
          1.4957,
          3.9642
        ],
        "snow_ratio": 0.002697,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_curated_candidate"
    },
    "nyc_spring_evening_partly.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "spring",
        "segment": "evening",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_candidate_approved"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 9.5805,
        "winter_mean_abs_rgb_channels": [
          10.1012,
          8.6456,
          9.9947
        ],
        "snow_ratio": 0.002697,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_curated_candidate"
    },
    "nyc_spring_evening_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "spring",
        "segment": "evening",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_candidate_approved"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 13.9518,
        "winter_mean_abs_rgb_channels": [
          14.1269,
          13.8216,
          13.9069
        ],
        "snow_ratio": 0.002697,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_curated_candidate"
    },
    "nyc_spring_evening_dark.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "spring",
        "segment": "evening",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_candidate_approved"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 6.4591,
        "winter_mean_abs_rgb_channels": [
          8.023,
          3.9874,
          7.367
        ],
        "snow_ratio": 0.002697,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_curated_candidate"
    },
    "nyc_summer_evening_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "nyc",
        "season": "summer",
        "segment": "evening",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 6.3703,
        "winter_mean_abs_rgb_channels": [
          7.7657,
          4.2657,
          7.0796
        ],
        "snow_ratio": 0.002656,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "nyc_summer_evening_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "nyc",
        "season": "summer",
        "segment": "evening",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 14.662,
        "winter_mean_abs_rgb_channels": [
          15.5762,
          13.6995,
          14.7104
        ],
        "snow_ratio": 0.002656,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "nyc_summer_evening_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "nyc",
        "season": "summer",
        "segment": "evening",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 16.8233,
        "winter_mean_abs_rgb_channels": [
          17.512,
          16.5343,
          16.4235
        ],
        "snow_ratio": 0.002656,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "nyc_summer_evening_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "nyc",
        "season": "summer",
        "segment": "evening",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 9.2292,
        "winter_mean_abs_rgb_channels": [
          11.426,
          6.5851,
          9.6766
        ],
        "snow_ratio": 0.002656,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "nyc_fall_evening_clear.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "fall",
        "segment": "evening",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 7.3552,
        "winter_mean_abs_rgb_channels": [
          8.9104,
          5.1443,
          8.0108
        ],
        "snow_ratio": 0.002645,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/nyc-fall-candidates"
    },
    "nyc_fall_evening_partly.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "fall",
        "segment": "evening",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 14.9608,
        "winter_mean_abs_rgb_channels": [
          15.9658,
          13.6438,
          15.2727
        ],
        "snow_ratio": 0.002645,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/nyc-fall-candidates"
    },
    "nyc_fall_evening_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "fall",
        "segment": "evening",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 18.0108,
        "winter_mean_abs_rgb_channels": [
          18.9338,
          17.3743,
          17.7244
        ],
        "snow_ratio": 0.002645,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/nyc-fall-candidates"
    },
    "nyc_fall_evening_dark.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "fall",
        "segment": "evening",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 10.3154,
        "winter_mean_abs_rgb_channels": [
          12.6357,
          7.3986,
          10.9121
        ],
        "snow_ratio": 0.002645,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/nyc-fall-candidates"
    },
    "nyc_spring_night_clear.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "spring",
        "segment": "night",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_candidate_approved"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 5.754,
        "winter_mean_abs_rgb_channels": [
          5.6466,
          3.0325,
          8.5829
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_curated_candidate"
    },
    "nyc_spring_night_partly.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "spring",
        "segment": "night",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_candidate_approved"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 19.2738,
        "winter_mean_abs_rgb_channels": [
          22.3819,
          18.5054,
          16.9341
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_curated_candidate"
    },
    "nyc_spring_night_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "spring",
        "segment": "night",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_candidate_approved"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 22.296,
        "winter_mean_abs_rgb_channels": [
          27.3111,
          22.8139,
          16.7628
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_curated_candidate"
    },
    "nyc_spring_night_dark.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "spring",
        "segment": "night",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_candidate_approved"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 17.5664,
        "winter_mean_abs_rgb_channels": [
          14.5202,
          10.2529,
          27.9261
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_curated_candidate"
    },
    "nyc_summer_night_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "nyc",
        "season": "summer",
        "segment": "night",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 9.8415,
        "winter_mean_abs_rgb_channels": [
          9.3716,
          7.1667,
          12.9862
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "nyc_summer_night_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "nyc",
        "season": "summer",
        "segment": "night",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 20.9738,
        "winter_mean_abs_rgb_channels": [
          23.1928,
          20.2744,
          19.4542
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "nyc_summer_night_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "nyc",
        "season": "summer",
        "segment": "night",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 25.2624,
        "winter_mean_abs_rgb_channels": [
          29.7281,
          26.0158,
          20.0433
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "nyc_summer_night_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "nyc",
        "season": "summer",
        "segment": "night",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 20.9534,
        "winter_mean_abs_rgb_channels": [
          17.8553,
          14.1078,
          30.897
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "nyc_fall_night_clear.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "fall",
        "segment": "night",
        "sky": "clear"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 11.2293,
        "winter_mean_abs_rgb_channels": [
          12.4719,
          7.2819,
          13.9343
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/nyc-fall-candidates"
    },
    "nyc_fall_night_partly.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "fall",
        "segment": "night",
        "sky": "partly"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 22.4742,
        "winter_mean_abs_rgb_channels": [
          26.4286,
          20.5132,
          20.4808
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/nyc-fall-candidates"
    },
    "nyc_fall_night_cloudy.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "fall",
        "segment": "night",
        "sky": "cloudy"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 27.1097,
        "winter_mean_abs_rgb_channels": [
          33.5611,
          26.6697,
          21.0983
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/nyc-fall-candidates"
    },
    "nyc_fall_night_dark.png": {
      "status": "approved",
      "requested": {
        "location": "nyc",
        "season": "fall",
        "segment": "night",
        "sky": "dark"
      },
      "reasons": [
        "manual_curated_gemini_candidate"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 22.3591,
        "winter_mean_abs_rgb_channels": [
          21.0567,
          14.3798,
          31.6407
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "manual_approved_local_curated_asset",
      "approved_from": "review/current-pass/nyc-fall-candidates"
    },
    "sansebastian_spring_morning_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "spring",
        "segment": "morning",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 5.4917,
        "winter_mean_abs_rgb_channels": [
          6.6501,
          2.0796,
          7.7455
        ],
        "snow_ratio": 0.052956,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_spring_morning_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "spring",
        "segment": "morning",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 7.9361,
        "winter_mean_abs_rgb_channels": [
          10.9567,
          3.6814,
          9.1703
        ],
        "snow_ratio": 0.052956,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_spring_morning_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "spring",
        "segment": "morning",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 9.2347,
        "winter_mean_abs_rgb_channels": [
          12.769,
          4.848,
          10.0871
        ],
        "snow_ratio": 0.052956,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_spring_morning_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "spring",
        "segment": "morning",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 20.599,
        "winter_mean_abs_rgb_channels": [
          24.5877,
          16.184,
          21.0252
        ],
        "snow_ratio": 0.052956,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_summer_morning_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "summer",
        "segment": "morning",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 8.0079,
        "winter_mean_abs_rgb_channels": [
          9.8556,
          3.8094,
          10.3586
        ],
        "snow_ratio": 0.052918,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_summer_morning_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "summer",
        "segment": "morning",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 9.5186,
        "winter_mean_abs_rgb_channels": [
          12.5698,
          4.8139,
          11.1719
        ],
        "snow_ratio": 0.052918,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_summer_morning_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "summer",
        "segment": "morning",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 11.3754,
        "winter_mean_abs_rgb_channels": [
          15.3137,
          6.4477,
          12.3649
        ],
        "snow_ratio": 0.052918,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_summer_morning_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "summer",
        "segment": "morning",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 22.4639,
        "winter_mean_abs_rgb_channels": [
          26.8107,
          17.5166,
          23.0645
        ],
        "snow_ratio": 0.052918,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_fall_morning_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "fall",
        "segment": "morning",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 8.5477,
        "winter_mean_abs_rgb_channels": [
          8.7407,
          5.1932,
          11.7091
        ],
        "snow_ratio": 0.052918,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_fall_morning_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "fall",
        "segment": "morning",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 10.4468,
        "winter_mean_abs_rgb_channels": [
          12.1891,
          6.4886,
          12.6627
        ],
        "snow_ratio": 0.052918,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_fall_morning_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "fall",
        "segment": "morning",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 12.1786,
        "winter_mean_abs_rgb_channels": [
          14.7729,
          7.8995,
          13.8633
        ],
        "snow_ratio": 0.052918,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_fall_morning_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "fall",
        "segment": "morning",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 23.4268,
        "winter_mean_abs_rgb_channels": [
          26.5182,
          19.1065,
          24.6556
        ],
        "snow_ratio": 0.052918,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_spring_day_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "spring",
        "segment": "day",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 6.2283,
        "winter_mean_abs_rgb_channels": [
          7.3945,
          3.6307,
          7.6599
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_spring_day_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "spring",
        "segment": "day",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 12.1065,
        "winter_mean_abs_rgb_channels": [
          15.6464,
          8.0661,
          12.6069
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_spring_day_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "spring",
        "segment": "day",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 16.4077,
        "winter_mean_abs_rgb_channels": [
          18.541,
          11.5274,
          19.1546
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_spring_day_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "spring",
        "segment": "day",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 28.9545,
        "winter_mean_abs_rgb_channels": [
          23.6187,
          27.948,
          35.2968
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_summer_day_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "summer",
        "segment": "day",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 10.4549,
        "winter_mean_abs_rgb_channels": [
          10.1171,
          8.6035,
          12.6441
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_summer_day_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "summer",
        "segment": "day",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 14.9446,
        "winter_mean_abs_rgb_channels": [
          17.9772,
          11.6409,
          15.2158
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_summer_day_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "summer",
        "segment": "day",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 19.5909,
        "winter_mean_abs_rgb_channels": [
          21.0942,
          15.3176,
          22.3611
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_summer_day_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "summer",
        "segment": "day",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 31.8369,
        "winter_mean_abs_rgb_channels": [
          26.1569,
          31.0765,
          38.2775
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_fall_day_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "fall",
        "segment": "day",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 12.3839,
        "winter_mean_abs_rgb_channels": [
          13.714,
          9.4284,
          14.0092
        ],
        "snow_ratio": 0.000001,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_fall_day_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "fall",
        "segment": "day",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 17.9634,
        "winter_mean_abs_rgb_channels": [
          21.3163,
          13.3714,
          19.2025
        ],
        "snow_ratio": 0.000001,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_fall_day_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "fall",
        "segment": "day",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 21.9493,
        "winter_mean_abs_rgb_channels": [
          23.9674,
          16.6872,
          25.1933
        ],
        "snow_ratio": 0.000001,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_fall_day_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "fall",
        "segment": "day",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 34.2186,
        "winter_mean_abs_rgb_channels": [
          28.7767,
          32.7153,
          41.1637
        ],
        "snow_ratio": 0.000001,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_spring_evening_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "spring",
        "segment": "evening",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 0.7703,
        "winter_mean_abs_rgb_channels": [
          0.5926,
          0.6923,
          1.0261
        ],
        "snow_ratio": 0.000032,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_spring_evening_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "spring",
        "segment": "evening",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 7.1584,
        "winter_mean_abs_rgb_channels": [
          3.7627,
          8.0206,
          9.6919
        ],
        "snow_ratio": 0.000032,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_spring_evening_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "spring",
        "segment": "evening",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 9.2429,
        "winter_mean_abs_rgb_channels": [
          5.0269,
          10.158,
          12.5439
        ],
        "snow_ratio": 0.000032,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_spring_evening_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "spring",
        "segment": "evening",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 5.9011,
        "winter_mean_abs_rgb_channels": [
          11.6728,
          3.2448,
          2.7858
        ],
        "snow_ratio": 0.000032,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_summer_evening_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "summer",
        "segment": "evening",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 3.9932,
        "winter_mean_abs_rgb_channels": [
          4.5024,
          4.7279,
          2.7492
        ],
        "snow_ratio": 0.000032,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_summer_evening_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "summer",
        "segment": "evening",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 9.533,
        "winter_mean_abs_rgb_channels": [
          6.4824,
          11.6349,
          10.4819
        ],
        "snow_ratio": 0.000032,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_summer_evening_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "summer",
        "segment": "evening",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 12.1974,
        "winter_mean_abs_rgb_channels": [
          7.8446,
          14.5323,
          14.2154
        ],
        "snow_ratio": 0.000032,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_summer_evening_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "summer",
        "segment": "evening",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 8.5371,
        "winter_mean_abs_rgb_channels": [
          14.342,
          7.0933,
          4.1761
        ],
        "snow_ratio": 0.000032,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_fall_evening_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "fall",
        "segment": "evening",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 4.3181,
        "winter_mean_abs_rgb_channels": [
          5.7486,
          3.9849,
          3.221
        ],
        "snow_ratio": 0.000032,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_fall_evening_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "fall",
        "segment": "evening",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 10.6516,
        "winter_mean_abs_rgb_channels": [
          8.7902,
          11.6127,
          11.552
        ],
        "snow_ratio": 0.000032,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_fall_evening_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "fall",
        "segment": "evening",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 12.6177,
        "winter_mean_abs_rgb_channels": [
          9.9469,
          13.4217,
          14.4846
        ],
        "snow_ratio": 0.000032,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_fall_evening_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "fall",
        "segment": "evening",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 8.9711,
        "winter_mean_abs_rgb_channels": [
          16.1496,
          6.2448,
          4.5189
        ],
        "snow_ratio": 0.000032,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_spring_night_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "spring",
        "segment": "night",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 0.524,
        "winter_mean_abs_rgb_channels": [
          0.759,
          0.4049,
          0.4081
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_spring_night_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "spring",
        "segment": "night",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 23.5905,
        "winter_mean_abs_rgb_channels": [
          25.9105,
          23.7413,
          21.1199
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_spring_night_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "spring",
        "segment": "night",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 34.9997,
        "winter_mean_abs_rgb_channels": [
          38.8517,
          35.2345,
          30.9128
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_spring_night_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "spring",
        "segment": "night",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 14.4108,
        "winter_mean_abs_rgb_channels": [
          18.4389,
          14.6985,
          10.095
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_summer_night_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "summer",
        "segment": "night",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 6.4587,
        "winter_mean_abs_rgb_channels": [
          6.9742,
          8.0736,
          4.3284
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_summer_night_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "summer",
        "segment": "night",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 29.5727,
        "winter_mean_abs_rgb_channels": [
          32.135,
          31.6225,
          24.9607
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_summer_night_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "summer",
        "segment": "night",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 40.3631,
        "winter_mean_abs_rgb_channels": [
          44.4469,
          42.4698,
          34.1727
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_summer_night_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "summer",
        "segment": "night",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 19.1735,
        "winter_mean_abs_rgb_channels": [
          23.4453,
          21.2439,
          12.8311
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_fall_night_clear.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "fall",
        "segment": "night",
        "sky": "clear"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only",
        "too_similar_to_winter_reference"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 8.3647,
        "winter_mean_abs_rgb_channels": [
          13.2541,
          8.0112,
          3.8289
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_fall_night_partly.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "fall",
        "segment": "night",
        "sky": "partly"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 31.3702,
        "winter_mean_abs_rgb_channels": [
          38.1979,
          31.4797,
          24.4331
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_fall_night_cloudy.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "fall",
        "segment": "night",
        "sky": "cloudy"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 41.0902,
        "winter_mean_abs_rgb_channels": [
          49.2438,
          41.2633,
          32.7637
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    },
    "sansebastian_fall_night_dark.png": {
      "status": "fallback_only",
      "requested": {
        "location": "sansebastian",
        "season": "fall",
        "segment": "night",
        "sky": "dark"
      },
      "reasons": [
        "deterministic_nonwinter_fallback_only"
      ],
      "metrics": {
        "winter_mean_abs_rgb_diff": 20.9741,
        "winter_mean_abs_rgb_channels": [
          29.1577,
          21.2175,
          12.547
        ],
        "snow_ratio": 0,
        "snow_ratio_limit": 0.055
      },
      "validator_checks": [],
      "source_policy": "generated_deterministic_nonwinter_never_auto_approved"
    }
  }
};
