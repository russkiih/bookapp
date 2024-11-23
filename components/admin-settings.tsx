"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Label } from "@/components/ui/label";

type Service = {
  id: number;
  name: string;
  duration: number;
  price: number;
};

type WorkingHours = {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
};

export function AdminSettings() {
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState({ name: "", duration: "", price: "" });
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [loading, setLoading] = useState(true);

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    fetchServices();
    fetchWorkingHours();
  }, []);

  async function fetchServices() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id');
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  }

  async function fetchWorkingHours() {
    try {
      const { data, error } = await supabase
        .from('working_hours')
        .select('*')
        .order('id');
      if (error) throw error;
      setWorkingHours(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching working hours:', error);
      setLoading(false);
    }
  }

  async function addService(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('services')
        .insert([
          {
            name: newService.name,
            duration: parseInt(newService.duration),
            price: parseFloat(newService.price)
          }
        ]);
      if (error) throw error;
      fetchServices();
      setNewService({ name: "", duration: "", price: "" });
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Error adding service');
    }
  }

  async function deleteService(id: number) {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Error deleting service');
    }
  }

  async function updateWorkingHours(id: number, is_available: boolean) {
    try {
      const { error } = await supabase
        .from('working_hours')
        .update({ is_available })
        .eq('id', id);
      if (error) throw error;
      fetchWorkingHours();
    } catch (error) {
      console.error('Error updating working hours:', error);
      alert('Error updating working hours');
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addService} className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={newService.name}
                  onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newService.duration}
                  onChange={(e) => setNewService(prev => ({ ...prev, duration: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>
            </div>
            <Button type="submit">Add Service</Button>
          </form>

          <div className="space-y-2">
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <span className="font-medium">{service.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {service.duration}min - ${service.price}
                  </span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteService(service.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Working Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {workingHours.map((hours) => (
              <div key={hours.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <span className="font-medium">{hours.day}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {hours.start_time} - {hours.end_time}
                  </span>
                </div>
                <Button
                  variant={hours.is_available ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateWorkingHours(hours.id, !hours.is_available)}
                >
                  {hours.is_available ? "Available" : "Unavailable"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 