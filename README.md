# Mohammad Sharafi

Software engineer: backend systems, mobile apps, and privacy-first AI.
Java · Python · Dart/Flutter · Swift · Go (learning in public)

[Portfolio](https://mohammadsharafi.vercel.app) · [Buy me a coffee](https://buymeacoffee.com/mohammadsh47)

## Recent

- **[Tether](https://github.com/MohammadSharafi/tether)**: an iPhone app and Mac server to watch,
  approve and continue Claude Code sessions from your phone. SwiftUI and Node, self-hosted over
  Tailscale: no cloud, no account. Open source (MIT).
- **[Stress Twin](https://github.com/MohammadSharafi/stress-twin)**: a crash-test lab for robot
  policies. Adversarial search over 14 scenario conditions in MuJoCo finds the mildest change that
  breaks a policy, explains the failure, and validates a safety envelope on scenarios the search
  never saw. Built for the Nebius × NVIDIA Global AI Hackathon 2026.

## Selected public work

**Distributed systems and local AI**
- **[NodeFlow](https://github.com/MohammadSharafi/NodeFlow-AI-Distributed-Automation-System)**:
  Java distributed automation engine: node-based workflows, gRPC, dynamic plugins,
  event-driven orchestration
- **[neurochain-orchestrator](https://github.com/MohammadSharafi/neurochain-orchestrator)**:
  fully offline AI workflow engine running on-device LLMs and vision models,
  event-driven end to end

**Mobile**
- **[seismic-risk-app](https://github.com/MohammadSharafi/seismic-risk-app)**: Flutter app with a
  Spring Boot backend and an XGBoost service that scores the earthquake vulnerability of buildings
  and ranks safety recommendations

**Research and privacy**
- **[Few-shot treatment feasibility](https://github.com/MohammadSharafi/few-shot-treatment-feasibility-thesis)**:
  MSc thesis: MIMIC-IV, symptom tokens, federated learning
- **[k-anonymity risk analysis](https://github.com/MohammadSharafi/k-anonymity-risk-analysis)**:
  record-linkage attacks and the privacy–utility trade-off, measured

## Publishing soon

A controlled experiment I built: a React app with **40 deliberately planted WCAG violations**
across 25 success criteria. Industry-standard automated scanning caught **7 of 40**. Every
miss was relational or temporal, the class of defect a static scan structurally cannot see.
Repo and write-up are being packaged now.

Next on the bench: a from-the-metal-up systems ladder: a WAL-backed KV store whose
acceptance test is `kill -9` mid-write, an epoll server from raw sockets, and a mini-Redis
speaking RESP, in Go.

## How I work

- Every claim gets a number; experiments get a written log with an explicit failure metric
- Zero dependencies unless the dependency earns its ownership cost
- Much of my production work is private (enterprise and healthcare); what's here is what I can show
