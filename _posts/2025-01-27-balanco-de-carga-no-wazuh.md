---
title: Como configurar HAProxy para balanço de carga no Wazuh (e habilitando HAProxy Helper HTTPS)
description: Passo a passo completo de como configurar o HAProxy como load balancer e integrar a API do HAProxy Helper via HTTPS com o Wazuh Manager para alta disponibilidade e balanço de carga otimizado.
author: D0ur4tt0
date: 2025-01-28 20:05:00 -0300
categories: [Wazuh, Sysadmin, Load Balancer]
tags: [wazuh, haproxy, security, devops, cluster]
pin: true
math: true
mermaid: true
image:
  path: /assets/img/posts/haproxy-wazuh/balanco-de-carga-wazuh.webp
  alt: Balanço de carga no Wazuh. Configurando HAProxy.
---

Em ambientes de segurança da informação, a alta disponibilidade e a escalabilidade são requisitos fundamentais para garantir a continuidade das operações e a eficiência na análise de logs. O **Wazuh**, uma plataforma open source de detecção de ameaças e monitoramento de segurança, é amplamente utilizado para proteger infraestruturas críticas. No entanto, à medida que o volume de dados e a complexidade do ambiente crescem, a necessidade de distribuir a carga de trabalho entre múltiplos servidores torna-se essencial.

É aí que entra o **HAProxy**, uma solução robusta e altamente configurável para balanceamento de carga. Neste artigo, você aprenderá como configurar o HAProxy para distribuir o tráfego de agentes do Wazuh entre múltiplos nós, garantindo alta disponibilidade, escalabilidade e resiliência.

---

## Setup e Arquitetura

Para essa demonstração, utilizaremos a seguinte arquitetura:

- **1 Servidor Amazon Linux** onde será instalado o Load Balancer (HAProxy)
- **1 Wazuh Indexer 4.10**
- **1 Wazuh Dashboard 4.10**
- **Cluster com 3 Wazuh Servers / Managers** 4.10 (sendo 1 master e 2 workers)
- **3 Servidores Linux** com o Agent do Wazuh instalado (versão 4.10)

A arquitetura ficará configurada da seguinte forma:

![Arquitetura Wazuh e HAProxy](/assets/img/posts/haproxy-wazuh/arquitetura-wazuh-haproxy.png)
_Estrutura do Cluster Wazuh com HAProxy Load Balancer_

---

## Configuração do HAProxy

Existem diversas formas de instalar o HAProxy a depender do seu sistema operacional (ou via Docker / PPA). No nosso caso, instalaremos pelo gerenciador de pacotes (`dnf`) do Amazon Linux.

> Todos os comandos a seguir estão sendo executados com permissões de usuário `root`.

### 1. Instalação e Habilitação

Instale o HAProxy:
```bash
dnf install haproxy -y
```

Verifique a versão instalada:
```bash
haproxy -v
```

Habilite o serviço no sistema:
```bash
systemctl enable haproxy
```

### 2. Modificando o arquivo de configuração

Modifique ou crie o arquivo `haproxy.cfg` em `/etc/haproxy/haproxy.cfg`:

```bash
nano /etc/haproxy/haproxy.cfg
```

Adicione o seguinte conteúdo ao arquivo:

```haproxy
global
  chroot /var/lib/haproxy
  user haproxy
  group haproxy
  maxconn 4000
  pidfile /var/run/haproxy.pid
  stats socket /var/lib/haproxy/stats level admin
  hard-stop-after 30016
  log 127.0.0.1 local2 info

defaults unnamed_defaults_1
  mode http
  maxconn 4000
  log global
  option tcplog
  option redispatch
  option dontlognull
  timeout check 10s
  timeout connect 10s
  timeout client 1m
  timeout queue 1m
  timeout server 1m
  retries 3

frontend wazuh_register from unnamed_defaults_1
  mode tcp
  bind :1515
  default_backend wazuh_register

frontend wazuh_reporting_front
  mode tcp
  bind :1514 name wazuh_reporting_front_bind
  default_backend wazuh_reporting

backend wazuh_register from unnamed_defaults_1
  mode tcp
  balance leastconn
  server master <ENDEREÇO_MANAGER_MASTER>:1515 check
  server worker1 <ENDERECO_MANAGER_WORKER_1>:1515 check
  server worker2 <ENDERECO_MANAGER_WORKER_2>:1515 check

backend wazuh_reporting
  mode tcp
  balance leastconn
  server master <ENDEREÇO_MANAGER_MASTER>:1514 check
  server worker1 <ENDERECO_MANAGER_WORKER_1>:1514 check
  server worker2 <ENDERECO_MANAGER_WORKER_2>:1514 check
```

