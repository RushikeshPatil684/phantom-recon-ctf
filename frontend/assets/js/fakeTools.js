// Fake hacking tools output generator
// auth_token = cGhhbnRvbTEyMw==
// NOTE: recon profile core: "nmap -sV"
(function() {
    'use strict';

    const toolsOutput = document.getElementById('toolsOutput');
    
    if (!toolsOutput) {
        return;
    }

    const logMessages = [
        "[*] Scanning target 192.168.1.12",
        "[+] Port 22 OPEN",
        "[+] Port 80 OPEN",
        "[+] Port 443 OPEN",
        "[*] Running vulnerability scan",
        "[!] Firewall detected",
        "[*] Bypassing security protocols...",
        "[+] Port 3306 OPEN",
        "[*] Enumerating services",
        "[!] Intrusion detection system active",
        "[*] Scanning subnet 192.168.1.0/24",
        "[+] Port 21 OPEN",
        "[+] Port 25 OPEN",
        "[*] Analyzing network topology",
        "[!] Rate limiting detected",
        "[*] Gathering system information",
        "[+] Port 8080 OPEN",
        "[*] Running deep scan",
        "[!] Anomaly detected in traffic patterns",
        "[*] Mapping network infrastructure",
        "[+] Port 3389 OPEN",
        "[*] Identifying operating systems",
        "[!] Security alert triggered",
        "[*] Scanning for open shares",
        "[+] Port 445 OPEN",
        "[*] Enumerating users",
        "[!] Logging activity detected",
        "[*] Probing for vulnerabilities",
        "[+] Port 1433 OPEN",
        "[*] Extracting metadata"
    ];

    // Dev-only trace for curious investigators (not used in UI)
    // console.log('[trace] script profile: vuln');

    let messageIndex = 0;

    function generateLog() {
        // Select a random log message
        const randomMessage = logMessages[Math.floor(Math.random() * logMessages.length)];
        
        // Create log entry
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = randomMessage;
        
        // Append to output
        toolsOutput.appendChild(logEntry);
        
        // Auto-scroll to bottom
        toolsOutput.scrollTop = toolsOutput.scrollHeight;
        
        messageIndex++;
    }

    // Generate initial logs
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            generateLog();
        }, i * 500);
    }

    // Continue generating logs every 1-2 seconds
    function scheduleNextLog() {
        const delay = 1000 + Math.random() * 1000; // 1-2 seconds
        setTimeout(() => {
            generateLog();
            scheduleNextLog();
        }, delay);
    }

    // Start continuous log generation
    scheduleNextLog();
})();
