#!/usr/bin/env python3
"""
CivicOS Synthetic Data Generator
Generates 5000-10000 realistic civic issue records for Bengaluru
"""

import json
import random
import csv
import os
from datetime import datetime, timedelta

BENGALURU_ZONES = [
    {"name": "Koramangala", "lat": 12.9352, "lng": 77.6245, "pop_density": 18000},
    {"name": "Indiranagar", "lat": 12.9784, "lng": 77.6408, "pop_density": 15000},
    {"name": "Whitefield", "lat": 12.9698, "lng": 77.7500, "pop_density": 12000},
    {"name": "Jayanagar", "lat": 12.9300, "lng": 77.5840, "pop_density": 20000},
    {"name": "Marathahalli", "lat": 12.9592, "lng": 77.6974, "pop_density": 16000},
    {"name": "HSR Layout", "lat": 12.9081, "lng": 77.6476, "pop_density": 14000},
    {"name": "BTM Layout", "lat": 12.9166, "lng": 77.6101, "pop_density": 17000},
    {"name": "Rajajinagar", "lat": 12.9922, "lng": 77.5568, "pop_density": 19000},
    {"name": "Malleswaram", "lat": 13.0031, "lng": 77.5715, "pop_density": 22000},
    {"name": "Hebbal", "lat": 13.0353, "lng": 77.5970, "pop_density": 11000},
    {"name": "Electronic City", "lat": 12.8399, "lng": 77.6770, "pop_density": 9000},
    {"name": "JP Nagar", "lat": 12.9063, "lng": 77.5857, "pop_density": 16000},
    {"name": "Vijayanagar", "lat": 12.9719, "lng": 77.5324, "pop_density": 18000},
    {"name": "Yelahanka", "lat": 13.1007, "lng": 77.5963, "pop_density": 8000},
    {"name": "Bannerghatta", "lat": 12.8899, "lng": 77.5975, "pop_density": 7000},
]

ISSUE_TYPES = [
    "pothole", "garbage", "water_leakage", "streetlight",
    "road_damage", "flooding", "construction_hazard", "open_manhole"
]

# Seasonal rainfall months (Bengaluru: Jun-Sep heavy, Oct-Nov moderate)
RAINFALL_MONTHS = {6, 7, 8, 9, 10, 11}

# Issue types more likely in rain
RAIN_AMPLIFIED = {"flooding": 3.0, "pothole": 2.0, "water_leakage": 1.5, "road_damage": 1.8}

SEVERITY_WEIGHTS = {"critical": 0.10, "high": 0.25, "medium": 0.40, "low": 0.25}

STATUS_WEIGHTS = {
    "reported": 0.30,
    "verified": 0.25,
    "in_progress": 0.25,
    "resolved": 0.20
}

RESOLUTION_TIMES = {
    "critical": (1, 7),
    "high": (3, 21),
    "medium": (7, 60),
    "low": (14, 120)
}


def weighted_choice(d):
    keys = list(d.keys())
    weights = list(d.values())
    return random.choices(keys, weights=weights, k=1)[0]


def rand_coord(center, spread=0.02):
    return center + random.uniform(-spread, spread)


def generate_record(idx, start_date, end_date):
    zone = random.choice(BENGALURU_ZONES)
    date = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
    month = date.month
    has_rainfall = month in RAINFALL_MONTHS and random.random() < 0.6

    # Weighted issue type (rain-amplified)
    type_weights = {t: 1.0 for t in ISSUE_TYPES}
    if has_rainfall:
        for t, amp in RAIN_AMPLIFIED.items():
            type_weights[t] *= amp
    total = sum(type_weights.values())
    type_weights = {k: v / total for k, v in type_weights.items()}
    issue_type = weighted_choice(type_weights)

    severity = weighted_choice(SEVERITY_WEIGHTS)
    status = weighted_choice(STATUS_WEIGHTS)

    # Resolution time
    res_min, res_max = RESOLUTION_TIMES[severity]
    resolution_days = random.randint(res_min, res_max) if status == "resolved" else None

    # Traffic density (0-100, higher during peak hours/zones)
    traffic_density = min(100, zone["pop_density"] / 200 + random.uniform(-10, 20))

    # Affected population
    base_pop = zone["pop_density"] * random.uniform(0.005, 0.05)
    affected_pop = int(base_pop * (2 if severity == "critical" else 1.5 if severity == "high" else 1))

    return {
        "id": f"ISS-{str(idx).zfill(5)}",
        "issue_type": issue_type,
        "latitude": round(rand_coord(zone["lat"]), 6),
        "longitude": round(rand_coord(zone["lng"]), 6),
        "ward": zone["name"],
        "date": date.strftime("%Y-%m-%d"),
        "severity": severity,
        "status": status,
        "resolution_days": resolution_days,
        "rainfall_mm": round(random.uniform(10, 80), 1) if has_rainfall else 0,
        "traffic_density": round(traffic_density, 1),
        "population_density": zone["pop_density"],
        "affected_population": affected_pop,
        "trust_score": random.randint(40, 95),
        "priority_score": random.randint(20, 100),
        "verification_count": random.randint(0, 30),
        "economic_impact_inr": int(affected_pop * random.uniform(10, 60)),
    }


def main():
    os.makedirs("data/output", exist_ok=True)

    start = datetime(2023, 1, 1)
    end = datetime(2025, 6, 1)
    N = 7500

    print(f"Generating {N} civic issue records for Bengaluru...")
    records = [generate_record(i + 1, start, end) for i in range(N)]

    # Save JSON
    json_path = "data/output/civic_issues.json"
    with open(json_path, "w") as f:
        json.dump(records, f, indent=2)
    print(f"✅ JSON: {json_path} ({len(records)} records)")

    # Save CSV
    csv_path = "data/output/civic_issues.csv"
    with open(csv_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=records[0].keys())
        writer.writeheader()
        writer.writerows(records)
    print(f"✅ CSV: {csv_path}")

    # Summary stats
    type_counts = {}
    for r in records:
        type_counts[r["issue_type"]] = type_counts.get(r["issue_type"], 0) + 1

    print("\n📊 Summary:")
    print(f"  Total records: {len(records)}")
    for t, c in sorted(type_counts.items(), key=lambda x: -x[1]):
        print(f"  {t:30s}: {c:5d} ({c/len(records)*100:.1f}%)")


if __name__ == "__main__":
    main()
