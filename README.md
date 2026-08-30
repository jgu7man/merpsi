# 🏢 MERPSI (Multi-Tenant ERP Domain Architecture Case Study)

[![Angular](https://img.shields.io/badge/Frontend-Angular%20SPA-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.io)
[![Firebase](https://img.shields.io/badge/Backend-Firebase%20%2F%20Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Architecture](https://img.shields.io/badge/Architecture-Modular%20ERP-0052CC?style=flat-square)](https://github.com/jgu7man/merpsi)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

An architectural case study and reference implementation of a **multi-tenant Enterprise Resource Planning (ERP) platform** designed for wholesale distribution, multi-store inventory routing, sales management, and operational governance.

---

## 🏛️ Domain Architecture Breakdown

```mermaid
graph TD
    subgraph CoreDomain ["🏢 Core ERP Domain Modules"]
        Inventory["📦 Inventory & Warehouse<br/>(Kardex, Stock In/Out, Locations)"]
        Sales["💰 Sales & Point of Sale<br/>(Transactions, Quotations, Invoicing)"]
        CRM["👥 CRM & Accounts<br/>(Customers, Credit Lines, Vendors)"]
        Distribution["🚚 Multi-Store Distribution<br/>(Inter-branch Transfers, Logistics)"]
    end

    subgraph Infrastructure ["⚡ Infrastructure & Persistence Layer"]
        Auth["🔐 Multi-Tenant RBAC Security (Firebase Auth)"]
        Database[("🔥 Cloud Firestore Document Database")]
        Storage[("📁 Cloud Storage for Documents & Media")]
    end

    Inventory --> Database
    Sales --> Database
    CRM --> Database
    Distribution --> Database
    Auth -.-> CoreDomain
```

---

## 💡 Key Architectural Decisions & Takeaways

1. **Multi-Tenant Partitioning:** Evaluated data partitioning strategies to isolate company tenant data while maintaining centralized product master catalogs.
2. **Kardex Consistency:** Built atomic transaction patterns to ensure concurrent point-of-sale checkouts never produce negative stock anomalies.
3. **Decoupled Business Rules:** Separated financial calculation rules from Angular UI views for long-term maintainability.

---

## 🚀 Development Setup

1. **Clone the repository and install dependencies:**
   ```bash
   git clone https://github.com/jgu7man/merpsi.git
   cd merpsi
   npm install
   ```

2. **Configure Firebase Credentials:**
   Set up your project credentials in `src/environments/environment.ts` and `src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
     production: false,
     firebaseConfig: {
       apiKey: "AIza***********************************",
       authDomain: "merpsi.firebaseapp.com",
       projectId: "merpsi",
       storageBucket: "merpsi.appspot.com",
       messagingSenderId: "************",
       appId: "1:************************************",
       measurementId: "G-**********"
     }
   };
   ```

3. **Start the local development server:**
   ```bash
   ng serve
   ```
   Open your browser at `http://localhost:4200/`.

---

## 📄 License

Distributed under the [MIT License](LICENSE). Created by [Jorge Guzmán (@jgu7man)](https://github.com/jgu7man).
