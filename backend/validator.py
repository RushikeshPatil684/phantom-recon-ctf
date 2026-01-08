def validate_nmap_command(command: str) -> bool:
    """
    Validate the submitted nmap command.

    The intended correct command (order-insensitive, extra flags allowed) is:
        nmap -sV -p 22,80 --script vuln 127.0.0.1

    Rules:
        - Must contain "nmap"
        - Target IP must be 127.0.0.1
        - Must include -sV (case insensitive)
        - Must include -p 22,80 (with or without space after -p)
        - Must include --script vuln (either as one token or two, or with =)
        - Additional flags/options are ignored
        - Order does not matter
        - Whitespace differences are ignored
    """
    if not isinstance(command, str):
        return False

    # Normalize spacing - collapse multiple spaces to single space
    normalized = " ".join(command.strip().split())
    if not normalized:
        return False

    # Convert to lowercase for case-insensitive matching
    lower = normalized.lower()

    # Check for required "nmap" command
    if "nmap" not in lower:
        return False

    # Check for required target IP
    if "127.0.0.1" not in lower:
        return False

    # Check for required -sV flag (case insensitive, so -sv matches)
    has_sv = "-sv" in lower

    # Check for required -p 22,80 flag
    # Accept: "-p 22,80" or "-p22,80" or "-p=22,80"
    has_p = (
        "-p 22,80" in lower or
        "-p22,80" in lower or
        "-p=22,80" in lower
    )

    # Check for required --script vuln
    # Accept: "--script vuln" or "--script=vuln" or "--script vuln" as separate tokens
    has_script = (
        "--script vuln" in lower or
        "--script=vuln" in lower
    )

    # All required components must be present
    return has_sv and has_p and has_script
