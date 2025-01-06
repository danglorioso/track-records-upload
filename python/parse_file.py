#!/usr/bin/env python
import re
import csv
import io
import sys
from typing import List, Dict
from rapidfuzz import fuzz, process

from standard_events import STANDARD_EVENTS
from standard_schools import STANDARD_SCHOOLS

def normalize_event(event_name: str) -> str:
    """
    Normalize the event name to the closest standardized name using fuzzy matching.
    
    Args:
        event_name (str): The event name to normalize.
    
    Returns:
        str: The standardized event name if a match is found, otherwise the original name.
    """

    # Initialize best match and score variables
    best_match = ""
    best_score = 0

    for standard_event, alternatives in STANDARD_EVENTS.items():
        # Combine standard event and alternatives for fuzzy matching
        possible_matches = [standard_event] + alternatives
        result = process.extractOne(event_name, possible_matches)

        # If score is higher than previous best, update with standardized
        # event name and score
        if result[1] > best_score:
            best_match, best_score = standard_event, result[1]

    # At end of loop, return best match if score is above threshold (85)
    if best_score > 85:
        print(best_match)
        return best_match
    else :
        # Return original if no close match found
        return event_name

def normalize_school(school_name: str) -> str:
    """
    Normalize the school name to the closest standardized name using fuzzy matching.
    
    Args:
        school_name (str): The school name to normalize.
    
    Returns:
        str: The standardized school name if a match is found, otherwise the original name.
    """
    # Initialize best match and score variables
    bset_match = ""
    best_score = 0

    for standard_school, alternatives in STANDARD_SCHOOLS.items():
        # Combine standard school and alternatives for fuzzy matching
        possible_matches = [standard_school] + alternatives
        result = process.extractOne(school_name, possible_matches, scorer=fuzz.partial_ratio)

        # If score is higher than previous best, update with standardized 
        # school name and score
        if result[1] > best_score:
            best_match, best_score = standard_school, result[1]

    # At end of loop, return best match if score is above threshold (85)
    if best_score > 85:
        return best_match
    else:
        # Return original if no close match found
        return school_name

def parse_results(file_path: str, metadata: Dict[str, str]) -> None:
    """
    Main function for parsing the track meet results and generate a structured CSV.
    
    Args:
        file_path (str): Path to the input text file.
        metadata (Dict[str, str]): Dictionary of constant metadata to include
            in each row that was inputted on web app upon file upload. 
    """
    # Define output columns
    columns = [
        "Meet Date", "Edition", "Meet Name", "Meet Location", "Season", "URL", 
        "Timing", "Event", "Round", "Gender", "Place", "Last Name", "First Name",
        "Grade", "School", "Mark", "Heat", "Wind", "Points", "Review"
    ]
    
    rows = []  # Store parsed data

    # Patterns for parsing
    event_pattern = re.compile(r"Event\s+\d+\s+(Boys|Girls)\s+(.+)")
    result_pattern = re.compile(r"(\d+)\s+([\w\-\'\.]+\s[\w\-\'\.]+)\s+(\d+)?\s+([\w\s\-\'\.]+)\s+([\d\.]+)")
    finals_pattern = re.compile(r"Finals")
    gender_map = {"Girls": "F", "Boys": "M"}
    
    current_event = ""
    current_gender = ""
    current_round = ""

    try:
        with open(file_path, "r") as file:
            for line in file:
                # Match event header
                event_match = event_pattern.search(line)
                if event_match:
                    current_gender = gender_map[event_match.group(1)]
                    raw_event_name = event_match.group(2).strip()
                    current_event = normalize_event(raw_event_name)  # Normalize event name
                    continue
                
                # Detect finals round
                if finals_pattern.search(line):
                    current_round = "Final"
                    continue
                
                # Match individual results
                result_match = result_pattern.search(line)
                if result_match:
                    place, full_name, grade, school, mark = result_match.groups()
                    last_name, first_name = parse_name(full_name)
                    normalized_school = normalize_school(school.strip())
                    rows.append({   
                        "Event": current_event,
                        "Round": current_round or "Prelim",
                        "Gender": current_gender,
                        "Place": place,
                        "Last Name": last_name,
                        "First Name": first_name,
                        "Grade": grade or "",
                        "School": normalized_school,
                        "Mark": mark,
                        "Heat": "",
                        "Wind": "",
                        "Points": "",
                        "Review": "FALSE"  # Mark TRUE for missing or invalid fields
                    })
    except FileNotFoundError:
        print(f"Error: File {file_path} not found.")
        sys.exit(1)

    # Add metadata to each row
    for row in rows:
        row.update(metadata)
    
    # Write output to CSV
    output_file = "output.csv"
    with open(output_file, "w", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)
    
    print(f"Processed results saved to {output_file}")

def parse_name(full_name: str):
    """
    Split a full name into last and first names.
    """
    parts = full_name.split()
    if len(parts) > 1:
        return parts[-1], " ".join(parts[:-1])
    return full_name, ""

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 parse_file.py <results_file>")
        sys.exit(1)
    
    # Example metadata
    metadata = {
        "Meet Date": "2023-01-01",
        "Meet Location": "Sample Location",
        "Edition": "1st",
        "Meet Name": "Sample Meet",
        "Timing": "FAT",
        "URL": "http://example.com",
        "Season": "Indoor"
    }
    
    # Parse file
    parse_results(sys.argv[1], metadata)

