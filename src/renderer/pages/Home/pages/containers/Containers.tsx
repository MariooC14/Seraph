'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Container, Play, Square, RefreshCw, Trash2 } from 'lucide-react';

function Containers() {
  const [containers, setContainers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchContainers = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await window.docker.listContainers();
      setContainers(result);
    } catch (err: any) {
      setError(typeof err === 'string' ? err : err?.message || 'Failed to list Docker containers');
      setContainers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Containers</h1>
        <Button>
          <Container className="mr-2 h-4 w-4" />
          New Container
        </Button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '1em' }}>
          Error: {error}
          <br />
          <button onClick={fetchContainers} disabled={loading}>
            {loading ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      )}
      {!error && loading && <div>Loading...</div>}
      {!error && !loading && containers.length === 0 && <div>No dockers running</div>}

      <div className="space-y-4">
        {containers.map(container => (
          <Card key={container.ID}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg font-medium">{container.Names}</CardTitle>
                <CardDescription>{container.Image}</CardDescription>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs ${
                  container.Status === 'running'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                {container.Status}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Container ID</Label>
                  <Input value={container.ID} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>CPU Usage</Label>
                  <Input value={container.cpu} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Memory Usage</Label>
                  <Input value={container.memory} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Ports</Label>
                  <Input value={container.ports} readOnly />
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                {container.Status === 'running' ? (
                  <Button variant="outline" size="sm">
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                ) : (
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restart
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Containers;
