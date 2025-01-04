#!/usr/bin/env python

def main():
    print("Hello World")


    with open("test_results.txt", "r") as file:
        for line in file:
            print(line)

if __name__ == "__main__":
    main()
