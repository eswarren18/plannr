def black_and_flake8_test():
    # Black: line longer than 79 characters (not a string literal)
    result = (
        1
        + 2
        + 3
        + 4
        + 5
        + 6
        + 7
        + 8
        + 9
        + 10
        + 11
        + 12
        + 13
        + 14
        + 15
        + 16
        + 17
        + 18
        + 19
        + 20
    )
    # Black: single quotes
    single_quoted = "This should be converted to double quotes if string normalization is enabled."
    # Black: line longer than 79 characters (string literal, for comparison)
    long_line = "This is a very long string that should trigger Black's line-length enforcement if it is working correctly."
    return result, long_line, single_quoted
