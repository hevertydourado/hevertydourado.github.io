---
title: "CyberDefenders: [Lab Name] — Write-Up"
description: "Detailed investigation and resolution walkthrough for the CyberDefenders [Lab Name] challenge covering [Category/Focus Area]."
author: D0ur4tt0
date: YYYY-MM-DD HH:MM:SS -0300
categories: [CyberDefenders, Writeups]
tags: [cyberdefenders, dfir, network-forensics, memory-forensics, easy]
pin: false
math: true
mermaid: true
mitre_attack:
  - tactic: Initial Access
    technique_id: T1190
    technique_name: Exploit Public-Facing Application
    details: Exploit attempt detected on web server endpoint
  - tactic: Execution
    technique_id: T1059.001
    technique_name: PowerShell
    details: Obfuscated PowerShell execution via CMD child process
  - tactic: Defense Evasion
    technique_id: T1027
    technique_name: Obfuscated Files or Information
    details: Base64 encoded payload executed in memory
---

## Challenge Overview

| Attribute | Details |
| :--- | :--- |
| **Platform** | [CyberDefenders](https://cyberdefenders.org/) |
| **Lab Name** | `[Lab Name]` |
| **Category** | `[Network Forensics / Memory Forensics / Disk Forensics / Endpoint]` |
| **Difficulty** | `[Easy / Medium / Hard]` |
| **Investigation Focus** | `[Short summary of the incident scenario]` |

---

## Tools Used

- **`Tool 1`**: Brief description of how it was used (e.g., Wireshark for PCAP analysis).
- **`Tool 2`**: Brief description (e.g., Volatility 3 for memory dump extraction).
- **`Tool 3`**: Brief description (e.g., CyberChef for decoding payloads).

---

{% include mitre-matrix.html %}

---

<div class="callout-ioc">
<div class="callout-title"><i class="fas fa-bug"></i> Indicators of Compromise (IOCs)</div>

| Type | Indicator / Value | Context |
| :--- | :--- | :--- |
| **IPv4 Address** | `192.168.1.100` | Malicious C2 Server IP |
| **SHA256 Hash** | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` | Dropped Web Shell Payload |
| **Domain** | `malicious-domain.com` | Exfiltration Endpoint |

</div>

---

## Investigation & Questions Breakdown

### Q1: What is the IP address of the compromised host?

**Investigation Steps:**
1. Filter PCAP traffic using Wireshark display filter: `http.request or dns`.
2. Observe initial suspicious HTTP GET request originating from `10.0.0.15`.

```bash
# Example analysis command
tshark -r investigation.pcap -Y "http.request.method == POST"
```

**Answer:** `10.0.0.15`

---

### Q2: What malicious executable was dropped on the victim host?

**Investigation Steps:**
1. Analyze process tree output from Volatility:
   ```bash
   vol.py -f memory.raw windows.pstree
   ```
2. Locate suspicious child process spawned under `explorer.exe`:

**Answer:** `malware_payload.exe`

---

## Conclusion & Key Takeaways

- Summary of root cause analysis and attack vector.
- Recommended detection rules (YARA / Sigma) or defensive mitigation controls.

---

## References & Resources

- [CyberDefenders Challenge Link](https://cyberdefenders.org/blueteam-ctf-challenges/)
- [MITRE ATT&CK Matrix](https://attack.mitre.org/)
