import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory mock vCenter storage
  let connected = false;
  let activeSessionId: string | null = null;
  let vCenterInfo: any = null;

  // vCenter Connection Endpoint
  app.post("/api/vcenter/connect", (req, res) => {
    const { host, username, password } = req.body;
    
    if (!host || !username || !password) {
      return res.status(400).json({ error: "Missing vCenter host or credentials." });
    }

    // Simulate connection delay
    setTimeout(() => {
      connected = true;
      activeSessionId = `vc-session-${Math.random().toString(36).substring(7)}`;
      vCenterInfo = {
        host,
        version: "8.0 U2",
        build: "22380479",
        connectedAt: new Date().toISOString()
      };
      
      res.json({
        status: "success",
        sessionId: activeSessionId,
        info: vCenterInfo
      });
    }, 1500);
  });

  app.post("/api/vcenter/disconnect", (req, res) => {
    connected = false;
    activeSessionId = null;
    vCenterInfo = null;
    res.json({ status: "disconnected" });
  });

  app.get("/api/vcenter/status", (req, res) => {
    res.json({ connected, info: vCenterInfo });
  });

  // Fetch clusters, hosts, and VMs structure
  app.get("/api/vcenter/infrastructure", (req, res) => {
    if (!connected) {
      return res.status(401).json({ error: "Not connected to vCenter." });
    }

    setTimeout(() => {
      // Mock hierarchy
      const clusters = [
        {
          id: "domain-c12",
          name: "Prod-Cluster-A",
          hosts: [
            { id: "host-20", name: "esx01.corp.local", cpuModel: "Intel Xeon Gold 6248R", cores: 48 },
            { id: "host-21", name: "esx02.corp.local", cpuModel: "Intel Xeon Gold 6248R", cores: 48 },
            { id: "host-22", name: "esx03.corp.local", cpuModel: "Intel Xeon Gold 6248R", cores: 48 }
          ]
        },
        {
          id: "domain-c35",
          name: "Dev-Cluster-B",
          hosts: [
            { id: "host-41", name: "esx11.dev.local", cpuModel: "AMD EPYC 7543", cores: 32 },
            { id: "host-42", name: "esx12.dev.local", cpuModel: "AMD EPYC 7543", cores: 32 }
          ]
        }
      ];

      // Mock VMs
      const vms = [
        { id: "vm-101", name: "prod-db-01", cluster: "Prod-Cluster-A", host: "esx01.corp.local", vcpu: 16, memoryGb: 64, state: "poweredOn", readyMs: 5400, intervalSec: 20 },
        { id: "vm-102", name: "prod-web-01", cluster: "Prod-Cluster-A", host: "esx02.corp.local", vcpu: 4, memoryGb: 16, state: "poweredOn", readyMs: 210, intervalSec: 20 },
        { id: "vm-103", name: "prod-web-02", cluster: "Prod-Cluster-A", host: "esx03.corp.local", vcpu: 4, memoryGb: 16, state: "poweredOn", readyMs: 190, intervalSec: 20 },
        { id: "vm-104", name: "prod-app-01", cluster: "Prod-Cluster-A", host: "esx01.corp.local", vcpu: 8, memoryGb: 32, state: "poweredOn", readyMs: 4200, intervalSec: 20 },
        { id: "vm-105", name: "prod-app-02", cluster: "Prod-Cluster-A", host: "esx02.corp.local", vcpu: 8, memoryGb: 32, state: "poweredOn", readyMs: 4600, intervalSec: 20 },
        { id: "vm-201", name: "dev-db-01", cluster: "Dev-Cluster-B", host: "esx11.dev.local", vcpu: 4, memoryGb: 16, state: "poweredOn", readyMs: 310, intervalSec: 20 },
        { id: "vm-202", name: "dev-app-01", cluster: "Dev-Cluster-B", host: "esx12.dev.local", vcpu: 2, memoryGb: 8, state: "poweredOn", readyMs: 80, intervalSec: 20 },
        { id: "vm-203", name: "dev-test-large", cluster: "Dev-Cluster-B", host: "esx11.dev.local", vcpu: 12, memoryGb: 64, state: "poweredOn", readyMs: 12400, intervalSec: 20 }
      ];

      res.json({ clusters, vms });
    }, 1000);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // In express 5.x
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
