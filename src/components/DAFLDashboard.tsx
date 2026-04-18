/**
 * DAFL Monitoring Dashboard
 * React component for monitoring autonomous funding system
 */

import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, DollarSign, Zap, AlertTriangle, CheckCircle } from '../components/Icons';

interface DAFLMetrics {
  total_revenue: number;
  total_costs: number;
  net_balance: number;
  content_generated: number;
  content_published: number;
  survival_mode: boolean;
}

interface ContentJob {
  job_id: string;
  status: string;
  progress: number;
  output_url?: string;
  error?: string;
}

interface SidecarStatus {
  service: string;
  status: string;
  version: string;
}

const SIDECAR_URL = (import.meta as any).env?.VITE_SIDECAR_URL || 'http://localhost:8001';

export function DAFLDashboard() {
  const [metrics, setMetrics] = useState<DAFLMetrics | null>(null);
  const [sidecarStatus, setSidecarStatus] = useState<SidecarStatus | null>(null);
  const [jobs, setJobs] = useState<ContentJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      // Fetch metrics
      const metricsRes = await fetch(`${SIDECAR_URL}/metrics`);
      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
      }

      // Fetch sidecar status
      const statusRes = await fetch(`${SIDECAR_URL}/`);
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setSidecarStatus(statusData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch DAFL data:', error);
      setLoading(false);
    }
  };

  const startSidecar = async () => {
    try {
      const res = await fetch(`${SIDECAR_URL}/sidecar/start`, { method: 'POST' });
      if (res.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to start sidecar:', error);
    }
  };

  const stopSidecar = async () => {
    try {
      const res = await fetch(`${SIDECAR_URL}/sidecar/stop`, { method: 'POST' });
      if (res.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to stop sidecar:', error);
    }
  };

  const generateContent = async () => {
    try {
      const res = await fetch(`${SIDECAR_URL}/content/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: 'gaming',
          platform: 'tiktok',
          duration_seconds: 60,
          include_game_footage: true
        })
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Content generation started: ${data.job_id}`);
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to generate content:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Activity className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-400">Loading DAFL Dashboard...</p>
        </div>
      </div>
    );
  }

  const isRunning = sidecarStatus?.status === 'running';
  const revenueRatio = metrics && metrics.total_costs > 0
    ? metrics.total_revenue / metrics.total_costs
    : 0;
  const mode = metrics?.survival_mode ? 'Survival' : 'Evolution';

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Zap className="text-yellow-500" size={40} />
            DAFL Monitoring Dashboard
          </h1>
          <p className="text-gray-400">
            Distributed Autonomous Funding Layer - Real-time Metrics
          </p>
        </div>

        {/* Status Bar */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border-2 border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isRunning ? (
                <CheckCircle className="text-green-500" size={32} />
              ) : (
                <AlertTriangle className="text-red-500" size={32} />
              )}
              <div>
                <h2 className="text-2xl font-bold">
                  {isRunning ? 'Active' : 'Inactive'}
                </h2>
                <p className="text-gray-400">
                  Mode: <span className={metrics?.survival_mode ? 'text-red-500' : 'text-green-500'}>
                    {mode}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {!isRunning ? (
                <button
                  onClick={startSidecar}
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition"
                >
                  Start Sidecar
                </button>
              ) : (
                <button
                  onClick={stopSidecar}
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
                >
                  Stop Sidecar
                </button>
              )}
              <button
                onClick={generateContent}
                disabled={!isRunning}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Content
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Revenue */}
            <div className="bg-gray-800 rounded-lg p-6 border-2 border-green-700">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-green-500" size={24} />
                <h3 className="text-lg font-semibold">Total Revenue</h3>
              </div>
              <p className="text-3xl font-bold text-green-500">
                ${metrics.total_revenue.toFixed(2)}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Content Published: {metrics.content_published}
              </p>
            </div>

            {/* Costs */}
            <div className="bg-gray-800 rounded-lg p-6 border-2 border-red-700">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="text-red-500" size={24} />
                <h3 className="text-lg font-semibold">Total Costs</h3>
              </div>
              <p className="text-3xl font-bold text-red-500">
                ${metrics.total_costs.toFixed(2)}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Content Generated: {metrics.content_generated}
              </p>
            </div>

            {/* Net Balance */}
            <div className={`bg-gray-800 rounded-lg p-6 border-2 ${
              metrics.net_balance >= 0 ? 'border-blue-700' : 'border-yellow-700'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <Activity className={metrics.net_balance >= 0 ? 'text-blue-500' : 'text-yellow-500'} size={24} />
                <h3 className="text-lg font-semibold">Net Balance</h3>
              </div>
              <p className={`text-3xl font-bold ${
                metrics.net_balance >= 0 ? 'text-blue-500' : 'text-yellow-500'
              }`}>
                ${metrics.net_balance.toFixed(2)}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Revenue Ratio: {revenueRatio.toFixed(2)}x
              </p>
            </div>
          </div>
        )}

        {/* Mode Explanation */}
        {metrics && (
          <div className={`rounded-lg p-6 mb-6 border-2 ${
            metrics.survival_mode
              ? 'bg-red-900/20 border-red-700'
              : 'bg-green-900/20 border-green-700'
          }`}>
            {metrics.survival_mode ? (
              <>
                <h3 className="text-xl font-bold text-red-500 mb-2">
                  🚨 Survival Mode Active
                </h3>
                <p className="text-gray-300">
                  Revenue &lt; Costs. System is optimizing for maximum efficiency and
                  allocating 90% of compute to revenue generation.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-green-500 mb-2">
                  ✨ Evolution Mode Active
                </h3>
                <p className="text-gray-300">
                  Revenue &gt; Costs. System is allocating 30% of surplus to R&amp;D for new
                  features and 70% to scaling for exponential growth.
                </p>
              </>
            )}
          </div>
        )}

        {/* System Architecture */}
        <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
          <h3 className="text-xl font-bold mb-4">System Architecture</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Revenue Streams</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>TikTok Creator Fund</li>
                <li>YouTube AdSense</li>
                <li>Instagram Reels Bonuses</li>
                <li>Affiliate Links (Games, Tech)</li>
                <li>GitHub Sponsors</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-400 mb-2">Cost Centers</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Gemini API (Text/Image Generation)</li>
                <li>Stable Horde (Backup Generation)</li>
                <li>FFmpeg Video Rendering</li>
                <li>Cloud Hosting (GCP/Firebase)</li>
                <li>API Rate Limits &amp; Compute</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>DAFL v1.0.0 - Autonomous Funding for romeytheAI/Ga-mg</p>
          <p className="mt-1">
            Sidecar: {sidecarStatus?.version || 'Unknown'} | Status: {sidecarStatus?.status || 'Unknown'}
          </p>
        </div>
      </div>
    </div>
  );
}
