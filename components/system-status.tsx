"use client";

import { useEffect, useState } from "react";
import { systemApi, SystemHealth, SystemVersion } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function SystemStatus() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [version, setVersion] = useState<SystemVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSystemStatus = async () => {
    setLoading(true);
    try {
      const [healthData, versionData] = await Promise.all([
        systemApi.getStatus(),
        systemApi.getVersion()
      ]);
      setHealth(healthData);
      setVersion(versionData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch system status:", err);
      setError("Failed to load system status. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
  }, []);

  const renderStatusBadge = (status: 'ok' | 'error') => {
    return status === 'ok' ? (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200" data-cy="status-operational">
        Operational
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200" data-cy="status-error">
        Error
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card className="w-full" data-cy="system-status-loading">
        <CardHeader>
          <CardTitle><Skeleton className="h-8 w-3/4" /></CardTitle>
          <CardDescription><Skeleton className="h-4 w-1/2" /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full" data-cy="system-status-error">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system health and version information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 text-red-700 rounded-md" data-cy="error-message">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full" data-cy="system-status">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system health and version information</CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchSystemStatus}
          data-cy="refresh-button"
          title="Refresh status"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div data-cy="system-health-section">
            <h3 className="text-sm font-medium mb-2">System Health</h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
              <div>
                <p className="text-sm font-medium text-gray-500">Overall Status</p>
                <div className="mt-1" data-cy="overall-status">{health && renderStatusBadge(health.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="text-sm mt-1" data-cy="last-updated">
                  {health?.timestamp ? new Date(health.timestamp).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Database</p>
                <div className="mt-1" data-cy="database-status">{health?.database && renderStatusBadge(health.database.status)}</div>
                <p className="text-xs text-gray-500 mt-1" data-cy="database-message">{health?.database.message}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Redis</p>
                <div className="mt-1" data-cy="redis-status">{health?.services.redis && renderStatusBadge(health.services.redis.status)}</div>
                <p className="text-xs text-gray-500 mt-1" data-cy="redis-message">{health?.services.redis.message}</p>
              </div>
            </div>
          </div>

          <div data-cy="version-section">
            <h3 className="text-sm font-medium mb-2">Version Information</h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
              <div>
                <p className="text-sm font-medium text-gray-500">App Version</p>
                <p className="text-sm mt-1" data-cy="app-version">{version?.version || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Environment</p>
                <p className="text-sm mt-1" data-cy="environment">{version?.environment || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Node.js</p>
                <p className="text-sm mt-1" data-cy="node-version">{version?.nodeVersion || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">NestJS</p>
                <p className="text-sm mt-1" data-cy="nest-version">{version?.nestVersion || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 