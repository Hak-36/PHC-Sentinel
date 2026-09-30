# 🏥 PHC-Sentinel

### Federated AI for Real-Time Primary Healthcare Supply & Capacity Intelligence

**PHC-Sentinel** is an AI-powered, privacy-preserving platform designed to give national and regional health systems real-time visibility into **medicine stock, healthcare capacity, staff availability, demand forecasts, and emergency preparedness** across Primary Health Centres (PHCs).

The platform combines **offline-first reporting, AI demand forecasting, explainable early warnings, expiry-aware redistribution, federated learning, differential privacy, and emergency what-if simulation** into a unified health-system intelligence layer.

> **Demo:** The current prototype uses synthetic data representing **25 PHCs across 5 districts**. It demonstrates the core decision-support workflows without using real patient records.

---

## 🎯 Problem

Primary Health Centres often operate with fragmented and delayed information.

A district health administrator may not know:

* Which PHCs are approaching a medicine stock-out
* How many days of medicine remain
* Whether a PHC has the staff required to actually dispense medicines
* Which medicines are likely to experience increased demand
* Which nearby PHCs have surplus stock
* Which stock is approaching expiry
* How an outbreak or flood could affect medicine requirements
* How to coordinate data across different jurisdictions while preserving data sovereignty

Traditional dashboards primarily show **what is happening now**.

PHC-Sentinel aims to answer:

> **What is likely to happen next, where will it happen, and what action can be taken now?**

---

# 💡 Solution

PHC-Sentinel creates an intelligent monitoring and decision-support layer for a distributed PHC network.

### Core pipeline

```text
PHC
 │
 ├── Medicine Stock
 ├── Staff Attendance
 ├── Footfall
 ├── Local Conditions
 └── Emergency Signals
        │
        ▼
 Offline-First Mobile / PWA
        │
        ▼
 District Data Layer
        │
        ├── Demand Forecasting
        ├── Stock Risk Detection
        ├── Staff-Aware Availability
        └── Emergency Simulation
        │
        ▼
 Federated Learning
        │
        ▼
 Privacy-Preserving Global Model
        │
        ▼
 National / District Dashboard
        │
        ├── Early Warnings
        ├── Redistribution
        ├── Forecasts
        └── What-If Scenarios
```

---

# 🚀 Key Features

## 1. 📦 Real-Time Medicine Stock Monitoring

PHC-Sentinel monitors medicine availability across the PHC network.

The dashboard provides:

* Current stock
* Forecasted daily demand
* Days of stock cover
* Supplier lead time
* Stock-out risk
* Medicine-level monitoring

The prototype currently includes:

* Paracetamol
* ORS sachets
* Amoxicillin
* Artesunate

The dashboard calculates medicine cover using:

```text
Days of Cover = Current Stock / Forecast Daily Demand
```

---

# 🚨 2. Explainable Early-Warning System

Instead of simply displaying a red indicator, PHC-Sentinel explains **why a PHC is at risk**.

A PHC is considered at risk when:

```text
Days of Cover < Supplier Lead Time
```

The system can also account for staff availability.

### Example

```text
PHC-07

Paracetamol
Stock: 420 units
Forecast demand: 105 units/day
Days of cover: 4 days
Supplier lead time: 6 days

⚠ STOCK-OUT RISK

Reason:
Demand is increasing due to the emergency scenario.
```

The prototype's alert explanation includes remaining cover, resupply lead time, forecast-demand changes, and pharmacist availability.

---

# 👨‍⚕️ 3. Attendance-Aware Stock Status

A medicine being physically present does not necessarily mean it is operationally available.

For example:

```text
Medicine stock > 0
        +
Pharmacist absent
        ↓
Operational Stock-out Risk
```

PHC-Sentinel therefore considers pharmacist availability when determining stock status.

The prototype explicitly displays pharmacist presence and treats a PHC without a pharmacist as a red/stock-out condition.

---

# 🤖 4. AI Demand Forecasting

PHC-Sentinel forecasts medicine demand using signals such as:

* Patient/footfall activity
* Seasonal patterns
* Outbreak signals
* Emergency scenarios

The prototype models demand using:

```text
Demand = w₁ × Footfall + w₂ × Outbreak Signal
```

This allows demand to increase dynamically when an emergency scenario is activated.

Supported demonstration scenarios include:

* Normal operations
* Dengue surge
* Flood and cholera
* Malaria outbreak

---

# 🔐 5. Federated Learning

PHC-Sentinel is designed for cross-region and cross-country collaboration without centralizing sensitive health records.

Instead of sending patient-level data to a central server:

```text
Country A ──┐
Country B ──┤
Country C ──┼──> Federated Aggregation
Country D ──┤
Country E ──┘
```

Each participant:

1. Keeps its data locally
2. Trains the model locally
3. Sends model updates
4. Participates in federated averaging
5. Receives an updated global model

The prototype demonstrates five participating countries:

* 🇮🇳 India
* 🇧🇷 Brazil
* 🇷🇺 Russia
* 🇨🇳 China
* 🇿🇦 South Africa

Only two model weights are exchanged per training round in the demonstration.

