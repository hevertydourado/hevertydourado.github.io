---
title: "[TEST] CyberDefenders: Brave — Network Forensics Write-Up"
description: "Test walkthrough demonstration for CyberDefenders Brave lab featuring PCAP traffic analysis, malicious payload extraction, and MITRE ATT&CK matrix mapping."
author: D0ur4tt0
date: 2025-02-01 10:00:00 -0300
categories: [CyberDefenders, Writeups]
tags: [cyberdefenders, dfir, network-forensics, easy, test]
pin: false
math: true
mermaid: true
image:
  path: /assets/img/default/preview.png
  alt: CyberDefenders Brave Test Lab
mitre_attack:
  - tactic: Initial Access
    technique_id: T1190
    technique_name: Exploit Public-Facing Application
    details: Exploit attempt detected targeting HTTP web application
  - tactic: Execution
    technique_id: T1059.001
    technique_name: PowerShell
    details: Encoded PowerShell payload launched via web shell
  - tactic: Command and Control
    technique_id: T1071.001
    technique_name: Web Protocols
    details: C2 beaconing over HTTP POST traffic on non-standard port
iocs:
  - type: IPv4 Address
    value: 192.168.1.105
    context: Attacker C2 Server IP
  - type: SHA256 Hash
    value: a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0
    context: Malicious ASPX Web Shell
  - type: Domain
    value: c2-malicious-domain.com
    context: Exfiltration Endpoint
---

## Challenge Overview

| Attribute | Details |
| :--- | :--- |
| **Platform** | [CyberDefenders](https://cyberdefenders.org/) |
| **Lab Name** | `Brave` |
| **Category** | `Network Forensics` |
| **Difficulty** | `Easy` |
| **Investigation Focus** | `Analysis of compromised web server network capture file (PCAP) to identify initial access and lateral movement.` |

---

## Tools Used

- **`Wireshark`**: Used to analyze network packets, filter HTTP streams, and reconstruct web shell uploads.
- **`TShark`**: CLI tool used to extract specific IP statistics and POST payloads.
- **`CyberChef`**: Utilized to decode Base64 obfuscated PowerShell scripts.

---

{% include mitre-matrix.html %}

---

{% include ioc-container.html %}

---

## Investigation & Questions Breakdown

### Q1: What is the IP address of the attacker?

**Investigation Steps:**
1. Open the PCAP file in Wireshark and inspect TCP connection handshakes.
2. Filter for incoming HTTP requests with high request frequency:
   ```bash
   tshark -r brave-investigation.pcap -Y "http.request" -T fields -e ip.src | sort | uniq -c
   ```

<details class="spoiler-answer">
  <summary>Reveal Answer</summary>
  <div class="answer-content">
    <code>192.168.1.105</code>
    <button type="button" class="btn-copy-answer" onclick="navigator.clipboard.writeText('192.168.1.105'); this.querySelector('i').className='fas fa-check text-success'; setTimeout(()=> this.querySelector('i').className='far fa-copy', 2000)" title="Copy to clipboard">
      <i class="far fa-copy"></i>
    </button>
  </div>
</details>

---

### Q2: What was the name of the webshell uploaded by the attacker?

**Investigation Steps:**
1. Filter for multipart HTTP POST data:
   `http.request.method == "POST" and http.request.uri contains "upload"`
2. Inspect the HTTP payload stream to locate the `filename` attribute in the Content-Disposition header.

<details class="spoiler-answer">
  <summary>Reveal Answer</summary>
  <div class="answer-content">
    <code>cmd_shell.aspx</code>
    <button type="button" class="btn-copy-answer" onclick="navigator.clipboard.writeText('cmd_shell.aspx'); this.querySelector('i').className='fas fa-check text-success'; setTimeout(()=> this.querySelector('i').className='far fa-copy', 2000)" title="Copy to clipboard">
      <i class="far fa-copy"></i>
    </button>
  </div>
</details>

---

## Conclusion & Key Takeaways

- The attacker successfully exploited a file upload vulnerability to drop an ASPX web shell.
- Implementing strict file extension whitelisting and egress firewall filtering would have mitigated the execution and C2 beaconing.

---

## References & Resources

- [CyberDefenders Brave Challenge](https://cyberdefenders.org/)
- [MITRE ATT&CK Matrix](https://attack.mitre.org/)
