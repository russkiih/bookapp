"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/date-picker";
import { supabase } from "@/lib/supabase";

const SERVICES = [
  { id: 1, name: "Haircut", duration: 30, price: 30 },
  { id: 2, name: "Hair Coloring", duration: 120, price: 100 },
  { id: 3, name: "Styling", duration: 45, price: 45 },
  { id: 4, name: "Treatment", duration: 60, price: 70 },
];

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00"
];

export function BookingForm() {
  const [date, setDate] = useState<Date>();
  const [service, setService] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedService = SERVICES.find(s => s.id.toString() === service);
      
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            service_id: selectedService?.id,
            service_name: selectedService?.name,
            booking_date: date,
            booking_time: timeSlot,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      // Clear form
      setName("");
      setEmail("");
      setPhone("");
      setDate(undefined);
      setService("");
      setTimeSlot("");
      
      alert('Booking submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
        <CardDescription>
          Select your preferred service, date, and time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="service">Service</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {SERVICES.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service.name} - ${service.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <DatePicker date={date} setDate={setDate} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email" 
              placeholder="Enter your email" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel" 
              placeholder="Enter your phone number" 
              required 
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Book Appointment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 