---

# 🛡️ 6. Differential Privacy

Federated learning reduces the need to centralize raw data, while differential privacy can add an additional privacy layer.

The prototype allows a configurable **privacy-noise parameter** during federated training.

```text
Local Training
      ↓
Model Update
      ↓
Privacy Noise
      ↓
Federated Aggregation
      ↓
Global Model
```

The demonstration reports:

```text
Patient records shared: 0
```

> In a production deployment, privacy guarantees should be formally configured, audited, and validated rather than inferred solely from the prototype.

---

# 🔄 7. Expiry-Aware Redistribution

A PHC with excess stock can potentially support another PHC that is approaching a stock-out.

PHC-Sentinel generates suggested transfers based on:

* Stock surplus
* Medicine requirement
* Geographic distance
* Supplier lead time
* Expiry timing

The prototype prioritizes stock approaching expiry and performs distance-aware matching between surplus and shortage locations.

Example:

```text
PHC Alpha-2
Surplus: 500 units
Expiry: 25 days

        ↓ Transfer

PHC Delta-4
Shortage: 350 units
Distance: 42 km
```

The current demo describes this as **greedy min-cost matching** using distance and expiry-related cost factors.

---

# 🌊 8. Emergency What-If Simulator

Health administrators can simulate emergency scenarios before making operational decisions.

Example:

```text
Scenario:
Dengue Surge

Severity:
80%

        ↓

Forecast demand ↑
        ↓
Days of cover ↓
        ↓
PHCs become at-risk
        ↓
Redistribution recommendations
```

This allows decision-makers to explore potential consequences of:

* Disease outbreaks
* Floods
* Sudden demand increases
* Regional supply disruptions

without changing the actual inventory.

---

# 🗺️ 9. Network Intelligence Dashboard

The dashboard provides a geographic view of the PHC network.

PHCs are categorized as:

🟢 **Safe**

🟠 **Watch**

🔴 **Stock-out Risk / No Pharmacist**

Suggested redistribution routes are displayed as dashed connections between PHCs.

---

# 📊 Dashboard KPIs

The prototype provides network-level KPIs including:

| KPI       | Meaning                               |
| --------- | ------------------------------------- |
| PHCs      | Total monitored PHCs                  |
| At Risk   | PHCs requiring attention              |
| Watch     | PHCs approaching risk                 |
| Safe      | PHCs with sufficient cover            |
| Transfers | Recommended redistribution operations |

---

# 🏗️ Technology Stack

## Frontend

* HTML
* CSS
* JavaScript
* Progressive Web App architecture

## Backend / Cloud

* Firebase
* BigQuery
* Google Cloud

## AI / ML

* Vertex AI
* Federated Learning
* Flower
* Differential Privacy

## Mapping

* Google Maps

## Data

* PHC inventory
* Footfall
* Staff attendance
* Supplier lead time
* Expiry information
* Outbreak signals

---

# 🧠 System Architecture

```text
                    ┌─────────────────────┐
                    │      PHC Users      │
                    │ Mobile / PWA / SMS  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Firebase        │
                    │ Sync + Authentication│
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      BigQuery       │
                    │ Analytics/Data Layer│
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
      ┌─────────────┐   ┌──────────────┐  ┌──────────────┐
      │ Forecasting │   │ Risk Engine  │  │ What-If      │
      │    Model    │   │              │  │ Simulator    │
      └──────┬──────┘   └──────┬───────┘  └──────┬───────┘
             │                 │                 │
             └─────────────────┼─────────────────┘
                               ▼
                    ┌─────────────────────┐
                    │ Decision Dashboard  │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
        Early Warnings   Redistribution   Emergency Plans
                              
                              
        ─────────── Federated Learning Layer ───────────

        India ─┐
        Brazil ├──> Local Training ──> Model Updates
        Russia ┤
        China  ┤
        S. Africa ┘
                         ↓
                  Federated Averaging
                         ↓
                   Global Model
```

---

# 📱 Offline-First Design

PHCs may operate in environments with unreliable connectivity.

The production architecture therefore targets:

```text
Online
  ↓
Cloud synchronization

Offline
  ↓
Local data capture
  ↓
Local queue
  ↓
Automatic synchronization
  ↓
Cloud
```

An SMS fallback can provide a low-bandwidth reporting channel when the primary application cannot connect.

---

# 🌍 BRICS Collaboration

The platform is designed around a data-sovereignty model.

Instead of:

```text
Country A patient data ─┐
Country B patient data ─┤
Country C patient data ─┼──> Central database
Country D patient data ─┤
Country E patient data ─┘
```

PHC-Sentinel uses:

```text
Country A ── Local Data ── Local Model ──┐
Country B ── Local Data ── Local Model ──┤
Country C ── Local Data ── Local Model ──┼──> Federated Model
Country D ── Local Data ── Local Model ──┤
Country E ── Local Data ── Local Model ──┘
```

This architecture is intended to allow collaborative model training while keeping underlying datasets within their respective jurisdictions.

---

# 🔒 Privacy Principles

PHC-Sentinel follows several privacy-oriented principles:

