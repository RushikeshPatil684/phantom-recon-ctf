// Global unlock state for the terminal
let terminalUnlocked = false;

// Terminal interaction handler
(function() {
    'use strict';

    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalWindow = document.querySelector('.terminal-window');
    const terminalLocked = document.querySelector('.terminal-locked');
    // Hint fragment (ports) for advanced users inspecting DevTools
    const reconPortsHint = '22,80,443';
    
    if (!terminalInput || !terminalOutput) {
        return;
    }

    const API_BASE_URL = 'http://127.0.0.1:5000';

    function appendLine(text, className) {
        const line = document.createElement('div');
        line.className = 'line' + (className ? ' ' + className : '');
        line.textContent = text;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function simulateNmapScan(command) {
        const parts = command.split(/\s+/);
        const hasNmap = parts[0] && parts[0].toLowerCase() === 'nmap';

        if (!hasNmap) {
            appendLine('command not found', 'error');
            return;
        }

        // Very forgiving parsing: treat last non-flag token as target
        let target = 'target';
        let hasSV = false;
        let hasO = false;

        parts.forEach((part) => {
            if (part.startsWith('-')) {
                if (part.indexOf('sV') !== -1) {
                    hasSV = true;
                }
                if (part.indexOf('O') !== -1) {
                    hasO = true;
                }
            } else if (part.toLowerCase() !== 'nmap') {
                target = part;
            }
        });

        const lines = [];
        lines.push('Starting Nmap 7.93 ( https://nmap.org )');
        lines.push('Nmap scan report for ' + target);
        lines.push('Host is up (0.030s latency).');

        if (hasSV) {
            lines.push('PORT     STATE SERVICE  VERSION');
            lines.push('22/tcp   open  ssh      OpenSSH 8.2p1 Debian 4 (protocol 2.0)');
            lines.push('80/tcp   open  http     Apache httpd 2.4.54 ((Debian))');
            lines.push('443/tcp  open  https    nginx 1.22.1');
        } else {
            lines.push('PORT     STATE SERVICE');
            lines.push('22/tcp   open  ssh');
            lines.push('80/tcp   open  http');
            lines.push('443/tcp  open  https');
        }

        if (hasO) {
            lines.push('');
            lines.push('OS detection results:');
            lines.push('Running: Linux 5.X');
            lines.push('OS CPE: cpe:/o:linux:linux_kernel:5');
            lines.push('OS details: Linux 5.4 - 5.15');
        }

        lines.push('');
        lines.push('Nmap done: 1 IP address (1 host up) scanned');

        // Print lines with slight delays to simulate scanning
        let delay = 0;
        const step = 250; // ms between lines
        lines.forEach((text) => {
            setTimeout(() => {
                appendLine(text);
            }, delay);
            delay += step;
        });
    }

    function validateNmapCommand(command) {
        // Send the full command to backend for real validation
        fetch(API_BASE_URL + '/api/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command: command }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data && data.success) {
                    appendLine('=== VALID COMMAND DETECTED ===', 'success');
                    if (data.flag) {
                        appendLine('FLAG: ' + data.flag, 'success');
                    }
                }
            })
            .catch(() => {
                // Silent fail on validation errors; still show fake output
            });
    }

    // Hint system - cryptic and misleading by design
    // Only ONE hint actually helps (hint5); others are misleading
    const hints = [
        "The echo of a scan is not the scan itself. What you see may not be what you get.",
        "Ports whisper secrets, but not all whispers are true. Some signals are manufactured.",
        "The terminal knows more than it shows. Inspect what lies beneath the surface.",
        "Flags hide in validation, not in simulation. The backend sees what the frontend cannot.",
        "Reconstruction requires fragments. Look where developers leave traces, not where users look."
    ];

    // Handle terminal input
    terminalInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            
            const command = terminalInput.value.trim();
            
            if (command.length > 0) {
                // Display the command
                appendLine('root@phantom:~$ ' + command);
                
                // PRIORITY 1: If terminal is locked, treat input as password attempt
                if (!terminalUnlocked) {
                    // Send password to backend
                    fetch(API_BASE_URL + '/api/unlock', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ password: command })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Unlock terminal
                            terminalUnlocked = true;
                            unlockTerminal();
                            
                            appendLine('ACCESS GRANTED – TERMINAL UNLOCKED', 'success');
                        } else {
                            // Show access denied
                            appendLine('ACCESS DENIED', 'error');
                        }
                    })
                    .catch(() => {
                        // Network error - show access denied
                        appendLine('ACCESS DENIED', 'error');
                    });
                    
                    // Clear input and return
                    terminalInput.value = '';
                    return;
                }
                
                // PRIORITY 2: Normalize input (terminal is unlocked)
                const normalized = command.trim();
                const lower = normalized.toLowerCase();
                
                // PRIORITY 3: Handle HINT command FIRST with early return
                if (lower === 'hint') {
                    // Randomly select and display one hint
                    const randomIndex = Math.floor(Math.random() * hints.length);
                    const selectedHint = hints[randomIndex];
                    appendLine('[HINT]', 'hint-header');
                    appendLine(selectedHint, 'hint');
                    terminalInput.value = '';
                    return;
                }
                
                // PRIORITY 4: Handle NMAP commands
                if (lower.startsWith('nmap')) {
                    // Always show fake scan output
                    simulateNmapScan(command);
                    // Also send to backend to check for the ONE correct command
                    validateNmapCommand(command);
                    terminalInput.value = '';
                    return;
                }
                
                // PRIORITY 5: Default - command not found
                appendLine('command not found', 'error');
            }
            
            // Clear input
            terminalInput.value = '';
        }
    });

    function unlockTerminal() {
        // Change terminal window styling
        if (terminalWindow) {
            terminalWindow.classList.remove('terminal-window');
            terminalWindow.classList.add('terminal-window-unlocked');
        }
        
        // Hide locked warning
        if (terminalLocked) {
            terminalLocked.style.display = 'none';
        }
    }

    // Keep terminal focused
    terminalInput.focus();
    
    // Re-focus on click
    document.addEventListener('click', function() {
        terminalInput.focus();
    });
})();
