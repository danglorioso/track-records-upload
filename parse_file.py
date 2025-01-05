#!/usr/bin/env python
import re
import csv
import io
import sys
from typing import List, Dict
from rapidfuzz import fuzz, process

# Define standardized event names and alternatives
STANDARD_EVENTS = {
    "50y": ["55 meter", "55 meter dash", "55M dash"],
    "55m": ["55m hurdles", "55 meter hurdles"],
    "55HH": ["55 meter hurdles", "55 meter high hurdles"],
    "60y": ["60 yard"],
    "60m": ["60 meter"],
    # Add remaining events here...
}

def normalize_event(event_name: str) -> str:
    """
    Normalize the event name to the closest standardized name using fuzzy matching.
    
    Args:
        event_name (str): The event name to normalize.
    
    Returns:
        str: The standardized event name if a match is found, otherwise the original name.
    """
    
    # Initialize best match and score
    best_match = ""
    best_score = 0

    for standard_event, alternatives in STANDARD_EVENTS.items():
        # Combine standard event and alternatives for fuzzy matching
        possible_matches = [standard_event] + alternatives
        result = process.extractOne(event_name, possible_matches)
        
        # If score is higher than previous best, update best match and score
        if result[1] > best_score:
            best_match = result[0]
            best_score = result[1]

    # At end of loop, return best match if score is above threshold
    if best_score > 85:
        print("Returning best match: ")
        print(best_match)
        return best_match
    
     # Return original if no match is found
    return event_name 


# Define standardized school names and alternatives
STANDARD_SCHOOLS = {
    "Abby Kelley": [],
    "Abington": [],
    "NDA-Tyngsboro": ["Notre Dame Academy Tyngsboro", "NDA Tyngsboro"],
    "Advanced Math & Science Academy Charter": ["AMSA"],
    "Chicopee Comprehensive": ["Chicopee Comp"],
    "Littleton": ["Littleton HS", "Littleton High School", "LITT"],
    "Mt Everett": ["Mount Everett"],
    # Add remaining schools here...
}

def normalize_school(school_name: str) -> str:
    """
    Normalize the school name to the closest standardized name using fuzzy matching.
    
    Args:
        school_name (str): The school name to normalize.
    
    Returns:
        str: The standardized school name if a match is found, otherwise the original name.
    """
    for standard_school, alternatives in STANDARD_SCHOOLS.items():
        # Combine standard school and alternatives for fuzzy matching
        possible_matches = [standard_school] + alternatives
        result = process.extractOne(school_name, possible_matches, scorer=fuzz.partial_ratio)

        print("Result from normalizing school name")
        print(result)


        # if score > 90:  # Threshold for a valid match
        #     return standard_school
    return school_name  # Return original if no match is found

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
        "Event", "Round", "Gender", "Place", "Last Name", "First Name",
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
        "Location": "Sample Location",
        "Edition": "1st",
        "Name": "Sample Meet",
        "Timing": "FAT",
        "URL": "http://example.com",
        "Season": "Indoor"
    }
    
    # Parse file
    parse_results(sys.argv[1], metadata)


# def main():
#     print("Hello World")


#     with open("test_results.txt", "r") as file:
#         for line in file:
#             print(line)

# if __name__ == "__main__":
#     main()
