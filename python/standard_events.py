# Define standardized event names and alternatives
STANDARD_EVENTS = {
    "50y": ["50 yard"],
    "55m": ["55 meter", "55meter", "55 m", "55 meter dash", "55 m dash", "55m dash", "55"],
    "55HH": ["55m hurdles", "55 meter hurdles", "55 meter high hurdles"],
    "60y": ["60 yard"],
    "60m": ["60 meter"],
    "80ydLH": ["80 yard hurdles", "80 yard low hurdles"],
    "100y": ["100 yard"],
    "100m": ["100 meter"],
    "100HH": ["100 meter hurdles"],
    "110HH": ["100m hurdles"],
    "120ydHH": ["120 yard hurdles", "120 yard high hurdles"],
    "180ydLH": ["180 yard low hurdles"],
    "200m": ["200 meter"],
    "220yd": ["220 yard"],
    "300yd": ["300 yard"],
    "300m": ["300 meter"],
    "300LH": ["300 meter low hurdles"],
    "330ydLH": ["330 yard low hurdles"],
    "400m": ["400m hurdles"],
    "440yd": ["440 yard"],
    "400LH": ["400 meter low hurdles"],
    "800m": ["800 meter"],
    "880yd": ["880 yard"],
    "1000yd": ["1000 yard"],
    "1000m": ["1000 meter"],
    "1500m": ["1500 meter"],
    "1600m": ["1600 meter"],
    "1 mile": ["1 mile"],
    "3000m": [],
    "3000m SC": [],
    "3200m": [],
    "2 mile": ["2 miles"],
    "5000m": [],
    "Shot Put": [],
    "Discus": [],
    "Javelin": [],
    "Javelin (Old)": [],
    "Turbo Javelin": [],
    "Weight Throw": [],
    "Hammer Throw": [],
    "High Jump": [],
    "Pole Vault": [],
    "Long Jump": [],
    "Triple Jump": [],
    "4x50yd": [],
    "4x50HH": [],
    "4x100m": ["4x100 relay"],
    "4x110yd": [],
    "4x200": ["4x200 meter relay", "4x200 meter"],
    "4x220yd": [],
    "4x400m": [],
    "4x440yd": ["4x400 yard relay", "1600 yard relay", "1 mile relay"],
    "4x800m": [],
    "4x880yd": [],
    "4x1 mile": ["4x1mile"],
    "4x1600m": [],
    "DMR 4000m": [],
    "SMR 800m": [],
    "SMR 1600m": [],
    "3x HJ": ["3x High Jump"],
    "3x PV": ["3x Pole Vault"],
    "3x LJ": ["3x Long Jump"],
    "3x TJ": ["3x Triple Jump"],
    "3x SP": ["3x Shot Put"],
    "3x Disc": ["3x Discus"],
    "3x Jav": ["3x Javelin"],
    "3x Turbo Jav": ["3x Turbo Javelin"],
    "4x110mHH": ["4x110m Shuttle Hurdle", "4x110 meter Shuttle Hurdle"],
    "4x100mHH": ["4x100m Shuttle Hurdle", "4x100 meter Shuttle Hurdle"],
    "4x120ydHH": [],
    "Pentathlon": ["Pent"],
    "Heptathlon": ["Hepta"],
    "Decathlon": ["Deca"],
    "Weight Pent": ["Weight Pentathlon"]
}