* Patient-level data should remain within the originating jurisdiction.
* Federated training is used instead of centralized raw-data sharing.
* Differential privacy can add noise to model updates.
* Access should be role-based.
* Data transmission should be encrypted.
* Audit logs should record sensitive administrative operations.
* Production deployments require formal privacy and security validation.

---

# 🧪 Current Prototype

The current browser prototype is a self-contained demonstration.

It includes:

* 25 synthetic PHCs
* 5 districts
* 4 medicines
* Multiple emergency scenarios
* Dynamic severity control
* Stock-cover calculations
* Staff-aware risk classification
* Early-warning explanations
* Redistribution recommendations
* Federated-learning simulation
* Differential-privacy noise control
* Federated convergence visualization
* Transfer approval/reset controls

---

# 🖥️ Running the Demo

The current prototype is a standalone HTML application.

### Option 1 — Browser

Open:

```text
PHC-Sentinel.html
```

in a modern browser.

### Option 2 — Local server

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/PHC-Sentinel.html
```

---

# 📈 Example Workflow

### Step 1 — Select a medicine

Example:

```text
Artesunate
```

### Step 2 — Select an emergency scenario

```text
Malaria outbreak
```

### Step 3 — Adjust severity

```text
60%
```

### Step 4 — Inspect the dashboard

The system recalculates:

```text
Demand
↓
Days of Cover
↓
Risk Status
↓
Early Warnings
↓
Redistribution Recommendations
```

### Step 5 — Inspect a PHC

Click a PHC on the map to view:

* Footfall index
* Pharmacist availability
* Supplier lead time
* Medicine stock
* Forecast demand
* Days of cover

### Step 6 — Simulate federated training

Adjust:

```text
Privacy Noise
```

and select:

```text
Retrain
```

The dashboard visualizes the learned model weights across federated rounds.

---

# 🛣️ Roadmap

## Phase 1 — Prototype

* [x] PHC network visualization
* [x] Medicine stock monitoring
* [x] Days-of-cover calculation
* [x] Early-warning system
* [x] Staff-aware risk
* [x] Redistribution recommendations
* [x] Emergency scenarios
* [x] Federated-learning simulation

## Phase 2 — Real Data Platform

* [ ] Firebase authentication
* [ ] Real PHC onboarding
* [ ] Firestore/BigQuery integration
* [ ] Real inventory synchronization
* [ ] Staff attendance integration
* [ ] Offline local storage
* [ ] SMS fallback

## Phase 3 — Production AI

* [ ] Vertex AI forecasting
* [ ] Flower federated-learning infrastructure
* [ ] Formal differential-privacy implementation
* [ ] Model monitoring
* [ ] Forecast uncertainty
* [ ] Automated anomaly detection
* [ ] Outbreak signal integration

## Phase 4 — Supply-Chain Optimisation

* [ ] Full min-cost-flow optimization
* [ ] Vehicle routing
* [ ] Warehouse integration
* [ ] Supplier lead-time prediction
* [ ] Expiry-aware inventory optimization
* [ ] Automated transfer workflows

## Phase 5 — Emergency Intelligence

* [ ] Flood simulation
* [ ] Epidemic simulation
* [ ] Supply disruption simulation
* [ ] Population displacement modeling
* [ ] Infrastructure outage modeling
* [ ] Multi-district emergency planning

## Phase 6 — Cross-Border Federated Collaboration

* [ ] Multi-country federation
* [ ] Secure aggregation
* [ ] Country-level governance controls
* [ ] Model-version management
* [ ] Privacy auditing
* [ ] Cross-jurisdiction model evaluation

---

# 📊 Success Metrics

A production deployment could measure:

### Supply Availability

```text
Stock-out rate
Days of cover
Emergency replenishment frequency
```

### Forecasting

```text
MAE
RMSE
Forecast bias
Demand prediction accuracy
```

### Redistribution

```text
Distance per transfer
Expiry prevented
Transfer cost
Unmet demand
```

### Operations

```text
PHC reporting compliance
Data synchronization latency
Alert response time
```

### Privacy

```text
Raw patient records shared
Privacy budget
Model-update leakage risk
Federated participation rate
```

---

# ⚠️ Important Scope

PHC-Sentinel is a **health-system decision-support prototype**, not a clinical diagnosis system.

It does not replace:

* Doctors
* Pharmacists
* Public-health authorities
* Emergency coordinators
* Procurement officials

Production deployment would require appropriate clinical, regulatory, cybersecurity, privacy, procurement, and public-health validation.

---

# 🌟 Vision

> **Every PHC should know what it has, what it needs, what it is likely to need next, and what nearby resources can help — without surrendering control of sensitive health data.**

PHC-Sentinel aims to turn fragmented PHC information into **predictive, explainable and privacy-preserving health-system intelligence.**

---

## 👨‍💻 Project

**PHC-Sentinel**

**Focus:**
AI × Federated Learning × Public Health × Supply Chain × Emergency Response

**Core technologies:**
Firebase · BigQuery · Vertex AI · Flower · Google Maps · PWA

**Prototype data:**
Synthetic data only

---