> Os parâmetros `<ENDERECO_MANAGER_[...]>` podem ser informados tanto por endereço IP quanto por FQDN/DNS.

> **Importante:** Para que o **HAProxy Helper** funcione corretamente com o Wazuh, o algoritmo de balanceamento deve obrigatoriamente ser `leastconn`.

---

## Configurando o HAProxy Helper (com HTTPS)

O HAProxy Helper utiliza a **Dataplane API** para que a comunicação entre o Wazuh Manager e o HAProxy aconteça de forma dinâmica, permitindo que o cluster faça atualizações de configuração conforme necessário.

### 1. Gerando Certificados SSL/TLS

Primeiro, gere o certificado no servidor onde o HAProxy está instalado:

```bash
openssl req -x509 -newkey rsa:4096 -keyout lb-key.pem -out lb-cert.pem -sha256 -nodes \
  -addext "subjectAltName=IP:<IP_SERVIDOR_LOAD_BALANCER>" \
  -subj "/C=BR/ST=SaoPaulo/O=Wazuh/CN=LoadBalancer-Internal"
```
*(Substitua `<IP_SERVIDOR_LOAD_BALANCER>` pelo IP real do seu Load Balancer).*

Em seguida, gere o certificado no **Manager Master** do seu cluster:

```bash
openssl req -x509 -newkey rsa:4096 -keyout lb-key.pem -out lb-cert.pem -sha256 -nodes \
  -addext "subjectAltName=IP:<IP_SERVIDOR_MANAGER_MASTER>" \
  -subj "/C=BR/ST=SaoPaulo/O=Wazuh/CN=Manager-Internal"
```
*(Substitua `<IP_SERVIDOR_MANAGER_MASTER>` pelo IP do seu servidor Manager Master).*

### 2. Download e Configuração do Dataplane API

Faça o download do binário do Dataplane API:

```bash
curl -sL https://github.com/haproxytech/dataplaneapi/releases/download/v2.8.13/dataplaneapi_2.8.13_linux_x86_64.tar.gz | tar xz && cp dataplaneapi /usr/local/bin/
```

Crie o arquivo de configuração `/etc/haproxy/dataplaneapi.yml`:

```yaml
config_version: 2
name: haproxy
mode: single
status: ""
dataplaneapi:
  host: 0.0.0.0
  port: 5555
  advertised:
    api_address: ""
    api_port: 0
  tls:
    tls_port: 6443
    tls_certificate: /etc/haproxy/ssl/lb-cert.pem    # caminho do seu certificado
    tls_key: /etc/haproxy/ssl/lb-key.pem            # caminho da sua chave
  scheme:
  - https
  transaction:
    transaction_dir: /tmp/haproxy
  user:
  - name: wazuh
    insecure: true
    password: wazuh
haproxy:
  config_file: /etc/haproxy/haproxy.cfg
  haproxy_bin: /usr/sbin/haproxy
  reload:
    reload_delay: 5
    reload_cmd: service haproxy reload
    restart_cmd: service haproxy restart
    reload_strategy: custom
```

> Lembre-se de ajustar os caminhos de `tls_certificate`, `tls_key` e credenciais (`name` e `password`) que serão utilizadas na autenticação.

### 3. Iniciando os Serviços e Testando

Reinicie o HAProxy:
```bash
systemctl restart haproxy.service
```

Inicie o Dataplane API em background:
```bash
/usr/local/bin/dataplaneapi -f /etc/haproxy/dataplaneapi.yml &
```

