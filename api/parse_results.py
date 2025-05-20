from typing import Dict, Any
from http.server import BaseHTTPRequestHandler
import json
import base64
import io
import csv
import re
from rapidfuzz import fuzz, process
from standard_events import STANDARD_EVENTS
from standard_schools import STANDARD_SCHOOLS

def normalize_event(event_name: str, review_bool: bool):
    best_match = ""
    best_score = 0
    for standard_event, alternatives in STANDARD_EVENTS.items():
        result = process.extractOne(event_name, [standard_event] + alternatives)
        if result[1] > best_score:
            best_match, best_score = standard_event, result[1]
    return (best_match, review_bool) if best_score > 85 else (event_name, True)

def normalize_school(school_name: str, review_bool: bool):
    best_match = ""
    best_score = 0
    for standard_school, alternatives in STANDARD_SCHOOLS.items():
        result = process.extractOne(school_name, [standard_school] + alternatives, scorer=fuzz.partial_ratio)
        if result[1] > best_score:
            best_match, best_score = standard_school, result[1]
    return (best_match, review_bool) if best_score > 85 else (school_name, True)

def parse_name(full_name: str):
    if ',' in full_name:
        last, first = full_name.split(',', 1)
        return last.strip(), first.strip()
    parts = full_name.split()
    return (" ".join(parts[1:]), parts[0]) if len(parts) > 1 else (parts[0], "")

def parse_results(text: str, metadata: Dict[str, str]) -> list[dict[str, Any]]:
    event_pattern = re.compile(r"Event\s+\d+\s+(Boys|Girls)\s+(.+)")
    result_pattern = re.compile(r"(\d+)\s+([\w\-\'\.]+(?:\s[\w\-\'\.]+){0,2})\s+(\d+)?\s+([\w\s\-\'\.]+?)\s+((?:\d{1,2}:\d{2}\.\d{2}|\d{1,2}\.\d{2})[q*]?)\s+(\d+)?\s*(\d+\.\d+)?\s*(\d+)?")
    finals_pattern = re.compile(r"Finals")
    gender_map = {"Girls": "F", "Boys": "M"}
    distance_events = {"shot put", "discus", "high jump", "long jump", "triple jump", "pole vault", "javelin"}

    rows = []
    current_event = current_gender = current_round = ""
    for line in text.splitlines():
        review_bool = False
        if (match := event_pattern.search(line)):
            current_gender = gender_map[match.group(1)]
            raw_event = match.group(2).strip()
            current_event, review_bool = normalize_event(raw_event, review_bool)
            if any(event in raw_event.lower() for event in distance_events):
                current_event = None
            continue
        if finals_pattern.search(line):
            current_round = "Final"
            continue
        if (match := result_pattern.search(line)) and current_event:
            place, full_name, grade, school, mark, heat, wind, points = match.groups()
            last_name, first_name = parse_name(full_name)
            school, review_bool = normalize_school(school.strip(), review_bool)
            row = {
                **metadata,
                "Event": current_event,
                "Round": current_round or "Prelim",
                "Gender": current_gender,
                "Place": place,
                "Last Name": last_name,
                "First Name": first_name,
                "Grade": grade or "",
                "School": school,
                "Mark": mark,
                "Heat": heat or "",
                "Wind": wind or "",
                "Points": points or "",
                "Review": review_bool
            }
            rows.append(row)
    return rows

def handler(request, response):
    if request.method != "POST":
        return response.status(405).send("Method Not Allowed")

    body = request.json()
    encoded_file = body.get("file")
    metadata = body.get("metadata", {})

    if not encoded_file:
        return response.status(400).send("Missing 'file' in request body")

    try:
        file_bytes = base64.b64decode(encoded_file)
        text = file_bytes.decode("utf-8")
        rows = parse_results(text, metadata)
        return response.json({ "success": True, "results": rows })
    except Exception as e:
        return response.status(500).json({ "success": False, "error": str(e) })