Testando a comunicação com a API:
```bash
curl -k -X GET --user wazuh:wazuh https://localhost:6443/v2/info
```

---

## Configurando o Wazuh Manager Master

No servidor **Manager Master**, edite o arquivo `ossec.conf` em `/var/ossec/etc/ossec.conf` e adicione o bloco `<haproxy_helper>` dentro da tag `<cluster>`:

```xml
<cluster>
   <name>wazuh</name>
   <node_name>wazuh-master</node_name>
   <node_type>master</node_type>
   <key>658e2ed0095b0121f95d2e4c7ccc616d</key>
   <port>1516</port>
   <bind_addr>0.0.0.0</bind_addr>
   <nodes>
       <node>172.31.50.173</node>
   </nodes>
   <hidden>no</hidden>
   <disabled>no</disabled>
   <haproxy_helper>
       <haproxy_disabled>no</haproxy_disabled>
       <haproxy_address>172.31.61.73</haproxy_address>
       <haproxy_user>wazuh</haproxy_user>
       <haproxy_password>wazuh</haproxy_password>
       <haproxy_protocol>https</haproxy_protocol>
       <haproxy_port>6443</haproxy_port>
       <haproxy_cert>/var/ossec/etc/lb-cert.pem</haproxy_cert>
       <client_cert_key>/var/ossec/etc/manager/lb-cert-manager.pem</client_cert_key>
   </haproxy_helper>
</cluster>
```

> **Parâmetros:**
> - `<haproxy_address>`: IP do servidor Load Balancer (HAProxy).
> - `<haproxy_user>` / `<haproxy_password>`: Credenciais do Dataplane API.
> - `<haproxy_cert>`: Certificado gerado no Load Balancer e copiado para o servidor Manager.
> - `<client_cert_key>`: Chave/Certificado gerado no próprio Manager Master.

Após salvar o arquivo, reinicie o serviço do Wazuh Manager:

```bash
systemctl restart wazuh-manager
```

### Validação dos Logs de Integração

Verifique os logs no Manager para confirmar o funcionamento do Helper:

```bash
tail -n500 /var/ossec/logs/cluster.log | grep 'HAPHelper'
```

![Logs Cluster Wazuh HAPHelper](/assets/img/posts/haproxy-wazuh/logs-cluster-wazuh.png)
_Validação de logs confirmando o sucesso da comunicação do HAPHelper com a API do HAProxy_

---

## Bônus: Autostart do Dataplane API no Systemd

Para garantir que o Dataplane API inicie automaticamente caso o servidor do HAProxy seja reiniciado:

1. Crie o arquivo `/etc/systemd/system/dataplaneapi.service`:
   ```bash
   sudo nano /etc/systemd/system/dataplaneapi.service
   ```

2. Adicione o seguinte conteúdo:
   ```ini
   [Unit]
   Description=HAProxy Data Plane API
   After=network.target

   [Service]
   Type=simple
   User=root
   ExecStart=/usr/local/bin/dataplaneapi -f /etc/haproxy/dataplaneapi.yml
   Restart=always
   RestartSec=5

   [Install]
   WantedBy=multi-user.target
   ```

3. Recarregue e inicie o serviço:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable dataplaneapi
   sudo systemctl start dataplaneapi
   ```

4. Verifique o status:
   ```bash
   sudo systemctl status dataplaneapi
   ```

---

## Conclusão

A configuração do **HAProxy** para balanceamento de carga no Wazuh habilitando o **HAProxy Helper via HTTPS** garante uma infraestrutura resiliente, escalável e de fácil manutenção. A integração entre a Dataplane API e o Wazuh Manager permite adicionar e remover nós do cluster de forma dinâmica sem interrupção na coleta de eventos.

Fique à vontade para deixar dúvidas ou sugestões nos comentários ou entrar em contato via LinkedIn/GitHub.

---

## Referências

- [Wazuh Server Cluster (HAProxy Documentation)](https://documentation.wazuh.com/)
- [HAProxy Data Plane API Releases](https://github.com/haproxytech/dataplaneapi/releases)
